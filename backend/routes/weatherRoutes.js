const express = require("express");

const {
    getCurrentWeather,
    getWeatherForecast
} = require("../services/weatherService");

const {
    generateCurrentAdvisories,
    generateForecastAdvisories
} = require("../services/weatherAdvisoryService");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| CURRENT WEATHER
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| WEATHER FORECAST
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| WEATHER ADVISORY
|--------------------------------------------------------------------------
|
| Returns care advisories based on:
|
| - Current weather
| - Upcoming forecast
|
*/

router.get("/advisory", async (req, res) => {

    try {

        const { location } = req.query;


        if (!location) {

            return res.status(400).json({
                success: false,
                message: "Location is required."
            });

        }


        /*
         * GET CURRENT WEATHER
         */

        const currentWeather =
            await getCurrentWeather(location);


        /*
         * GET FORECAST
         */

        const forecastResult =
            await getWeatherForecast(location);


        const forecast =
            forecastResult.forecast || [];


        /*
         * GENERATE ADVISORIES
         */

        const currentAdvisories =
            generateCurrentAdvisories(
                currentWeather
            );


        const forecastAdvisories =
            generateForecastAdvisories(
                forecast
            );


        /*
         * RESPONSE
         */

        res.json({

            success: true,

            location:
                currentWeather.location,

            currentWeather,

            currentAdvisories,

            forecastAdvisories

        });


    } catch (error) {

        console.error(
            "Weather advisory error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

});


module.exports = router;