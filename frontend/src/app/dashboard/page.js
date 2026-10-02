"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getPlantingPlans } from "../../services/plantingPlanService";


export default function DashboardPage() {

    const [user, setUser] = useState(null);

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        async function loadDashboard() {

            try {

                const storedUser =
                    localStorage.getItem(
                        "buildAndBloomUser"
                    );


                if (!storedUser) {

                    window.location.href = "/login";

                    return;

                }


                const parsedUser =
                    JSON.parse(storedUser);


                if (!parsedUser.user_id) {

                    window.location.href = "/login";

                    return;

                }


                setUser(parsedUser);


                const data =
                    await getPlantingPlans(
                        parsedUser.user_id
                    );


                setPlans(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        }


        loadDashboard();

    }, []);


    if (loading) {

        return (

            <section className="dashboard-page">

                <div className="dashboard-container">

                    <div className="catalogue-state">

                        <p>
                            Loading your dashboard...
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

        <section className="dashboard-page">

            <div className="dashboard-container">


                {/* WELCOME */}

                <div className="dashboard-welcome">

                    <div>

                        <span className="section-badge">
                             Build & Bloom
                        </span>

                        <h1>
                            Welcome back,{" "}
                            <span>
                                {user.full_name}
                            </span>!
                        </h1>

                        <p>
                            Here's an overview of your
                            planting activities.
                        </p>

                    </div>

                    <div className="dashboard-welcome-icon">
                        
                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="assessment-error">

                        <span>
                            ️
                        </span>

                        <div>

                            <strong>
                                Dashboard Notice
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* STAT CARDS */}

                <div className="dashboard-stats">


                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            
                        </div>

                        <div>

                            <span>
                                My Plants
                            </span>

                            <strong>
                                {plans.length}
                            </strong>

                        </div>

                    </div>


                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            
                        </div>

                        <div>

                            <span>
                                Planting Plans
                            </span>

                            <strong>
                                {plans.length}
                            </strong>

                        </div>

                    </div>


                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            
                        </div>

                        <div>

                            <span>
                                Growing
                            </span>

                            <strong>
                                {
                                    plans.filter(
                                        (plan) =>
                                            plan.status ===
                                            "Growing"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            
                        </div>

                        <div>

                            <span>
                                Completed
                            </span>

                            <strong>
                                {
                                    plans.filter(
                                        (plan) =>
                                            plan.status ===
                                            "Completed"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>


                </div>


                {/* MAIN GRID */}

                <div className="dashboard-grid">


                    {/* PLANTING PLANS */}

                    <div className="dashboard-panel">

                        <div className="dashboard-panel-header">

                            <div>

                                <span>
                                    Your Activity
                                </span>

                                <h2>
                                    Recent Planting Plans
                                </h2>

                            </div>

                            <Link href="/plants">
                                View All →
                            </Link>

                        </div>


                        {plans.length === 0 ? (

                            <div className="dashboard-empty">

                                <div>
                                    
                                </div>

                                <h3>
                                    No planting plans yet
                                </h3>

                                <p>
                                    Start planning your first
                                    crop.
                                </p>

                                <Link
                                    href="/crops"
                                    className="dashboard-action-button"
                                >
                                    Explore Crops
                                </Link>

                            </div>

                        ) : (

                            <div className="dashboard-plan-list">

                                {plans
                                    .slice(0, 3)
                                    .map((plan) => (

                                        <div
                                            className="dashboard-plan-item"
                                            key={plan.plan_id}
                                        >

                                            <div className="dashboard-plan-icon">
                                                
                                            </div>

                                            <div className="dashboard-plan-info">

                                                <strong>
                                                    {plan.plan_name}
                                                </strong>

                                                <span>
                                                    {plan.crop_name}
                                                </span>

                                            </div>

                                            <span
                                                className={`plant-status status-${plan.status
                                                    .toLowerCase()
                                                    .replaceAll(
                                                        " ",
                                                        "-"
                                                    )}`}
                                            >
                                                {plan.status}
                                            </span>

                                        </div>

                                    ))}

                            </div>

                        )}

                    </div>


                    {/* QUICK ACTIONS */}

                    <div className="dashboard-panel">

                        <div className="dashboard-panel-header">

                            <div>

                                <span>
                                    Get Started
                                </span>

                                <h2>
                                    Quick Actions
                                </h2>

                            </div>

                        </div>


                        <div className="dashboard-actions">


                            <Link
                                href="/assessment"
                                className="dashboard-action-card"
                            >

                                <span>
                                    
                                </span>

                                <div>

                                    <strong>
                                        Crop Assessment
                                    </strong>

                                    <p>
                                        Find crops suitable
                                        for your conditions.
                                    </p>

                                </div>

                            </Link>


                            <Link
                                href="/crops"
                                className="dashboard-action-card"
                            >

                                <span>
                                    
                                </span>

                                <div>

                                    <strong>
                                        Crop Catalogue
                                    </strong>

                                    <p>
                                        Explore available crops
                                        and their requirements.
                                    </p>

                                </div>

                            </Link>


                            <Link
                                href="/weather"
                                className="dashboard-action-card"
                            >

                                <span>
                                    ️
                                </span>

                                <div>

                                    <strong>
                                        Check Weather
                                    </strong>

                                    <p>
                                        View current weather
                                        conditions.
                                    </p>

                                </div>

                            </Link>


                            <Link
                                href="/calendar"
                                className="dashboard-action-card"
                            >

                                <span>
                                    
                                </span>

                                <div>

                                    <strong>
                                        Planting Calendar
                                    </strong>

                                    <p>
                                        Check planting schedules
                                        for crops.
                                    </p>

                                </div>

                            </Link>


                        </div>

                    </div>


                </div>


                {/* BOTTOM CTA */}

                <div className="dashboard-cta">

                    <div>

                        <span>
                             Ready to grow?
                        </span>

                        <h2>
                            Find the right crop for your location.
                        </h2>

                        <p>
                            Use our crop assessment to understand
                            which crops match your growing conditions.
                        </p>

                    </div>


                    <Link
                        href="/assessment"
                        className="dashboard-cta-button"
                    >
                        Start Assessment →
                    </Link>

                </div>


            </div>

        </section>

    );

}