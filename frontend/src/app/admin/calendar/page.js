"use client";

import { useEffect, useState } from "react";

export default function PlantingCalendarManagement() {
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [crops, setCrops] = useState([]);
    const [locations, setLocations] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        crop_id: "",
        location_id: "",
        planting_month: "",
        season: "",
        growing_period: "",
        harvest_period: "",
        notes: ""
    });
    const [editingSchedule, setEditingSchedule] = useState(null);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/planting-calendar"
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                            "Failed to retrieve planting calendar."
                    );
                }

                setCalendar(result.data);
            } catch (error) {
                console.error(
                    "Failed to fetch planting calendar:",
                    error
                );

                setError(
                    "Unable to load planting calendar data. Please make sure the backend server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        const fetchCrops = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/crops"
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                            "Failed to retrieve crops."
                    );
                }

                setCrops(result.data);
            } catch (error) {
                console.error(
                    "Failed to fetch crops:",
                    error
                );
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/locations"
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                            "Failed to retrieve locations."
                    );
                }

                setLocations(result.data);
            } catch (error) {
                console.error(
                    "Failed to fetch locations:",
                    error
                );
            }
        };

        fetchCalendar();
        fetchCrops();
        fetchLocations();
    }, []);

    const handleAddSchedule = async (e) => {
        e.preventDefault();

        setFormError("");
        setSaving(true);

        try {
            const response = await fetch(
                editingSchedule
                    ? `http://localhost:5000/api/planting-calendar/${editingSchedule.calendar_id}`
                    : "http://localhost:5000/api/planting-calendar",
                {
                    method: editingSchedule
                        ? "PUT"
                        : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "buildAndBloomToken"
                        )}`,
                    },
                    body: JSON.stringify({
                        crop_id: Number(formData.crop_id),
                        location_id: Number(formData.location_id),
                        planting_month:
                            formData.planting_month,
                        season: formData.season,
                        growing_period:
                            formData.growing_period,
                        harvest_period:
                            formData.harvest_period,
                        notes: formData.notes,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to create planting schedule."
                );
            }

            // Refresh calendar records
            const calendarResponse = await fetch(
                "http://localhost:5000/api/planting-calendar"
            );

            const calendarResult =
                await calendarResponse.json();

            if (
                !calendarResponse.ok ||
                !calendarResult.success
            ) {
                throw new Error(
                    `Schedule was ${editingSchedule ? "updated" : "created"}, but the calendar could not be refreshed.`
                );
            }

            setCalendar(calendarResult.data);

            // Reset form
            setFormData({
                crop_id: "",
                location_id: "",
                planting_month: "",
                season: "",
                growing_period: "",
                harvest_period: "",
                notes: ""
            });

            setShowAddForm(false);
            setEditingSchedule(null);

            alert(
                editingSchedule
                    ? "Planting schedule updated successfully."
                    : "Planting schedule added successfully."
            );

        } catch (error) {
            console.error(
                "Failed to save planting schedule:",
                error
            );

            setFormError(
                error.message ||
                    `Failed to ${editingSchedule ? "update" : "create"} planting schedule.`
            );

        } finally {
            setSaving(false);
        }
    };

    const filteredCalendar = calendar.filter((entry) => {
        const searchTerm = search.toLowerCase();

        return (
            entry.crop_name?.toLowerCase().includes(searchTerm) ||
            entry.location_name?.toLowerCase().includes(searchTerm) ||
            entry.category?.toLowerCase().includes(searchTerm) ||
            entry.planting_month
                ?.toLowerCase()
                .includes(searchTerm) ||
            entry.season?.toLowerCase().includes(searchTerm)
        );
    });

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
                    maxWidth: "1300px",
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
                            Planting Calendar
                        </h1>

                        <p
                            style={{
                                marginTop: "8px",
                                color: "#6b7280",
                            }}
                        >
                            Manage planting schedules for crops and
                            Pangasinan locations.
                        </p>
                    </div>

                    <button
    onClick={() => {
        setFormError("");
        setShowAddForm(true);
    }}
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
    + Add Schedule
</button>
                </div>

                {showAddForm && (
    <div
        style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "25px",
            marginBottom: "25px",
        }}
    >
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
            }}
        >
            <div>
                <h2
                    style={{
                        margin: 0,
                        fontSize: "20px",
                        color: "#1f2937",
                    }}
                >
                    Add Planting Schedule
                </h2>

                <p
                    style={{
                        marginTop: "6px",
                        marginBottom: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                    }}
                >
                    Add planting schedule information for a
                    crop and Pangasinan location.
                </p>
            </div>

            <button
                type="button"
                onClick={() => {
                    setShowAddForm(false);
                    setEditingSchedule(null);
                    setFormError("");
                }}
                style={{
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                }}
            >
                Cancel
            </button>
        </div>

        {formError && (
            <div
                style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                }}
            >
                {formError}
            </div>
        )}

        <form onSubmit={handleAddSchedule}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "18px",
                }}
            >
                {/* Crop */}
                <div>
                    <label style={labelStyle}>
                        Crop *
                    </label>

                    <select
                        value={formData.crop_id}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                crop_id: e.target.value,
                            })
                        }
                        required
                        style={inputStyle}
                    >
                        <option value="">
                            Select Crop
                        </option>

                        {crops.map((crop) => (
                            <option
                                key={crop.crop_id}
                                value={crop.crop_id}
                            >
                                {crop.crop_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label style={labelStyle}>
                        Location *
                    </label>

                    <select
                        value={formData.location_id}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                location_id: e.target.value,
                            })
                        }
                        required
                        style={inputStyle}
                    >
                        <option value="">
                            Select Location
                        </option>

                        {locations.map((location) => (
                            <option
                                key={location.location_id}
                                value={location.location_id}
                            >
                                {location.location_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Planting Month */}
                <div>
                    <label style={labelStyle}>
                        Planting Month
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. June"
                        value={formData.planting_month}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                planting_month:
                                    e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                {/* Season */}
                <div>
                    <label style={labelStyle}>
                        Season
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Wet Season"
                        value={formData.season}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                season: e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                {/* Growing Period */}
                <div>
                    <label style={labelStyle}>
                        Growing Period
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. 3-4 months"
                        value={formData.growing_period}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                growing_period:
                                    e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                {/* Harvest Period */}
                <div>
                    <label style={labelStyle}>
                        Harvest Period
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. September-October"
                        value={formData.harvest_period}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                harvest_period:
                                    e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                {/* Notes */}
                <div
                    style={{
                        gridColumn: "1 / -1",
                    }}
                >
                    <label style={labelStyle}>
                        Notes
                    </label>

                    <textarea
                        placeholder="Optional notes about this planting schedule..."
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                notes: e.target.value,
                            })
                        }
                        rows={4}
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "22px",
                }}
            >
                <button
                    type="button"
                    onClick={() => {
                        setShowAddForm(false);
                        setEditingSchedule(null);
                        setFormError("");
                    }}
                    style={{
                        background: "#f3f4f6",
                        color: "#374151",
                        border: "none",
                        padding: "11px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        background: saving
                            ? "#9ca3af"
                            : "#166534",
                        color: "white",
                        border: "none",
                        padding: "11px 18px",
                        borderRadius: "8px",
                        cursor: saving
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: "600",
                    }}
                >
                    {saving
                        ? "Saving..."
                        : "Save Schedule"}
                </button>
            </div>
        </form>
    </div>
)}

                {/* Summary */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginBottom: "25px",
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "20px",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <div
                            style={{
                                color: "#6b7280",
                                fontSize: "14px",
                            }}
                        >
                            Calendar Records
                        </div>

                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#166534",
                                marginTop: "5px",
                            }}
                        >
                            {loading ? "..." : calendar.length}
                        </div>
                    </div>

                    <div
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "20px",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <div
                            style={{
                                color: "#6b7280",
                                fontSize: "14px",
                            }}
                        >
                            Crops in Calendar
                        </div>

                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#166534",
                                marginTop: "5px",
                            }}
                        >
                            {loading
                                ? "..."
                                : new Set(
                                      calendar.map(
                                          (entry) => entry.crop_id
                                      )
                                  ).size}
                        </div>
                    </div>

                    <div
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "20px",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <div
                            style={{
                                color: "#6b7280",
                                fontSize: "14px",
                            }}
                        >
                            Locations Covered
                        </div>

                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#166534",
                                marginTop: "5px",
                            }}
                        >
                            {loading
                                ? "..."
                                : new Set(
                                      calendar.map(
                                          (entry) => entry.location_id
                                      )
                                  ).size}
                        </div>
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
                            placeholder="Search crop, location, month, or season..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
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
                        Loading planting calendar...
                    </div>
                )}

                {/* Calendar Table */}
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
                                Planting Calendar Database
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
                                        <th style={thStyle}>
                                            ID
                                        </th>

                                        <th style={thStyle}>
                                            Crop
                                        </th>

                                        <th style={thStyle}>
                                            Category
                                        </th>

                                        <th style={thStyle}>
                                            Location
                                        </th>

                                        <th style={thStyle}>
                                            Planting Month
                                        </th>

                                        <th style={thStyle}>
                                            Season
                                        </th>

                                        <th style={thStyle}>
                                            Growing Period
                                        </th>

                                        <th style={thStyle}>
                                            Harvest Period
                                        </th>

                                        <th style={thStyle}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredCalendar.map(
                                        (entry) => (
                                            <tr
                                                key={
                                                    entry.calendar_id
                                                }
                                            >
                                                <td style={tdStyle}>
                                                    {
                                                        entry.calendar_id
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight:
                                                            "600",
                                                        color:
                                                            "#166534",
                                                    }}
                                                >
                                                    {
                                                        entry.crop_name
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        entry.category ||
                                                        "—"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        entry.location_name
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        entry.planting_month ||
                                                        "—"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        entry.season ||
                                                        "—"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        entry.growing_period ||
                                                        "—"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        entry.harvest_period ||
                                                        "—"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingSchedule(entry);
                                                            setFormData({
                                                                crop_id: entry.crop_id || "",
                                                                location_id:
                                                                    entry.location_id || "",
                                                                planting_month:
                                                                    entry.planting_month || "",
                                                                season: entry.season || "",
                                                                growing_period:
                                                                    entry.growing_period || "",
                                                                harvest_period:
                                                                    entry.harvest_period || "",
                                                                notes: entry.notes || "",
                                                            });
                                                            setFormError("");
                                                            setShowAddForm(true);
                                                        }}
                                                        style={{
                                                            background: "#166534",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "7px 12px",
                                                            borderRadius: "6px",
                                                            cursor: "pointer",
                                                            fontWeight: "600",
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredCalendar.length === 0 && (
                            <div
                                style={{
                                    padding: "30px",
                                    textAlign: "center",
                                    color: "#6b7280",
                                }}
                            >
                                No planting calendar records
                                found.
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

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
};

const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "white",
    color: "#374151",
};