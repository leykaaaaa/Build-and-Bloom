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

// CREATE PLANTING CALENDAR ENTRY
const createPlantingCalendar = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const {
            crop_id,
            location_id,
            planting_month,
            season,
            growing_period,
            harvest_period,
            notes
        } = req.body;

        // VALIDATE REQUIRED FIELDS
        if (!crop_id || !location_id) {
            return res.status(400).json({
                success: false,
                message:
                    "Crop and location are required."
            });
        }

        // CHECK IF CROP EXISTS
        const [crop] = await connection.query(
            `
            SELECT crop_id
            FROM crops
            WHERE crop_id = ?
            `,
            [crop_id]
        );

        if (crop.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found."
            });
        }

        // CHECK IF LOCATION EXISTS
        const [location] = await connection.query(
            `
            SELECT location_id
            FROM locations
            WHERE location_id = ?
            `,
            [location_id]
        );

        if (location.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Location not found."
            });
        }

        // START TRANSACTION
        await connection.beginTransaction();

        // INSERT INTO DATABASE
        const [result] = await connection.query(
            `
            INSERT INTO planting_calendar (
                crop_id,
                location_id,
                planting_month,
                season,
                growing_period,
                harvest_period,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                crop_id,
                location_id,
                planting_month || null,
                season || null,
                growing_period || null,
                harvest_period || null,
                notes || null
            ]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message:
                "Planting calendar entry created successfully.",
            calendar_id: result.insertId
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Error creating planting calendar:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to create planting calendar entry."
        });

    } finally {
        connection.release();
    }
};

// UPDATE PLANTING CALENDAR ENTRY
const updatePlantingCalendar = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { id } = req.params;

        const {
            crop_id,
            location_id,
            planting_month,
            season,
            growing_period,
            harvest_period,
            notes
        } = req.body;

        // VALIDATE REQUIRED FIELDS
        if (!crop_id || !location_id) {
            return res.status(400).json({
                success: false,
                message:
                    "Crop and location are required."
            });
        }

        // CHECK IF CALENDAR ENTRY EXISTS
        const [existingEntry] =
            await connection.query(
                `
                SELECT calendar_id
                FROM planting_calendar
                WHERE calendar_id = ?
                `,
                [id]
            );

        if (existingEntry.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Planting calendar entry not found."
            });
        }

        // CHECK IF CROP EXISTS
        const [crop] =
            await connection.query(
                `
                SELECT crop_id
                FROM crops
                WHERE crop_id = ?
                `,
                [crop_id]
            );

        if (crop.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found."
            });
        }

        // CHECK IF LOCATION EXISTS
        const [location] =
            await connection.query(
                `
                SELECT location_id
                FROM locations
                WHERE location_id = ?
                `,
                [location_id]
            );

        if (location.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Location not found."
            });
        }

        // START TRANSACTION
        await connection.beginTransaction();

        // UPDATE DATABASE
        await connection.query(
            `
            UPDATE planting_calendar
            SET
                crop_id = ?,
                location_id = ?,
                planting_month = ?,
                season = ?,
                growing_period = ?,
                harvest_period = ?,
                notes = ?
            WHERE calendar_id = ?
            `,
            [
                crop_id,
                location_id,
                planting_month || null,
                season || null,
                growing_period || null,
                harvest_period || null,
                notes || null,
                id
            ]
        );

        await connection.commit();

        res.json({
            success: true,
            message:
                "Planting calendar entry updated successfully.",
            calendar_id: id
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Error updating planting calendar:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update planting calendar entry."
        });

    } finally {
        connection.release();
    }
};

// DELETE PLANTING CALENDAR ENTRY
const deletePlantingCalendar = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { id } = req.params;

        const [existingEntry] =
            await connection.query(
                `
                SELECT calendar_id
                FROM planting_calendar
                WHERE calendar_id = ?
                `,
                [id]
            );

        if (existingEntry.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Planting calendar entry not found."
            });
        }

        await connection.beginTransaction();

        await connection.query(
            `
            DELETE FROM planting_calendar
            WHERE calendar_id = ?
            `,
            [id]
        );

        await connection.commit();

        res.json({
            success: true,
            message:
                "Planting calendar entry deleted successfully.",
            calendar_id: id
        });

    } catch (error) {
        await connection.rollback();

        console.error(
            "Error deleting planting calendar:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete planting calendar entry."
        });

    } finally {
        connection.release();
    }
};


module.exports = {
    getPlantingCalendar,
    getPlantingCalendarByLocation,
    createPlantingCalendar,
    updatePlantingCalendar,
    deletePlantingCalendar
};