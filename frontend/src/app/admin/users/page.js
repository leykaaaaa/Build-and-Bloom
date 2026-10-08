"use client";

import { useEffect, useState } from "react";
import { getAuthHeaders } from "../../../services/authService";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
    "http://localhost:5000/api/auth/users",
    {
        headers: getAuthHeaders()
    }
);

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to retrieve users."
                    );
                }

                setUsers(result.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);

                setError(
                    "Unable to load registered users. Please make sure the backend server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const searchTerm = search.toLowerCase();

        return (
            user.full_name?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm) ||
            user.location_name?.toLowerCase().includes(searchTerm)
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
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: "25px" }}>
                    <h1
                        style={{
                            margin: 0,
                            color: "#1f2937",
                            fontSize: "30px",
                        }}
                    >
                        User Management
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#6b7280",
                        }}
                    >
                        View registered users and their selected locations.
                    </p>
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
                        Registered Users
                    </div>

                    <div
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#166534",
                            marginTop: "5px",
                        }}
                    >
                        {loading ? "..." : users.length}
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
                            placeholder="Search name, email, or location..."
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
                        Loading registered users...
                    </div>
                )}

                {/* User Table */}
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
                                Registered Users
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
                                        <th style={thStyle}>Full Name</th>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Location</th>
                                        <th style={thStyle}>Registered</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.user_id}>
                                            <td style={tdStyle}>
                                                {user.user_id}
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight: "600",
                                                    color: "#166534",
                                                }}
                                            >
                                                {user.full_name}
                                            </td>

                                            <td style={tdStyle}>
                                                {user.email}
                                            </td>

                                            <td style={tdStyle}>
                                                {user.location_name || "—"}
                                            </td>

                                            <td style={tdStyle}>
                                                {user.created_at
                                                    ? new Date(
                                                          user.created_at
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div
                                style={{
                                    padding: "30px",
                                    textAlign: "center",
                                    color: "#6b7280",
                                }}
                            >
                                No users found.
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