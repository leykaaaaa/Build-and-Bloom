const express = require("express");

const {
    getPlantingCalendar,
    getPlantingCalendarByLocation,
    createPlantingCalendar,
    updatePlantingCalendar
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
router.put(
    "/:id",
    verifyToken,
    verifyAdmin,
    updatePlantingCalendar
);


module.exports = router;