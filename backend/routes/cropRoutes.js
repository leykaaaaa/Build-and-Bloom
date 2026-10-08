const express = require("express");

const {
    getAllCrops,
    getCropById,
    createCrop,
    updateCrop,
    deleteCrop
} = require("../controllers/cropController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public crop information
router.get("/", getAllCrops);

router.get("/:id", getCropById);

// Admin-only crop creation
router.post(
    "/",
    verifyToken,
    verifyAdmin,
    createCrop
);

// Admin-only crop update
router.put(
    "/:id",
    verifyToken,
    verifyAdmin,
    updateCrop
);

router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    deleteCrop
);

module.exports = router;