INSERT INTO crops
    (crop_name, category, description, growing_period, harvest_period)
VALUES
(
    'Eggplant',
    'Vegetable',
    'A fruiting vegetable commonly grown in tropical areas. It requires sufficient sunlight, moderate water, and well-drained soil.',
    '3-4 months',
    'Around 3-4 months after planting'
),
(
    'Bitter Gourd',
    'Vegetable',
    'A climbing vine vegetable commonly known as ampalaya. It grows best in warm conditions with adequate sunlight and support for its vines.',
    '2-3 months',
    'Around 2-3 months after planting'
),
(
    'Squash',
    'Vegetable',
    'A sprawling vine vegetable commonly cultivated for its edible fruits. It requires sufficient growing space, sunlight, and well-drained soil.',
    '3-4 months',
    'Around 3-4 months after planting'
),
(
    'Okra',
    'Vegetable',
    'A warm-season vegetable cultivated for its edible green pods. It grows well under full sunlight and moderate water availability.',
    '2-3 months',
    'Around 2-3 months after planting'
),
(
    'String Beans',
    'Legume',
    'A climbing legume commonly known as sitaw. It produces long edible pods and benefits from sufficient sunlight and suitable vine support.',
    '2-3 months',
    'Around 2-3 months after planting'
),
(
    'Mung Bean',
    'Legume',
    'A short-duration legume commonly known as monggo. It is cultivated for its edible seeds and is relatively adaptable to warm growing conditions.',
    '2-3 months',
    'Around 2-3 months after planting'
);



INSERT INTO crop_requirements
    (
        crop_id,
        soil_type,
        water_requirement,
        sunlight_requirement,
        min_temperature,
        max_temperature,
        season,
        environment,
        flood_tolerance,
        drainage_requirement
    )
VALUES
(
    7,
    'Loam, Sandy Loam',
    'Moderate',
    'Full Sun',
    20.00,
    35.00,
    'Wet and Dry Season',
    'Open Field, Container',
    'Low',
    'Well-drained'
),
(
    8,
    'Loam, Sandy Loam',
    'Moderate',
    'Full Sun',
    20.00,
    35.00,
    'Wet and Dry Season',
    'Open Field',
    'Low',
    'Well-drained'
),
(
    9,
    'Loam, Sandy Loam',
    'Moderate',
    'Full Sun',
    18.00,
    32.00,
    'Wet and Dry Season',
    'Open Field',
    'Low to Moderate',
    'Well-drained'
),
(
    10,
    'Loam, Sandy',
    'Moderate',
    'Full Sun',
    20.00,
    35.00,
    'Wet and Dry Season',
    'Open Field, Container',
    'Low to Moderate',
    'Well-drained'
),
(
    11,
    'Loam, Sandy Loam',
    'Moderate',
    'Full Sun',
    18.00,
    30.00,
    'Wet and Dry Season',
    'Open Field',
    'Low',
    'Well-drained'
),
(
    12,
    'Sandy Loam, Loam',
    'Low to Moderate',
    'Full Sun',
    25.00,
    35.00,
    'Dry Season',
    'Open Field',
    'Low',
    'Well-drained'
);