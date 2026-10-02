const pool = require("../config/db");

const {
    getCurrentWeather,
    getWeatherForecast
} = require("../services/weatherService");


/*
|--------------------------------------------------------------------------
| NORMALIZATION
|--------------------------------------------------------------------------
*/

function normalize(value) {
    if (!value) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase();
}


/*
|--------------------------------------------------------------------------
| REQUIREMENT MATCHING
|--------------------------------------------------------------------------
|
| Supports database values such as:
|
| "Loam, Sandy"
| "Open Field/Container"
| "Full Sun"
|
| and user selections such as:
|
| "Loam"
| "Open Field"
| "Full"
|--------------------------------------------------------------------------
*/

function splitRequirements(value) {
    if (!value) {
        return [];
    }

    return String(value)
        .toLowerCase()
        .split(/[,/|]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}


function matchesRequirement(
    userValue,
    requirementValue
) {
    if (!userValue || !requirementValue) {
        return false;
    }

    const user = normalize(userValue);

    const requirements =
        splitRequirements(requirementValue);

    return requirements.some((requirement) => {

        if (user === requirement) {
            return true;
        }

        if (user.includes(requirement)) {
            return true;
        }

        if (requirement.includes(user)) {
            return true;
        }

        /*
         * Handle common wording differences.
         */

        if (
            user === "full" &&
            requirement.includes("full sun")
        ) {
            return true;
        }

        if (
            user === "partial" &&
            requirement.includes("partial")
        ) {
            return true;
        }

        if (
            user === "silty" &&
            requirement === "silt"
        ) {
            return true;
        }

        if (
            user === "silt" &&
            requirement === "silty"
        ) {
            return true;
        }

        return false;
    });
}


/*
|--------------------------------------------------------------------------
| WATER SCORE
|--------------------------------------------------------------------------
*/

function waterScore(
    userWater,
    cropWater
) {
    if (!userWater || !cropWater) {
        return 50;
    }

    const user = normalize(userWater);
    const crop = normalize(cropWater);


    if (
        user.includes("low") &&
        crop.includes("low")
    ) {
        return 100;
    }


    if (
        user.includes("moderate") &&
        crop.includes("moderate")
    ) {
        return 100;
    }


    if (
        user.includes("high") &&
        crop.includes("high")
    ) {
        return 100;
    }


    /*
     * Moderate water can work reasonably well
     * for crops requiring low water.
     */

    if (
        user.includes("moderate") &&
        crop.includes("low")
    ) {
        return 80;
    }


    /*
     * High water for a moderate-water crop.
     */

    if (
        user.includes("high") &&
        crop.includes("moderate")
    ) {
        return 80;
    }


    /*
     * Moderate water for a high-water crop.
     */

    if (
        user.includes("moderate") &&
        crop.includes("high")
    ) {
        return 70;
    }


    /*
     * Low water for a moderate-water crop.
     */

    if (
        user.includes("low") &&
        crop.includes("moderate")
    ) {
        return 70;
    }


    /*
     * Low water for a high-water crop.
     */

    if (
        user.includes("low") &&
        crop.includes("high")
    ) {
        return 40;
    }


    /*
     * High water for a low-water crop.
     */

    if (
        user.includes("high") &&
        crop.includes("low")
    ) {
        return 60;
    }


    return 40;
}


/*
|--------------------------------------------------------------------------
| SUNLIGHT SCORE
|--------------------------------------------------------------------------
*/

function sunlightScore(
    userSunlight,
    cropSunlight
) {
    if (!userSunlight || !cropSunlight) {
        return 50;
    }

    const user = normalize(userSunlight);
    const crop = normalize(cropSunlight);


    if (
        user.includes("full") &&
        crop.includes("full")
    ) {
        return 100;
    }


    if (
        user.includes("partial") &&
        crop.includes("partial")
    ) {
        return 100;
    }


    if (
        user.includes("low") &&
        crop.includes("low")
    ) {
        return 100;
    }


    /*
     * Full sunlight can usually satisfy
     * a crop requiring partial sunlight.
     */

    if (
        user.includes("full") &&
        crop.includes("partial")
    ) {
        return 90;
    }


    /*
     * Partial sunlight for a full-sun crop
     * is less suitable.
     */

    if (
        user.includes("partial") &&
        crop.includes("full")
    ) {
        return 70;
    }


    /*
     * Low sunlight for a partial-sun crop.
     */

    if (
        user.includes("low") &&
        crop.includes("partial")
    ) {
        return 60;
    }


    return 40;
}


/*
|--------------------------------------------------------------------------
| WEATHER SCORE
|--------------------------------------------------------------------------
|
| Current implementation evaluates temperature because
| crop requirements currently contain min/max temperature.
|--------------------------------------------------------------------------
*/

function weatherScore(
    weather,
    crop
) {
    if (
        !weather ||
        weather.temperature === null ||
        weather.temperature === undefined ||
        crop.min_temperature === null ||
        crop.min_temperature === undefined ||
        crop.max_temperature === null ||
        crop.max_temperature === undefined
    ) {
        return 50;
    }


    const temperature =
        Number(weather.temperature);

    const min =
        Number(crop.min_temperature);

    const max =
        Number(crop.max_temperature);


    if (
        Number.isNaN(temperature) ||
        Number.isNaN(min) ||
        Number.isNaN(max)
    ) {
        return 50;
    }


    /*
     * Temperature is inside the preferred range.
     */

    if (
        temperature >= min &&
        temperature <= max
    ) {
        return 100;
    }


    /*
     * Temperature is outside the range.
     */

    const distance =
        temperature < min
            ? min - temperature
            : temperature - max;


    if (distance <= 3) {
        return 70;
    }


    if (distance <= 6) {
        return 40;
    }


    return 10;
}


/*
|--------------------------------------------------------------------------
| COMPATIBILITY LEVEL
|--------------------------------------------------------------------------
*/

function getCompatibilityLevel(score) {

    if (score >= 80) {
        return "Highly Suitable";
    }

    if (score >= 60) {
        return "Moderately Suitable";
    }

    return "Not Recommended";
}


/*
|--------------------------------------------------------------------------
| EXPLANATION
|--------------------------------------------------------------------------
*/

function generateExplanation({
    crop,
    soilFactor,
    waterFactor,
    sunlightFactor,
    environmentFactor,
    weatherFactor,
    weather
}) {

    const reasons = [];


    /*
     * SOIL
     */

    if (soilFactor >= 80) {

        reasons.push(
            `The soil condition matches the preferred soil type for ${crop.crop_name}.`
        );

    } else {

        reasons.push(
            `The selected soil condition does not closely match the preferred soil type for ${crop.crop_name}.`
        );

    }


    /*
     * WATER
     */

    if (waterFactor >= 80) {

        reasons.push(
            "The available water level is suitable for this crop."
        );

    } else if (waterFactor >= 60) {

        reasons.push(
            "The available water level is moderately compatible with this crop."
        );

    } else {

        reasons.push(
            "The water availability may not fully meet this crop's requirements."
        );

    }


    /*
     * SUNLIGHT
     */

    if (sunlightFactor >= 80) {

        reasons.push(
            "The available sunlight is appropriate for this crop."
        );

    } else if (sunlightFactor >= 60) {

        reasons.push(
            "The available sunlight is moderately compatible with this crop."
        );

    } else {

        reasons.push(
            "The available sunlight may not fully satisfy this crop's requirements."
        );

    }


    /*
     * ENVIRONMENT
     */

    if (environmentFactor >= 80) {

        reasons.push(
            "The selected growing environment is compatible with this crop."
        );

    } else {

        reasons.push(
            "The selected growing environment does not closely match the preferred environment for this crop."
        );

    }


    /*
     * WEATHER
     */

    if (weather) {

        const temperature =
            Number(weather.temperature);


        if (weatherFactor >= 80) {

            reasons.push(
                `The current temperature of ${temperature.toFixed(1)}°C is within the preferred temperature range of ${crop.min_temperature}°C–${crop.max_temperature}°C.`
            );

        } else if (weatherFactor >= 60) {

            reasons.push(
                `The current temperature of ${temperature.toFixed(1)}°C is slightly outside the preferred range of ${crop.min_temperature}°C–${crop.max_temperature}°C.`
            );

        } else {

            reasons.push(
                `The current temperature of ${temperature.toFixed(1)}°C is outside the preferred range of ${crop.min_temperature}°C–${crop.max_temperature}°C.`
            );

        }

    } else {

        reasons.push(
            "Current weather information was unavailable during the assessment."
        );

    }


    return reasons.join(" ");
}


/*
|--------------------------------------------------------------------------
| ASSESS CROPS
|--------------------------------------------------------------------------
*/

async function assessCrops(req, res) {

    try {

        const {
            location,
            soil,
            water,
            sunlight,
            environment,
            crop_id,
            user_id
        } = req.body;


        /*
         * VALIDATE REQUIRED ASSESSMENT DATA
         */

        if (
            !location ||
            !soil ||
            !water ||
            !sunlight ||
            !environment
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Location, soil, water, sunlight, and environment are required."

            });

        }


        /*
         * VALIDATE USER ID WHEN PROVIDED
         *
         * The frontend may send user_id for a
         * logged-in user.
         */

        let validatedUserId = null;


        if (user_id) {

            const [
                userRows
            ] = await pool.query(
                `
                SELECT user_id
                FROM users
                WHERE user_id = ?
                LIMIT 1
                `,
                [user_id]
            );


            if (userRows.length > 0) {

                validatedUserId =
                    userRows[0].user_id;

            }

        }


        /*
         * GET LOCATION ID ONCE
         */

        let locationId = null;


        const [
            locationRows
        ] = await pool.query(
            `
            SELECT location_id
            FROM locations
            WHERE LOWER(location_name) = LOWER(?)
            LIMIT 1
            `,
            [location]
        );


        if (locationRows.length > 0) {

            locationId =
                locationRows[0].location_id;

        }


        /*
         * GET WEATHER
         */

        let currentWeather = null;

        let weatherForecast = [];


        try {

            currentWeather =
                await getCurrentWeather(location);


            const forecastResult =
                await getWeatherForecast(location);


            weatherForecast =
                forecastResult.forecast || [];


        } catch (weatherError) {

            console.error(
                "Weather integration error:",
                weatherError.message
            );

        }


        /*
         * GET CROPS
         */

        let query = `
            SELECT
                c.crop_id,
                c.crop_name,
                c.category,
                c.description,
                c.growing_period,
                c.harvest_period,

                cr.soil_type,
                cr.water_requirement,
                cr.sunlight_requirement,
                cr.min_temperature,
                cr.max_temperature,
                cr.season,
                cr.environment

            FROM crops c

            LEFT JOIN crop_requirements cr
                ON c.crop_id = cr.crop_id
        `;


        const queryParams = [];


        /*
         * SPECIFIC CROP ASSESSMENT
         *
         * Example:
         *
         * /assessment?crop=3
         *
         * Only that crop will be evaluated.
         */

        if (crop_id) {

            query += `
                WHERE c.crop_id = ?
            `;

            queryParams.push(crop_id);

        }


        query += `
            ORDER BY c.crop_name ASC
        `;


        const [
            crops
        ] = await pool.query(
            query,
            queryParams
        );


        /*
         * HANDLE INVALID SPECIFIC CROP
         */

        if (
            crop_id &&
            crops.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "The selected crop could not be found."

            });

        }


        /*
         * CALCULATE COMPATIBILITY
         */

        const evaluatedCrops =
            crops.map((crop) => {

                /*
                 * SOIL
                 */

                const soilFactor =
                    matchesRequirement(
                        soil,
                        crop.soil_type
                    )
                        ? 100
                        : 40;


                /*
                 * WATER
                 */

                const waterFactor =
                    waterScore(
                        water,
                        crop.water_requirement
                    );


                /*
                 * SUNLIGHT
                 */

                const sunlightFactor =
                    sunlightScore(
                        sunlight,
                        crop.sunlight_requirement
                    );


                /*
                 * ENVIRONMENT
                 */

                const environmentFactor =
                    matchesRequirement(
                        environment,
                        crop.environment
                    )
                        ? 100
                        : 40;


                /*
                 * WEATHER
                 */

                const weatherFactor =
                    weatherScore(
                        currentWeather,
                        crop
                    );


                /*
                 * WEIGHTED SCORE
                 *
                 * Soil       = 25%
                 * Water      = 20%
                 * Sunlight   = 20%
                 * Environment= 15%
                 * Weather    = 20%
                 */

                const score =
                    (soilFactor * 0.25) +
                    (waterFactor * 0.20) +
                    (sunlightFactor * 0.20) +
                    (environmentFactor * 0.15) +
                    (weatherFactor * 0.20);


                const roundedScore =
                    Math.round(score * 100) / 100;


                const compatibilityLevel =
                    getCompatibilityLevel(
                        roundedScore
                    );


                const explanation =
                    generateExplanation({

                        crop,

                        soilFactor,

                        waterFactor,

                        sunlightFactor,

                        environmentFactor,

                        weatherFactor,

                        weather:
                            currentWeather

                    });


                return {

                    crop_id:
                        crop.crop_id,

                    crop_name:
                        crop.crop_name,

                    category:
                        crop.category,

                    description:
                        crop.description,

                    score:
                        roundedScore,

                    compatibility_level:
                        compatibilityLevel,

                    factors: {

                        soil:
                            soilFactor,

                        water:
                            waterFactor,

                        sunlight:
                            sunlightFactor,

                        environment:
                            environmentFactor,

                        weather:
                            weatherFactor

                    },

                    explanation

                };

            });


        /*
         * FILTER RECOMMENDATIONS
         *
         * General assessment:
         *
         * Only crops with a score of 60+
         * are returned as recommendations.
         *
         * Specific crop assessment:
         *
         * Always return the selected crop,
         * even when it is below 60, because
         * the user specifically asked:
         *
         * "Can I grow this?"
         */

        let recommendations;


        if (crop_id) {

            recommendations =
                evaluatedCrops;

        } else {

            recommendations =
                evaluatedCrops.filter(
                    (crop) =>
                        crop.score >= 60
                );

        }


        /*
         * RANK
         */

        recommendations.sort(
            (a, b) =>
                b.score - a.score
        );


        /*
         * SAVE RESULTS
         *
         * Only the crops that are actually
         * returned by the assessment are saved.
         */

        for (
            const recommendation
            of recommendations
        ) {

            await pool.query(
                `
                INSERT INTO recommendations (
                    user_id,
                    crop_id,
                    location_id,
                    compatibility_score,
                    compatibility_level,
                    explanation,
                    assessment_soil,
                    assessment_water,
                    assessment_sunlight,
                    assessment_environment
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [

                    validatedUserId,

                    recommendation.crop_id,

                    locationId,

                    recommendation.score,

                    recommendation.compatibility_level,

                    recommendation.explanation,

                    soil,

                    water,

                    sunlight,

                    environment

                ]
            );

        }


        /*
         * RESPONSE
         *
         * IMPORTANT:
         * This structure remains compatible with
         * your current assessment/page.js.
         */

        res.json({

            success: true,

            message:
                "Crop assessment completed successfully.",

            assessment: {

                location,

                soil,

                water,

                sunlight,

                environment

            },

            currentWeather,

            forecast:
                weatherForecast,

            recommendations

        });


    } catch (error) {

        console.error(
            "Crop assessment error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to process crop assessment.",

            error:
                error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {
    assessCrops
};