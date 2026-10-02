const API_KEY = process.env.OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";


const locationCoordinates = {

    "Dagupan": {
        lat: 16.0433,
        lon: 120.3333
    },

    "Lingayen": {
        lat: 16.0217,
        lon: 120.2319
    },

    "Urdaneta": {
        lat: 15.9761,
        lon: 120.5711
    },

    "Santa Barbara": {
        lat: 16.0000,
        lon: 120.4000
    },

    "San Carlos": {
        lat: 15.9280,
        lon: 120.3480
    }

};


function getCoordinates(location) {

    const coordinates =
        locationCoordinates[location];

    if (!coordinates) {

        throw new Error(
            `Weather coordinates not available for ${location}.`
        );

    }

    return coordinates;
}


async function getCurrentWeather(location) {

    if (!API_KEY) {

        throw new Error(
            "OpenWeatherMap API key is not configured."
        );

    }

    const { lat, lon } =
        getCoordinates(location);


    const url =
        `${BASE_URL}/weather` +
        `?lat=${lat}` +
        `&lon=${lon}` +
        `&appid=${API_KEY}` +
        `&units=metric`;


    const response =
        await fetch(url);


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to retrieve current weather."
        );

    }


    return {

        location,

        temperature:
            data.main?.temp ?? null,

        feels_like:
            data.main?.feels_like ?? null,

        humidity:
            data.main?.humidity ?? null,

        rainfall:
            data.rain?.["1h"] ??
            data.rain?.["3h"] ??
            0,

        weather_condition:
            data.weather?.[0]?.main ??
            "Unknown",

        weather_description:
            data.weather?.[0]?.description ??
            "Unknown",

        wind_speed:
            data.wind?.speed ?? null,

        recorded_at:
            new Date()

    };

}


async function getWeatherForecast(location) {

    if (!API_KEY) {

        throw new Error(
            "OpenWeatherMap API key is not configured."
        );

    }

    const { lat, lon } =
        getCoordinates(location);


    const url =
        `${BASE_URL}/forecast` +
        `?lat=${lat}` +
        `&lon=${lon}` +
        `&appid=${API_KEY}` +
        `&units=metric`;


    const response =
        await fetch(url);


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to retrieve weather forecast."
        );

    }


    return {

        location,

        forecast: data.list.map((item) => ({

            datetime: item.dt_txt,

            temperature:
                item.main?.temp ?? null,

            feels_like:
                item.main?.feels_like ?? null,

            humidity:
                item.main?.humidity ?? null,

            rainfall:
                item.rain?.["3h"] ?? 0,

            weather_condition:
                item.weather?.[0]?.main ??
                "Unknown",

            weather_description:
                item.weather?.[0]?.description ??
                "Unknown",

            wind_speed:
                item.wind?.speed ?? null

        }))

    };

}


module.exports = {
    getCurrentWeather,
    getWeatherForecast
};