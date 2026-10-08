"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    useRouter,
    useSearchParams
} from "next/navigation";

import { assessCrops } from "../../services/recommendationService";
import { getCropById } from "../../services/cropService";

export default function AssessmentPage() {

    const router = useRouter();

    const searchParams = useSearchParams();

    const selectedCrop = searchParams.get("crop");

   const [form, setForm] = useState({
    location: "",
    soil: "",
    water: "",
    sunlight: "",
    environment: "",
    planting_month: ""
});

    const [specificCrop, setSpecificCrop] = useState(null);
    const [locations, setLocations] = useState([]);
const [locationsLoading, setLocationsLoading] = useState(true);
const [locationsError, setLocationsError] = useState("");

    const [results, setResults] = useState([]);

    const [currentWeather, setCurrentWeather] =
        useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [submitted, setSubmitted] = useState(false);

        /*
        Protect the assessment page.
        Only logged-in users can access it.
    */

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "buildAndBloomUser"
            );


        if (!storedUser) {

            router.push("/login");

            return;

        }


        try {

            const parsedUser =
                JSON.parse(storedUser);


            if (!parsedUser?.user_id) {

                localStorage.removeItem(
                    "buildAndBloomUser"
                );

                router.push("/login");

            }

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem(
                "buildAndBloomUser"
            );

            router.push("/login");

        }

    }, [router]);


    
/*
    Load all Pangasinan locations from the database API.
*/

useEffect(() => {

    async function loadLocations() {

        try {

            setLocationsLoading(true);
            setLocationsError("");

            const response = await fetch(
                "http://localhost:5000/api/locations"
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load locations."
                );
            }

            setLocations(result.data || []);

        } catch (error) {

            console.error("Location loading error:", error);

            setLocationsError(
                error.message || "Unable to load locations."
            );

        } finally {

            setLocationsLoading(false);

        }

    }

    loadLocations();

}, []);


    /*
        Load specific crop when the page is opened
        through "Can I Grow This?"
    */

    useEffect(() => {

        async function loadSpecificCrop() {

            if (!selectedCrop) {
                return;
            }

            try {

                const crop =
                    await getCropById(selectedCrop);

                setSpecificCrop(crop);

            } catch (err) {

                console.error(err);

            }

        }

        loadSpecificCrop();

    }, [selectedCrop]);


    function handleChange(event) {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    }


    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);

        setError("");

        setSubmitted(false);

        setResults([]);

        setCurrentWeather(null);


        try {

           const storedUser =
    localStorage.getItem("buildAndBloomUser");

const loggedInUser =
    storedUser
        ? JSON.parse(storedUser)
        : null;


const result = await assessCrops({
    ...form,

    crop_id: selectedCrop
        ? Number(selectedCrop)
        : null,

    user_id:
        loggedInUser?.user_id || null
});


            console.log(
                "Assessment API result:",
                result
            );


            /*
                IMPORTANT:
                Backend returns recommendations,
                not data.
            */

            setResults(
                Array.isArray(result.recommendations)
                    ? result.recommendations
                    : []
            );


            setCurrentWeather(
                result.currentWeather || null
            );


            setSubmitted(true);


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to process the assessment."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <section className="assessment-page">

            <div className="assessment-container">


                {/* HEADER */}

                <div className="assessment-header">

                    <span className="section-badge">
                         Build & Bloom
                    </span>

                    <h1>
                        Crop Assessment
                    </h1>

                    <p>
                        Tell us about your growing conditions
                        and Build & Bloom will evaluate crop
                        compatibility for you.
                    </p>

                </div>


                {/* SPECIFIC CROP */}

                {specificCrop && (

                    <div className="specific-crop-banner">

                        <span></span>

                        <div>

                            <strong>
                                Checking:{" "}
                                {specificCrop.crop_name}
                            </strong>

                            <p>
                                This assessment will determine
                                whether your conditions are suitable
                                for growing{" "}
                                {specificCrop.crop_name}.
                            </p>

                        </div>

                    </div>

                )}


                {/* ASSESSMENT FORM */}

                <div className="assessment-card">

                    <form onSubmit={handleSubmit}>


                        {/* LOCATION */}

                        <div className="form-section">

                            <h2>
                                 Your Growing Location
                            </h2>

                            <p className="form-description">
                                Select the Pangasinan location where
                                you plan to grow.
                            </p>


                            <label>
                                Location
                            </label>

                            
<select
    name="location"
    value={form.location}
    onChange={handleChange}
    required
    disabled={locationsLoading || locations.length === 0}
>

    <option value="">
        {locationsLoading
            ? "Loading locations..."
            : "Select your location"}
    </option>

    {locations.map((location) => (

        <option
            key={location.location_id}
            value={location.location_name}
        >
            {location.location_name} ({location.location_type})
        </option>

    ))}

</select>

{locationsError && (
    <p className="form-error">
        {locationsError}
    </p>
)}

                        </div>


                        {/* GROWING CONDITIONS */}

                        <div className="form-section">

                            <h2>
                                 Growing Conditions
                            </h2>

                            <p className="form-description">
                                Provide the conditions available
                                in your growing area.
                            </p>


                            <div className="assessment-grid">


                                {/* SOIL */}

                                <div className="assessment-field">

                                    <label>
                                        Soil Type
                                    </label>

                                    <select
                                        name="soil"
                                        value={form.soil}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select soil type
                                        </option>

                                        <option value="Loam">
                                            Loam
                                        </option>

                                        <option value="Clay">
                                            Clay
                                        </option>

                                        <option value="Sandy">
                                            Sandy
                                        </option>

                                        <option value="Silty">
                                            Silty
                                        </option>

                                    </select>

                                </div>


                                {/* WATER */}

                                <div className="assessment-field">

                                    <label>
                                        Water Availability
                                    </label>

                                    <select
                                        name="water"
                                        value={form.water}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select water availability
                                        </option>

                                        <option value="Low">
                                            Low
                                        </option>

                                        <option value="Moderate">
                                            Moderate
                                        </option>

                                        <option value="High">
                                            High
                                        </option>

                                    </select>

                                </div>


                                {/* SUNLIGHT */}

                                <div className="assessment-field">

                                    <label>
                                        Sunlight
                                    </label>

                                    <select
                                        name="sunlight"
                                        value={form.sunlight}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select sunlight
                                        </option>

                                        <option value="Low">
                                            Low
                                        </option>

                                        <option value="Partial">
                                            Partial Sun
                                        </option>

                                        <option value="Full">
                                            Full Sun
                                        </option>

                                    </select>

                                </div>


                                {/* ENVIRONMENT */}

                                <div className="assessment-field">

                                    <label>
                                        Growing Environment
                                    </label>

                                    <select
                                        name="environment"
                                        value={form.environment}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select environment
                                        </option>

                                        <option value="Open Field">
                                            Open Field
                                        </option>

                                        <option value="Greenhouse">
                                            Greenhouse
                                        </option>

                                        <option value="Container">
                                            Container
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>
                        {/* PLANTING MONTH */}

                        <div className="assessment-field">

                            <label>
                                Intended Planting Month
                            </label>

                            <select
                                name="planting_month"
                                value={form.planting_month}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select planting month
                                </option>

                                {[
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December"
                                ].map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* WEATHER NOTE */}

                        <div className="assessment-note">

                            <span>
                                ️
                            </span>

                            <div>

                                <strong>
                                    Weather is included in the analysis
                                </strong>

                                <p>
                                    Current weather conditions are
                                    considered together with your
                                    growing conditions and crop
                                    requirements when calculating
                                    compatibility.
                                </p>

                            </div>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="assessment-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Analyzing..."
                                : "Analyze Growing Conditions"
                            }

                        </button>

                    </form>


                    {/* ERROR */}

                    {error && (

                        <div className="assessment-error">

                            <span>
                                ️
                            </span>

                            <div>

                                <strong>
                                    Assessment failed
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* RESULTS */}

                {submitted && (

                    <section className="assessment-results">


                        {/* RESULT HEADER */}

                        <div className="results-header">

                            <div>

                                <span className="section-badge">
                                     Results
                                </span>

                                <h2>
                                    Crop Compatibility Results
                                </h2>

                                <p>
                                    Based on the growing conditions
                                    and current weather conditions
                                    available for your selected
                                    location.
                                </p>

                            </div>


                            <div className="results-count">
                                {results.length}

                            <span>
                                {results.length === 1
                                    ? "suitable crop found"
                                    : "suitable crops found"}
                            </span>

                            </div>

                        </div>


                        {/* CURRENT WEATHER SUMMARY */}

                        {currentWeather && (

                            <div className="assessment-weather-summary">

                                <div className="assessment-weather-icon">
                                    ️
                                </div>

                                <div>

                                    <span>
                                        Current Weather
                                    </span>

                                    <strong>
                                        {Math.round(
                                            currentWeather.temperature
                                        )}°C
                                    </strong>

                                    <p>
                                        {currentWeather.weather_description}
                                        {" · "}
                                        Humidity{" "}
                                        {currentWeather.humidity}%
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* NO RESULTS */}

                        {results.length === 0 ? (

                            <div className="no-results">

                                <div className="no-results-icon">
                                    
                                </div>
                                <h3>
                                    No suitable crops found
                                </h3>

                                <p>
                                    Based on the growing conditions you provided,
                                    none of the available crops currently meet
                                    the recommended compatibility level. Try
                                    adjusting your growing conditions or explore
                                    the Crop Catalogue to learn more about
                                    different crops.
                                </p>

                                <Link
                                    href="/crops"
                                    className="no-results-button"
                                >
                                    Explore Crop Catalogue 
                                </Link>

                            </div>

                        ) : (

                            <div className="recommendation-grid">

                                {results.map((crop) => (

                                    <article
                                        className="recommendation-card"
                                        key={crop.crop_id}
                                    >


                                        {/* CROP HEADER */}

                                        <div className="recommendation-top">

                                            <div className="recommendation-icon">
                                                
                                            </div>

                                            <div>

                                                <span className="crop-category">
                                                    {crop.category}
                                                </span>

                                                <h3>
                                                    {crop.crop_name}
                                                </h3>

                                            </div>

                                        </div>


                                        {/* SCORE */}

                                        <div className="compatibility-score">

                                            <strong>
                                                {crop.score}%
                                            </strong>

                                            <span>
                                                Compatibility
                                            </span>

                                        </div>


                                        {/* LEVEL */}

                                        <div
                                            className={`compatibility-level ${
                                                crop.compatibility_level
                                                    .toLowerCase()
                                                    .replaceAll(
                                                        " ",
                                                        "-"
                                                    )
                                            }`}
                                        >

                                            {crop.compatibility_level}

                                        </div>


                                        {/* FACTORS */}

                                        <div className="factor-list">

                                        <div>
                                            <span>Soil</span>
                                            <strong>{crop.factors.soil}%</strong>
                                        </div>

                                        <div>
                                            <span>Water</span>
                                            <strong>{crop.factors.water}%</strong>
                                        </div>

                                        <div>
                                            <span>Sunlight</span>
                                            <strong>{crop.factors.sunlight}%</strong>
                                        </div>

                                        <div>
                                            <span>Environment</span>
                                            <strong>{crop.factors.environment}%</strong>
                                        </div>

                                        <div>
                                            <span>Weather</span>
                                            <strong>{crop.factors.weather}%</strong>
                                        </div>

                                        <div>
                                            <span>Planting Season</span>
                                            <strong>{crop.factors.season}%</strong>
                                        </div>

                                        <div className="location-factor">
                                            <span>Location Suitability</span>
                                            <strong>{crop.factors.location_suitability ?? "N/A"}{crop.factors.location_suitability != null ? "%" : ""}</strong>
                                        </div>

                                        <div>
                                            <span>Flood Compatibility</span>
                                            <strong>{crop.factors.flood ?? "N/A"}{crop.factors.flood != null ? "%" : ""}</strong>
                                        </div>

                                        <div>
                                            <span>Drainage Compatibility</span>
                                            <strong>{crop.factors.drainage ?? "N/A"}{crop.factors.drainage != null ? "%" : ""}</strong>
                                        </div>

                                    </div>

                                        {/* EXPLANATION */}

                                                <div className="recommendation-explanation">

                                    <strong>
                                        Why?
                                    </strong>

                                    <p>
                                        {crop.explanation}
                                    </p>

                                    {crop.planting_season && (
                                        <p>
                                            <strong>Selected planting month:</strong>{" "}
                                            {form.planting_month} — {crop.planting_season}
                                        </p>
                                    )}

                                </div>





                                        {/* ACTIONS */}

                                        <div className="recommendation-actions">

                                            <Link
                                                href={`/crops/${crop.crop_id}`}
                                                className="view-recommendation"
                                            >
                                                View Crop
                                            </Link>
                                    <Link
                                        href={`/plants/plan?crop=${crop.crop_id}`}
                                        className="plan-recommendation"
                                    >
                                        Plan This Plant
                                    </Link>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}

                    </section>

                )}

            </div>

        </section>

    );

}