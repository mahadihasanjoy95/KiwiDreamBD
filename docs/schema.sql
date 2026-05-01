-- =============================================================================
-- KiwiDream BD — Complete Database Schema v3.1
-- =============================================================================
-- Database : MySQL (latest stable)
-- Charset  : utf8mb4 — required for Bengali (বাংলা) content
-- Collation: utf8mb4_unicode_ci
-- Money    : DECIMAL(15,2) everywhere — never FLOAT or DOUBLE
-- UUIDs    : CHAR(36) for all business entity PKs (@PrePersist in Java)
-- Auth PKs : BIGINT AUTO_INCREMENT (refresh_tokens, password_reset_tokens)
-- Audit    : created_at, updated_at, created_by, updated_by on all entities
--            that extend BaseAuditableEntity
-- =============================================================================
-- DESIGN DECISIONS:
--   1. Unified `plans` table — isMasterPlan flag separates admin templates
--      from applicant personal plans. No separate master_plans table needed.
--   2. All plan sub-resources (monthly items, moving items, checklist, fund)
--      live in single shared tables with plan_id FK. Admin template items sit
--      under master plans; applicant items sit under user plans.
--   3. plan_users (M2M) — supports Phase 2 plan sharing (husband/wife) with
--      no schema change needed. Phase 1 always sets access_role = 'OWNER'.
--   4. Archive = immutable JSON snapshot in plan_archives. No restore.
--   5. Countries and cities are data-driven — no hardcoded enums in schema.
--   6. Exchange rate and app config live in app_settings key-value table.
--   7. Static website text (menus, labels) stays in frontend i18n files.
--   8. Role is a single ENUM column on users — no roles/permissions/api_permission_map
--      tables. Authorization handled by @PreAuthorize in Java controllers.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS kiwi_dream_bd
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE kiwi_dream_bd;

-- =============================================================================
-- ██████╗  ██████╗  ██████╗ ████████╗    ██╗
-- ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝    ╚██╗
-- ██████╔╝██║   ██║██║   ██║   ██║        ╚██╗  AUTH MODULE
-- ██╔══██╗██║   ██║██║   ██║   ██║        ██╔╝
-- ██║  ██║╚██████╔╝╚██████╔╝   ██║       ██╔╝
-- ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝      ╚═╝
-- =============================================================================

-- =============================================================================
-- AUTH-1: users
-- Core user account. password_hash is nullable for Google OAuth2 users.
-- google_id stores the OAuth2 "sub" claim for account linking.
-- role: single ENUM column — no join tables, no permission rows.
--   ROLE_APPLICANT  → student/applicant — can own and manage their own plans
--   ROLE_ADMIN      → operational staff — full content + user management
--   ROLE_SUPER_ADMIN → unrestricted — can delete core entities and manage admins
-- Authorization is enforced by @PreAuthorize in Spring Security controllers.
-- Extends BaseAuditableEntity.
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id                   CHAR(36)       NOT NULL,
    email                VARCHAR(255)   NOT NULL,
    name                 VARCHAR(255)   NOT NULL,
    password_hash        VARCHAR(255)   NULL,
    phone_number         VARCHAR(30)    NULL,
    profile_picture      VARCHAR(1000)  NULL,
    google_id            VARCHAR(255)   NULL,
    role                 ENUM('ROLE_APPLICANT','ROLE_ADMIN','ROLE_SUPER_ADMIN')
                                        NOT NULL DEFAULT 'ROLE_APPLICANT',
    target_move_date     DATE           NULL,
    current_savings_bdt  DECIMAL(15,2)  NULL,
    monthly_income_bdt   DECIMAL(15,2)  NULL,
    preferred_currency   ENUM('NZD','BDT')     NOT NULL DEFAULT 'BDT',
    preferred_language   ENUM('EN','BN')        NOT NULL DEFAULT 'EN',
    auth_provider        ENUM('LOCAL','GOOGLE') NOT NULL DEFAULT 'LOCAL',
    email_verified       BOOLEAN               NOT NULL DEFAULT FALSE,
    is_active            BOOLEAN               NOT NULL DEFAULT TRUE,
    created_at           DATETIME(6)           NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at           DATETIME(6)           NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by           VARCHAR(255)          NULL,
    updated_by           VARCHAR(255)          NULL,

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email),
    INDEX idx_user_google_id (google_id),
    INDEX idx_user_active_role (is_active, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- AUTH-2: refresh_tokens
-- Issued on login/refresh. Revoked on logout.
-- =============================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    token       VARCHAR(512)  NOT NULL,
    user_id     CHAR(36)      NOT NULL,
    revoked     BOOLEAN       NOT NULL DEFAULT FALSE,
    expires_at  DATETIME(6)   NOT NULL,
    created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    CONSTRAINT pk_refresh_tokens PRIMARY KEY (id),
    CONSTRAINT fk_rt_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_refresh_token UNIQUE (token),
    INDEX idx_refresh_token_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- AUTH-3: password_reset_tokens
-- Single-use tokens for forgot-password flow. Expires after a short window.
-- =============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    token       VARCHAR(255)  NOT NULL,
    user_id     CHAR(36)      NOT NULL,
    expires_at  DATETIME(6)   NOT NULL,
    used        BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    CONSTRAINT pk_password_reset_tokens PRIMARY KEY (id),
    CONSTRAINT fk_prt_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_prt_token UNIQUE (token),
    INDEX idx_prt_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- ██████╗ ██╗   ██╗███████╗██╗███╗   ██╗███████╗███████╗███████╗
-- ██╔══██╗██║   ██║██╔════╝██║████╗  ██║██╔════╝██╔════╝██╔════╝
-- ██████╔╝██║   ██║███████╗██║██╔██╗ ██║█████╗  ███████╗███████╗
-- ██╔══██╗██║   ██║╚════██║██║██║╚██╗██║██╔══╝  ╚════██║╚════██║
-- ██████╔╝╚██████╔╝███████║██║██║ ╚████║███████╗███████║███████║
-- ╚═════╝  ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝
-- =============================================================================

-- =============================================================================
-- BIZ-1: countries
-- Admin-managed. Data-driven — not hardcoded in code.
-- Designed for multi-country from day one (NZ, AU, CA, UK, ...).
-- currency_code is the destination currency (NZD, AUD, CAD, GBP).
-- Soft delete via is_active = FALSE — never hard-delete (orphans cities/plans).
-- =============================================================================
CREATE TABLE IF NOT EXISTS countries (
    id               CHAR(36)      NOT NULL,
    code             VARCHAR(10)   NOT NULL,
    name_en          VARCHAR(100)  NOT NULL,
    name_bn          VARCHAR(200)  NOT NULL,
    flag_emoji       VARCHAR(10)   NULL,
    flag_image_url   VARCHAR(1000) NULL,
    color_hex        VARCHAR(7)    NULL,
    currency_code    VARCHAR(5)    NOT NULL,
    description_en   TEXT          NULL,
    description_bn   TEXT          NULL,
    display_order    INT           NOT NULL DEFAULT 0,
    is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by       VARCHAR(255)  NULL,
    updated_by       VARCHAR(255)  NULL,

    CONSTRAINT pk_countries PRIMARY KEY (id),
    CONSTRAINT uq_countries_code UNIQUE (code),
    INDEX idx_countries_active_order (is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-2: cities
-- Belongs to a country. Admin-managed. Public read.
-- suburbs and highlights stored as JSON for flexibility.
-- Soft delete via is_active = FALSE.
-- RESTRICT FK — cannot delete country while cities exist under it.
-- =============================================================================
CREATE TABLE IF NOT EXISTS cities (
    id                      CHAR(36)       NOT NULL,
    country_id              CHAR(36)       NOT NULL,
    code                    VARCHAR(30)    NOT NULL,
    name_en                 VARCHAR(150)   NOT NULL,
    name_bn                 VARCHAR(300)   NOT NULL,
    tagline_en              VARCHAR(255)   NULL,
    tagline_bn              VARCHAR(500)   NULL,
    short_description_en    TEXT           NULL,
    short_description_bn    TEXT           NULL,
    long_description_en     TEXT           NULL,
    long_description_bn     TEXT           NULL,
    weekly_range_min_nzd    DECIMAL(15,2)  NULL,
    weekly_range_max_nzd    DECIMAL(15,2)  NULL,
    room_rent_hint_nzd      DECIMAL(15,2)  NULL,
    transport_hint_nzd      DECIMAL(15,2)  NULL,
    groceries_hint_nzd      DECIMAL(15,2)  NULL,
    -- JSON: ["University of Auckland", "AUT", "Massey"]
    universities            JSON           NULL,
    -- JSON: [{nameEn, nameBn, rentHintNzd, transportRating, budgetRating, notes}]
    suburbs                 JSON           NULL,
    overall_feel_en         TEXT           NULL,
    overall_feel_bn         TEXT           NULL,
    icon_svg_url            VARCHAR(1000)  NULL,
    color_hex               VARCHAR(7)     NULL,
    -- JSON: ["student-friendly", "affordable", "safe"]
    tags                    JSON           NULL,
    -- JSON: {transport: 4.2, safety: 4.5, affordability: 3.8, studentFriendly: 4.0}
    ratings                 JSON           NULL,
    display_order           INT            NOT NULL DEFAULT 0,
    is_active               BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at              DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at              DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by              VARCHAR(255)   NULL,
    updated_by              VARCHAR(255)   NULL,

    CONSTRAINT pk_cities PRIMARY KEY (id),
    CONSTRAINT uq_cities_country_code UNIQUE (country_id, code),
    CONSTRAINT fk_cities_country
        FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE RESTRICT,
    INDEX idx_cities_country_active (country_id, is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-3: planning_profiles
-- "Who are you planning for?" cards. Admin-managed. Public read. Global (not
-- country-specific — Solo Student applies to NZ, AU, CA equally).
-- budget_range_min/max is displayed on the profile card for the user.
-- =============================================================================
CREATE TABLE IF NOT EXISTS planning_profiles (
    id                          CHAR(36)       NOT NULL,
    code                        VARCHAR(50)    NOT NULL,
    name_en                     VARCHAR(150)   NOT NULL,
    name_bn                     VARCHAR(300)   NOT NULL,
    short_details_en            TEXT           NULL,
    short_details_bn            TEXT           NULL,
    -- JSON: ["student", "solo", "modest"]
    tags                        JSON           NULL,
    monthly_budget_range_min_nzd  DECIMAL(15,2) NULL,
    monthly_budget_range_max_nzd  DECIMAL(15,2) NULL,
    icon_svg_url                VARCHAR(1000)  NULL,
    color_hex                   VARCHAR(7)     NULL,
    display_order               INT            NOT NULL DEFAULT 0,
    is_active                   BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at                  DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at                  DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by                  VARCHAR(255)   NULL,
    updated_by                  VARCHAR(255)   NULL,

    CONSTRAINT pk_planning_profiles PRIMARY KEY (id),
    CONSTRAINT uq_planning_profiles_code UNIQUE (code),
    INDEX idx_planning_profiles_active_order (is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-4: plans
-- UNIFIED plan table — holds both admin master plans and applicant personal plans.
-- is_master_plan = TRUE  → admin-created template. is_published controls visibility.
-- is_master_plan = FALSE → applicant's personal copy. status controls active/archived.
--
-- One master plan per country+city+profile combo is enforced at APPLICATION LAYER
-- (not via DB constraint) because MySQL does not support partial unique indexes.
--
-- source_master_plan_id: which master plan this user plan was copied from.
-- Set to NULL if the master plan is later deleted (ON DELETE SET NULL).
--
-- Snapshot fields (country_name_snapshot, city_name_snapshot, profile_name_snapshot)
-- are denormalized at copy time — they protect display stability even if admin
-- later renames a country, city, or profile.
--
-- FK to cities and planning_profiles use RESTRICT — cannot delete city/profile
-- while master plans exist under them.
-- =============================================================================
CREATE TABLE IF NOT EXISTS plans (
    id                       CHAR(36)       NOT NULL,
    country_id               CHAR(36)       NOT NULL,
    city_id                  CHAR(36)       NOT NULL,
    planning_profile_id      CHAR(36)       NOT NULL,
    display_plan_name        VARCHAR(255)   NOT NULL,
    is_master_plan           BOOLEAN        NOT NULL DEFAULT FALSE,
    is_published             BOOLEAN        NOT NULL DEFAULT FALSE,
    overview_en              TEXT           NULL,
    overview_bn              TEXT           NULL,
    -- Applicant-facing fields (only relevant when is_master_plan = FALSE):
    source_master_plan_id    CHAR(36)       NULL,
    country_name_snapshot    VARCHAR(150)   NULL,
    city_name_snapshot       VARCHAR(150)   NULL,
    profile_name_snapshot    VARCHAR(150)   NULL,
    status                   ENUM('ACTIVE','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    is_deleted               BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at               DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at               DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by               VARCHAR(255)   NULL,
    updated_by               VARCHAR(255)   NULL,

    CONSTRAINT pk_plans PRIMARY KEY (id),
    CONSTRAINT fk_plans_country
        FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE RESTRICT,
    CONSTRAINT fk_plans_city
        FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE RESTRICT,
    CONSTRAINT fk_plans_profile
        FOREIGN KEY (planning_profile_id) REFERENCES planning_profiles (id) ON DELETE RESTRICT,
    CONSTRAINT fk_plans_source_master
        FOREIGN KEY (source_master_plan_id) REFERENCES plans (id) ON DELETE SET NULL,
    INDEX idx_plans_master_published (is_master_plan, is_published, is_deleted),
    INDEX idx_plans_city_profile (city_id, planning_profile_id),
    INDEX idx_plans_source_master (source_master_plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-5: plan_users
-- M2M between plans and users. Supports Phase 2 plan sharing (husband/wife).
-- Phase 1: every user plan has exactly one row with access_role = 'OWNER'.
-- Phase 2: add 'VIEWER' and 'EDITOR' rows for shared access without schema change.
-- =============================================================================
CREATE TABLE IF NOT EXISTS plan_users (
    id           CHAR(36)     NOT NULL,
    plan_id      CHAR(36)     NOT NULL,
    user_id      CHAR(36)     NOT NULL,
    access_role  ENUM('OWNER','VIEWER','EDITOR') NOT NULL DEFAULT 'OWNER',
    joined_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    CONSTRAINT pk_plan_users PRIMARY KEY (id),
    CONSTRAINT uq_plan_users_plan_user UNIQUE (plan_id, user_id),
    CONSTRAINT fk_pu_plan
        FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
    CONSTRAINT fk_pu_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_plan_users_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-6: monthly_living_items
-- Monthly expense line items. Used for BOTH master plans and user plans.
--
-- For master plan items (plan.is_master_plan = TRUE):
--   name_en, name_bn, note_en, note_bn → set by admin (bilingual)
--   custom_name, custom_note          → NULL
--
-- For user plan items (plan.is_master_plan = FALSE):
--   custom_name, custom_note → set by applicant (single language, their own text)
--   name_en, name_bn, note_en, note_bn → NULL (not needed after copy)
--
-- At copy time: custom_name is populated from name_en or name_bn based on the
-- applicant's preferred language. Master plan bilingual fields are left NULL.
-- Cascade: deleting a plan cascades all its items.
-- =============================================================================
CREATE TABLE IF NOT EXISTS monthly_living_items (
    id                      CHAR(36)       NOT NULL,
    plan_id                 CHAR(36)       NOT NULL,
    name_en                 VARCHAR(255)   NULL,
    name_bn                 VARCHAR(500)   NULL,
    custom_name             VARCHAR(255)   NULL,
    estimated_amount_nzd    DECIMAL(15,2)  NOT NULL DEFAULT 0.00,
    note_en                 TEXT           NULL,
    note_bn                 TEXT           NULL,
    custom_note             TEXT           NULL,
    is_custom               BOOLEAN        NOT NULL DEFAULT FALSE,
    display_order           INT            NOT NULL DEFAULT 0,

    CONSTRAINT pk_monthly_living_items PRIMARY KEY (id),
    CONSTRAINT fk_mli_plan
        FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
    INDEX idx_mli_plan_order (plan_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-7: moving_cost_items
-- One-time pre-arrival / arrival expenses. Same bilingual pattern as monthly items.
-- Admin sets item_name_en + item_name_bn for master plans.
-- Applicant sets custom_item_name for their personal plan.
-- =============================================================================
CREATE TABLE IF NOT EXISTS moving_cost_items (
    id                      CHAR(36)       NOT NULL,
    plan_id                 CHAR(36)       NOT NULL,
    item_name_en            VARCHAR(255)   NULL,
    item_name_bn            VARCHAR(500)   NULL,
    custom_item_name        VARCHAR(255)   NULL,
    estimated_amount_nzd    DECIMAL(15,2)  NOT NULL DEFAULT 0.00,
    note_en                 TEXT           NULL,
    note_bn                 TEXT           NULL,
    custom_note             TEXT           NULL,
    is_custom               BOOLEAN        NOT NULL DEFAULT FALSE,
    display_order           INT            NOT NULL DEFAULT 0,

    CONSTRAINT pk_moving_cost_items PRIMARY KEY (id),
    CONSTRAINT fk_mci_plan
        FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
    INDEX idx_mci_plan_order (plan_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-8: checklist_items
-- Pre-departure checklist. Used for both master plans and user plans.
-- Master plan items (admin-set): item_text_en, item_text_bn, note_en, note_bn
-- User plan items  (applicant) : custom_item_text, custom_note
-- is_done and completed_at are only relevant for user plan items.
-- is_custom = TRUE for items the applicant added themselves (not from master).
-- =============================================================================
CREATE TABLE IF NOT EXISTS checklist_items (
    id               CHAR(36)     NOT NULL,
    plan_id          CHAR(36)     NOT NULL,
    category         ENUM('DOCUMENTS','FINANCIAL','ACCOMMODATION','COMMUNICATION','HEALTH','CUSTOM')
                                  NOT NULL DEFAULT 'CUSTOM',
    item_text_en     VARCHAR(500) NULL,
    item_text_bn     VARCHAR(1000) NULL,
    custom_item_text VARCHAR(500) NULL,
    quantity         INT          NOT NULL DEFAULT 1,
    is_done          BOOLEAN      NOT NULL DEFAULT FALSE,
    completed_at     DATETIME(6)  NULL,
    note_en          TEXT         NULL,
    note_bn          TEXT         NULL,
    custom_note      TEXT         NULL,
    is_custom        BOOLEAN      NOT NULL DEFAULT FALSE,
    display_order    INT          NOT NULL DEFAULT 0,

    CONSTRAINT pk_checklist_items PRIMARY KEY (id),
    CONSTRAINT fk_ci_plan
        FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
    INDEX idx_ci_plan_category (plan_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-9: living_funds
-- One row per plan (1:1). Holds both admin guidance (for master plans) and
-- applicant savings data (for user plans).
--
-- Master plan fields (admin-set):
--   minimum_amount_nzd     → bare minimum recommended fund
--   recommended_amount_nzd → comfortable runway
--   explanation_en/bn      → why this amount
--   disclaimer_en/bn       → "Exclude tuition fees from this figure"
--
-- User plan fields (applicant-set):
--   user_saved_amount_bdt           → current savings in BDT
--   user_monthly_contribution_bdt   → how much they add monthly
--   user_target_date                → planned departure date
--   user_notes                      → personal notes
--
-- Computed (NOT stored — calculated in service layer at query time):
--   survival_months = (user_saved_amount_bdt / exchange_rate) / monthly_total_nzd
--   readiness_score = 0–100 derived from survival_months
--   projected_ready_date = derived from contribution rate + shortfall
-- =============================================================================
CREATE TABLE IF NOT EXISTS living_funds (
    id                            CHAR(36)       NOT NULL,
    plan_id                       CHAR(36)       NOT NULL,
    minimum_amount_nzd            DECIMAL(15,2)  NULL,
    recommended_amount_nzd        DECIMAL(15,2)  NULL,
    explanation_en                TEXT           NULL,
    explanation_bn                TEXT           NULL,
    disclaimer_en                 TEXT           NULL,
    disclaimer_bn                 TEXT           NULL,
    user_saved_amount_bdt         DECIMAL(15,2)  NULL DEFAULT 0.00,
    user_monthly_contribution_bdt DECIMAL(15,2)  NULL DEFAULT 0.00,
    user_target_date              DATE           NULL,
    user_notes                    TEXT           NULL,
    created_at                    DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at                    DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by                    VARCHAR(255)   NULL,
    updated_by                    VARCHAR(255)   NULL,

    CONSTRAINT pk_living_funds PRIMARY KEY (id),
    CONSTRAINT uq_living_funds_plan UNIQUE (plan_id),
    CONSTRAINT fk_lf_plan
        FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-10: plan_archives
-- Immutable JSON snapshots created when an applicant archives a plan.
-- No restore. Viewable as history only.
--
-- snapshot_json contains the full plan state at the moment of archiving:
--   { plan, monthlyItems[], movingItems[], checklistItems[], livingFund }
--
-- plan_id is NOT a strict FK — the plan may be hard-deleted later by the user
-- or admin, but the archive snapshot should remain as history.
-- user_id FK cascades on user deletion — if user account is deleted, archives go too.
-- =============================================================================
CREATE TABLE IF NOT EXISTS plan_archives (
    id             CHAR(36)     NOT NULL,
    plan_id        CHAR(36)     NULL,
    user_id        CHAR(36)     NOT NULL,
    snapshot_json  JSON         NOT NULL,
    archived_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    CONSTRAINT pk_plan_archives PRIMARY KEY (id),
    CONSTRAINT fk_pa_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_pa_user_archived (user_id, archived_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-11: news
-- Admin-published articles and content pieces. HTML body (rich text).
-- Only admins can create/update/delete. Public read of published items.
-- is_deleted = soft delete.
-- =============================================================================
CREATE TABLE IF NOT EXISTS news (
    id            CHAR(36)      NOT NULL,
    title         VARCHAR(255)  NOT NULL,
    icon_name     VARCHAR(50)   NULL,
    -- JSON: ["banking", "student", "visa"]
    tags          JSON          NULL,
    content_html  LONGTEXT      NOT NULL,
    is_published  BOOLEAN       NOT NULL DEFAULT FALSE,
    published_at  DATETIME(6)   NULL,
    is_deleted    BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by    VARCHAR(255)  NULL,
    updated_by    VARCHAR(255)  NULL,

    CONSTRAINT pk_news PRIMARY KEY (id),
    INDEX idx_news_published_deleted (is_published, is_deleted, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- BIZ-12: app_settings
-- Key-value store for admin-managed application configuration.
-- Phase 1 use: BDT ↔ NZD exchange rate (set manually by admin).
-- Phase 2: replaced by automated FX API integration, but table stays.
--
-- Example rows:
--   exchange_rate_bdt_per_nzd = "83.50"
--   exchange_rate_last_updated = "2026-04-26"
--   exchange_rate_source = "manual"
-- =============================================================================
CREATE TABLE IF NOT EXISTS app_settings (
    id              CHAR(36)      NOT NULL,
    setting_key     VARCHAR(100)  NOT NULL,
    setting_value   VARCHAR(500)  NOT NULL,
    description     VARCHAR(255)  NULL,
    created_at      DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by      VARCHAR(255)  NULL,
    updated_by      VARCHAR(255)  NULL,

    CONSTRAINT pk_app_settings PRIMARY KEY (id),
    CONSTRAINT uq_app_settings_key UNIQUE (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Initial exchange rate (admin updates this via admin panel)
INSERT INTO app_settings (id, setting_key, setting_value, description, created_by)
VALUES (
    UUID(),
    'exchange_rate_bdt_per_nzd',
    '83.50',
    'How many BDT equals 1 NZD. Updated manually by admin until Phase 2 FX integration.',
    'system'
)
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Initial NZ country record
INSERT INTO countries (
    id, code, name_en, name_bn, flag_emoji, color_hex,
    currency_code, description_en, description_bn, display_order, is_active, created_by
)
VALUES (
    UUID(),
    'NZ',
    'New Zealand',
    'নিউজিল্যান্ড',
    '🇳🇿',
    '#0095A1',
    'NZD',
    'A Pacific nation known for its quality universities, safe environment, and student-friendly cities.',
    'প্রশান্ত মহাসাগরীয় একটি দেশ যা তার মানসম্পন্ন বিশ্ববিদ্যালয়, নিরাপদ পরিবেশ এবং শিক্ষার্থী-বান্ধব শহরের জন্য পরিচিত।',
    1,
    TRUE,
    'system'
)
ON DUPLICATE KEY UPDATE code = VALUES(code);

-- =============================================================================
-- LEGACY TABLES — REMOVED
-- The following phase-0 tables from the original schema are replaced by the
-- new unified design above. Do not recreate them.
--   × city_templates     → replaced by plans (is_master_plan=TRUE) + monthly_living_items
--   × budget_plans       → replaced by plans (is_master_plan=FALSE)
--   × expense_categories → replaced by monthly_living_items
--   × move_calculators   → replaced by moving_cost_items (under a plan)
--   × savings_plans      → replaced by living_funds.user_saved_amount_bdt + user_target_date
--   × checklist_items    → replaced by checklist_items (now plan-scoped, not user-scoped)
--   × nz_contents        → replaced by news
--   × job_info           → replaced by news (category-tagged articles)
-- =============================================================================
