"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

async function fetchWithAdminAuth(url, options = {}) {
    const token = localStorage.getItem("buildAndBloomToken");

    if (!token) {
        localStorage.removeItem("buildAndBloomUser");
        window.location.href = "/login?reason=session-expired";
        throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem("buildAndBloomToken");
        localStorage.removeItem("buildAndBloomUser");
        window.location.href = "/login?reason=session-expired";
        throw new Error("Your session has expired. Please log in again.");
    }

    return response;
}

export default function PlantingCalendarManagement() {
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [crops, setCrops] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        crop_id: "",
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

        fetchCalendar();
        fetchCrops();
    }, []);

    const handleAddSchedule = async (e) => {
        e.preventDefault();

        setFormError("");
        setSaving(true);

        try {
            const response = await fetchWithAdminAuth(
                editingSchedule
                    ? `${API_URL}/api/planting-calendar/bulk`
                    : `${API_URL}/api/planting-calendar`,
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
                        location_id: null,
                        ...(editingSchedule
                            ? { calendar_ids: editingSchedule.calendar_ids }
                            : {}),
                        crop_id: Number(formData.crop_id),
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

    const groupedCalendar = Object.values(
        calendar.reduce((groups, entry) => {
            const scheduleKey = JSON.stringify([
                entry.crop_id,
                entry.planting_month,
                entry.season,
                entry.growing_period,
                entry.harvest_period,
                entry.notes,
            ].map((value) => String(value ?? "").trim().toLowerCase()));

            if (!groups[scheduleKey]) {
                groups[scheduleKey] = {
                    ...entry,
                    calendar_ids: [],
                    records: [],
                    location_names: new Set(),
                    has_general_entry: false,
                };
            }

            const group = groups[scheduleKey];
            group.calendar_ids.push(entry.calendar_id);
            group.records.push(entry);

            if (entry.location_name) {
                group.location_names.add(entry.location_name);
            } else {
                group.has_general_entry = true;
            }

            if (entry.calendar_id < group.calendar_id) {
                group.calendar_id = entry.calendar_id;
            }

            return groups;
        }, {})
    ).map((group) => ({
        ...group,
        location_names: [...group.location_names].sort((a, b) => a.localeCompare(b)),
    }));

    const filteredCalendar = groupedCalendar.filter((entry) => {
        const searchTerm = search.toLowerCase();

        return (
            entry.crop_name?.toLowerCase().includes(searchTerm) ||
            entry.category?.toLowerCase().includes(searchTerm) ||
            entry.location_names.some((location) =>
                location.toLowerCase().includes(searchTerm)
            ) ||
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
                            Manage general planting schedules by crop and season.
                        </p>
                    </div>

                    <button
    onClick={() => {
        setEditingSchedule(null);

        setFormData({
            crop_id: "",
            planting_month: "",
            season: "",
            growing_period: "",
            harvest_period: "",
            notes: ""
        });

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
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
        }}
    >
        <div
            style={{
                width: "100%",
                maxWidth: "850px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "white",
                borderRadius: "14px",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
            }}
        >
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "22px 25px",
                borderBottom: "1px solid #e5e7eb",
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
                    {editingSchedule
                        ? "Edit Planting Schedule"
                        : "Add Planting Schedule"}
                </h2>

                <p
                    style={{
                        marginTop: "6px",
                        marginBottom: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                    }}
                >
                    {editingSchedule
                        ? "Update this crop and season schedule."
                        : "Add a general planting schedule for a crop."}
                </p>
                {editingSchedule?.has_legacy_locations && (
                    <p
                        style={{
                            marginTop: "6px",
                            marginBottom: 0,
                            color: "#9a6700",
                            fontSize: "13px",
                        }}
                    >
                        This grouped schedule includes older location-specific entries. Saving changes their schedule details while keeping their locations.
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() => {
                    setShowAddForm(false);
                    setEditingSchedule(null);
                    setFormError("");
                }}
                style={{
                    width: "36px",
                    height: "36px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#f3f4f6",
                    color: "#374151",
                    fontSize: "22px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                ×
            </button>
        </div>

        <div
            style={{
                padding: "25px",
            }}
        >
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
                    paddingTop: "20px",
                    borderTop: "1px solid #e5e7eb",
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
                        : editingSchedule
                        ? "Update Schedule"
                        : "Save Schedule"}
                </button>
            </div>
        </form>
        </div>
        </div>
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
                            Schedule Records
                        </div>

                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#166534",
                                marginTop: "5px",
                            }}
                        >
                            {loading ? "..." : groupedCalendar.length}
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
                                      groupedCalendar.map(
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
                            Seasons Covered
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
                                      groupedCalendar
                                          .map((entry) => entry.season?.trim())
                                          .filter(Boolean)
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
                            placeholder="Search crop, month, or season..."
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
                                Crop and Season Schedules
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
                                            Schedule Scope
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
                                                    {entry.has_general_entry
                                                        ? "General"
                                                        : entry.location_names.length > 1
                                                            ? `General (${entry.location_names.length} legacy locations)`
                                                            : entry.location_names.length === 1
                                                                ? `Legacy: ${entry.location_names[0]}`
                                                                : "General"}
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
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingSchedule({
                                                                    ...entry,
                                                                    has_legacy_locations: entry.location_names.length > 0,
                                                                });
                                                                setFormData({
                                                                    crop_id:
                                                                        entry.crop_id || "",
                                                                    planting_month:
                                                                        entry.planting_month || "",
                                                                    season:
                                                                        entry.season || "",
                                                                    growing_period:
                                                                        entry.growing_period || "",
                                                                    harvest_period:
                                                                        entry.harvest_period || "",
                                                                    notes:
                                                                        entry.notes || "",
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

                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                const confirmed =
                                                                    window.confirm(
                                                                        `Delete the planting schedule for ${entry.crop_name}?${entry.calendar_ids.length > 1 ? ` This removes ${entry.calendar_ids.length} duplicate entries from ${entry.location_names.join(", ")}.` : ""}`
                                                                    );

                                                                if (!confirmed) {
                                                                    return;
                                                                }

                                                                try {
                                                                    const response =
                                                                        await fetchWithAdminAuth(
                                                                            `${API_URL}/api/planting-calendar/bulk`,
                                                                            {
                                                                                method: "DELETE",
                                                                                headers: {
                                                                                    "Content-Type": "application/json",
                                                                                    Authorization:
                                                                                        `Bearer ${localStorage.getItem(
                                                                                            "buildAndBloomToken"
                                                                                        )}`,
                                                                                },
                                                                                body: JSON.stringify({
                                                                                    calendar_ids: entry.calendar_ids,
                                                                                }),
                                                                            }
                                                                        );

                                                                    const result =
                                                                        await response.json();

                                                                    if (
                                                                        !response.ok ||
                                                                        !result.success
                                                                    ) {
                                                                        throw new Error(
                                                                            result.message ||
                                                                                "Failed to delete planting schedule."
                                                                        );
                                                                    }

                                                                    const calendarResponse =
                                                                        await fetch(
                                                                            "http://localhost:5000/api/planting-calendar"
                                                                        );

                                                                    const calendarResult =
                                                                        await calendarResponse.json();

                                                                    if (
                                                                        !calendarResponse.ok ||
                                                                        !calendarResult.success
                                                                    ) {
                                                                        throw new Error(
                                                                            "Schedule was deleted, but the calendar could not be refreshed."
                                                                        );
                                                                    }

                                                                    setCalendar(
                                                                        calendarResult.data
                                                                    );

                                                                    alert(
                                                                        "Planting schedule deleted successfully."
                                                                    );
                                                                } catch (error) {
                                                                    console.error(
                                                                        "Failed to delete planting schedule:",
                                                                        error
                                                                    );

                                                                    alert(
                                                                        error.message ||
                                                                            "Failed to delete planting schedule."
                                                                    );
                                                                }
                                                            }}
                                                            style={{
                                                                background: "#dc2626",
                                                                color: "white",
                                                                border: "none",
                                                                padding: "7px 12px",
                                                                borderRadius: "6px",
                                                                cursor: "pointer",
                                                                fontWeight: "600",
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
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