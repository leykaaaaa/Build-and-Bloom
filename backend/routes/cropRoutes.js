const express = require("express");

const {
    getAllCrops,
    getCropById
} = require("../controllers/cropController");

const router = express.Router();

router.get("/", getAllCrops);

router.get("/:id", getCropById);

module.exports = router;