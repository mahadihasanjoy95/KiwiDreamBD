-- =============================================================================
-- KiwiDream BD — Phase 1 Database Schema
-- Database: MySQL (latest stable)
-- Character Set: utf8mb4 (full Unicode — required for Bengali content)
-- All monetary values: DECIMAL(15,2) — never FLOAT or DOUBLE
-- Primary keys: CHAR(36) UUID strings
-- =============================================================================

CREATE DATABASE IF NOT EXISTS kiwi_dream_bd
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE kiwi_dream_bd;

-- =============================================================================
-- 1. users
-- Core user account table. password_hash is nullable for Google OAuth users.
-- =============================================================================
CREATE TABLE users (
    id                   CHAR(36)       NOT NULL,
    email                VARCHAR(255)   NOT NULL,
    name                 VARCHAR(255)   NOT NULL,
    password_hash        VARCHAR(255)   NULL,
    phone_number         VARCHAR(30)    NULL,
    profile_picture      VARCHAR(1000)  NULL,
    city                 ENUM('AUCKLAND','WELLINGTON','CHRISTCHURCH','DUNEDIN','HAMILTON') NULL,
    target_move_date     DATE           NULL,
    current_savings_bdt  DECIMAL(15,2)  NULL,
    monthly_income_bdt   DECIMAL(15,2)  NULL,
    preferred_currency   ENUM('NZD','BDT')                        NOT NULL DEFAULT 'NZD',
    preferred_language   ENUM('EN','BN')                          NOT NULL DEFAULT 'EN',
    auth_provider        ENUM('LOCAL','GOOGLE')                   NOT NULL DEFAULT 'LOCAL',
    role                 ENUM('USER','ADMIN','SUPER_ADMIN')        NOT NULL DEFAULT 'USER',
    email_verified       BOOLEAN                                  NOT NULL DEFAULT FALSE,
    is_active            BOOLEAN                                  NOT NULL DEFAULT TRUE,
    created_at           DATETIME                                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME                                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 2. city_templates
-- Admin-seeded cost-of-living templates per NZ city. Read-only for regular users.
-- Declared before budget_plans because budget_plans references it.
-- =============================================================================
CREATE TABLE city_templates (
    id              CHAR(36)      NOT NULL,
    city            ENUM('AUCKLAND','WELLINGTON','CHRISTCHURCH','DUNEDIN','HAMILTON') NOT NULL,
    country         VARCHAR(10)   NOT NULL DEFAULT 'NZ',
    template_name   VARCHAR(255)  NOT NULL,
    description_en  TEXT          NOT NULL,
    description_bn  TEXT          NOT NULL,
    -- JSON array: [{categoryName, estimatedAmountNZD, displayOrder, notes}]
    categories      JSON          NOT NULL,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    last_updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_city_templates PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_city_templates_city_active ON city_templates (city, is_active);


-- =============================================================================
-- 3. budget_plans
-- A user can have multiple budget plans (compare scenarios).
-- based_on_template_id is nullable — users can start from scratch.
-- is_deleted = TRUE means hard-deleted by user or admin.
-- =============================================================================
CREATE TABLE budget_plans (
    id                    CHAR(36)     NOT NULL,
    user_id               CHAR(36)     NOT NULL,
    plan_name             VARCHAR(255) NOT NULL,
    based_on_template_id  CHAR(36)     NULL,
    city                  ENUM('AUCKLAND','WELLINGTON','CHRISTCHURCH','DUNEDIN','HAMILTON') NULL,
    status                ENUM('ACTIVE','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    is_deleted            BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_budget_plans PRIMARY KEY (id),
    CONSTRAINT fk_budget_plans_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_budget_plans_template
        FOREIGN KEY (based_on_template_id) REFERENCES city_templates (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_budget_plans_user_id ON budget_plans (user_id);
CREATE INDEX idx_budget_plans_user_status_deleted ON budget_plans (user_id, status, is_deleted);


-- =============================================================================
-- 4. expense_categories
-- Each row is one expense line item inside a budget plan.
-- Cascades on plan delete — no orphan categories.
-- total_monthly_estimated_nzd on the plan is computed (SUM) — not stored.
-- =============================================================================
CREATE TABLE expense_categories (
    id                    CHAR(36)      NOT NULL,
    budget_plan_id        CHAR(36)      NOT NULL,
    category_name         VARCHAR(255)  NOT NULL,
    estimated_amount_nzd  DECIMAL(15,2) NOT NULL,
    is_custom             BOOLEAN       NOT NULL DEFAULT FALSE,
    display_order         INT           NOT NULL DEFAULT 0,
    notes                 TEXT          NULL,

    CONSTRAINT pk_expense_categories PRIMARY KEY (id),
    CONSTRAINT fk_expense_categories_plan
        FOREIGN KEY (budget_plan_id) REFERENCES budget_plans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_expense_categories_plan_id ON expense_categories (budget_plan_id);


-- =============================================================================
-- 5. move_calculators
-- One calculator per user. Items stored as JSON for full user customizability.
-- JSON schema: [{itemName, amountNZD, amountBDT, notes, isCustom}]
-- =============================================================================
CREATE TABLE move_calculators (
    id          CHAR(36)      NOT NULL,
    user_id     CHAR(36)      NOT NULL,
    plan_name   VARCHAR(255)  NOT NULL DEFAULT 'My Move Cost Estimate',
    -- JSON array: [{itemName, amountNZD, amountBDT, notes, isCustom}]
    items       JSON          NOT NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_move_calculators PRIMARY KEY (id),
    CONSTRAINT uq_move_calculators_user UNIQUE (user_id),
    CONSTRAINT fk_move_calculators_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 6. savings_plans
-- readiness_score and projected_ready_date are computed at query time — not stored.
-- =============================================================================
CREATE TABLE savings_plans (
    id                        CHAR(36)      NOT NULL,
    user_id                   CHAR(36)      NOT NULL,
    plan_name                 VARCHAR(255)  NOT NULL,
    target_amount_nzd         DECIMAL(15,2) NOT NULL,
    current_saved_bdt         DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    monthly_contribution_bdt  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    target_date               DATE          NOT NULL,
    created_at                DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_savings_plans PRIMARY KEY (id),
    CONSTRAINT fk_savings_plans_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_savings_plans_user_id ON savings_plans (user_id);


-- =============================================================================
-- 7. checklist_items
-- Each user has their own independent checklist state.
-- Default items are seeded on account creation (is_default = TRUE).
-- =============================================================================
CREATE TABLE checklist_items (
    id             CHAR(36)     NOT NULL,
    user_id        CHAR(36)     NOT NULL,
    category       ENUM('DOCUMENTS','FINANCIAL','ACCOMMODATION','COMMUNICATION','HEALTH','CUSTOM') NOT NULL,
    item_text      VARCHAR(500) NOT NULL,
    is_completed   BOOLEAN      NOT NULL DEFAULT FALSE,
    is_default     BOOLEAN      NOT NULL DEFAULT TRUE,
    display_order  INT          NOT NULL DEFAULT 0,
    completed_at   DATETIME     NULL,

    CONSTRAINT pk_checklist_items PRIMARY KEY (id),
    CONSTRAINT fk_checklist_items_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_checklist_items_user_category ON checklist_items (user_id, category);


-- =============================================================================
-- 8. nz_contents
-- Admin-managed static/curated content for the NZ Essentials guide.
-- body_en / body_bn stored as markdown. city = NULL means country-wide content.
-- =============================================================================
CREATE TABLE nz_contents (
    id              CHAR(36)     NOT NULL,
    content_key     VARCHAR(100) NOT NULL,
    category        ENUM('JOB_INFO','ESSENTIALS','CITY_GUIDE','BANKING','TRANSPORT') NOT NULL,
    title_en        VARCHAR(255) NOT NULL,
    title_bn        VARCHAR(255) NOT NULL,
    body_en         LONGTEXT     NOT NULL,
    body_bn         LONGTEXT     NOT NULL,
    city            ENUM('AUCKLAND','WELLINGTON','CHRISTCHURCH','DUNEDIN','HAMILTON') NULL,
    is_published    BOOLEAN      NOT NULL DEFAULT FALSE,
    last_updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_nz_contents PRIMARY KEY (id),
    CONSTRAINT uq_nz_contents_key UNIQUE (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_nz_contents_category_city_published ON nz_contents (category, city, is_published);


-- =============================================================================
-- 9. job_info
-- Admin-managed NZ part-time job data. city = NULL means applies to all NZ.
-- common_jobs JSON: [{jobTitle, avgHourlyRateNZD, descriptionEN, descriptionBN}]
-- =============================================================================
CREATE TABLE job_info (
    id                         CHAR(36)      NOT NULL,
    city                       ENUM('AUCKLAND','WELLINGTON','CHRISTCHURCH','DUNEDIN','HAMILTON') NULL,
    minimum_wage_nzd           DECIMAL(15,2) NOT NULL,
    weekly_hours_during_study  INT           NOT NULL DEFAULT 20,
    weekly_hours_during_break  INT           NOT NULL,
    -- JSON array: [{jobTitle, avgHourlyRateNZD, descriptionEN, descriptionBN}]
    common_jobs                JSON          NOT NULL,
    last_updated_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_job_info PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
