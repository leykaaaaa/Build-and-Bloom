"use client";

import { useEffect, useState } from "react";

import {
    getPlantingCalendarByLocationId
} from "../../services/plantingCalendarService";


const locations = [
    {
        id: 1,
        name: "Dagupan"
    },
    {
        id: 2,
        name: "Lingayen"
    },
    {
        id: 3,
        name: "Urdaneta"
    },
    {
        id: 4,
        name: "Santa Barbara"
    },
    {
        id: 5,
        name: "San Carlos"
    }
];


function getCropIcon(category) {

    const value =
        category?.toLowerCase() || "";

    if (
        value.includes("rice") ||
        value.includes("cereal")
    ) {
        return "";
    }

    if (value.includes("vegetable")) {
        return "";
    }

    if (value.includes("root")) {
        return "";
    }

    if (value.includes("legume")) {
        return "";
    }

    return "";
}


export default function CalendarPage() {

    const [locationId, setLocationId] =
        useState(1);

    const [calendar, setCalendar] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // AUTH CHECK
    // =========================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "buildAndBloomUser"
            );

        if (!storedUser) {

            window.location.href = "/login";

            return;

        }

        try {

            const parsedUser =
                JSON.parse(storedUser);

            if (!parsedUser?.user_id) {

                localStorage.removeItem(
                    "buildAndBloomUser"
                );

                window.location.href = "/login";

            }

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem(
                "buildAndBloomUser"
            );

            window.location.href = "/login";

        }

    }, []);


    // =========================================================
    // LOAD CALENDAR
    // =========================================================

    async function loadCalendar(
        selectedLocationId
    ) {

        setLoading(true);
        setError("");

        try {

            const data =
                await getPlantingCalendarByLocationId(
                    selectedLocationId
                );

            setCalendar(data);

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to load planting calendar."
            );

            setCalendar([]);

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadCalendar(locationId);

    }, [locationId]);


    function handleLocationChange(event) {

        setLocationId(
            Number(event.target.value)
        );

    }


    const selectedLocation =
        locations.find(
            (location) =>
                location.id === locationId
        );


    return (

        <section className="calendar-page">

            <div className="calendar-container">


                {/* HEADER */}

                <div className="calendar-header">

                    <span className="section-badge">
                         Build & Bloom
                    </span>

                    <h1>
                        Planting Calendar
                    </h1>

                    <p>
                        Explore recommended planting schedules
                        based on your growing location in
                        Pangasinan.
                    </p>

                </div>


                {/* LOCATION SELECTOR */}

                <div className="calendar-location">

                    <div>

                        <span>
                             Growing Location
                        </span>

                        <strong>
                            {selectedLocation?.name},
                            {" "}Pangasinan
                        </strong>

                    </div>


                    <select
                        value={locationId}
                        onChange={handleLocationChange}
                    >

                        {locations.map(
                            (location) => (

                                <option
                                    key={location.id}
                                    value={location.id}
                                >
                                    {location.name}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="calendar-error">

                        <span>
                            ️
                        </span>

                        <div>

                            <strong>
                                Unable to load planting calendar
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className="calendar-loading">

                        <span>
                            
                        </span>

                        <p>
                            Loading planting schedules...
                        </p>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    calendar.length === 0 && (

                    <div className="calendar-empty">

                        <span>
                            
                        </span>

                        <h2>
                            No planting schedules found
                        </h2>

                        <p>
                            There are currently no planting
                            schedule records available for
                            {` ${selectedLocation?.name}`}.
                        </p>

                    </div>

                )}


                {/* CALENDAR RESULTS */}

                {!loading &&
                    !error &&
                    calendar.length > 0 && (

                    <section className="calendar-results">

                        <div className="calendar-results-header">

                            <div>

                                <span className="section-badge">
                                    Planting Schedule
                                </span>

                                <h2>
                                    Crops for{" "}
                                    {selectedLocation?.name}
                                </h2>

                            </div>

                            <span className="calendar-count">
                                {calendar.length}{" "}
                                {calendar.length === 1
                                    ? "crop"
                                    : "crops"}
                            </span>

                        </div>


                        <div className="calendar-grid">

                            {calendar.map(
                                (item) => (

                                    <article
                                        className="calendar-card"
                                        key={item.calendar_id}
                                    >

                                        <div className="calendar-card-top">

                                            <div className="calendar-crop-icon">

                                                {getCropIcon(
                                                    item.category
                                                )}

                                            </div>

                                            <div>

                                                <span className="crop-category">
                                                    {item.category}
                                                </span>

                                                <h3>
                                                    {item.crop_name}
                                                </h3>

                                            </div>

                                        </div>


                                        <div className="calendar-details">

                                            <div className="calendar-detail">

                                                <span>
                                                    
                                                </span>

                                                <div>

                                                    <small>
                                                        Planting Period
                                                    </small>

                                                    <strong>
                                                        {item.planting_month ||
                                                            "Not specified"}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="calendar-detail">

                                                <span>
                                                    ️
                                                </span>

                                                <div>

                                                    <small>
                                                        Season
                                                    </small>

                                                    <strong>
                                                        {item.season ||
                                                            "Not specified"}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="calendar-detail">

                                                <span>
                                                    
                                                </span>

                                                <div>

                                                    <small>
                                                        Growing Period
                                                    </small>

                                                    <strong>
                                                        {item.growing_period ||
                                                            "Not specified"}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="calendar-detail">

                                                <span>
                                                    
                                                </span>

                                                <div>

                                                    <small>
                                                        Harvest Period
                                                    </small>

                                                    <strong>
                                                        {item.harvest_period ||
                                                            "Not specified"}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {item.notes && (

                                            <div className="calendar-notes">

                                                <strong>
                                                     Note
                                                </strong>

                                                <p>
                                                    {item.notes}
                                                </p>

                                            </div>

                                        )}

                                    </article>

                                )
                            )}

                        </div>

                    </section>

                )}

            </div>

        </section>

    );

}