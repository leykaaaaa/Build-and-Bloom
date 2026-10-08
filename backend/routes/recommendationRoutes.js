const express = require("express");

const {
    assessCrops,
    getRecommendationHistory
} = require("../controllers/recommendationController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/assess", assessCrops);

router.get(
    "/history",
    verifyToken,
    verifyAdmin,
    getRecommendationHistory
);

module.exports = router;