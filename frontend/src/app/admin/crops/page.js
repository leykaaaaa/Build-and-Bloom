"use client";

import { useEffect, useState } from "react";

export default function CropManagement() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);
const [saving, setSaving] = useState(false);
const [formError, setFormError] = useState("");
const [deleteError, setDeleteError] = useState("");
const [deletingCropId, setDeletingCropId] = useState(null);

const [formData, setFormData] = useState({
    crop_name: "",
    category: "",
    description: "",
    growing_period: "",
    harvest_period: "",
    soil_type: "",
    water_requirement: "",
    sunlight_requirement: "",
    min_temperature: "",
    max_temperature: "",
    season: "",
    environment: ""
});

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/crops"
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to retrieve crops."
                    );
                }

                setCrops(result.data);
            } catch (error) {
                console.error("Failed to fetch crops:", error);
                setError(
                    "Unable to load crop data. Please make sure the backend server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCrops();
    }, []);


    const handleSaveCrop = async () => {
    setFormError("");
    setSaving(true);

    try {
        const token = localStorage.getItem(
            "buildAndBloomToken"
        );

        if (!token) {
            throw new Error(
                "Authentication token not found. Please log in again."
            );
        }

        const response = await fetch(
            editingCrop
                ? `http://localhost:5000/api/crops/${editingCrop.crop_id}`
                : "http://localhost:5000/api/crops",
            {
                method: editingCrop ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("buildAndBloomToken")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    min_temperature: Number(formData.min_temperature),
                    max_temperature: Number(formData.max_temperature),
                }),
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "Failed to create crop."
            );
        }

        // Refresh crop table
        const cropsResponse = await fetch(
            "http://localhost:5000/api/crops"
        );

        const cropsResult =
            await cropsResponse.json();

        if (
            cropsResponse.ok &&
            cropsResult.success
        ) {
            setCrops(cropsResult.data);
        }

        // Reset form
        setFormData({
            crop_name: "",
            category: "",
            description: "",
            growing_period: "",
            harvest_period: "",
            soil_type: "",
            water_requirement: "",
            sunlight_requirement: "",
            min_temperature: "",
            max_temperature: "",
            season: "",
            environment: ""
        });

        setShowAddForm(false);
        setEditingCrop(null);

    } catch (error) {
        console.error(
            "Failed to create crop:",
            error
        );

        setFormError(
            error.message ||
            "Failed to create crop."
        );

    } finally {
        setSaving(false);
    }
};

const handleDeleteCrop = async (crop) => {
    if (!window.confirm(`Delete ${crop.crop_name}? This action cannot be undone.`)) {
        return;
    }

    setDeleteError("");
    setDeletingCropId(crop.crop_id);

    try {
        const token = localStorage.getItem("buildAndBloomToken");

        if (!token) {
            throw new Error(
                "Authentication token not found. Please log in again."
            );
        }

        const response = await fetch(
            `http://localhost:5000/api/crops/${crop.crop_id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to delete crop.");
        }

        setCrops((currentCrops) =>
            currentCrops.filter(
                (currentCrop) => currentCrop.crop_id !== crop.crop_id
            )
        );
    } catch (error) {
        console.error("Failed to delete crop:", error);
        setDeleteError(error.message || "Failed to delete crop.");
    } finally {
        setDeletingCropId(null);
    }
};

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
                            Crop Management
                        </h1>

                        <p
                            style={{
                                marginTop: "8px",
                                color: "#6b7280",
                            }}
                        >
                            Manage crops and their agricultural requirements.
                        </p>
                    </div>
<button
    type="button"
    onClick={() => {
        setEditingCrop(null);
        setFormError("");

        setFormData({
            crop_name: "",
            category: "",
            description: "",
            growing_period: "",
            harvest_period: "",
            soil_type: "",
            water_requirement: "",
            sunlight_requirement: "",
            min_temperature: "",
            max_temperature: "",
            season: "",
            environment: ""
        });

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
    + Add Crop
</button>
                </div>


                {/* Add / Edit Crop Modal */}
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
            boxSizing: "border-box",
        }}
    >
        <div
            style={{
                width: "100%",
                maxWidth: "850px",
                maxHeight: "90vh",
                background: "white",
                borderRadius: "14px",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 25px",
                borderBottom: "1px solid #e5e7eb",
                flexShrink: 0,
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
                    {editingCrop ? "Edit Crop" : "Add New Crop"}
                </h2>

                <p
                    style={{
                        marginTop: "6px",
                        marginBottom: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                    }}
                >
                    {editingCrop
                        ? "Update the crop information and agricultural requirements."
                        : "Add the crop information and its agricultural requirements."}
                </p>
            </div>

            <button
                type="button"
                onClick={() => {
                    setShowAddForm(false);
                    setEditingCrop(null);
                    setFormError("");
                }}
                style={{
                    width: "36px",
                    height: "36px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#f3f4f6",
                    color: "#374151",
                    fontSize: "20px",
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
                overflowY: "auto",
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

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "18px",
            }}
        >
            {/* Crop Name */}
            <div>
                <label style={labelStyle}>
                    Crop Name *
                </label>

                <input
                    type="text"
                    value={formData.crop_name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            crop_name: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. Tomato"
                />
            </div>

            {/* Category */}
            <div>
                <label style={labelStyle}>
                    Category *
                </label>

                <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            category: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. Vegetable"
                />
            </div>

            {/* Growing Period */}
            <div>
                <label style={labelStyle}>
                    Growing Period
                </label>

                <input
                    type="text"
                    value={formData.growing_period}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            growing_period: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. 90 days"
                />
            </div>

            {/* Harvest Period */}
            <div>
                <label style={labelStyle}>
                    Harvest Period
                </label>

                <input
                    type="text"
                    value={formData.harvest_period}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            harvest_period: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. After 90 days"
                />
            </div>

            {/* Soil */}
            <div>
                <label style={labelStyle}>
                    Soil Type *
                </label>

                <input
                    type="text"
                    value={formData.soil_type}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            soil_type: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. Loam, Sandy"
                />
            </div>

            {/* Water */}
            <div>
                <label style={labelStyle}>
                    Water Requirement *
                </label>

                <input
                    type="text"
                    value={formData.water_requirement}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            water_requirement: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. Moderate"
                />
            </div>

            {/* Sunlight */}
            <div>
                <label style={labelStyle}>
                    Sunlight Requirement *
                </label>

                <input
                    type="text"
                    value={formData.sunlight_requirement}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            sunlight_requirement: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. Full Sun"
                />
            </div>

            {/* Season */}
            <div>
                <label style={labelStyle}>
                    Season *
                </label>

                <input
                    type="text"
                    value={formData.season}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            season: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. Wet and Dry Season"
                />
            </div>

            {/* Minimum Temperature */}
            <div>
                <label style={labelStyle}>
                    Minimum Temperature (°C) *
                </label>

                <input
                    type="number"
                    value={formData.min_temperature}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            min_temperature: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. 20"
                />
            </div>

            {/* Maximum Temperature */}
            <div>
                <label style={labelStyle}>
                    Maximum Temperature (°C) *
                </label>

                <input
                    type="number"
                    value={formData.max_temperature}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            max_temperature: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. 35"
                />
            </div>

            {/* Environment */}
            <div>
                <label style={labelStyle}>
                    Growing Environment *
                </label>

                <input
                    type="text"
                    value={formData.environment}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            environment: e.target.value,
                        })
                    }
                    style={inputStyle}
                    placeholder="e.g. Open Field"
                />
            </div>

            {/* Description */}
            <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                    Description
                </label>

                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    style={{
                        ...inputStyle,
                        minHeight: "90px",
                        resize: "vertical",
                    }}
                    placeholder="Enter a short description of the crop."
                />
            </div>
        </div>

        </div>

        {/* Modal Footer */}
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                padding: "18px 25px",
                borderTop: "1px solid #e5e7eb",
                background: "#fafafa",
                flexShrink: 0,
            }}
        >
            <button
                type="button"
                onClick={() => {
                    setShowAddForm(false);
                    setEditingCrop(null);
                    setFormError("");
                }}
                disabled={saving}
                style={{
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: "600",
                }}
            >
                Cancel
            </button>

            <button
                type="button"
                onClick={handleSaveCrop}
                disabled={saving}
                style={{
                    background: saving ? "#9ca3af" : "#166534",
                    color: "white",
                    border: "none",
                    padding: "11px 20px",
                    borderRadius: "8px",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: "600",
                }}
            >
                {saving
                    ? "Saving..."
                    : editingCrop
                    ? "Update Crop"
                    : "Save Crop"}
            </button>
        </div>

        </div>
    </div>
)}



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
                        Total Crops
                    </div>

                    <div
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#166534",
                            marginTop: "5px",
                        }}
                    >
                        {loading ? "..." : crops.length}
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

                {deleteError && (
                    <div
                        role="alert"
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "15px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                        }}
                    >
                        {deleteError}
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
                        Loading crop data...
                    </div>
                )}

                {/* Crop Table */}
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
                                Crop Database
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
                                        <th style={thStyle}>Crop Name</th>
                                        <th style={thStyle}>Category</th>
                                        <th style={thStyle}>
                                            Growing Period
                                        </th>
                                        <th style={thStyle}>
                                            Harvest Period
                                        </th>
                                        <th style={thStyle}>Soil</th>
                                        <th style={thStyle}>Water</th>
                                        <th style={thStyle}>Sunlight</th>
                                        <th style={thStyle}>Season</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {crops.map((crop) => (
                                        <tr key={crop.crop_id}>
                                            <td style={tdStyle}>
                                                {crop.crop_id}
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight: "600",
                                                    color: "#166534",
                                                }}
                                            >
                                                {crop.crop_name}
                                            </td>

                                            <td style={tdStyle}>
                                                {crop.category || "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {crop.growing_period || "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {crop.harvest_period || "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {crop.soil_type || "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {crop.water_requirement || "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {crop.sunlight_requirement ||
                                                    "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {crop.season || "—"}
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
                                                    setEditingCrop(crop);
                                                    setShowAddForm(true);
                                                    setFormError("");
                                                    setFormData({
                                                        crop_name: crop.crop_name || "",
                                                        category: crop.category || "",
                                                        description: crop.description || "",
                                                        growing_period: crop.growing_period || "",
                                                        harvest_period: crop.harvest_period || "",
                                                        soil_type: crop.soil_type || "",
                                                        water_requirement: crop.water_requirement || "",
                                                        sunlight_requirement: crop.sunlight_requirement || "",
                                                        min_temperature: crop.min_temperature ?? "",
                                                        max_temperature: crop.max_temperature ?? "",
                                                        season: crop.season || "",
                                                        environment: crop.environment || ""
                                                    });
                                                }}
                                                    style={{
                                                        background: "#2563eb",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 12px",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCrop(crop)}
                                                    disabled={deletingCropId === crop.crop_id}
                                                    style={{
                                                        background: "#dc2626",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 12px",
                                                        borderRadius: "6px",
                                                        cursor: deletingCropId === crop.crop_id ? "not-allowed" : "pointer",
                                                        fontWeight: "600",
                                                        opacity: deletingCropId === crop.crop_id ? 0.7 : 1,
                                                    }}
                                                >
                                                    {deletingCropId === crop.crop_id ? "Deleting..." : "Delete"}
                                                </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
};

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
};