USE build_and_bloom;

ALTER TABLE planting_calendar
MODIFY location_id INT NULL;

START TRANSACTION;

CREATE TEMPORARY TABLE duplicate_planting_calendar_schedules AS
SELECT
    MIN(calendar_id) AS keeper_id,
    crop_id,
    planting_month,
    season,
    growing_period,
    harvest_period,
    notes
FROM planting_calendar
GROUP BY
    crop_id,
    planting_month,
    season,
    growing_period,
    harvest_period,
    notes
HAVING COUNT(*) > 1
    AND (
        COUNT(DISTINCT location_id) > 1
        OR (
            COUNT(DISTINCT location_id) = 1
            AND COUNT(*) > COUNT(location_id)
        )
    );

UPDATE planting_calendar AS calendar
INNER JOIN duplicate_planting_calendar_schedules AS duplicates
    ON calendar.calendar_id = duplicates.keeper_id
SET calendar.location_id = NULL;

DELETE calendar
FROM planting_calendar AS calendar
INNER JOIN duplicate_planting_calendar_schedules AS duplicates
    ON calendar.crop_id = duplicates.crop_id
    AND calendar.planting_month <=> duplicates.planting_month
    AND calendar.season <=> duplicates.season
    AND calendar.growing_period <=> duplicates.growing_period
    AND calendar.harvest_period <=> duplicates.harvest_period
    AND calendar.notes <=> duplicates.notes
    AND calendar.calendar_id <> duplicates.keeper_id;

DROP TEMPORARY TABLE duplicate_planting_calendar_schedules;

COMMIT;
