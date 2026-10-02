const pool = require("../config/db");

const getAllCrops = async (req, res) => {
    try {
        const [crops] = await pool.query(`
            SELECT
                c.crop_id,
                c.crop_name,
                c.category,
                c.description,
                c.growing_period,
                c.harvest_period,
                cr.soil_type,
                cr.water_requirement,
                cr.sunlight_requirement,
                cr.min_temperature,
                cr.max_temperature,
                cr.season,
                cr.environment
            FROM crops c
            LEFT JOIN crop_requirements cr
                ON c.crop_id = cr.crop_id
            ORDER BY c.crop_name ASC
        `);

        res.json({
            success: true,
            count: crops.length,
            data: crops
        });

    } catch (error) {
        console.error("Crop retrieval error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve crops."
        });
    }
};


const getCropById = async (req, res) => {
    try {
        const { id } = req.params;

        const [crops] = await pool.query(`
            SELECT
                c.crop_id,
                c.crop_name,
                c.category,
                c.description,
                c.growing_period,
                c.harvest_period,
                cr.soil_type,
                cr.water_requirement,
                cr.sunlight_requirement,
                cr.min_temperature,
                cr.max_temperature,
                cr.season,
                cr.environment
            FROM crops c
            LEFT JOIN crop_requirements cr
                ON c.crop_id = cr.crop_id
            WHERE c.crop_id = ?
        `, [id]);

        if (crops.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found."
            });
        }

        res.json({
            success: true,
            data: crops[0]
        });

    } catch (error) {
        console.error("Crop retrieval error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve crop."
        });
    }
};


module.exports = {
    getAllCrops,
    getCropById
};