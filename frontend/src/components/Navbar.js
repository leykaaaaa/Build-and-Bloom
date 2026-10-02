"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        function loadUser() {
            const storedUser =
                localStorage.getItem("buildAndBloomUser");

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);

                    if (parsedUser && parsedUser.user_id) {
                        setUser(parsedUser);
                    } else {
                        setUser(null);
                    }

                } catch (error) {
                    console.error(
                        "Invalid stored user:",
                        error
                    );

                    localStorage.removeItem(
                        "buildAndBloomUser"
                    );

                    setUser(null);
                }
            } else {
                setUser(null);
            }

            setLoaded(true);
        }

        loadUser();

        // Update navbar if localStorage changes
        // from another tab/window.
        window.addEventListener(
            "storage",
            loadUser
        );

        return () => {
            window.removeEventListener(
                "storage",
                loadUser
            );
        };

    }, []);

    function handleLogout() {
        localStorage.removeItem(
            "buildAndBloomUser"
        );

        setUser(null);

        window.location.href = "/";
    }

    /*
     * IMPORTANT:
     * Do not show the public navbar while
     * localStorage is still being checked.
     */
    if (!loaded) {
        return (
            <nav className="navbar">
                <div className="navbar-container">

                    <Link
                        href="/"
                        className="navbar-brand"
                    >
                        <span className="brand-icon">
                            
                        </span>

                        <span className="brand-text">
                            Build <span>&</span> Bloom
                        </span>
                    </Link>

                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* BRAND */}

                <Link
                    href={user ? "/dashboard" : "/"}
                    className="navbar-brand"
                >
                    <span className="brand-icon">
                        
                    </span>

                    <span className="brand-text">
                        Build <span>&</span> Bloom
                    </span>
                </Link>


                {/* NAVIGATION */}

                <div className="navbar-links">

                    {user ? (
                        <>

                        <Link href="/dashboard">
    Dashboard
</Link>
                            <Link href="/crops">
                                Crop Catalogue
                            </Link>

                            <Link href="/assessment">
                                Crop Assessment
                            </Link>

                            <Link href="/weather">
                                Weather
                            </Link>

                            <Link href="/calendar">
                                Planting Calendar
                            </Link>

                            <Link href="/plants">
                                My Plants
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/">
                                Home
                            </Link>

                            <a href="/#about">
                                About
                            </a>

                            <a href="/#features">
                                Features
                            </a>
                        </>
                    )}

                </div>


                {/* ACTIONS */}

                <div className="navbar-actions">

                    {user ? (
                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="login-button"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="register-button"
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}