-- =============================================================================
-- KiwiDream BD — Seed Data
-- Version: 3.0  |  Date: April 2026
-- =============================================================================
use kiwi_dream_bd;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE living_funds;
TRUNCATE TABLE checklist_items;
TRUNCATE TABLE moving_cost_items;
TRUNCATE TABLE monthly_living_items;
TRUNCATE TABLE plan_archives;
TRUNCATE TABLE plan_users;
TRUNCATE TABLE plans;
TRUNCATE TABLE planning_profiles;
TRUNCATE TABLE cities;
TRUNCATE TABLE countries;

SET FOREIGN_KEY_CHECKS = 1;

-- ─────────────────────────────────────────────────────────────────────────────
-- COUNTRY: New Zealand
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO countries (
    id, code, name_en, name_bn,
    flag_emoji, flag_image_url, color_hex, currency_code,
    description_en, description_bn,
    display_order, is_active,
    created_at, updated_at, created_by, updated_by
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'NZ', 'New Zealand', 'নিউজিল্যান্ড',
    '🇳🇿', NULL, '#00AFAF', 'NZD',
    'New Zealand is a Pacific island country known for its stunning natural landscapes.',
    'নিউজিল্যান্ড প্রশান্ত মহাসাগরীয় একটি দেশ যা তার অসাধারণ প্রাকৃতিক দৃশ্যর জন্য পরিচিত।',
    1, TRUE, NOW(), NOW(), 'system', 'system'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- CITIES (under New Zealand)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO cities (
    id, country_id, code, name_en, name_bn,
    tagline_en, tagline_bn,
    short_description_en, short_description_bn,
    long_description_en, long_description_bn,
    weekly_range_min_nzd, weekly_range_max_nzd,
    room_rent_hint_nzd, transport_hint_nzd, groceries_hint_nzd,
    universities, suburbs, tags, ratings, overall_feel_en, overall_feel_bn,
    icon_svg_url, color_hex,
    display_order, is_active,
    created_at, updated_at, created_by, updated_by
) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'AUCKLAND', 'Auckland', 'অকল্যান্ড', 'NZ''s largest and most vibrant city', 'নিউজিল্যান্ডের সবচেয়ে বড় ও প্রাণবন্ত শহর', 'Auckland is New Zealand''s commercial capital.', 'অকল্যান্ড নিউজিল্যান্ডের বাণিজ্যিক রাজধানী।', 'Auckland sits on an isthmus between two harbours.', 'অকল্যান্ড দুটি বন্দরের মধ্যে একটি সংযোগস্থলে অবস্থিত।', 450.00, 700.00, 320.00, 120.00, 240.00, '["University of Auckland", "AUT"]', '[{"nameEn":"Papatoetoe","nameBn":"পাপাটোইটোই"}]', '["student-friendly","multicultural"]', '{"transport":3.8,"safety":3.9}', 'Energetic, multicultural, expensive but full of opportunity.', 'প্রাণবন্ত, বহুসাংস্কৃতিক, ব্যয়বহুল কিন্তু সুযোগে পরিপূর্ণ।', NULL, '#1a9aa0', 1, TRUE, NOW(), NOW(), 'system', 'system'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'WELLINGTON', 'Wellington', 'ওয়েলিংটন', 'The cool little capital', 'ছোট কিন্তু আকর্ষণীয় রাজধানী', 'New Zealand''s compact, walkable capital.', 'নিউজিল্যান্ডের ছোট ও হাঁটার উপযোগী রাজধানী।', 'Wellington is NZ''s capital and cultural heart.', 'ওয়েলিংটন নিউজিল্যান্ডের রাজধানী এবং সাংস্কৃতিক কেন্দ্র।', 420.00, 640.00, 295.00, 100.00, 220.00, '["Victoria University"]', '[{"nameEn":"Newtown","nameBn":"নিউটাউন"}]', '["capital","walkable"]', '{"transport":4.5,"safety":4.3}', 'Compact and walkable, great café culture.', 'ছোট ও হাঁটার উপযোগী, দারুণ ক্যাফে সংস্কৃতি।', NULL, '#7c5cbf', 2, TRUE, NOW(), NOW(), 'system', 'system'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'CHRISTCHURCH', 'Christchurch', 'ক্রাইস্টচার্চ', 'The garden city of NZ', 'নিউজিল্যান্ডের গার্ডেন সিটি', 'Christchurch is NZ''s second largest city.', 'ক্রাইস্টচার্চ নিউজিল্যান্ডের দ্বিতীয় বৃহত্তম শহর।', 'Christchurch offers the best value-for-money living.', 'ক্রাইস্টচার্চ দক্ষিণ দ্বীপে সেরা মানের জীবনযাপনের সুযোগ দেয়।', 370.00, 560.00, 245.00, 90.00, 200.00, '["University of Canterbury"]', '[{"nameEn":"Riccarton","nameBn":"রিকার্টন"}]', '["affordable","flat"]', '{"transport":3.5,"safety":4.2}', 'Flat, spacious, affordable.', 'সমতল, প্রশস্ত, সাশ্রয়ী।', NULL, '#e87a41', 3, TRUE, NOW(), NOW(), 'system', 'system'),
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'HAMILTON', 'Hamilton', 'হ্যামিলটন', 'Affordable student city', 'সাশ্রয়ী মূল্যের ছাত্র শহর', 'Hamilton is a growing inland city.', 'হ্যামিলটন একটি বর্ধমান অভ্যন্তরীণ শহর।', 'Hamilton is NZ''s fourth largest city.', 'হ্যামিলটন নিউজিল্যান্ডের চতুর্থ বৃহত্তম শহর।', 310.00, 470.00, 215.00, 75.00, 185.00, '["University of Waikato"]', '[{"nameEn":"Claudelands","nameBn":"ক্লডল্যান্ডস"}]', '["budget-friendly"]', '{"transport":3.0,"safety":4.0}', 'Budget-friendly, quieter than main cities.', 'বাজেট-বান্ধব, প্রধান শহরগুলির চেয়ে শান্ত।', NULL, '#5c8a5c', 4, TRUE, NOW(), NOW(), 'system', 'system'),
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'DUNEDIN', 'Dunedin', 'ডুনেডিন', 'NZ''s student city with lowest living costs', 'সবচেয়ে কম খরচে বাসযোগ্য ছাত্র শহর', 'Dunedin is famous for Otago University.', 'ডুনেডিন ওটাগো বিশ্ববিদ্যালয়ের জন্য বিখ্যাত।', 'Dunedin is the quintessential student city.', 'ডুনেডিন আদর্শ ছাত্র শহর।', 280.00, 420.00, 185.00, 70.00, 175.00, '["University of Otago"]', '[{"nameEn":"North Dunedin","nameBn":"নর্থ ডুনেডিন"}]', '["cheapest","student"]', '{"transport":3.5,"safety":4.3}', 'Coldest but cheapest.', 'সবচেয়ে ঠান্ডা কিন্তু সবচেয়ে সস্তা।', NULL, '#4a6fa5', 5, TRUE, NOW(), NOW(), 'system', 'system');

-- ─────────────────────────────────────────────────────────────────────────────
-- PLANNING PROFILES (Only 2 as requested)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO planning_profiles (
    id, code, name_en, name_bn,
    short_details_en, short_details_bn,
    tags, monthly_budget_range_min_nzd, monthly_budget_range_max_nzd,
    default_person_count, icon_svg_url, color_hex,
    display_order, is_active,
    created_at, updated_at, created_by, updated_by
) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SOLO_STUDENT', 'Solo Student', 'একা শিক্ষার্থী', 'Planning for one student on a modest budget.', 'একজন শিক্ষার্থীর জন্য পরিকল্পনা সীমিত বাজেটে।', '["student","solo","modest","first-year"]', 1400.00, 2200.00, 1, NULL, '#00AFAF', 1, TRUE, NOW(), NOW(), 'system', 'system'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'STUDENT_COUPLE', 'Student Couple', 'ছাত্র দম্পতি', 'Planning for two — husband and wife, or two flatmates.', 'দুইজনের পরিকল্পনা — স্বামী ও স্ত্রী, বা দুই ফ্ল্যাটমেট।', '["couple","student","shared","two-people"]', 2400.00, 3800.00, 2, NULL, '#9C6DB5', 2, TRUE, NOW(), NOW(), 'system', 'system');

-- ─────────────────────────────────────────────────────────────────────────────
-- MASTER PLANS (2 profiles × 5 cities = 10 plans)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO plans (id, country_id, city_id, planning_profile_id, display_plan_name, is_master_plan, is_published, overview_en, overview_bn, status, is_deleted, created_at, updated_at, created_by, updated_by) VALUES
('p0100000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Auckland — Solo Student Plan', TRUE, TRUE, 'Solo living plan in Auckland.', 'অকল্যান্ডে একা থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0200000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Auckland — Student Couple Plan', TRUE, TRUE, 'Couple living plan in Auckland.', 'অকল্যান্ডে দম্পতি থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0300000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Wellington — Solo Student Plan', TRUE, TRUE, 'Solo living plan in Wellington.', 'ওয়েলিংটনে একা থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0400000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Wellington — Student Couple Plan', TRUE, TRUE, 'Couple living plan in Wellington.', 'ওয়েলিংটনে দম্পতি থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0500000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Christchurch — Solo Student Plan', TRUE, TRUE, 'Solo living plan in Christchurch.', 'ক্রাইস্টচার্চে একা থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0600000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Christchurch — Student Couple Plan', TRUE, TRUE, 'Couple living plan in Christchurch.', 'ক্রাইস্টচার্চে দম্পতি থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0700000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hamilton — Solo Student Plan', TRUE, TRUE, 'Solo living plan in Hamilton.', 'হ্যামিলটনে একা থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0800000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Hamilton — Student Couple Plan', TRUE, TRUE, 'Couple living plan in Hamilton.', 'হ্যামিলটনে দম্পতি থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p0900000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dunedin — Solo Student Plan', TRUE, TRUE, 'Solo living plan in Dunedin.', 'ডুনেডিনে একা থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system'),
('p1000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dunedin — Student Couple Plan', TRUE, TRUE, 'Couple living plan in Dunedin.', 'ডুনেডিনে দম্পতি থাকার পরিকল্পনা।', 'ACTIVE', FALSE, NOW(), NOW(), 'system', 'system');

-- ─────────────────────────────────────────────────────────────────────────────
-- MONTHLY LIVING ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO monthly_living_items (id, plan_id, name_en, name_bn, estimated_amount_nzd, is_custom, display_order) VALUES
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', 320, FALSE, 1),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Groceries', 'মুদিখানা', 240, FALSE, 2),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', 120, FALSE, 3),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 80, FALSE, 4),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 80.00, FALSE, 5),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 60.00, FALSE, 6),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 40.00, FALSE, 7),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Rent (1-Bedroom)', 'ভাড়া (১-বেডরুম)', 550, FALSE, 1),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Groceries (2 people)', 'মুদিখানা (২ জন)', 432.0, FALSE, 2),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Transport (2 passes)', 'পরিবহন (২টি পাস)', 216.0, FALSE, 3),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 120.0, FALSE, 4),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 150.00, FALSE, 5),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 120.00, FALSE, 6),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 80.00, FALSE, 7),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', 280, FALSE, 1),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Groceries', 'মুদিখানা', 220, FALSE, 2),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', 100, FALSE, 3),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 80, FALSE, 4),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 80.00, FALSE, 5),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 60.00, FALSE, 6),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 40.00, FALSE, 7),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Rent (1-Bedroom)', 'ভাড়া (১-বেডরুম)', 490, FALSE, 1),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Groceries (2 people)', 'মুদিখানা (২ জন)', 396.0, FALSE, 2),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Transport (2 passes)', 'পরিবহন (২টি পাস)', 180.0, FALSE, 3),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 120.0, FALSE, 4),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 150.00, FALSE, 5),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 120.00, FALSE, 6),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 80.00, FALSE, 7),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', 240, FALSE, 1),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Groceries', 'মুদিখানা', 200, FALSE, 2),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', 80, FALSE, 3),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 80, FALSE, 4),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 80.00, FALSE, 5),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 60.00, FALSE, 6),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 40.00, FALSE, 7),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Rent (1-Bedroom)', 'ভাড়া (১-বেডরুম)', 400, FALSE, 1),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Groceries (2 people)', 'মুদিখানা (২ জন)', 360.0, FALSE, 2),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Transport (2 passes)', 'পরিবহন (২টি পাস)', 144.0, FALSE, 3),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 120.0, FALSE, 4),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 150.00, FALSE, 5),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 120.00, FALSE, 6),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 80.00, FALSE, 7),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', 195, FALSE, 1),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Groceries', 'মুদিখানা', 185, FALSE, 2),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', 65, FALSE, 3),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 70, FALSE, 4),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 80.00, FALSE, 5),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 60.00, FALSE, 6),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 40.00, FALSE, 7),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Rent (1-Bedroom)', 'ভাড়া (১-বেডরুম)', 350, FALSE, 1),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Groceries (2 people)', 'মুদিখানা (২ জন)', 333.0, FALSE, 2),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Transport (2 passes)', 'পরিবহন (২টি পাস)', 117.0, FALSE, 3),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 105.0, FALSE, 4),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 150.00, FALSE, 5),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 120.00, FALSE, 6),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 80.00, FALSE, 7),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', 165, FALSE, 1),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Groceries', 'মুদিখানা', 175, FALSE, 2),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', 55, FALSE, 3),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 90, FALSE, 4),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 80.00, FALSE, 5),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 60.00, FALSE, 6),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 40.00, FALSE, 7),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Rent (1-Bedroom)', 'ভাড়া (১-বেডরুম)', 300, FALSE, 1),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Groceries (2 people)', 'মুদিখানা (২ জন)', 315.0, FALSE, 2),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Transport (2 passes)', 'পরিবহন (২টি পাস)', 99.0, FALSE, 3),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', 135.0, FALSE, 4),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Eating Out', 'বাইরে খাওয়া', 150.00, FALSE, 5),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', 120.00, FALSE, 6),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Entertainment', 'বিনোদন', 80.00, FALSE, 7);

-- ─────────────────────────────────────────────────────────────────────────────
-- MOVING COST ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, estimated_amount_nzd, is_custom, display_order) VALUES
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Return Flight (Dhaka → Auckland)', 'ফ্লাইট', 1200.00, FALSE, 1),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Student Visa Fee', 'স্টুডেন্ট ভিসা ফি', 375.00, FALSE, 2),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 1280, FALSE, 3),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 150.00, FALSE, 4),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 120.00, FALSE, 5),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'SIM Card', 'সিম কার্ড', 30.00, FALSE, 6),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Return Flights (2x)', 'ফ্লাইট (২ জন)', 2400.00, FALSE, 1),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Visa Fees (Student + Partner)', 'ভিসা ফি (স্টুডেন্ট + পার্টনার)', 750.00, FALSE, 2),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 2200, FALSE, 3),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 250.00, FALSE, 4),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 180.00, FALSE, 5),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'SIM Cards (2x)', 'সিম কার্ড (২টি)', 60.00, FALSE, 6),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Return Flight (Dhaka → Wellington)', 'ফ্লাইট', 1200.00, FALSE, 1),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Student Visa Fee', 'স্টুডেন্ট ভিসা ফি', 375.00, FALSE, 2),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 1120, FALSE, 3),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 150.00, FALSE, 4),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 120.00, FALSE, 5),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'SIM Card', 'সিম কার্ড', 30.00, FALSE, 6),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Return Flights (2x)', 'ফ্লাইট (২ জন)', 2400.00, FALSE, 1),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Visa Fees (Student + Partner)', 'ভিসা ফি (স্টুডেন্ট + পার্টনার)', 750.00, FALSE, 2),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 1960, FALSE, 3),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 250.00, FALSE, 4),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 180.00, FALSE, 5),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'SIM Cards (2x)', 'সিম কার্ড (২টি)', 60.00, FALSE, 6),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Return Flight (Dhaka → Christchurch)', 'ফ্লাইট', 1200.00, FALSE, 1),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Student Visa Fee', 'স্টুডেন্ট ভিসা ফি', 375.00, FALSE, 2),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 960, FALSE, 3),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 150.00, FALSE, 4),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 120.00, FALSE, 5),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'SIM Card', 'সিম কার্ড', 30.00, FALSE, 6),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Return Flights (2x)', 'ফ্লাইট (২ জন)', 2400.00, FALSE, 1),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Visa Fees (Student + Partner)', 'ভিসা ফি (স্টুডেন্ট + পার্টনার)', 750.00, FALSE, 2),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 1600, FALSE, 3),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 250.00, FALSE, 4),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 180.00, FALSE, 5),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'SIM Cards (2x)', 'সিম কার্ড (২টি)', 60.00, FALSE, 6),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Return Flight (Dhaka → Hamilton)', 'ফ্লাইট', 1200.00, FALSE, 1),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Student Visa Fee', 'স্টুডেন্ট ভিসা ফি', 375.00, FALSE, 2),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 780, FALSE, 3),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 150.00, FALSE, 4),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 120.00, FALSE, 5),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'SIM Card', 'সিম কার্ড', 30.00, FALSE, 6),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Return Flights (2x)', 'ফ্লাইট (২ জন)', 2400.00, FALSE, 1),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Visa Fees (Student + Partner)', 'ভিসা ফি (স্টুডেন্ট + পার্টনার)', 750.00, FALSE, 2),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 1400, FALSE, 3),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 250.00, FALSE, 4),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 180.00, FALSE, 5),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'SIM Cards (2x)', 'সিম কার্ড (২টি)', 60.00, FALSE, 6),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Return Flight (Dhaka → Dunedin)', 'ফ্লাইট', 1200.00, FALSE, 1),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Student Visa Fee', 'স্টুডেন্ট ভিসা ফি', 375.00, FALSE, 2),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 660, FALSE, 3),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 150.00, FALSE, 4),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 120.00, FALSE, 5),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'SIM Card', 'সিম কার্ড', 30.00, FALSE, 6),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Return Flights (2x)', 'ফ্লাইট (২ জন)', 2400.00, FALSE, 1),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Visa Fees (Student + Partner)', 'ভিসা ফি (স্টুডেন্ট + পার্টনার)', 750.00, FALSE, 2),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', 1200, FALSE, 3),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Bedding & Linen', 'বিছানাপত্র', 250.00, FALSE, 4),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', 180.00, FALSE, 5),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'SIM Cards (2x)', 'সিম কার্ড (২টি)', 60.00, FALSE, 6);

-- ─────────────────────────────────────────────────────────────────────────────
-- CHECKLIST ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, quantity, is_custom, is_done, display_order) VALUES
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0100000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Visa approved and printed copy ready', 'ভিসা অনুমোদিত এবং প্রিন্ট কপি প্রস্তুত', 1, FALSE, FALSE, 1),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Passport valid for at least 6 months', 'পাসপোর্ট অন্তত ৬ মাস মেয়াদ আছে', 1, FALSE, FALSE, 2),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'DOCUMENTS', 'Offer letter and enrollment documents packed', 'অফার লেটার এবং ভর্তির কাগজপত্র প্রস্তুত', 1, FALSE, FALSE, 3),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'FINANCIAL', '3-month living expense buffer is ready', '৩ মাসের লিভিং খরচের বাফার প্রস্তুত', 1, FALSE, FALSE, 4),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'FINANCIAL', 'International card or Wise account activated', 'আন্তর্জাতিক কার্ড বা ওয়াইজ অ্যাকাউন্ট সক্রিয়', 1, FALSE, FALSE, 5),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'FINANCIAL', 'Small arrival cash in NZD prepared', 'নিউজিল্যান্ড ডলারে ছোট অংকের নগদ টাকা প্রস্তুত', 1, FALSE, FALSE, 6),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'First 2 weeks accommodation confirmed', 'প্রথম ২ সপ্তাহের আবাসন নিশ্চিত', 1, FALSE, FALSE, 7),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'ACCOMMODATION', 'Tenancy agreement reviewed carefully', 'ভাড়ার চুক্তি সাবধানে পড়া হয়েছে', 1, FALSE, FALSE, 8),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'COMMUNICATION', 'NZ SIM options researched', 'নিউজিল্যান্ডের সিমের অপশন যাচাই করা হয়েছে', 1, FALSE, FALSE, 9),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'COMMUNICATION', 'Local contact or community group joined', 'স্থানীয় পরিচিত বা কমিউনিটি গ্রুপে যুক্ত হওয়া হয়েছে', 1, FALSE, FALSE, 10),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'HEALTH', 'Health insurance documents saved', 'স্বাস্থ্য বীমার কাগজপত্র সংরক্ষিত', 1, FALSE, FALSE, 11),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 'HEALTH', 'Medical records and prescriptions packed', 'মেডিকেল রেকর্ড এবং প্রেসক্রিপশন প্যাক করা হয়েছে', 1, FALSE, FALSE, 12);


-- ─────────────────────────────────────────────────────────────────────────────
-- LIVING FUNDS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO living_funds (id, plan_id, minimum_amount_nzd, recommended_amount_nzd, explanation_en, explanation_bn) VALUES
(UUID(), 'p0100000-0000-0000-0000-000000000000', 8000.00, 12000.00, 'Your living fund should cover at least 3 months of expenses.', 'আপনার লিভিং ফান্ড অন্তত ৩ মাসের খরচ কভার করা উচিত।'),
(UUID(), 'p0200000-0000-0000-0000-000000000000', 14000.00, 21000.00, 'For two people, living fund should cover 3–6 months of shared expenses.', 'দুইজনের জন্য, লিভিং ফান্ড ৩–৬ মাসের শেয়ার্ড খরচ কভার করা উচিত।'),
(UUID(), 'p0300000-0000-0000-0000-000000000000', 8000.00, 12000.00, 'Your living fund should cover at least 3 months of expenses.', 'আপনার লিভিং ফান্ড অন্তত ৩ মাসের খরচ কভার করা উচিত।'),
(UUID(), 'p0400000-0000-0000-0000-000000000000', 14000.00, 21000.00, 'For two people, living fund should cover 3–6 months of shared expenses.', 'দুইজনের জন্য, লিভিং ফান্ড ৩–৬ মাসের শেয়ার্ড খরচ কভার করা উচিত।'),
(UUID(), 'p0500000-0000-0000-0000-000000000000', 8000.00, 12000.00, 'Your living fund should cover at least 3 months of expenses.', 'আপনার লিভিং ফান্ড অন্তত ৩ মাসের খরচ কভার করা উচিত।'),
(UUID(), 'p0600000-0000-0000-0000-000000000000', 14000.00, 21000.00, 'For two people, living fund should cover 3–6 months of shared expenses.', 'দুইজনের জন্য, লিভিং ফান্ড ৩–৬ মাসের শেয়ার্ড খরচ কভার করা উচিত।'),
(UUID(), 'p0700000-0000-0000-0000-000000000000', 8000.00, 12000.00, 'Your living fund should cover at least 3 months of expenses.', 'আপনার লিভিং ফান্ড অন্তত ৩ মাসের খরচ কভার করা উচিত।'),
(UUID(), 'p0800000-0000-0000-0000-000000000000', 14000.00, 21000.00, 'For two people, living fund should cover 3–6 months of shared expenses.', 'দুইজনের জন্য, লিভিং ফান্ড ৩–৬ মাসের শেয়ার্ড খরচ কভার করা উচিত।'),
(UUID(), 'p0900000-0000-0000-0000-000000000000', 8000.00, 12000.00, 'Your living fund should cover at least 3 months of expenses.', 'আপনার লিভিং ফান্ড অন্তত ৩ মাসের খরচ কভার করা উচিত।'),
(UUID(), 'p1000000-0000-0000-0000-000000000000', 14000.00, 21000.00, 'For two people, living fund should cover 3–6 months of shared expenses.', 'দুইজনের জন্য, লিভিং ফান্ড ৩–৬ মাসের শেয়ার্ড খরচ কভার করা উচিত।');
