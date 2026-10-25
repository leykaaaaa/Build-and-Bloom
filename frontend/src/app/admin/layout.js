"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    isAuthenticated,
    isAdmin
} from "../../services/authGuard";
import styles from "./layout.module.css";

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
            path: "/admin",
            icon: " "
        },
        {
            name: "Crop Management",
            path: "/admin/crops",
            icon: ""
        },
        {
            name: "Location Management",
            path: "/admin/locations",
            icon: " "
        },
        {
            name: "Planting Calendar",
            path: "/admin/calendar",
            icon: " "
        },
        {
            name: "User Management",
            path: "/admin/users",
            icon: ""
        },
        {
            name: "Recommendations",
            path: "/admin/recommendations",
            icon: ""
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: ""
        }
    ];

    return (
        <div className={styles.adminContainer}>

            {/* Sidebar */}
            <aside className={styles.sidebar}>

                {/* Logo / Brand */}
                <div className={styles.brand}>
                    <div className={styles.logo} aria-hidden="true">
                        
                    </div>

                    <div>
                        <div className={styles.brandName}>
                            Build & Bloom
                        </div>

                        <div className={styles.brandSubtitle}>
                            Admin Panel
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.navigation} aria-label="Admin navigation">

                    {menuItems.map((item) => {
                        const isActive = item.path === "/admin"
                            ? pathname === item.path
                            : pathname === item.path || pathname.startsWith(`${item.path}/`);

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${styles.navItem}${isActive ? ` ${styles.activeNavItem}` : ""}`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <span className={styles.navIcon} aria-hidden="true">
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                </nav>

                {/* Bottom */}
                <div className={styles.sidebarBottom}>

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
                        className={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>

        </div>
    );
}