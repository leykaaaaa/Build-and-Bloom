"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function ProfilePage() {

    const router = useRouter();

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "buildAndBloomUser"
            );


        if (!storedUser) {

            router.push("/login");

            return;

        }


        try {

            const parsedUser =
                JSON.parse(storedUser);


            if (!parsedUser.user_id) {

                router.push("/login");

                return;

            }


            setUser(parsedUser);

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem(
                "buildAndBloomUser"
            );

            router.push("/login");

            return;

        }


        setLoading(false);

    }, [router]);


    function handleLogout() {

        localStorage.removeItem(
            "buildAndBloomUser"
        );

        setUser(null);

        router.push("/");

    }


    if (loading) {

        return (

            <section className="profile-page">

                <div className="profile-container">

                    <div className="catalogue-state">

                        <p>
                            Loading your account...
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    if (!user) {
        return null;
    }


    return (

        <section className="profile-page">

            <div className="profile-container">


                {/* HEADER */}

                <div className="profile-header">

                    <span className="section-badge">
                         Build & Bloom
                    </span>

                    <h1>
                        My Account
                    </h1>

                    <p>
                        View your Build & Bloom account
                        information.
                    </p>

                </div>


                {/* PROFILE CARD */}

                <div className="profile-card">


                    {/* PROFILE ICON */}

                    <div className="profile-avatar">
                        
                    </div>


                    {/* USER NAME */}

                    <div className="profile-name">

                        <h2>
                            {user.full_name}
                        </h2>

                        <p>
                            Build & Bloom Grower
                        </p>

                    </div>


                    {/* ACCOUNT DETAILS */}

                    <div className="profile-details">


                        <div className="profile-detail">

                            <span>
                                 Full Name
                            </span>

                            <strong>
                                {user.full_name}
                            </strong>

                        </div>


                        <div className="profile-detail">

                            <span>
                                ️ Email Address
                            </span>

                            <strong>
                                {user.email}
                            </strong>

                        </div>


                        <div className="profile-detail">

                            <span>
                                 Location
                            </span>

                            <strong>
                                {user.location_id
                                    ? `Location #${user.location_id}`
                                    : "Not specified"}
                            </strong>

                        </div>


                        <div className="profile-detail">

                            <span>
                                 User ID
                            </span>

                            <strong>
                                {user.user_id}
                            </strong>

                        </div>


                    </div>


                    {/* ACTIONS */}

                    <div className="profile-actions">

                        <Link
                            href="/plants"
                            className="profile-primary-button"
                        >
                             My Plants
                        </Link>


                        <button
                            type="button"
                            className="profile-logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}