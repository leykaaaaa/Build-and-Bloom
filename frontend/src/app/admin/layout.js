"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    isAuthenticated,
    isAdmin
} from "../../services/authGuard";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
            return;
        }

        if (!isAdmin()) {
            router.replace("/dashboard");
        }
    }, [router]);

    if (
        !isAuthenticated() ||
        !isAdmin()
    ) {
        return null;
    }

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin"
        },
        {
            name: "Crop Management",
            path: "/admin/crops"
        },
        {
            name: "Location Management",
            path: "/admin/locations"
        },
        {
            name: "Planting Calendar",
            path: "/admin/calendar"
        },
        {
            name: "User Management",
            path: "/admin/users"
        },
        {
            name: "Recommendations",
            path: "/admin/recommendations"
        },
        {
            name: "Settings",
            path: "/admin/settings"
        }
    ];

    return (
        <div style={styles.adminContainer}>

            {/* Sidebar */}
            <aside style={styles.sidebar}>

                {/* Logo / Brand */}
                <div style={styles.brand}>
                    <div style={styles.logo}>
                        
                    </div>

                    <div>
                        <div style={styles.brandName}>
                            Build & Bloom
                        </div>

                        <div style={styles.brandSubtitle}>
                            Admin Panel
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={styles.navigation}>

                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                style={{
                                    ...styles.navItem,
                                    ...(isActive
                                        ? styles.activeNavItem
                                        : {})
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}

                </nav>

                {/* Bottom */}
                <div style={styles.sidebarBottom}>

                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem(
                                "buildAndBloomUser"
                            );

                            localStorage.removeItem(
                                "buildAndBloomToken"
                            );

                            router.replace("/login");
                        }}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {children}
            </main>

        </div>
    );
}

const styles = {
    adminContainer: {
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc"
    },

    sidebar: {
        width: "250px",
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100
    },

    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "24px 20px",
        borderBottom: "1px solid #f1f5f9"
    },

    logo: {
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        background: "#dcfce7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },

    brandName: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#166534"
    },

    brandSubtitle: {
        fontSize: "12px",
        color: "#64748b",
        marginTop: "2px"
    },

    navigation: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "20px 14px",
        flex: 1
    },

    navItem: {
        display: "flex",
        alignItems: "center",
        padding: "11px 14px",
        borderRadius: "8px",
        textDecoration: "none",
        color: "#475569",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease"
    },

    activeNavItem: {
        background: "#dcfce7",
        color: "#166534",
        fontWeight: "600"
    },

    sidebarBottom: {
        padding: "16px 14px",
        borderTop: "1px solid #f1f5f9"
    },

    logoutButton: {
        width: "100%",
        padding: "11px 14px",
        border: "none",
        borderRadius: "8px",
        background: "#fef2f2",
        color: "#dc2626",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
    },

    mainContent: {
        flex: 1,
        marginLeft: "250px",
        minWidth: 0,
        padding: "32px"
    }
};