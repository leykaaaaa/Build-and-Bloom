
const express = require("express");

const {
    createPlantingPlan,
    getPlantingPlans,
    updatePlantingPlanStatus,
    getPlantingPlanAdvisories
} = require("../controllers/plantingPlanController");

const router = express.Router();

// CREATE PLANTING PLAN
router.post("/", createPlantingPlan);

// UPDATE PLANTING PLAN STATUS
router.put("/:plan_id/status", updatePlantingPlanStatus);

// GET CROP-SPECIFIC PLANTING PLAN ADVISORIES
router.get("/:user_id/advisories", getPlantingPlanAdvisories);

// GET USER'S PLANTING PLANS
router.get("/:user_id", getPlantingPlans);

module.exports = router;