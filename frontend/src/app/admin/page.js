"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
    const [totalCrops, setTotalCrops] = useState(0);
    const [loadingCrops, setLoadingCrops] = useState(true);

    const [totalUsers, setTotalUsers] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [totalCalendarRecords, setTotalCalendarRecords] = useState(0);
    const [loadingCalendar, setLoadingCalendar] = useState(true);

    useEffect(() => {
        const fetchCalendarCount = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/planting-calendar"
                );

                const result = await response.json();

                if (result.success) {
                    setTotalCalendarRecords(
                        result.data.length
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to fetch planting calendar count:",
                    error
                );
            } finally {
                setLoadingCalendar(false);
            }
        };

        fetchCalendarCount();
    }, []);

    useEffect(() => {
        const fetchCropCount = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/crops"
                );

                const result = await response.json();

                if (result.success) {
                    setTotalCrops(result.count);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch crop count:",
                    error
                );
            } finally {
                setLoadingCrops(false);
            }
        };

        fetchCropCount();
    }, []);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/users"
                );

                const result = await response.json();

                if (result.success) {
                    setTotalUsers(result.count);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch user count:",
                    error
                );
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUserCount();
    }, []);

    return (
        <div style={styles.container}>

            {/* Dashboard Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        Admin Dashboard
                    </h1>

                    <p style={styles.subtitle}>
                        Manage the data and features of
                        Build & Bloom.
                    </p>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div style={styles.cards}>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>
                        Total Crops
                    </p>

                    <h2 style={styles.cardNumber}>
                        {loadingCrops
                            ? "..."
                            : totalCrops}
                    </h2>

                    <p style={styles.cardDescription}>
                        Crops currently in the system
                    </p>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>
                        Total Locations
                    </p>

                    <h2 style={styles.cardNumber}>
                        48
                    </h2>

                    <p style={styles.cardDescription}>
                        Pangasinan locations
                    </p>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>
                        Registered Users
                    </p>

                    <h2 style={styles.cardNumber}>
                        {loadingUsers
                            ? "..."
                            : totalUsers}
                    </h2>

                    <p style={styles.cardDescription}>
                        Users currently registered
                    </p>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>
                        Planting Calendar
                    </p>

                    <h2 style={styles.cardNumber}>
                        {loadingCalendar
                            ? "..."
                            : totalCalendarRecords}
                    </h2>

                    <p style={styles.cardDescription}>
                        Calendar records in the system
                    </p>
                </div>

                <div style={styles.card}>
                    <p style={styles.cardLabel}>
                        Weather API
                    </p>

                    <h2 style={styles.cardNumber}>
                        Active
                    </h2>

                    <p style={styles.cardDescription}>
                        OpenWeather integration
                    </p>
                </div>

            </div>

            {/* System Overview */}
            <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    System Overview
                </h2>

                <div style={styles.overview}>

                    <div>
                        <h3>
                            Crop Recommendation Engine
                        </h3>

                        <p>
                            The recommendation engine uses
                            crop requirements, location
                            information, weather conditions,
                            planting season, and other
                            compatibility factors to generate
                            crop recommendations.
                        </p>
                    </div>

                    <div>
                        <h3>
                            Dataset Management
                        </h3>

                        <p>
                            Administrators can manage the
                            agricultural data used by the
                            system, including crops,
                            requirements, locations, and
                            planting calendar information.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        boxSizing: "border-box",
    },

    header: {
        marginBottom: "30px",
    },

    title: {
        margin: 0,
        fontSize: "32px",
        fontWeight: "700",
        color: "#1f2937",
    },

    subtitle: {
        marginTop: "8px",
        color: "#6b7280",
        fontSize: "15px",
    },

    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(5, minmax(0, 1fr))",
        gap: "20px",
        marginBottom: "30px",
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "22px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #f1f5f9",
        boxSizing: "border-box",
    },

    cardLabel: {
        margin: 0,
        color: "#6b7280",
        fontSize: "14px",
    },

    cardNumber: {
        margin: "10px 0",
        fontSize: "28px",
        color: "#1f5134",
    },

    cardDescription: {
        margin: 0,
        color: "#9ca3af",
        fontSize: "13px",
        lineHeight: "1.4",
    },

    section: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "25px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #f1f5f9",
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "20px",
        fontSize: "20px",
        color: "#1f2937",
    },

    overview: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
    },
};