const express = require("express");

const {
    getPlantingCalendar,
    getPlantingCalendarByLocation
} = require("../controllers/plantingCalendarController");

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


module.exports = router;