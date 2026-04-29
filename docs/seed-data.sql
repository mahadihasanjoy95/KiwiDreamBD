-- =============================================================================
-- KiwiDream BD — Seed Data
-- Version: 1.0  |  Date: April 2026
-- Run this against the kiwi_dream_bd database after schema creation.
-- All UUIDs are stable — safe to re-run with INSERT IGNORE.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- COUNTRY: New Zealand
-- ─────────────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO countries (
    id, code, name_en, name_bn,
    flag_emoji, flag_image_url, color_hex, currency_code,
    description_en, description_bn,
    display_order, is_active,
    created_at, updated_at, created_by, updated_by
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'NZ',
    'New Zealand',
    'নিউজিল্যান্ড',
    '🇳🇿',
    NULL,
    '#00AFAF',
    'NZD',
    'New Zealand is a Pacific island country known for its stunning natural landscapes, high quality of life, and welcoming immigration pathways for international students and skilled workers.',
    'নিউজিল্যান্ড প্রশান্ত মহাসাগরীয় একটি দেশ যা তার অসাধারণ প্রাকৃতিক দৃশ্য, উচ্চমানের জীবনযাত্রা এবং আন্তর্জাতিক শিক্ষার্থী ও দক্ষ কর্মীদের জন্য বন্ধুসুলভ অভিবাসন পথের জন্য পরিচিত।',
    1,
    TRUE,
    NOW(), NOW(), 'system', 'system'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- CITIES (under New Zealand)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO cities (
    id, country_id, code, name_en, name_bn,
    tagline_en, tagline_bn,
    short_description_en, short_description_bn,
    long_description_en, long_description_bn,
    weekly_range_min_nzd, weekly_range_max_nzd,
    room_rent_hint_nzd, transport_hint_nzd, groceries_hint_nzd,
    cost_index, overall_feel_en, overall_feel_bn,
    icon_svg_url, color_hex,
    universities, suburbs, tags, ratings,
    display_order, is_active,
    created_at, updated_at, created_by, updated_by
) VALUES
-- Auckland
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'AUCKLAND',
    'Auckland',
    'অকল্যান্ড',
    'NZ''s largest and most vibrant city',
    'নিউজিল্যান্ডের সবচেয়ে বড় ও প্রাণবন্ত শহর',
    'Auckland is New Zealand''s commercial capital, home to over a third of the population and most top universities.',
    'অকল্যান্ড নিউজিল্যান্ডের বাণিজ্যিক রাজধানী, যেখানে দেশের এক-তৃতীয়াংশ জনসংখ্যা বাস করে।',
    'Auckland sits on an isthmus between two harbours and is surrounded by 50 volcanic cones. It is the most culturally diverse city in NZ, offering excellent job markets, transport networks, and student communities.',
    'অকল্যান্ড দুটি বন্দরের মধ্যে একটি সংযোগস্থলে অবস্থিত এবং ৫০টি আগ্নেয়গিরির শঙ্কু দ্বারা বেষ্টিত। এটি নিউজিল্যান্ডের সবচেয়ে সাংস্কৃতিকভাবে বৈচিত্র্যময় শহর।',
    450.00, 700.00,
    320.00, 120.00, 240.00,
    115,
    'Energetic, multicultural, expensive but full of opportunity. Strong Bangladeshi community in areas like Papatoetoe and Manukau.',
    'প্রাণবন্ত, বহুসাংস্কৃতিক, ব্যয়বহুল কিন্তু সুযোগে পরিপূর্ণ। পাপাটোইটোই ও মানুকাউতে শক্তিশালী বাংলাদেশি সম্প্রদায়।',
    NULL, '#1a9aa0',
    '["University of Auckland", "AUT", "Unitec", "Massey University Auckland"]',
    '[{"nameEn":"Papatoetoe","nameBn":"পাপাটোইটোই","rentHintNzd":280,"transportRating":4.0,"budgetRating":4.5},{"nameEn":"Manukau","nameBn":"মানুকাউ","rentHintNzd":300,"transportRating":3.5,"budgetRating":4.2},{"nameEn":"Henderson","nameBn":"হেন্ডারসন","rentHintNzd":290,"transportRating":3.5,"budgetRating":4.3},{"nameEn":"New Lynn","nameBn":"নিউ লিন","rentHintNzd":310,"transportRating":4.0,"budgetRating":4.0}]',
    '["student-friendly","multicultural","largest-city","job-market"]',
    '{"transport":3.8,"safety":3.9,"affordability":2.9}',
    1, TRUE,
    NOW(), NOW(), 'system', 'system'
),
-- Wellington
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'WELLINGTON',
    'Wellington',
    'ওয়েলিংটন',
    'The cool little capital',
    'ছোট কিন্তু আকর্ষণীয় রাজধানী',
    'New Zealand''s compact, walkable capital with a thriving café culture, government jobs, and Victoria University.',
    'নিউজিল্যান্ডের ছোট ও হাঁটার উপযোগী রাজধানী, সরকারি চাকরি ও ভিক্টোরিয়া বিশ্ববিদ্যালয়ের জন্য বিখ্যাত।',
    'Wellington is NZ''s capital and cultural heart. It hosts the national government, Te Papa museum, and a booming tech scene. Rents are high but manageable compared to Auckland.',
    'ওয়েলিংটন নিউজিল্যান্ডের রাজধানী এবং সাংস্কৃতিক কেন্দ্র। এটি জাতীয় সরকার, তে পাপা জাদুঘর এবং বর্ধমান প্রযুক্তি খাতের আবাস।',
    420.00, 640.00,
    295.00, 100.00, 220.00,
    100,
    'Compact and walkable, great café culture, strong public service jobs. Windier than other cities but very liveable.',
    'ছোট ও হাঁটার উপযোগী, দারুণ ক্যাফে সংস্কৃতি, শক্তিশালী সরকারি চাকরির বাজার। অন্য শহরের তুলনায় বেশি বাতাস কিন্তু বসবাসযোগ্য।',
    NULL, '#7c5cbf',
    '["Victoria University of Wellington", "Massey University Wellington", "Whitireia"]',
    '[{"nameEn":"Newtown","nameBn":"নিউটাউন","rentHintNzd":260,"transportRating":4.5,"budgetRating":4.0},{"nameEn":"Johnsonville","nameBn":"জনসনভিল","rentHintNzd":245,"transportRating":4.0,"budgetRating":4.2},{"nameEn":"Petone","nameBn":"পেটোন","rentHintNzd":250,"transportRating":4.0,"budgetRating":4.1}]',
    '["capital","walkable","government-jobs","café-culture"]',
    '{"transport":4.5,"safety":4.3,"affordability":3.3}',
    2, TRUE,
    NOW(), NOW(), 'system', 'system'
),
-- Christchurch
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'CHRISTCHURCH',
    'Christchurch',
    'ক্রাইস্টচার্চ',
    'The garden city of NZ',
    'নিউজিল্যান্ডের গার্ডেন সিটি',
    'Christchurch is NZ''s second largest city, rebuilt after the 2011 earthquake with modern infrastructure and affordable rents.',
    'ক্রাইস্টচার্চ নিউজিল্যান্ডের দ্বিতীয় বৃহত্তম শহর, ২০১১ সালের ভূমিকম্পের পরে আধুনিক অবকাঠামো ও সাশ্রয়ী ভাড়া নিয়ে পুনর্নির্মিত।',
    'Christchurch offers the best value-for-money living in NZ South Island. The city has wide roads, flat terrain (great for cycling), and a rapidly growing tech and innovation sector.',
    'ক্রাইস্টচার্চ দক্ষিণ দ্বীপে সেরা মানের জীবনযাপনের সুযোগ দেয়। শহরে প্রশস্ত রাস্তা, সমতল ভূমি (সাইকেল চালানোর জন্য দারুণ) এবং দ্রুত বর্ধনশীল প্রযুক্তি খাত রয়েছে।',
    370.00, 560.00,
    245.00, 90.00, 200.00,
    85,
    'Flat, spacious, affordable. Post-earthquake rebuild gave it a modern feel. Great for families and budget-conscious students.',
    'সমতল, প্রশস্ত, সাশ্রয়ী। ভূমিকম্পের পরে পুনর্নির্মাণ এটিকে আধুনিক রূপ দিয়েছে। পরিবার ও বাজেট সচেতন শিক্ষার্থীদের জন্য দারুণ।',
    NULL, '#e87a41',
    '["University of Canterbury", "Lincoln University", "Ara Institute"]',
    '[{"nameEn":"Riccarton","nameBn":"রিকার্টন","rentHintNzd":210,"transportRating":4.0,"budgetRating":4.7},{"nameEn":"Hornby","nameBn":"হর্নবি","rentHintNzd":195,"transportRating":3.5,"budgetRating":4.8},{"nameEn":"Sydenham","nameBn":"সিডেনহ্যাম","rentHintNzd":220,"transportRating":4.0,"budgetRating":4.5}]',
    '["affordable","flat","family-friendly","south-island"]',
    '{"transport":3.5,"safety":4.2,"affordability":4.3}',
    3, TRUE,
    NOW(), NOW(), 'system', 'system'
),
-- Hamilton
(
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'HAMILTON',
    'Hamilton',
    'হ্যামিলটন',
    'Affordable student city with great university options',
    'সাশ্রয়ী মূল্যের ছাত্র শহর, বিশ্ববিদ্যালয়ের সুবিধাসহ',
    'Hamilton is a growing inland city with the University of Waikato, lower rents, and a strong student culture.',
    'হ্যামিলটন একটি বর্ধমান অভ্যন্তরীণ শহর, ওয়াইকাটো বিশ্ববিদ্যালয়, কম ভাড়া এবং শক্তিশালী ছাত্র সংস্কৃতি সহ।',
    'Hamilton is NZ''s fourth largest city, centrally located on the North Island. Known for affordable rents and Waikato University, it''s popular with international students on tight budgets.',
    'হ্যামিলটন নিউজিল্যান্ডের চতুর্থ বৃহত্তম শহর, উত্তর দ্বীপের কেন্দ্রে অবস্থিত। সাশ্রয়ী ভাড়া ও ওয়াইকাটো বিশ্ববিদ্যালয়ের জন্য পরিচিত।',
    310.00, 470.00,
    215.00, 75.00, 185.00,
    75,
    'Budget-friendly, quieter than main cities, great university life. Lower pay rates for part-time work but also much lower costs.',
    'বাজেট-বান্ধব, প্রধান শহরগুলির চেয়ে শান্ত, দারুণ বিশ্ববিদ্যালয় জীবন। খণ্ডকালীন কাজে কম বেতন কিন্তু খরচও অনেক কম।',
    NULL, '#5c8a5c',
    '["University of Waikato", "Wintec", "Te Wānanga o Aotearoa"]',
    '[{"nameEn":"Claudelands","nameBn":"ক্লডল্যান্ডস","rentHintNzd":185,"transportRating":3.0,"budgetRating":4.9},{"nameEn":"Chartwell","nameBn":"চার্টওয়েল","rentHintNzd":195,"transportRating":3.0,"budgetRating":4.8},{"nameEn":"Hillcrest","nameBn":"হিলক্রেস্ট","rentHintNzd":190,"transportRating":3.0,"budgetRating":4.8}]',
    '["budget-friendly","university","inland","student-life"]',
    '{"transport":3.0,"safety":4.0,"affordability":4.8}',
    4, TRUE,
    NOW(), NOW(), 'system', 'system'
),
-- Dunedin
(
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'DUNEDIN',
    'Dunedin',
    'ডুনেডিন',
    'NZ''s student city with lowest living costs',
    'সবচেয়ে কম খরচে বাসযোগ্য নিউজিল্যান্ডের ছাত্র শহর',
    'Dunedin is famous for Otago University, the oldest university in NZ, and the most affordable rents in any NZ city.',
    'ডুনেডিন ওটাগো বিশ্ববিদ্যালয়ের জন্য বিখ্যাত, নিউজিল্যান্ডের প্রাচীনতম বিশ্ববিদ্যালয়, এবং যেকোনো নিউজিল্যান্ড শহরে সবচেয়ে সাশ্রয়ী ভাড়া।',
    'Dunedin is the quintessential student city. Otago University campus is central, rents are the lowest in any NZ city, and the student social scene is vibrant. Cold winters but a tight-knit community.',
    'ডুনেডিন আদর্শ ছাত্র শহর। ওটাগো বিশ্ববিদ্যালয় ক্যাম্পাস কেন্দ্রীয়, ভাড়া নিউজিল্যান্ডের যেকোনো শহরের মধ্যে সবচেয়ে কম, ছাত্র সামাজিক দৃশ্য প্রাণবন্ত। শীতল শীতকাল কিন্তু ঘনিষ্ঠ সম্প্রদায়।',
    280.00, 420.00,
    185.00, 70.00, 175.00,
    70,
    'Coldest but cheapest. Strong student culture, excellent university. Best option for tight budgets on the South Island.',
    'সবচেয়ে ঠান্ডা কিন্তু সবচেয়ে সস্তা। শক্তিশালী ছাত্র সংস্কৃতি, চমৎকার বিশ্ববিদ্যালয়। দক্ষিণ দ্বীপে টাইট বাজেটের জন্য সেরা বিকল্প।',
    NULL, '#4a6fa5',
    '["University of Otago", "Otago Polytechnic"]',
    '[{"nameEn":"North Dunedin","nameBn":"নর্থ ডুনেডিন","rentHintNzd":155,"transportRating":4.0,"budgetRating":5.0},{"nameEn":"South Dunedin","nameBn":"সাউথ ডুনেডিন","rentHintNzd":150,"transportRating":3.5,"budgetRating":5.0},{"nameEn":"Caversham","nameBn":"কেভার্শাম","rentHintNzd":160,"transportRating":3.5,"budgetRating":4.9}]',
    '["cheapest","student","south-island","university"]',
    '{"transport":3.5,"safety":4.3,"affordability":5.0}',
    5, TRUE,
    NOW(), NOW(), 'system', 'system'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PLANNING PROFILES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO planning_profiles (
    id, code, name_en, name_bn,
    short_details_en, short_details_bn,
    tags, monthly_budget_range_min_nzd, monthly_budget_range_max_nzd,
    icon_svg_url, color_hex, default_person_count,
    display_order, is_active,
    created_at, updated_at, created_by, updated_by
) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'SOLO_STUDENT',
    'Solo Student',
    'একা শিক্ষার্থী',
    'Planning for one student on a modest budget. Covers rent share, groceries, transport and essentials.',
    'একজন শিক্ষার্থীর জন্য পরিকল্পনা সীমিত বাজেটে। শেয়ার রুম, মুদি, পরিবহন এবং প্রয়োজনীয় জিনিস অন্তর্ভুক্ত।',
    '["student","solo","modest","first-year"]',
    1400.00, 2200.00,
    NULL, '#00AFAF',
    1,
    1, TRUE,
    NOW(), NOW(), 'system', 'system'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'STUDENT_COUPLE',
    'Student Couple',
    'ছাত্র দম্পতি',
    'Planning for two — husband and wife, or two flatmates. Costs are shared but still significant.',
    'দুইজনের পরিকল্পনা — স্বামী ও স্ত্রী, বা দুই ফ্ল্যাটমেট। খরচ শেয়ার হলেও উল্লেখযোগ্য।',
    '["couple","student","shared","two-people"]',
    2400.00, 3800.00,
    NULL, '#9C6DB5',
    2,
    2, TRUE,
    NOW(), NOW(), 'system', 'system'
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'WORKER',
    'Skilled Worker',
    'দক্ষ কর্মী',
    'Planning for a working professional — higher income, higher costs, comfortable lifestyle.',
    'একজন কর্মরত পেশাদারের পরিকল্পনা — বেশি আয়, বেশি খরচ, আরামদায়ক জীবনধারা।',
    '["worker","professional","comfortable","income"]',
    2800.00, 4500.00,
    NULL, '#E87A41',
    1,
    3, TRUE,
    NOW(), NOW(), 'system', 'system'
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'FAMILY',
    'Family Planning',
    'পারিবারিক পরিকল্পনা',
    'Planning for a couple with one or two children. Covers childcare, school costs, and family essentials.',
    'এক বা দুই সন্তান সহ দম্পতির পরিকল্পনা। শিশু যত্ন, স্কুল খরচ এবং পারিবারিক প্রয়োজনীয়তা অন্তর্ভুক্ত।',
    '["family","children","long-term","childcare"]',
    4200.00, 7000.00,
    NULL, '#5C8A5C',
    3,
    4, TRUE,
    NOW(), NOW(), 'system', 'system'
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'VISITOR',
    'Short-Stay Visitor',
    'স্বল্পমেয়াদী দর্শনার্থী',
    'Planning for a 1–6 month visit. Tourist or short-term visa. Higher per-week costs but no long-term setup.',
    '১–৬ মাসের পরিদর্শনের জন্য পরিকল্পনা। পর্যটক বা স্বল্পমেয়াদী ভিসা। সপ্তাহ প্রতি বেশি খরচ কিন্তু দীর্ঘমেয়াদী সেটআপ নেই।',
    '["visitor","tourist","short-term","temporary"]',
    2000.00, 3500.00,
    NULL, '#4A6FA5',
    1,
    5, TRUE,
    NOW(), NOW(), 'system', 'system'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MASTER PLANS (published templates)
-- Plan IDs follow pattern: [city-short][profile-short]-plan-uuid
-- ─────────────────────────────────────────────────────────────────────────────

-- Auckland × Solo Student
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p1-auckland-solo-student-000000000001',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Auckland — Solo Student Plan',
    TRUE, TRUE,
    'A realistic monthly living plan for a solo Bangladeshi student in Auckland. Covers a shared room in South Auckland, weekly groceries, public transport, and essential bills.',
    'অকল্যান্ডে একজন একা বাংলাদেশি শিক্ষার্থীর জন্য বাস্তবসম্মত মাসিক জীবনযাপন পরিকল্পনা। সাউথ অকল্যান্ডে শেয়ার রুম, সাপ্তাহিক মুদি, পাবলিক ট্রান্সপোর্ট এবং প্রয়োজনীয় বিল অন্তর্ভুক্ত।',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- Auckland × Student Couple
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p2-auckland-couple-0000000000000002',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Auckland — Student Couple Plan',
    TRUE, TRUE,
    'A monthly living plan for two students — husband and wife or two flatmates — sharing a 1-bedroom unit in Auckland. Covers joint costs with realistic Auckland pricing.',
    'অকল্যান্ডে দুজন শিক্ষার্থীর — স্বামী-স্ত্রী বা দুই ফ্ল্যাটমেট — একটি ১-বেডরুম ইউনিট শেয়ার করে মাসিক খরচের পরিকল্পনা।',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- Wellington × Solo Student
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p3-wellington-solo-student-000000003',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Wellington — Solo Student Plan',
    TRUE, TRUE,
    'Monthly living plan for a solo student in Wellington. Slightly lower rent than Auckland but excellent transport and walkability.',
    'ওয়েলিংটনে একজন একা শিক্ষার্থীর মাসিক জীবনযাপন পরিকল্পনা। অকল্যান্ডের চেয়ে কিছুটা কম ভাড়া কিন্তু চমৎকার পরিবহন ও হাঁটার সুবিধা।',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- Wellington × Student Couple
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p4-wellington-couple-0000000000000004',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Wellington — Student Couple Plan',
    TRUE, TRUE,
    'Monthly living plan for a couple in Wellington. Compact city means lower transport costs and excellent walkability.',
    'ওয়েলিংটনে একজোড়া শিক্ষার্থীর মাসিক জীবনযাপন পরিকল্পনা। ছোট শহর মানে কম পরিবহন খরচ এবং চমৎকার হাঁটার সুবিধা।',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- Christchurch × Solo Student
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p5-christchurch-solo-000000000000005',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Christchurch — Solo Student Plan',
    TRUE, TRUE,
    'Monthly living plan for a solo student in Christchurch. Modern rebuilt city with affordable rents and good student life.',
    'ক্রাইস্টচার্চে একজন একা শিক্ষার্থীর মাসিক জীবনযাপন পরিকল্পনা। আধুনিক পুনর্নির্মিত শহর সাশ্রয়ী ভাড়া এবং ভালো ছাত্র জীবন সহ।',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- Hamilton × Solo Student
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p6-hamilton-solo-student-0000000006',
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555555',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Hamilton — Solo Student Plan',
    TRUE, TRUE,
    'The most budget-friendly solo student plan in NZ''s North Island. Hamilton offers the lowest rents with a strong university community.',
    'নিউজিল্যান্ডের উত্তর দ্বীপে সবচেয়ে বাজেট-বান্ধব একা শিক্ষার্থী পরিকল্পনা। হ্যামিলটন শক্তিশালী বিশ্ববিদ্যালয় সম্প্রদায় সহ সর্বনিম্ন ভাড়া অফার করে।',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- Dunedin × Solo Student
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p7-dunedin-solo-student-00000000007',
    '11111111-1111-1111-1111-111111111111',
    '66666666-6666-6666-6666-666666666666',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Dunedin — Solo Student Plan',
    TRUE, TRUE,
    'The cheapest student plan in NZ. Dunedin''s low rents and student-focused city make it ideal for tight budgets. Cold but cheap!',
    'নিউজিল্যান্ডে সবচেয়ে সস্তা ছাত্র পরিকল্পনা। ডুনেডিনের কম ভাড়া এবং ছাত্রকেন্দ্রিক শহর এটিকে টাইট বাজেটের জন্য আদর্শ করে। ঠান্ডা কিন্তু সস্তা!',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- Auckland × Family
INSERT IGNORE INTO plans (
    id, country_id, city_id, planning_profile_id,
    display_plan_name, is_master_plan, is_published,
    overview_en, overview_bn, status, is_deleted,
    created_at, updated_at, created_by, updated_by
) VALUES (
    'p8-auckland-family-0000000000000008',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Auckland — Family Plan',
    TRUE, TRUE,
    'Comprehensive monthly budget for a family of 3 in Auckland. Includes rent for a 2-bedroom house, childcare, school costs, and family groceries.',
    'অকল্যান্ডে ৩ জনের পরিবারের জন্য ব্যাপক মাসিক বাজেট। ২-বেডরুম বাড়ির ভাড়া, শিশু যত্ন, স্কুল খরচ এবং পারিবারিক মুদি অন্তর্ভুক্ত।',
    NULL, FALSE,
    NOW(), NOW(), 'system', 'system'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MONTHLY LIVING ITEMS (per master plan)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Auckland × Solo Student ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-akl-solo-001', 'p1-auckland-solo-student-000000000001', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', NULL, 320.00, 'Weekly room rent in South Auckland (Papatoetoe/Manukau area). Prices vary — $280–$370/week is typical for solo students.', 'সাউথ অকল্যান্ডে সাপ্তাহিক রুম ভাড়া। একা শিক্ষার্থীদের জন্য $২৮০–$৩৭০/সপ্তাহ সাধারণ।', FALSE, 1),
('mi-akl-solo-002', 'p1-auckland-solo-student-000000000001', 'Groceries', 'মুদিখানা', NULL, 240.00, 'Weekly groceries from Pak''nSave or Countdown. Budget $60/week for halal meat + rice + vegetables.', 'প্যাকএনসেভ বা কাউন্টডাউন থেকে সাপ্তাহিক মুদি। হালাল মাংস + চাল + সবজির জন্য সপ্তাহে $৬০ বাজেট।', FALSE, 2),
('mi-akl-solo-003', 'p1-auckland-solo-student-000000000001', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', NULL, 120.00, 'AT HOP card. Monthly pass for zone 2–3 is around $120. Student concession applies with valid ID.', 'AT HOP কার্ড। জোন ২–৩ এর মাসিক পাস প্রায় $১২০। বৈধ আইডি সহ শিক্ষার্থী ছাড় প্রযোজ্য।', FALSE, 3),
('mi-akl-solo-004', 'p1-auckland-solo-student-000000000001', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', NULL, 80.00, 'Share of power bill + mobile data plan (1.5GB/day SIM). Most shared houses split power bills equally.', 'বিদ্যুৎ বিলের অংশ + মোবাইল ডেটা প্ল্যান। বেশিরভাগ শেয়ার হাউস বিদ্যুৎ বিল সমানভাবে ভাগ করে।', FALSE, 4),
('mi-akl-solo-005', 'p1-auckland-solo-student-000000000001', 'Eating Out', 'বাইরে খাওয়া', NULL, 80.00, 'Occasional cafe/restaurant meals. $80/month is 2–3 meals out. Halal options widely available in South Auckland.', 'মাঝে মাঝে ক্যাফে/রেস্তোরাঁয় খাবার। $৮০/মাস মানে ২–৩ বার বাইরে খাওয়া।', FALSE, 5),
('mi-akl-solo-006', 'p1-auckland-solo-student-000000000001', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 60.00, 'Toiletries, medications, haircuts. Student Services Levy usually covers GP visits at campus health centres.', 'টয়লেট্রিজ, ওষুধ, চুল কাটা। ছাত্র পরিষেবা লেভি সাধারণত ক্যাম্পাস স্বাস্থ্য কেন্দ্রে জিপি ভিজিট কভার করে।', FALSE, 6),
('mi-akl-solo-007', 'p1-auckland-solo-student-000000000001', 'Entertainment & Subscriptions', 'বিনোদন', NULL, 40.00, 'Netflix/Spotify shared plan + occasional activities. Budget well below $100 for a modest lifestyle.', 'নেটফ্লিক্স/স্পটিফাই শেয়ার্ড প্ল্যান + মাঝেমধ্যে কার্যকলাপ।', FALSE, 7),
('mi-akl-solo-008', 'p1-auckland-solo-student-000000000001', 'Study & Stationery', 'পড়াশোনা ও স্টেশনারি', NULL, 30.00, 'Printed notes, stationery, printing. Textbooks are usually available in library or as e-books.', 'মুদ্রিত নোট, স্টেশনারি, প্রিন্টিং।', FALSE, 8);

-- ── Auckland × Student Couple ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-akl-couple-001', 'p2-auckland-couple-0000000000000002', 'Rent (1-Bedroom Unit)', 'ভাড়া (১-বেডরুম ইউনিট)', NULL, 550.00, 'Weekly rent for a 1-bedroom unit in South Auckland. Both partners living together. $480–$620 is typical range.', 'সাউথ অকল্যান্ডে ১-বেডরুম ইউনিটের সাপ্তাহিক ভাড়া। $৪৮০–$৬২০ সাধারণ পরিসর।', FALSE, 1),
('mi-akl-couple-002', 'p2-auckland-couple-0000000000000002', 'Groceries (2 people)', 'মুদিখানা (২ জন)', NULL, 420.00, 'Combined groceries for two people. $210/person/month. Buying in bulk saves significantly.', 'দুইজনের জন্য মোট মুদি। প্রতি মাসে প্রতি ব্যক্তি $২১০। বাল্কে কেনা উল্লেখযোগ্যভাবে সাশ্রয় করে।', FALSE, 2),
('mi-akl-couple-003', 'p2-auckland-couple-0000000000000002', 'Transport (2 passes)', 'পরিবহন (২টি পাস)', NULL, 220.00, 'Two AT HOP monthly passes for zone 2–3. Student concession where applicable.', 'জোন ২–৩ এর জন্য দুটি AT HOP মাসিক পাস।', FALSE, 3),
('mi-akl-couple-004', 'p2-auckland-couple-0000000000000002', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', NULL, 140.00, 'Full power bill + fibre broadband. Couple units pay full utilities.', 'সম্পূর্ণ বিদ্যুৎ বিল + ফাইবার ব্রডব্যান্ড।', FALSE, 4),
('mi-akl-couple-005', 'p2-auckland-couple-0000000000000002', 'Eating Out & Takeaways', 'বাইরে খাওয়া', NULL, 150.00, 'Occasional meals out for two. $75/person/month.', 'দুইজনের জন্য মাঝে মাঝে বাইরে খাওয়া।', FALSE, 5),
('mi-akl-couple-006', 'p2-auckland-couple-0000000000000002', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 120.00, 'Toiletries, medications, haircuts for two.', 'দুইজনের জন্য টয়লেট্রিজ, ওষুধ, চুল কাটা।', FALSE, 6),
('mi-akl-couple-007', 'p2-auckland-couple-0000000000000002', 'Entertainment', 'বিনোদন', NULL, 80.00, 'Streaming, occasional outings for two.', 'স্ট্রিমিং, মাঝেমধ্যে দুজন মিলে বাইরে যাওয়া।', FALSE, 7);

-- ── Wellington × Solo Student ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-wlg-solo-001', 'p3-wellington-solo-student-000000003', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', NULL, 280.00, 'Weekly room in Newtown or Johnsonville. Wellington shared rooms range $250–$320/week.', 'নিউটাউন বা জনসনভিলে সাপ্তাহিক রুম। ওয়েলিংটন শেয়ার রুম $২৫০–$৩২০/সপ্তাহ।', FALSE, 1),
('mi-wlg-solo-002', 'p3-wellington-solo-student-000000003', 'Groceries', 'মুদিখানা', NULL, 220.00, 'Pak''nSave Kilbirnie or Countdown. Similar prices to Auckland.', 'প্যাকএনসেভ কিলবার্নি বা কাউন্টডাউন।', FALSE, 2),
('mi-wlg-solo-003', 'p3-wellington-solo-student-000000003', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', NULL, 100.00, 'Snapper card. Metlink monthly pass. Much of central Wellington is walkable.', 'স্ন্যাপার কার্ড। মেটলিংক মাসিক পাস। কেন্দ্রীয় ওয়েলিংটনের বেশিরভাগ হাঁটা দূরত্বের মধ্যে।', FALSE, 3),
('mi-wlg-solo-004', 'p3-wellington-solo-student-000000003', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', NULL, 80.00, 'Share of power + mobile data. Winter heating costs are higher in Wellington.', 'বিদ্যুৎ + মোবাইল ডেটার অংশ। ওয়েলিংটনে শীতকালীন হিটিং খরচ বেশি।', FALSE, 4),
('mi-wlg-solo-005', 'p3-wellington-solo-student-000000003', 'Eating Out', 'বাইরে খাওয়া', NULL, 70.00, 'Wellington has great café culture but prices are competitive.', 'ওয়েলিংটনে দারুণ ক্যাফে সংস্কৃতি আছে।', FALSE, 5),
('mi-wlg-solo-006', 'p3-wellington-solo-student-000000003', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 60.00, NULL, NULL, FALSE, 6),
('mi-wlg-solo-007', 'p3-wellington-solo-student-000000003', 'Entertainment', 'বিনোদন', NULL, 40.00, NULL, NULL, FALSE, 7);

-- ── Wellington × Student Couple ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-wlg-couple-001', 'p4-wellington-couple-0000000000000004', 'Rent (1-Bedroom)', 'ভাড়া (১-বেডরুম)', NULL, 490.00, 'Weekly rent for 1-bedroom in Newtown or Petone. $430–$550 range.', 'নিউটাউন বা পেটোনে ১-বেডরুমের সাপ্তাহিক ভাড়া।', FALSE, 1),
('mi-wlg-couple-002', 'p4-wellington-couple-0000000000000004', 'Groceries (2 people)', 'মুদিখানা (২ জন)', NULL, 390.00, NULL, NULL, FALSE, 2),
('mi-wlg-couple-003', 'p4-wellington-couple-0000000000000004', 'Transport (2 passes)', 'পরিবহন (২টি পাস)', NULL, 180.00, 'Wellington is very walkable — lower transport costs than Auckland.', 'ওয়েলিংটন খুব হাঁটার উপযোগী — অকল্যান্ডের তুলনায় কম পরিবহন খরচ।', FALSE, 3),
('mi-wlg-couple-004', 'p4-wellington-couple-0000000000000004', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', NULL, 130.00, NULL, NULL, FALSE, 4),
('mi-wlg-couple-005', 'p4-wellington-couple-0000000000000004', 'Eating Out', 'বাইরে খাওয়া', NULL, 130.00, NULL, NULL, FALSE, 5),
('mi-wlg-couple-006', 'p4-wellington-couple-0000000000000004', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 110.00, NULL, NULL, FALSE, 6),
('mi-wlg-couple-007', 'p4-wellington-couple-0000000000000004', 'Entertainment', 'বিনোদন', NULL, 75.00, NULL, NULL, FALSE, 7);

-- ── Christchurch × Solo Student ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-chc-solo-001', 'p5-christchurch-solo-000000000000005', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', NULL, 240.00, 'Weekly room in Riccarton or Hornby. Christchurch has great value rooms near university.', 'রিকার্টন বা হর্নবিতে সাপ্তাহিক রুম। বিশ্ববিদ্যালয়ের কাছে চমৎকার মানের রুম।', FALSE, 1),
('mi-chc-solo-002', 'p5-christchurch-solo-000000000000005', 'Groceries', 'মুদিখানা', NULL, 200.00, NULL, NULL, FALSE, 2),
('mi-chc-solo-003', 'p5-christchurch-solo-000000000000005', 'Public Transport / Cycling', 'পরিবহন/সাইকেল', NULL, 80.00, 'Metro card or cycling (flat terrain = easy cycling). Many students cycle in Christchurch.', 'মেট্রো কার্ড বা সাইকেল চালানো। চ্যাপ্টা ভূমি মানে সহজ সাইকেল।', FALSE, 3),
('mi-chc-solo-004', 'p5-christchurch-solo-000000000000005', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', NULL, 80.00, NULL, NULL, FALSE, 4),
('mi-chc-solo-005', 'p5-christchurch-solo-000000000000005', 'Eating Out', 'বাইরে খাওয়া', NULL, 65.00, NULL, NULL, FALSE, 5),
('mi-chc-solo-006', 'p5-christchurch-solo-000000000000005', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 55.00, NULL, NULL, FALSE, 6),
('mi-chc-solo-007', 'p5-christchurch-solo-000000000000005', 'Entertainment', 'বিনোদন', NULL, 35.00, NULL, NULL, FALSE, 7);

-- ── Hamilton × Solo Student ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-ham-solo-001', 'p6-hamilton-solo-student-0000000006', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', NULL, 195.00, 'Weekly room near Waikato University. Hamilton has some of the lowest rents on North Island.', 'ওয়াইকাটো বিশ্ববিদ্যালয়ের কাছে সাপ্তাহিক রুম। হ্যামিলটনে উত্তর দ্বীপের সবচেয়ে কম ভাড়ার কিছু রুম আছে।', FALSE, 1),
('mi-ham-solo-002', 'p6-hamilton-solo-student-0000000006', 'Groceries', 'মুদিখানা', NULL, 185.00, NULL, NULL, FALSE, 2),
('mi-ham-solo-003', 'p6-hamilton-solo-student-0000000006', 'Public Transport', 'পাবলিক ট্রান্সপোর্ট', NULL, 65.00, 'Hamilton City buses. Cheaper than Auckland/Wellington.', 'হ্যামিলটন সিটি বাস। অকল্যান্ড/ওয়েলিংটনের চেয়ে সস্তা।', FALSE, 3),
('mi-ham-solo-004', 'p6-hamilton-solo-student-0000000006', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', NULL, 70.00, NULL, NULL, FALSE, 4),
('mi-ham-solo-005', 'p6-hamilton-solo-student-0000000006', 'Eating Out', 'বাইরে খাওয়া', NULL, 55.00, NULL, NULL, FALSE, 5),
('mi-ham-solo-006', 'p6-hamilton-solo-student-0000000006', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 50.00, NULL, NULL, FALSE, 6),
('mi-ham-solo-007', 'p6-hamilton-solo-student-0000000006', 'Entertainment', 'বিনোদন', NULL, 30.00, NULL, NULL, FALSE, 7);

-- ── Dunedin × Solo Student ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-dud-solo-001', 'p7-dunedin-solo-student-00000000007', 'Rent (Shared Room)', 'ভাড়া (শেয়ার রুম)', NULL, 165.00, 'Weekly room near Otago campus. North Dunedin has the cheapest rooms in any NZ city.', 'ওটাগো ক্যাম্পাসের কাছে সাপ্তাহিক রুম। নর্থ ডুনেডিনে নিউজিল্যান্ডের যেকোনো শহরে সবচেয়ে সস্তা রুম।', FALSE, 1),
('mi-dud-solo-002', 'p7-dunedin-solo-student-00000000007', 'Groceries', 'মুদিখানা', NULL, 175.00, NULL, NULL, FALSE, 2),
('mi-dud-solo-003', 'p7-dunedin-solo-student-00000000007', 'Public Transport / Walking', 'পরিবহন/হাঁটা', NULL, 55.00, 'Otago campus is central — many students walk. ORC bus pass is affordable.', 'ওটাগো ক্যাম্পাস কেন্দ্রীয় — অনেক শিক্ষার্থী হাঁটে। ORC বাস পাস সাশ্রয়ী।', FALSE, 3),
('mi-dud-solo-004', 'p7-dunedin-solo-student-00000000007', 'Power & Heating', 'বিদ্যুৎ ও হিটিং', NULL, 90.00, 'Higher than other cities due to cold winters. Budget extra $30/month for winter heating.', 'ঠান্ডা শীতকালের কারণে অন্য শহরের চেয়ে বেশি। শীতকালীন হিটিংয়ের জন্য অতিরিক্ত $৩০/মাস বাজেট।', FALSE, 4),
('mi-dud-solo-005', 'p7-dunedin-solo-student-00000000007', 'Eating Out', 'বাইরে খাওয়া', NULL, 50.00, NULL, NULL, FALSE, 5),
('mi-dud-solo-006', 'p7-dunedin-solo-student-00000000007', 'Personal & Health', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 45.00, NULL, NULL, FALSE, 6),
('mi-dud-solo-007', 'p7-dunedin-solo-student-00000000007', 'Entertainment', 'বিনোদন', NULL, 30.00, NULL, NULL, FALSE, 7);

-- ── Auckland × Family ──
INSERT IGNORE INTO monthly_living_items (id, plan_id, name_en, name_bn, custom_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mi-akl-fam-001', 'p8-auckland-family-0000000000000008', 'Rent (2-Bedroom House)', 'ভাড়া (২-বেডরুম বাড়ি)', NULL, 780.00, 'Weekly rent for a 2-bedroom house in South Auckland. Family-suitable homes range $700–$900/week.', 'সাউথ অকল্যান্ডে ২-বেডরুম বাড়ির সাপ্তাহিক ভাড়া। পরিবার-উপযুক্ত বাড়ি $৭০০–$৯০০/সপ্তাহ।', FALSE, 1),
('mi-akl-fam-002', 'p8-auckland-family-0000000000000008', 'Groceries (Family)', 'মুদিখানা (পরিবার)', NULL, 650.00, 'Groceries for 2 adults + 1 child. Family bulk buying is cost-efficient.', '২ প্রাপ্তবয়স্ক + ১ শিশুর জন্য মুদি।', FALSE, 2),
('mi-akl-fam-003', 'p8-auckland-family-0000000000000008', 'Transport', 'পরিবহন', NULL, 280.00, '2 AT HOP passes + occasional rideshare for school runs.', '২টি AT HOP পাস + স্কুলের জন্য মাঝেমধ্যে রাইডশেয়ার।', FALSE, 3),
('mi-akl-fam-004', 'p8-auckland-family-0000000000000008', 'Power & Internet', 'বিদ্যুৎ ও ইন্টারনেট', NULL, 180.00, NULL, NULL, FALSE, 4),
('mi-akl-fam-005', 'p8-auckland-family-0000000000000008', 'Childcare / School', 'শিশু যত্ন / স্কুল', NULL, 400.00, 'ECE 20 hours subsidy covers some childcare. School age (5+) is free. ECE gap fees ~$400/month.', 'ECE ২০ ঘণ্টা ভর্তুকি কিছু শিশু যত্ন কভার করে। স্কুল বয়স (৫+) বিনামূল্যে।', FALSE, 5),
('mi-akl-fam-006', 'p8-auckland-family-0000000000000008', 'Eating Out', 'বাইরে খাওয়া', NULL, 200.00, NULL, NULL, FALSE, 6),
('mi-akl-fam-007', 'p8-auckland-family-0000000000000008', 'Personal & Health (Family)', 'ব্যক্তিগত ও স্বাস্থ্য', NULL, 250.00, 'Include pharmacy, GP, and personal care for 3 people.', '৩ জনের জন্য ফার্মেসি, জিপি, এবং ব্যক্তিগত যত্ন অন্তর্ভুক্ত।', FALSE, 7),
('mi-akl-fam-008', 'p8-auckland-family-0000000000000008', 'Entertainment & Activities', 'বিনোদন ও কার্যক্রম', NULL, 150.00, 'Kids activities, parks, family outings.', 'শিশুদের কার্যক্রম, পার্ক, পারিবারিক ভ্রমণ।', FALSE, 8);

-- ─────────────────────────────────────────────────────────────────────────────
-- MOVING COST ITEMS (per master plan — only for Auckland Solo Student as reference)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order) VALUES
('mv-akl-solo-001', 'p1-auckland-solo-student-000000000001', 'Return Flight (Dhaka → Auckland)', 'ফ্লাইট (ঢাকা → অকল্যান্ড)', NULL, 1200.00, 'One-way economy class. Book 3+ months in advance for best prices. Biman or Qatar Airways are popular choices.', 'এক-পথ ইকোনমি ক্লাস। সেরা দামের জন্য ৩+ মাস আগে বুক করুন।', FALSE, 1),
('mv-akl-solo-002', 'p1-auckland-solo-student-000000000001', 'Student Visa Fee', 'স্টুডেন্ট ভিসা ফি', NULL, 375.00, 'NZ student visa application fee as of 2024. Check Immigration NZ for current rates.', 'নিউজিল্যান্ড স্টুডেন্ট ভিসা আবেদন ফি। বর্তমান হারের জন্য ইমিগ্রেশন NZ চেক করুন।', FALSE, 2),
('mv-akl-solo-003', 'p1-auckland-solo-student-000000000001', 'Rental Bond (4 weeks)', 'রেন্টাল বন্ড (৪ সপ্তাহ)', NULL, 1280.00, '4 weeks bond on $320/week room. Bond is refundable at end of tenancy if no damage.', '$৩২০/সপ্তাহের রুমে ৪ সপ্তাহের বন্ড। বন্ড ফেরতযোগ্য।', FALSE, 3),
('mv-akl-solo-004', 'p1-auckland-solo-student-000000000001', 'Bedding & Linen', 'বিছানাপত্র', NULL, 150.00, 'Duvet, pillow, sheets, towels from Kmart or The Warehouse. Budget pack is sufficient.', 'কে-মার্ট বা দ্য ওয়্যারহাউস থেকে ডুভেট, বালিশ, চাদর, তোয়ালে।', FALSE, 4),
('mv-akl-solo-005', 'p1-auckland-solo-student-000000000001', 'Kitchen Basics', 'রান্নাঘরের প্রয়োজনীয়', NULL, 120.00, 'Pots, plates, cutlery, rice cooker, glasses. Essential kitchen starter set.', 'পাত্র, প্লেট, কাটলারি, রাইস কুকার, গ্লাস।', FALSE, 5),
('mv-akl-solo-006', 'p1-auckland-solo-student-000000000001', 'SIM Card & Mobile Setup', 'সিম কার্ড ও মোবাইল', NULL, 30.00, 'Spark, Skinny, or 2degrees prepay SIM. $30 covers first month data.', 'স্পার্ক, স্কিনি, বা টু-ডিগ্রিস প্রিপেই সিম।', FALSE, 6),
('mv-akl-solo-007', 'p1-auckland-solo-student-000000000001', 'Airport Transfer', 'এয়ারপোর্ট ট্রান্সফার', NULL, 45.00, 'SkyBus to city or shared taxi. Ask your university for shuttle options.', 'স্কাইবাস বা শেয়ার্ড ট্যাক্সি। বিশ্ববিদ্যালয়কে শাটল অপশন সম্পর্কে জিজ্ঞেস করুন।', FALSE, 7),
('mv-akl-solo-008', 'p1-auckland-solo-student-000000000001', 'Winter Clothing', 'শীতের পোশাক', NULL, 180.00, 'Warm jacket, thermal innerwear, gloves. Auckland is mild but winters require layers.', 'উষ্ণ জ্যাকেট, থার্মাল আন্ডারওয়্যার, গ্লাভস।', FALSE, 8),
('mv-akl-solo-009', 'p1-auckland-solo-student-000000000001', 'First Week Groceries', 'প্রথম সপ্তাহের মুদি', NULL, 80.00, 'Stock up on rice, lentils, oil, spices at Pak''nSave. Plan first big shop carefully.', 'প্যাকএনসেভে চাল, ডাল, তেল, মশলা মজুদ করুন।', FALSE, 9);

-- Apply same moving cost items to all other master plans
INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order)
SELECT CONCAT('mv-akl-couple-', LPAD(display_order, 3, '0')), 'p2-auckland-couple-0000000000000002',
       item_name_en, item_name_bn, NULL, estimated_amount_nzd, note_en, note_bn, FALSE, display_order
FROM moving_cost_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order)
SELECT CONCAT('mv-wlg-solo-', LPAD(display_order, 3, '0')), 'p3-wellington-solo-student-000000003',
       item_name_en, item_name_bn, NULL, estimated_amount_nzd, note_en, note_bn, FALSE, display_order
FROM moving_cost_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order)
SELECT CONCAT('mv-wlg-couple-', LPAD(display_order, 3, '0')), 'p4-wellington-couple-0000000000000004',
       item_name_en, item_name_bn, NULL, estimated_amount_nzd, note_en, note_bn, FALSE, display_order
FROM moving_cost_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order)
SELECT CONCAT('mv-chc-solo-', LPAD(display_order, 3, '0')), 'p5-christchurch-solo-000000000000005',
       item_name_en, item_name_bn, NULL, estimated_amount_nzd, note_en, note_bn, FALSE, display_order
FROM moving_cost_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order)
SELECT CONCAT('mv-ham-solo-', LPAD(display_order, 3, '0')), 'p6-hamilton-solo-student-0000000006',
       item_name_en, item_name_bn, NULL, estimated_amount_nzd, note_en, note_bn, FALSE, display_order
FROM moving_cost_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order)
SELECT CONCAT('mv-dud-solo-', LPAD(display_order, 3, '0')), 'p7-dunedin-solo-student-00000000007',
       item_name_en, item_name_bn, NULL, estimated_amount_nzd, note_en, note_bn, FALSE, display_order
FROM moving_cost_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO moving_cost_items (id, plan_id, item_name_en, item_name_bn, custom_item_name, estimated_amount_nzd, note_en, note_bn, is_custom, display_order)
SELECT CONCAT('mv-akl-fam-', LPAD(display_order, 3, '0')), 'p8-auckland-family-0000000000000008',
       item_name_en, item_name_bn, NULL, estimated_amount_nzd, note_en, note_bn, FALSE, display_order
FROM moving_cost_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

-- ─────────────────────────────────────────────────────────────────────────────
-- CHECKLIST ITEMS (shared across all master plans via template IDs)
-- ─────────────────────────────────────────────────────────────────────────────

-- For Auckland Solo Student (p1) — full checklist
INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order) VALUES
-- DOCUMENTS
('cl-p1-doc-001', 'p1-auckland-solo-student-000000000001', 'DOCUMENTS', 'Valid Passport (6+ months validity)', 'বৈধ পাসপোর্ট (৬+ মাস মেয়াদ)', NULL, 1, FALSE, NULL, 'Ensure passport is valid for at least 6 months beyond your intended stay.', NULL, NULL, FALSE, 1),
('cl-p1-doc-002', 'p1-auckland-solo-student-000000000001', 'DOCUMENTS', 'Student Visa Approved', 'স্টুডেন্ট ভিসা অনুমোদিত', NULL, 1, FALSE, NULL, NULL, NULL, NULL, FALSE, 2),
('cl-p1-doc-003', 'p1-auckland-solo-student-000000000001', 'DOCUMENTS', 'Offer Letter from University', 'বিশ্ববিদ্যালয়ের অফার লেটার', NULL, 1, FALSE, NULL, NULL, NULL, NULL, FALSE, 3),
('cl-p1-doc-004', 'p1-auckland-solo-student-000000000001', 'DOCUMENTS', 'Travel Insurance Purchased', 'ট্রাভেল ইন্স্যুরেন্স কেনা', NULL, 1, FALSE, NULL, 'Check if your university requires specific coverage.', NULL, NULL, FALSE, 4),
('cl-p1-doc-005', 'p1-auckland-solo-student-000000000001', 'DOCUMENTS', 'Police Clearance Certificate', 'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট', NULL, 1, FALSE, NULL, NULL, NULL, NULL, FALSE, 5),
('cl-p1-doc-006', 'p1-auckland-solo-student-000000000001', 'DOCUMENTS', 'Academic Transcripts (Certified Copies)', 'একাডেমিক ট্রান্সক্রিপ্ট (সত্যায়িত কপি)', NULL, 3, FALSE, NULL, NULL, NULL, NULL, FALSE, 6),
-- FINANCIAL
('cl-p1-fin-001', 'p1-auckland-solo-student-000000000001', 'FINANCIAL', 'Living Fund Transferred (NZD)', 'লিভিং ফান্ড ট্রান্সফার করা (NZD)', NULL, 1, FALSE, NULL, 'Transfer via Wise or Western Union. Avoid airport exchange rates.', NULL, NULL, FALSE, 7),
('cl-p1-fin-002', 'p1-auckland-solo-student-000000000001', 'FINANCIAL', 'NZ Bank Account Opened (Before Arrival)', 'NZ ব্যাংক অ্যাকাউন্ট খোলা (আসার আগে)', NULL, 1, FALSE, NULL, 'ASB and BNZ allow opening accounts from overseas before arriving.', NULL, NULL, FALSE, 8),
('cl-p1-fin-003', 'p1-auckland-solo-student-000000000001', 'FINANCIAL', 'Bond Money Prepared (4 weeks rent)', 'বন্ড মানি প্রস্তুত (৪ সপ্তাহ ভাড়া)', NULL, 1, FALSE, NULL, NULL, NULL, NULL, FALSE, 9),
('cl-p1-fin-004', 'p1-auckland-solo-student-000000000001', 'FINANCIAL', 'Tuition Fees Paid (First Semester)', 'টিউশন ফি পরিশোধ (প্রথম সেমিস্টার)', NULL, 1, FALSE, NULL, NULL, NULL, NULL, FALSE, 10),
-- ACCOMMODATION
('cl-p1-acc-001', 'p1-auckland-solo-student-000000000001', 'ACCOMMODATION', 'Shared Room Booked (First Month)', 'শেয়ার রুম বুক করা (প্রথম মাস)', NULL, 1, FALSE, NULL, 'Use TradeMe or Facebook groups (Bangladeshi NZ community groups) to find rooms.', NULL, NULL, FALSE, 11),
('cl-p1-acc-002', 'p1-auckland-solo-student-000000000001', 'ACCOMMODATION', 'Tenancy Agreement Signed', 'টেনেন্সি চুক্তি স্বাক্ষরিত', NULL, 1, FALSE, NULL, NULL, NULL, NULL, FALSE, 12),
('cl-p1-acc-003', 'p1-auckland-solo-student-000000000001', 'ACCOMMODATION', 'Bond Lodged with Tenancy Services', 'টেনেন্সি সার্ভিসে বন্ড জমা দেওয়া', NULL, 1, FALSE, NULL, 'Landlord must lodge bond within 23 working days.', NULL, NULL, FALSE, 13),
-- COMMUNICATION
('cl-p1-com-001', 'p1-auckland-solo-student-000000000001', 'COMMUNICATION', 'NZ SIM Card Purchased', 'NZ সিম কার্ড কেনা', NULL, 1, FALSE, NULL, 'Skinny or 2degrees offer best value prepay plans.', NULL, NULL, FALSE, 14),
('cl-p1-com-002', 'p1-auckland-solo-student-000000000001', 'COMMUNICATION', 'Internet Plan Set Up', 'ইন্টারনেট প্ল্যান সেট আপ', NULL, 1, FALSE, NULL, 'Shared broadband split with flatmates saves money.', NULL, NULL, FALSE, 15),
-- HEALTH
('cl-p1-hlt-001', 'p1-auckland-solo-student-000000000001', 'HEALTH', 'Enrolled at a GP (General Practitioner)', 'জিপিতে নথিভুক্তি', NULL, 1, FALSE, NULL, 'Enrol immediately after arrival. Campus health centres are subsidised for students.', NULL, NULL, FALSE, 16),
('cl-p1-hlt-002', 'p1-auckland-solo-student-000000000001', 'HEALTH', 'Medication Supply Packed (3 months)', 'ওষুধের সরবরাহ প্যাক করা (৩ মাস)', NULL, 1, FALSE, NULL, NULL, NULL, NULL, FALSE, 17),
('cl-p1-hlt-003', 'p1-auckland-solo-student-000000000001', 'HEALTH', 'IRD Number Applied For', 'IRD নম্বরের জন্য আবেদন', NULL, 1, FALSE, NULL, 'Apply online at IRD.govt.nz. Required for part-time work.', NULL, NULL, FALSE, 18);

-- Copy checklist to other plans (each gets the same items)
INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order)
SELECT CONCAT('cl-p2-', SUBSTR(id, 6)), 'p2-auckland-couple-0000000000000002', category, item_text_en, item_text_bn, NULL, quantity, FALSE, NULL, note_en, NULL, NULL, FALSE, display_order
FROM checklist_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order)
SELECT CONCAT('cl-p3-', SUBSTR(id, 6)), 'p3-wellington-solo-student-000000003', category, item_text_en, item_text_bn, NULL, quantity, FALSE, NULL, note_en, NULL, NULL, FALSE, display_order
FROM checklist_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order)
SELECT CONCAT('cl-p4-', SUBSTR(id, 6)), 'p4-wellington-couple-0000000000000004', category, item_text_en, item_text_bn, NULL, quantity, FALSE, NULL, note_en, NULL, NULL, FALSE, display_order
FROM checklist_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order)
SELECT CONCAT('cl-p5-', SUBSTR(id, 6)), 'p5-christchurch-solo-000000000000005', category, item_text_en, item_text_bn, NULL, quantity, FALSE, NULL, note_en, NULL, NULL, FALSE, display_order
FROM checklist_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order)
SELECT CONCAT('cl-p6-', SUBSTR(id, 6)), 'p6-hamilton-solo-student-0000000006', category, item_text_en, item_text_bn, NULL, quantity, FALSE, NULL, note_en, NULL, NULL, FALSE, display_order
FROM checklist_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order)
SELECT CONCAT('cl-p7-', SUBSTR(id, 6)), 'p7-dunedin-solo-student-00000000007', category, item_text_en, item_text_bn, NULL, quantity, FALSE, NULL, note_en, NULL, NULL, FALSE, display_order
FROM checklist_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

INSERT IGNORE INTO checklist_items (id, plan_id, category, item_text_en, item_text_bn, custom_item_text, quantity, is_done, completed_at, note_en, note_bn, custom_note, is_custom, display_order)
SELECT CONCAT('cl-p8-', SUBSTR(id, 6)), 'p8-auckland-family-0000000000000008', category, item_text_en, item_text_bn, NULL, quantity, FALSE, NULL, note_en, NULL, NULL, FALSE, display_order
FROM checklist_items WHERE plan_id = 'p1-auckland-solo-student-000000000001'
ON DUPLICATE KEY UPDATE plan_id = plan_id;

-- ─────────────────────────────────────────────────────────────────────────────
-- LIVING FUNDS (per master plan)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO living_funds (
    id, plan_id,
    minimum_amount_nzd, recommended_amount_nzd,
    explanation_en, explanation_bn,
    disclaimer_en, disclaimer_bn,
    user_saved_amount_bdt, user_monthly_contribution_bdt, user_target_date, user_notes,
    created_at, updated_at
) VALUES
('lf-p1-auckland-solo', 'p1-auckland-solo-student-000000000001',
 8000.00, 12000.00,
 'Your living fund should cover at least 3 months of rent + groceries + transport before your first part-time pay arrives. We recommend 6 months for safety.',
 'আপনার লিভিং ফান্ড প্রথম খণ্ডকালীন বেতন আসার আগে অন্তত ৩ মাসের ভাড়া + মুদি + পরিবহন কভার করা উচিত। নিরাপত্তার জন্য আমরা ৬ মাস সুপারিশ করি।',
 'This amount covers living costs only — exclude tuition fees, visa fees, and flight costs from your living fund calculation.',
 'এই পরিমাণ শুধুমাত্র জীবনযাপন খরচ কভার করে — টিউশন ফি, ভিসা ফি এবং ফ্লাইট খরচ আপনার লিভিং ফান্ড গণনা থেকে বাদ দিন।',
 NULL, NULL, NULL, NULL, NOW(), NOW()),

('lf-p2-auckland-couple', 'p2-auckland-couple-0000000000000002',
 14000.00, 21000.00,
 'For two people, living fund should cover 3–6 months of shared expenses. Both may not find part-time work immediately.',
 'দুইজনের জন্য, লিভিং ফান্ড ৩–৬ মাসের শেয়ার্ড খরচ কভার করা উচিত।',
 'Exclude tuition fees and one-time moving costs from this calculation.',
 'টিউশন ফি এবং এককালীন মুভিং খরচ এই গণনা থেকে বাদ দিন।',
 NULL, NULL, NULL, NULL, NOW(), NOW()),

('lf-p3-wellington-solo', 'p3-wellington-solo-student-000000003',
 7500.00, 11000.00,
 'Wellington''s lower rent makes the living fund slightly easier to build. Aim for 6 months of total living expenses.',
 'ওয়েলিংটনের কম ভাড়া লিভিং ফান্ড তৈরি করা কিছুটা সহজ করে।',
 'Exclude tuition fees and one-time moving costs from this calculation.',
 'টিউশন ফি এবং এককালীন মুভিং খরচ বাদ দিন।',
 NULL, NULL, NULL, NULL, NOW(), NOW()),

('lf-p4-wellington-couple', 'p4-wellington-couple-0000000000000004',
 13000.00, 19500.00,
 'For a couple in Wellington, aim for 6 months of joint living expenses. Wellington''s excellent public transport reduces costs.',
 'ওয়েলিংটনে একজোড়ার জন্য ৬ মাসের যৌথ জীবনযাপন খরচের লক্ষ্য রাখুন।',
 'Exclude tuition fees and one-time moving costs.',
 'টিউশন ফি এবং এককালীন মুভিং খরচ বাদ দিন।',
 NULL, NULL, NULL, NULL, NOW(), NOW()),

('lf-p5-christchurch-solo', 'p5-christchurch-solo-000000000000005',
 6500.00, 9500.00,
 'Christchurch offers excellent value. Living fund of NZD 9,500 covers 6 months comfortably for a solo student.',
 'ক্রাইস্টচার্চ চমৎকার মান অফার করে। NZD ৯,৫০০ এর লিভিং ফান্ড একজন একা শিক্ষার্থীর জন্য ৬ মাস আরামদায়কভাবে কভার করে।',
 'Exclude tuition fees and one-time moving costs.',
 'টিউশন ফি এবং এককালীন মুভিং খরচ বাদ দিন।',
 NULL, NULL, NULL, NULL, NOW(), NOW()),

('lf-p6-hamilton-solo', 'p6-hamilton-solo-student-0000000006',
 5500.00, 8000.00,
 'Hamilton is one of the most affordable cities for students. NZD 8,000 covers 6+ months for a solo student.',
 'হ্যামিলটন শিক্ষার্থীদের জন্য সবচেয়ে সাশ্রয়ী শহরগুলির মধ্যে একটি।',
 'Exclude tuition fees and one-time moving costs.',
 'টিউশন ফি এবং এককালীন মুভিং খরচ বাদ দিন।',
 NULL, NULL, NULL, NULL, NOW(), NOW()),

('lf-p7-dunedin-solo', 'p7-dunedin-solo-student-00000000007',
 5000.00, 7500.00,
 'Dunedin is the cheapest student city in NZ. NZD 7,500 covers 6+ months comfortably. Budget extra for winter heating.',
 'ডুনেডিন নিউজিল্যান্ডে সবচেয়ে সস্তা ছাত্র শহর। NZD ৭,৫০০ আরামদায়কভাবে ৬+ মাস কভার করে।',
 'Exclude tuition fees and one-time moving costs. Budget extra for winter heating costs.',
 'টিউশন ফি এবং এককালীন মুভিং খরচ বাদ দিন। শীতকালীন হিটিং খরচের জন্য অতিরিক্ত বাজেট।',
 NULL, NULL, NULL, NULL, NOW(), NOW()),

('lf-p8-auckland-family', 'p8-auckland-family-0000000000000008',
 25000.00, 36000.00,
 'Families need a larger living fund due to childcare costs and higher rents. Aim for 6 months of full family expenses.',
 'শিশু যত্ন খরচ এবং উচ্চ ভাড়ার কারণে পরিবারের বড় লিভিং ফান্ড প্রয়োজন।',
 'Exclude tuition fees, childcare enrollment fees, and one-time moving costs from this calculation.',
 'টিউশন ফি, শিশু যত্ন নথিভুক্তি ফি এবং এককালীন মুভিং খরচ বাদ দিন।',
 NULL, NULL, NULL, NULL, NOW(), NOW());

-- =============================================================================
-- VERIFICATION QUERIES (uncomment to verify after running)
-- =============================================================================
-- SELECT COUNT(*) AS countries FROM countries;          -- expect: 1
-- SELECT COUNT(*) AS cities FROM cities;                -- expect: 5
-- SELECT COUNT(*) AS profiles FROM planning_profiles;   -- expect: 5
-- SELECT COUNT(*) AS plans FROM plans;                  -- expect: 8
-- SELECT COUNT(*) AS monthly_items FROM monthly_living_items;  -- expect: 57
-- SELECT COUNT(*) AS moving_items FROM moving_cost_items;      -- expect: 72
-- SELECT COUNT(*) AS checklist_items FROM checklist_items;     -- expect: 144
-- SELECT COUNT(*) AS living_funds FROM living_funds;           -- expect: 8
