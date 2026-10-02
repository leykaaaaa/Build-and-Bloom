-- ============================================
-- BUILD & BLOOM
-- Initial Seed Data
-- ============================================

USE build_and_bloom;


-- ============================================
-- 1. LOCATIONS
-- ============================================

INSERT INTO locations
(location_name, location_type, province)
VALUES
('Dagupan', 'City', 'Pangasinan'),
('Lingayen', 'Municipality', 'Pangasinan'),
('Urdaneta', 'City', 'Pangasinan'),
('Santa Barbara', 'Municipality', 'Pangasinan'),
('San Carlos', 'City', 'Pangasinan');


-- ============================================
-- 2. CROPS
-- ============================================

INSERT INTO crops
(crop_name, category, description, growing_period, harvest_period)
VALUES

(
    'Rice',
    'Cereal',
    'A major food crop commonly cultivated in lowland areas and irrigated fields.',
    '3-4 months',
    'Around 3-4 months after planting'
),

(
    'Corn',
    'Cereal',
    'A versatile cereal crop grown for food, feed, and other agricultural uses.',
    '3-4 months',
    'Around 3-4 months after planting'
),

(
    'Tomato',
    'Vegetable',
    'A fruiting vegetable that grows best with sufficient sunlight and well-drained soil.',
    '2-3 months',
    'Around 2-3 months after transplanting'
),

(
    'Onion',
    'Vegetable',
    'A bulb crop that generally requires well-drained soil and adequate sunlight.',
    '3-4 months',
    'Around 3-4 months after planting'
),

(
    'Camote',
    'Root Crop',
    'A root crop that can tolerate relatively dry conditions and grows well in loose soil.',
    '3-5 months',
    'Around 3-5 months after planting'
),

(
    'Peanut',
    'Legume',
    'A legume crop that develops underground pods and generally prefers loose, well-drained soil.',
    '3-5 months',
    'Around 3-5 months after planting'
);


-- ============================================
-- 3. CROP REQUIREMENTS
-- ============================================

INSERT INTO crop_requirements
(
    crop_id,
    soil_type,
    water_requirement,
    sunlight_requirement,
    min_temperature,
    max_temperature,
    season,
    environment
)
VALUES

(
    (SELECT crop_id FROM crops WHERE crop_name = 'Rice'),
    'Clay, Loam',
    'High',
    'Full Sun',
    20.00,
    35.00,
    'Wet and Dry Season',
    'Open Field'
),

(
    (SELECT crop_id FROM crops WHERE crop_name = 'Corn'),
    'Loam, Sandy',
    'Moderate',
    'Full Sun',
    18.00,
    35.00,
    'Wet and Dry Season',
    'Open Field'
),

(
    (SELECT crop_id FROM crops WHERE crop_name = 'Tomato'),
    'Loam, Silt',
    'Moderate',
    'Full Sun',
    18.00,
    30.00,
    'Dry Season',
    'Open Field, Greenhouse, Container'
),

(
    (SELECT crop_id FROM crops WHERE crop_name = 'Onion'),
    'Loam, Sandy',
    'Moderate',
    'Full Sun',
    13.00,
    30.00,
    'Cool and Dry Season',
    'Open Field'
),

(
    (SELECT crop_id FROM crops WHERE crop_name = 'Camote'),
    'Sandy, Loam',
    'Low to Moderate',
    'Full Sun',
    20.00,
    35.00,
    'Wet and Dry Season',
    'Open Field, Container'
),

(
    (SELECT crop_id FROM crops WHERE crop_name = 'Peanut'),
    'Sandy, Loam',
    'Moderate',
    'Full Sun',
    20.00,
    35.00,
    'Dry Season',
    'Open Field'
);


-- ============================================
-- 4. PLANTING CALENDAR
-- ============================================

INSERT INTO planting_calendar
(
    crop_id,
    location_id,
    planting_month,
    season,
    growing_period,
    harvest_period,
    notes
)
SELECT
    c.crop_id,
    l.location_id,
    'June-September',
    'Wet Season',
    c.growing_period,
    c.harvest_period,
    'Initial planting schedule for Build & Bloom research data.'
FROM crops c
CROSS JOIN locations l
WHERE c.crop_name IN ('Rice', 'Corn');


INSERT INTO planting_calendar
(
    crop_id,
    location_id,
    planting_month,
    season,
    growing_period,
    harvest_period,
    notes
)
SELECT
    c.crop_id,
    l.location_id,
    'November-February',
    'Cool and Dry Season',
    c.growing_period,
    c.harvest_period,
    'Initial planting schedule for Build & Bloom research data.'
FROM crops c
CROSS JOIN locations l
WHERE c.crop_name = 'Onion';


INSERT INTO planting_calendar
(
    crop_id,
    location_id,
    planting_month,
    season,
    growing_period,
    harvest_period,
    notes
)
SELECT
    c.crop_id,
    l.location_id,
    'November-April',
    'Dry Season',
    c.growing_period,
    c.harvest_period,
    'Initial planting schedule for Build & Bloom research data.'
FROM crops c
CROSS JOIN locations l
WHERE c.crop_name IN ('Tomato', 'Peanut');


INSERT INTO planting_calendar
(
    crop_id,
    location_id,
    planting_month,
    season,
    growing_period,
    harvest_period,
    notes
)
SELECT
    c.crop_id,
    l.location_id,
    'Year-round',
    'Wet and Dry Season',
    c.growing_period,
    c.harvest_period,
    'Initial planting schedule for Build & Bloom research data.'
FROM crops c
CROSS JOIN locations l
WHERE c.crop_name = 'Camote';


-- ============================================
-- END OF INITIAL SEED DATA
-- ============================================