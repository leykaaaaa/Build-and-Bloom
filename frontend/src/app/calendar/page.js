"use client";

import { useEffect, useState } from "react";

import {
    getPlantingCalendar
} from "../../services/plantingCalendarService";


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


    // Load all schedules so the calendar can show a general guide.
    // =========================================================
    useEffect(() => {
        async function loadCalendar() {
            try {
                const data = await getPlantingCalendar();
                setCalendar(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError(
                    err.message ||
                    "Unable to load planting calendar."
                );
            } finally {
                setLoading(false);
            }
        }

        loadCalendar();
    }, []);

    const scheduleGroups = Object.values(
        calendar.reduce((seasons, item) => {
            const season = item.season?.trim() || "Season not specified";
            const scheduleKey = [
                item.crop_id,
                item.planting_month?.trim().toLowerCase() || "",
                item.growing_period?.trim().toLowerCase() || "",
                item.harvest_period?.trim().toLowerCase() || "",
                season.toLowerCase(),
            ].join("|");

            if (!seasons[season]) {
                seasons[season] = {
                    name: season,
                    crops: {},
                };
            }

            if (!seasons[season].crops[item.crop_id]) {
                seasons[season].crops[item.crop_id] = {
                    crop_id: item.crop_id,
                    crop_name: item.crop_name,
                    category: item.category,
                    schedules: {},
                };
            }

            if (!seasons[season].crops[item.crop_id].schedules[scheduleKey]) {
                seasons[season].crops[item.crop_id].schedules[scheduleKey] = {
                    planting_month: item.planting_month,
                    growing_period: item.growing_period,
                    harvest_period: item.harvest_period,
                    notes: new Set(),
                };
            }

            if (item.notes?.trim()) {
                seasons[season].crops[item.crop_id].schedules[scheduleKey].notes.add(item.notes.trim());
            }

            return seasons;
        }, {})
    )
        .sort((first, second) => first.name.localeCompare(second.name))
        .map((season) => ({
            ...season,
            crops: Object.values(season.crops)
                .map((crop) => ({
                    ...crop,
                    schedules: Object.values(crop.schedules).map((schedule) => ({
                        ...schedule,
                        notes: [...schedule.notes],
                    })),
                }))
                .sort((first, second) => first.crop_name.localeCompare(second.crop_name)),
        }));

    const cropCount = new Set(
        calendar.map((item) => item.crop_id)
    ).size;


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
                        Explore general planting guidance for Pangasinan, organized
                        by season and crop.
                    </p>

                </div>


                <div className="calendar-overview">
                    <strong>General planting guide</strong>
                    <span>Use these schedules as a starting point; actual timing can vary with local conditions.</span>
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
                            There are currently no planting schedule records available.
                        </p>

                    </div>

                )}


                {/* CALENDAR RESULTS */}

                {!loading &&
                    !error &&
                    scheduleGroups.length > 0 && (

                    <section className="calendar-results">

                        <div className="calendar-results-header">

                            <div>

                                <span className="section-badge">
                                    Planting Schedule
                                </span>

                                <h2>
                                    Planting by season
                                </h2>

                            </div>

                            <span className="calendar-count">
                                {cropCount}{" "}
                                {cropCount === 1 ? "crop" : "crops"}
                            </span>

                        </div>


                        {scheduleGroups.map((group) => (
                            <section className="calendar-season" key={group.name}>
                                <div className="calendar-season-header">
                                    <h3>{group.name}</h3>
                                    <span>
                                        {group.crops.length} {group.crops.length === 1 ? "crop" : "crops"}
                                    </span>
                                </div>

                                <div className="calendar-grid">
                                    {group.crops.map((crop) => (
                                        <article
                                            className="calendar-card"
                                            key={`${group.name}-${crop.crop_id}`}
                                        >

                                            <div className="calendar-card-top">
                                                <div className="calendar-crop-icon">
                                                    {getCropIcon(crop.category)}
                                                </div>
                                                <div>
                                                    <span className="crop-category">
                                                        {crop.category}
                                                    </span>
                                                    <h4>{crop.crop_name}</h4>
                                                </div>
                                            </div>

                                            <div className="calendar-schedule-list">
                                                {crop.schedules.map((schedule, index) => (
                                                    <div className="calendar-schedule" key={`${schedule.planting_month}-${index}`}>
                                                        <div className="calendar-details">
                                                            <div className="calendar-detail">
                                                                <span aria-hidden="true"></span>
                                                                <div>
                                                                    <small>Planting Period</small>
                                                                    <strong>{schedule.planting_month || "Not specified"}</strong>
                                                                </div>
                                                            </div>

                                                            <div className="calendar-detail">
                                                                <span aria-hidden="true"></span>
                                                                <div>
                                                                    <small>Growing Period</small>
                                                                    <strong>{schedule.growing_period || "Not specified"}</strong>
                                                                </div>
                                                            </div>

                                                            <div className="calendar-detail">
                                                                <span aria-hidden="true"></span>
                                                                <div>
                                                                    <small>Harvest Period</small>
                                                                    <strong>{schedule.harvest_period || "Not specified"}</strong>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {schedule.notes.length > 0 && (
                                                            <div className="calendar-notes">
                                                                <strong>Notes</strong>
                                                                <p>{schedule.notes.join(" ")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}

                    </section>

                )}

            </div>

        </section>

    );

}