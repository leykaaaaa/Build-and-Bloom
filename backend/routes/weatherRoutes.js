const express = require("express");

const {
    getCurrentWeather,
    getWeatherForecast
} = require("../services/weatherService");

const router = express.Router();


router.get("/current", async (req, res) => {

    try {

        const { location } = req.query;


        if (!location) {

            return res.status(400).json({
                success: false,
                message: "Location is required."
            });

        }


        const weather =
            await getCurrentWeather(location);


        res.json({
            success: true,
            data: weather
        });


    } catch (error) {

        console.error(
            "Current weather error:",
            error
        );


        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


router.get("/forecast", async (req, res) => {

    try {

        const { location } = req.query;


        if (!location) {

            return res.status(400).json({
                success: false,
                message: "Location is required."
            });

        }


        const weather =
            await getWeatherForecast(location);


        res.json({
            success: true,
            data: weather
        });


    } catch (error) {

        console.error(
            "Weather forecast error:",
            error
        );


        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


module.exports = router;