const express = require("express");

const {
    createPlantingPlan,
    getPlantingPlans,
    updatePlantingPlanStatus
} = require("../controllers/plantingPlanController");

const router = express.Router();


// CREATE PLANTING PLAN
router.post(
    "/",
    createPlantingPlan
);


// UPDATE PLANTING PLAN STATUS
router.put(
    "/:plan_id/status",
    updatePlantingPlanStatus
);


// GET USER'S PLANTING PLANS
router.get(
    "/:user_id",
    getPlantingPlans
);


module.exports = router;