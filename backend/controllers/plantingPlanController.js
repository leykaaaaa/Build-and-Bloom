const pool = require("../config/db");


/*
    Create a planting plan
*/
const createPlantingPlan = async (req, res) => {

    try {

        const {
            user_id,
            crop_id,
            location_id,
            plan_name,
            planting_date,
            quantity,
            growing_method,
            notes
        } = req.body;


        if (
            !user_id ||
            !crop_id ||
            !plan_name
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "User, crop, and plan name are required."
            });

        }


        const [result] = await pool.query(
            `
            INSERT INTO planting_plans (
                user_id,
                crop_id,
                location_id,
                plan_name,
                planting_date,
                quantity,
                growing_method,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user_id,
                crop_id,
                location_id || null,
                plan_name,
                planting_date || null,
                quantity || null,
                growing_method || null,
                notes || null
            ]
        );


        res.status(201).json({

            success: true,

            message:
                "Planting plan created successfully.",

            plan_id: result.insertId

        });


    } catch (error) {

        console.error(
            "Create planting plan error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create planting plan."

        });

    }

};


/*
    Get planting plans for a user
*/
const getPlantingPlans = async (req, res) => {

    try {

        const { user_id } = req.params;


        const [plans] = await pool.query(
            `
            SELECT
                pp.plan_id,
                pp.plan_name,
                pp.planting_date,
                pp.quantity,
                pp.growing_method,
                pp.notes,
                pp.status,
                pp.created_at,

                c.crop_id,
                c.crop_name,
                c.category,

                l.location_id,
                l.location_name

            FROM planting_plans pp

            INNER JOIN crops c
                ON pp.crop_id = c.crop_id

            LEFT JOIN locations l
                ON pp.location_id = l.location_id

            WHERE pp.user_id = ?

            ORDER BY pp.created_at DESC
            `,
            [user_id]
        );


        res.json({

            success: true,

            count: plans.length,

            data: plans

        });


    } catch (error) {

        console.error(
            "Get planting plans error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to retrieve planting plans."

        });

    }

};


// UPDATE PLANTING PLAN STATUS
const updatePlantingPlanStatus = async (req, res) => {
    try {

        const { plan_id } = req.params;
        const { user_id, status } = req.body;


        // Validate required fields
        if (!plan_id || !user_id || !status) {
            return res.status(400).json({
                success: false,
                message:
                    "Plan ID, user ID, and status are required."
            });
        }


        // Validate allowed statuses
        const allowedStatuses = [
            "Planned",
            "Growing",
            "Harvested",
            "Completed"
        ];


        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid planting plan status."
            });
        }


        // Make sure the plan belongs to the logged-in user
        const [plans] = await pool.query(
            `
            SELECT plan_id
            FROM planting_plans
            WHERE plan_id = ?
            AND user_id = ?
            `,
            [
                plan_id,
                user_id
            ]
        );


        if (plans.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Planting plan not found or does not belong to this account."
            });
        }


        // Update the status
        await pool.query(
            `
            UPDATE planting_plans
            SET status = ?
            WHERE plan_id = ?
            AND user_id = ?
            `,
            [
                status,
                plan_id,
                user_id
            ]
        );


        res.json({
            success: true,
            message:
                "Planting plan status updated successfully."
        });

    } catch (error) {

        console.error(
            "Error updating planting plan status:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update planting plan status."
        });

    }
};

module.exports = {
    createPlantingPlan,
    getPlantingPlans,
    updatePlantingPlanStatus
};