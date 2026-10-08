
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    getPlantingPlans,
    getPlantingPlanAdvisories,
    updatePlantingPlanStatus
} from "../../services/plantingPlanService";

const statusOptions = [
    "Planned",
    "Growing",
    "Harvested",
    "Completed"
];

export default function MyPlantsPage() {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [advisoryLoadError, setAdvisoryLoadError] = useState("");
    const [updatingPlanId, setUpdatingPlanId] = useState(null);

    useEffect(() => {

        async function loadPlans() {

            try {

                const storedUser = localStorage.getItem(
                    "buildAndBloomUser"
                );

                if (!storedUser) {
                    router.push("/login");
                    return;
                }

                const parsedUser = JSON.parse(storedUser);

                if (!parsedUser.user_id) {
                    setError(
                        "Unable to identify your account. Please log in again."
                    );
                    setLoading(false);
                    return;
                }

                setUser(parsedUser);

                // Retrieve all planting plans first.
                const planData = await getPlantingPlans(
                    parsedUser.user_id
                );

                const allPlans = Array.isArray(planData)
                    ? planData
                    : [];

                // Retrieve advisories separately so that a weather
                // service problem does not hide the user's plant plans.
                try {

                    const advisoryResponse =
                        await getPlantingPlanAdvisories(
                            parsedUser.user_id
                        );

                    const advisoryPlans = Array.isArray(advisoryResponse)
                        ? advisoryResponse
                        : advisoryResponse?.data || [];

                    // Match advisories to their corresponding plans.
                    const advisoryMap = new Map(
                        advisoryPlans.map((item) => [
                            item.plan_id,
                            item
                        ])
                    );

                    const mergedPlans = allPlans.map((plan) => {

                        const advisoryData = advisoryMap.get(
                            plan.plan_id
                        );

                        return {
                            ...plan,
                            current_weather:
                                advisoryData?.current_weather || null,
                            advisories:
                                advisoryData?.advisories || [],
                            advisory_error:
                                advisoryData?.advisory_error || null,
                            advisory_message:
                                advisoryData?.advisory_message || null
                        };

                    });

                    setPlans(mergedPlans);

                } catch (advisoryError) {

                    console.error(
                        "Unable to load crop advisories:",
                        advisoryError
                    );

                    setAdvisoryLoadError(
                        "Weather-based advisories are currently unavailable. Your planting plans are still accessible."
                    );

                    setPlans(
                        allPlans.map((plan) => ({
                            ...plan,
                            current_weather: null,
                            advisories: [],
                            advisory_error:
                                "Unable to retrieve weather advisories."
                        }))
                    );

                }

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Unable to load your planting plans."
                );

            } finally {

                setLoading(false);

            }

        }

        loadPlans();

    }, [router]);


    /*
        UPDATE PLANTING PLAN STATUS
    */

    async function handleStatusChange(planId, newStatus) {

        if (!user?.user_id) {
            return;
        }

        try {

            setUpdatingPlanId(planId);
            setError("");

            await updatePlantingPlanStatus(
                planId,
                user.user_id,
                newStatus
            );

            setPlans((currentPlans) =>
                currentPlans.map((plan) =>
                    plan.plan_id === planId
                        ? {
                            ...plan,
                            status: newStatus
                        }
                        : plan
                )
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to update planting plan status."
            );

        } finally {

            setUpdatingPlanId(null);

        }

    }


    /*
        ADVISORY PRIORITY CLASS
    */

    function getPriorityClass(priority) {

        switch (priority?.toLowerCase()) {

            case "high":
                return "advisory-priority-high";

            case "warning":
                return "advisory-priority-warning";

            case "info":
                return "advisory-priority-info";

            default:
                return "advisory-priority-default";

        }

    }


    /*
        LOADING STATE
    */

    if (loading) {

        return (

            <section className="plants-page">

                <div className="plants-container">

                    <div className="catalogue-state">

                        <p>
                            Loading your planting plans...
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    return (

        <section className="plants-page">

            <div className="plants-container">

                {/* HEADER */}

                <div className="plants-header">

                    <div>

                        <span className="section-badge">
                            Build & Bloom
                        </span>

                        <h1>
                            My Plants
                        </h1>

                        <p>
                            Keep track of the crops you plan
                            to grow and manage your planting
                            activities.
                        </p>

                    </div>

                    <Link
                        href="/crops"
                        className="create-plant-button"
                    >
                        + Plan a Plant
                    </Link>

                </div>


                {/* GENERAL ERROR */}

                {error && (

                    <div className="assessment-error">

                        <div>

                            <strong>
                                Unable to load or update plans
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* ADVISORY LOADING ERROR */}

                {advisoryLoadError && (

                    <div className="advisory-load-error">

                        <strong>
                            Weather Advisory Notice
                        </strong>

                        <p>
                            {advisoryLoadError}
                        </p>

                    </div>

                )}


                {/* EMPTY STATE */}

                {!error && plans.length === 0 && (

                    <div className="plants-empty">

                        <div className="plants-empty-icon">
                        </div>

                        <h2>
                            No planting plans yet
                        </h2>

                        <p>
                            Start by exploring the crop catalogue
                            and create your first planting plan.
                        </p>

                        <Link
                            href="/crops"
                            className="assessment-submit"
                        >
                            Explore Crops
                        </Link>

                    </div>

                )}


                {/* PLANTING PLANS */}

                {plans.length > 0 && (

                    <div className="plants-grid">

                        {plans.map((plan) => (

                            <article
                                className="plant-plan-card"
                                key={plan.plan_id}
                            >

                                {/* CARD HEADER */}

                                <div className="plant-plan-top">

                                    <div className="plant-plan-icon">
                                    </div>

                                    <div>

                                        <span>
                                            {plan.category}
                                        </span>

                                        <h2>
                                            {plan.plan_name}
                                        </h2>

                                    </div>

                                </div>


                                {/* CROP */}

                                <div className="plant-plan-crop">

                                    <strong>
                                        {plan.crop_name}
                                    </strong>

                                </div>


                                {/* PLANT DETAILS */}

                                <div className="plant-plan-details">

                                    <div>

                                        <span>
                                            Location
                                        </span>

                                        <strong>
                                            {plan.location_name ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Planting Date
                                        </span>

                                        <strong>
                                            {plan.planting_date
                                                ? new Date(
                                                    plan.planting_date
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    }
                                                )
                                                : "Not specified"}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Growing Method
                                        </span>

                                        <strong>
                                            {plan.growing_method ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Quantity
                                        </span>

                                        <strong>
                                            {plan.quantity ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                </div>


                                {/* CURRENT WEATHER */}

                                {plan.current_weather && (

                                    <div className="plant-weather-section">

                                        <h3>
                                            Current Weather
                                        </h3>

                                        <div className="plant-weather-grid">

                                            <div>
                                                <span>
                                                    Temperature
                                                </span>

                                                <strong>
                                                    {Number(
                                                        plan.current_weather.temperature
                                                    ).toFixed(1)}°C
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Humidity
                                                </span>

                                                <strong>
                                                    {plan.current_weather.humidity}%
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Condition
                                                </span>

                                                <strong>
                                                    {plan.current_weather.weather_description ||
                                                        plan.current_weather.weather_condition}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Rainfall
                                                </span>

                                                <strong>
                                                    {plan.current_weather.rainfall} mm
                                                </strong>
                                            </div>

                                        </div>

                                    </div>

                                )}


                                {/* CROP-SPECIFIC ADVISORIES */}

                                <div className="plant-advisory-section">

                                    <div className="plant-advisory-heading">

                                        <div>

                                            <span>
                                                SMART PLANT CARE
                                            </span>

                                            <h3>
                                                Crop Care Advisories
                                            </h3>

                                        </div>

                                    </div>


                                    {plan.advisory_message && (

                                        <div className="plant-advisory-empty">
                                            {plan.advisory_message}
                                        </div>

                                    )}


                                    {plan.advisory_error && (

                                        <div className="plant-advisory-empty">
                                            {plan.advisory_error}
                                        </div>

                                    )}


                                    {!plan.advisory_message &&
                                        !plan.advisory_error &&
                                        plan.advisories?.length === 0 && (

                                        <div className="plant-advisory-empty">

                                            {["Harvested", "Completed"].includes(
                                                plan.status
                                            )
                                                ? "This planting plan is completed. Weather-based advisories are no longer generated."
                                                : "No crop-specific advisories are currently available."}

                                        </div>

                                    )}


                                    {plan.advisories?.length > 0 && (

                                        <div className="plant-advisory-list">

                                            {plan.advisories.map(
                                                (advisory, index) => (

                                                    <div
                                                        className={`plant-advisory-card ${getPriorityClass(
                                                            advisory.priority
                                                        )}`}
                                                        key={`${plan.plan_id}-${advisory.type}-${index}`}
                                                    >

                                                        <div className="plant-advisory-card-header">

                                                            <strong>
                                                                {advisory.title}
                                                            </strong>

                                                            <span className="plant-advisory-priority">
                                                                {advisory.priority}
                                                            </span>

                                                        </div>

                                                        <p>
                                                            {advisory.message}
                                                        </p>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>


                                {/* STATUS */}

                                <div className="plant-plan-status-section">

                                    <div>

                                        <span className="plant-status-label">
                                            Plant Status
                                        </span>

                                        <select
                                            value={
                                                plan.status ||
                                                "Planned"
                                            }
                                            disabled={
                                                updatingPlanId ===
                                                plan.plan_id
                                            }
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    plan.plan_id,
                                                    event.target.value
                                                )
                                            }
                                            className="plant-status-select"
                                        >

                                            {statusOptions.map(
                                                (status) => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {updatingPlanId ===
                                        plan.plan_id && (

                                        <span className="plant-status-saving">
                                            Saving...
                                        </span>

                                    )}

                                </div>


                                {/* FOOTER */}

                                <div className="plant-plan-footer">

                                    <span
                                        className={`plant-status status-${(
                                            plan.status ||
                                            "Planned"
                                        )
                                            .toLowerCase()
                                            .replaceAll(" ", "-")}`}
                                    >
                                        {plan.status ||
                                            "Planned"}
                                    </span>

                                    <span className="plant-plan-id">
                                        Plan #{plan.plan_id}
                                    </span>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

}