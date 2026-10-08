
-- BUILD & BLOOM
-- Preliminary flood risk and drainage classifications
-- Covers all 48 Pangasinan locations

UPDATE location_characteristics
SET
    flood_risk_level = CASE location_id
        WHEN 1 THEN 'High'       -- Dagupan
        WHEN 2 THEN 'Low'        -- Lingayen
        WHEN 3 THEN 'Moderate'   -- Urdaneta
        WHEN 4 THEN 'Moderate'   -- Santa Barbara
        WHEN 5 THEN 'Moderate'   -- San Carlos
        WHEN 6 THEN 'Moderate'   -- Agno
        WHEN 7 THEN 'Moderate'   -- Aguilar
        WHEN 8 THEN 'Moderate'   -- Alaminos
        WHEN 9 THEN 'Moderate'   -- Alcala
        WHEN 10 THEN 'Moderate'  -- Anda
        WHEN 11 THEN 'Moderate'  -- Asingan
        WHEN 12 THEN 'Moderate'  -- Balungao
        WHEN 13 THEN NULL        -- Bani
        WHEN 14 THEN 'Moderate'  -- Basista
        WHEN 15 THEN 'Moderate'  -- Bautista
        WHEN 16 THEN 'High'      -- Bayambang
        WHEN 17 THEN NULL        -- Binalonan
        WHEN 18 THEN NULL        -- Binmaley
        WHEN 19 THEN NULL        -- Bolinao
        WHEN 20 THEN 'High'      -- Bugallon
        WHEN 21 THEN NULL        -- Burgos
        WHEN 22 THEN 'Moderate'  -- Calasiao
        WHEN 23 THEN 'Moderate'  -- Dasol
        WHEN 24 THEN 'Moderate'  -- Infanta
        WHEN 25 THEN NULL        -- Labrador
        WHEN 26 THEN 'Moderate'  -- Laoac
        WHEN 27 THEN NULL        -- Mabini
        WHEN 28 THEN NULL        -- Malasiqui
        WHEN 29 THEN 'Moderate'  -- Manaoag
        WHEN 30 THEN 'Moderate'  -- Mangaldan
        WHEN 31 THEN 'Moderate'  -- Mangatarem
        WHEN 32 THEN NULL        -- Mapandan
        WHEN 33 THEN 'Moderate'  -- Natividad
        WHEN 34 THEN 'Moderate'  -- Pozorrubio
        WHEN 35 THEN 'Moderate'  -- Rosales
        WHEN 36 THEN NULL        -- San Fabian
        WHEN 37 THEN 'Moderate'  -- San Jacinto
        WHEN 38 THEN 'Moderate'  -- San Manuel
        WHEN 39 THEN 'Moderate'  -- San Nicolas
        WHEN 40 THEN NULL        -- San Quintin
        WHEN 41 THEN 'Moderate'  -- Santa Maria
        WHEN 42 THEN 'Moderate'  -- Santo Tomas
        WHEN 43 THEN NULL        -- Sison
        WHEN 44 THEN 'Moderate'  -- Sual
        WHEN 45 THEN 'Moderate'  -- Tayug
        WHEN 46 THEN 'Moderate'  -- Umingan
        WHEN 47 THEN 'High'      -- Urbiztondo
        WHEN 48 THEN 'Moderate'  -- Villasis
        ELSE NULL
    END,

    drainage_condition = CASE location_id
        WHEN 1 THEN 'Moderate'   -- Dagupan
        WHEN 8 THEN 'Moderate'   -- Alaminos
        WHEN 10 THEN 'Moderate'  -- Anda
        WHEN 13 THEN 'Moderate'  -- Bani
        WHEN 17 THEN 'Moderate'  -- Binalonan
        WHEN 18 THEN 'Moderate'  -- Binmaley
        WHEN 25 THEN 'Moderate'  -- Labrador
        WHEN 28 THEN 'Moderate'  -- Malasiqui
        WHEN 32 THEN 'Moderate'  -- Mapandan
        WHEN 40 THEN 'Moderate'  -- San Quintin
        ELSE NULL
    END
WHERE location_id BETWEEN 1 AND 48;