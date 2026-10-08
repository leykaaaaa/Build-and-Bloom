"use client";

import { useEffect, useState } from "react";

export default function LocationManagement() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/locations"
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to retrieve locations."
                    );
                }

                setLocations(result.data);
            } catch (error) {
                console.error("Failed to fetch locations:", error);

                setError(
                    "Unable to load location data. Please make sure the backend server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const filteredLocations = locations.filter((location) =>
        location.location_name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8faf9",
                padding: "30px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                color: "#1f2937",
                                fontSize: "30px",
                            }}
                        >
                            Location Management
                        </h1>

                        <p
                            style={{
                                marginTop: "8px",
                                color: "#6b7280",
                            }}
                        >
                            Manage the Pangasinan locations used by the system.
                        </p>
                    </div>

                    <button
                        style={{
                            background: "#166534",
                            color: "white",
                            border: "none",
                            padding: "12px 18px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        + Add Location
                    </button>
                </div>

                {/* Summary */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "25px",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        style={{
                            color: "#6b7280",
                            fontSize: "14px",
                        }}
                    >
                        Total Pangasinan Locations
                    </div>

                    <div
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#166534",
                            marginTop: "5px",
                        }}
                    >
                        {loading ? "..." : locations.length}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "15px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Search */}
                {!loading && !error && (
                    <div
                        style={{
                            background: "white",
                            padding: "18px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            marginBottom: "20px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                fontSize: "14px",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div
                        style={{
                            background: "white",
                            padding: "30px",
                            borderRadius: "12px",
                            textAlign: "center",
                            color: "#6b7280",
                        }}
                    >
                        Loading location data...
                    </div>
                )}

                {/* Location Table */}
                {!loading && !error && (
                    <div
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "20px",
                                borderBottom: "1px solid #e5e7eb",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    color: "#1f2937",
                                }}
                            >
                                Pangasinan Location Database
                            </h2>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            background: "#f9fafb",
                                        }}
                                    >
                                        <th style={thStyle}>ID</th>
                                        <th style={thStyle}>Location</th>
                                        <th style={thStyle}>Type</th>
                                        <th style={thStyle}>Province</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredLocations.map((location) => (
                                        <tr key={location.location_id}>
                                            <td style={tdStyle}>
                                                {location.location_id}
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight: "600",
                                                    color: "#166534",
                                                }}
                                            >
                                                {location.location_name}
                                            </td>

                                            <td style={tdStyle}>
                                                {location.location_type || "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {location.province || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredLocations.length === 0 && (
                            <div
                                style={{
                                    padding: "30px",
                                    textAlign: "center",
                                    color: "#6b7280",
                                }}
                            >
                                No locations found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const thStyle = {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
};

const tdStyle = {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
};