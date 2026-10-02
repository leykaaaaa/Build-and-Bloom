const pool = require("../config/db");


// GET ALL PLANTING CALENDAR ENTRIES
const getPlantingCalendar = async (req, res) => {
    try {

        const { location_id } = req.query;

        let query = `
            SELECT
                pc.calendar_id,
                pc.crop_id,
                c.crop_name,
                c.category,
                c.description,
                pc.location_id,
                l.location_name,
                pc.planting_month,
                pc.season,
                pc.growing_period,
                pc.harvest_period,
                pc.notes
            FROM planting_calendar pc
            INNER JOIN crops c
                ON pc.crop_id = c.crop_id
            INNER JOIN locations l
                ON pc.location_id = l.location_id
        `;

        const params = [];


        // FILTER BY LOCATION IF PROVIDED
        if (location_id) {

            query += `
                WHERE pc.location_id = ?
            `;

            params.push(location_id);

        }


        // ORDER RESULTS
        query += `
            ORDER BY
                l.location_name ASC,
                c.crop_name ASC
        `;


        const [rows] = await pool.query(
            query,
            params
        );


        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(
            "Error retrieving planting calendar:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve planting calendar."
        });

    }
};


// GET PLANTING CALENDAR BY LOCATION NAME
const getPlantingCalendarByLocation = async (req, res) => {
    try {

        const { location } = req.params;


        const [rows] = await pool.query(
            `
            SELECT
                pc.calendar_id,
                pc.crop_id,
                c.crop_name,
                c.category,
                c.description,
                pc.location_id,
                l.location_name,
                pc.planting_month,
                pc.season,
                pc.growing_period,
                pc.harvest_period,
                pc.notes
            FROM planting_calendar pc
            INNER JOIN crops c
                ON pc.crop_id = c.crop_id
            INNER JOIN locations l
                ON pc.location_id = l.location_id
            WHERE l.location_name = ?
            ORDER BY c.crop_name ASC
            `,
            [location]
        );


        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(
            "Error retrieving planting calendar by location:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve planting calendar."
        });

    }
};


module.exports = {
    getPlantingCalendar,
    getPlantingCalendarByLocation
};