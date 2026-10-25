const express = require("express");

const {
    getPlantingCalendar,
    getPlantingCalendarByLocation,
    createPlantingCalendar,
    updatePlantingCalendarSchedules,
    deletePlantingCalendarSchedules,
    updatePlantingCalendar,
    deletePlantingCalendar
} = require("../controllers/plantingCalendarController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL PLANTING CALENDAR ENTRIES
// Optional: ?location_id=1 (general schedules are included)

router.get(
    "/",
    getPlantingCalendar
);


// GET LOCATION-SPECIFIC AND GENERAL PLANTING SCHEDULES BY LOCATION NAME
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

// UPDATE GROUPED PLANTING CALENDAR ENTRIES
// Admin only
router.put(
    "/bulk",
    verifyToken,
    verifyAdmin,
    updatePlantingCalendarSchedules
);

router.put(
    "/:id",
    verifyToken,
    verifyAdmin,
    updatePlantingCalendar
);

// DELETE PLANTING CALENDAR ENTRY
// Admin only
router.delete(
    "/bulk",
    verifyToken,
    verifyAdmin,
    deletePlantingCalendarSchedules
);

router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    deletePlantingCalendar
);


module.exports = router;