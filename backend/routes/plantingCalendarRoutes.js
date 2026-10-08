const express = require("express");

const {
    getPlantingCalendar,
    getPlantingCalendarByLocation,
    createPlantingCalendar,
    updatePlantingCalendar,
    deletePlantingCalendar
} = require("../controllers/plantingCalendarController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL PLANTING CALENDAR ENTRIES
// Optional: ?location_id=1

router.get(
    "/",
    getPlantingCalendar
);


// GET PLANTING CALENDAR BY LOCATION NAME
// Example: /location/Santa%20Barbara

router.get(
    "/location/:location",
    getPlantingCalendarByLocation
);


// CREATE PLANTING CALENDAR ENTRY
// Admin only
router.post(
    "/",
    verifyToken,
    verifyAdmin,
    createPlantingCalendar
);

// UPDATE PLANTING CALENDAR ENTRY
// Admin only
router.put(
    "/:id",
    verifyToken,
    verifyAdmin,
    updatePlantingCalendar
);

// DELETE PLANTING CALENDAR ENTRY
// Admin only
router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    deletePlantingCalendar
);


module.exports = router;