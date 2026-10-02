const express = require("express");

const {
    assessCrops
} = require("../controllers/recommendationController");

const router = express.Router();

router.post("/assess", assessCrops);

module.exports = router;