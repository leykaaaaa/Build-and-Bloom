
/*
|--------------------------------------------------------------------------
| CROP-SPECIFIC ADVISORY SERVICE
|--------------------------------------------------------------------------
|
| Generates care advisories by comparing:
| - Crop requirements
| - Current weather
| - Upcoming weather forecast
|
*/

function generateCropAdvisories(
    crop,
    requirements,
    currentWeather,
    forecast = []
) {
    const advisories = [];

    if (!requirements || !currentWeather) {
        return advisories;
    }

    const {
        min_temperature,
        max_temperature,
        water_requirement,
        soil_type,
        sunlight_requirement
    } = requirements;

    const temperature = Number(currentWeather.temperature);
    const rainfall = Number(currentWeather.rainfall);
    const humidity = Number(currentWeather.humidity);

    /*
    |--------------------------------------------------------------------------
    | TEMPERATURE ADVISORIES
    |--------------------------------------------------------------------------
    */

    if (
        Number.isFinite(temperature) &&
        max_temperature !== null &&
        temperature > Number(max_temperature)
    ) {
        advisories.push({
            type: "temperature",
            priority: "high",
            title: "Temperature Above Crop Requirement",
            message:
                `${crop.crop_name} is currently experiencing temperatures ` +
                `above its recorded maximum requirement of ${max_temperature}°C. ` +
                "Monitor the plant for heat stress and consider providing shade."
        });
    }

    else if (
        Number.isFinite(temperature) &&
        min_temperature !== null &&
        temperature < Number(min_temperature)
    ) {
        advisories.push({
            type: "temperature",
            priority: "warning",
            title: "Temperature Below Crop Requirement",
            message:
                `${crop.crop_name} is currently experiencing temperatures ` +
                `below its recorded minimum requirement of ${min_temperature}°C. ` +
                "Monitor plant growth and protect the crop from excessive cold."
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CURRENT RAINFALL AND WATER ADVISORIES
    |--------------------------------------------------------------------------
    */

    if (
        Number.isFinite(rainfall) &&
        rainfall > 0
    ) {
        advisories.push({
            type: "water",
            priority: "info",
            title: "Rainfall Detected",
            message:
                `Rainfall has been detected in your planting location. ` +
                "Check the soil moisture before watering again to avoid overwatering."
        });
    }

    /*
    |--------------------------------------------------------------------------
    | HIGH HUMIDITY
    |--------------------------------------------------------------------------
    */

    if (
        Number.isFinite(humidity) &&
        humidity >= 85
    ) {
        advisories.push({
            type: "humidity",
            priority: "warning",
            title: "High Humidity",
            message:
                `Humidity is currently ${humidity}%. ` +
                "Monitor your crop for signs of fungal diseases and maintain good airflow."
        });
    }

    /*
    |--------------------------------------------------------------------------
    | FORECAST RAINFALL
    |--------------------------------------------------------------------------
    */

    const rainyForecast = forecast.filter(
        (item) => Number(item.rainfall) >= 1
    );

    if (rainyForecast.length > 0) {
        advisories.push({
            type: "rain",
            priority: "warning",
            title: "Rain Expected",
            message:
                `Rainfall is expected in the upcoming forecast for ${crop.crop_name}. ` +
                "Check soil moisture before watering and ensure proper drainage.",
            occurrences: rainyForecast.length
        });
    }

    /*
    |--------------------------------------------------------------------------
    | FORECAST TEMPERATURE
    |--------------------------------------------------------------------------
    */

    const temperatureWarnings = forecast.filter((item) => {
        const forecastTemperature = Number(item.temperature);

        return (
            Number.isFinite(forecastTemperature) &&
            (
                (
                    max_temperature !== null &&
                    forecastTemperature > Number(max_temperature)
                ) ||
                (
                    min_temperature !== null &&
                    forecastTemperature < Number(min_temperature)
                )
            )
        );
    });

    if (temperatureWarnings.length > 0) {
        advisories.push({
            type: "forecast-temperature",
            priority: "warning",
            title: "Temperature Changes Expected",
            message:
                `Upcoming temperatures may fall outside the recorded ` +
                `temperature requirements of ${crop.crop_name}. ` +
                "Monitor weather conditions and prepare appropriate crop protection.",
            occurrences: temperatureWarnings.length
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CROP REQUIREMENT INFORMATION
    |--------------------------------------------------------------------------
    */

    advisories.push({
        type: "crop-information",
        priority: "info",
        title: "Crop Care Reference",
        message:
            `Soil: ${soil_type || "Not specified"}. ` +
            `Water: ${water_requirement || "Not specified"}. ` +
            `Sunlight: ${sunlight_requirement || "Not specified"}.`
    });

    /*
    |--------------------------------------------------------------------------
    | DEFAULT ADVISORY
    |--------------------------------------------------------------------------
    */

    if (advisories.length === 1) {
        advisories.unshift({
            type: "general",
            priority: "info",
            title: "No Immediate Weather Concern",
            message:
                `No temperature, rainfall, or humidity warning ` +
                `was triggered for ${crop.crop_name} based on the available readings. ` +
                "Continue monitoring your plant."
        });
    }

    return advisories;
}


module.exports = {
    generateCropAdvisories
};