"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { getCropById } from "../../../services/cropService";

export default function CropDetailsPage() {

    const params = useParams();
    const router = useRouter();

    const { id } = params;

    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // AUTH CHECK
    // =========================================================

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

            if (!parsedUser?.user_id) {

                localStorage.removeItem(
                    "buildAndBloomUser"
                );

                router.push("/login");

            }

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem(
                "buildAndBloomUser"
            );

            router.push("/login");

        }

    }, [router]);


    // =========================================================
    // LOAD CROP
    // =========================================================

    useEffect(() => {

        async function loadCrop() {

            try {

                const data =
                    await getCropById(id);

                setCrop(data);

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load crop information."
                );

            } finally {

                setLoading(false);

            }

        }

        if (id) {
            loadCrop();
        }

    }, [id]);


    if (loading) {

        return (

            <section className="crop-details-page">

                <div className="catalogue-state">

                    <p>
                        Loading crop information...
                    </p>

                </div>

            </section>

        );

    }


    if (error || !crop) {

        return (

            <section className="crop-details-page">

                <div className="catalogue-state error-state">

                    <p>
                        {error || "Crop not found."}
                    </p>

                    <Link
                        href="/crops"
                        className="back-button"
                    >
                        ← Back to Crop Catalogue
                    </Link>

                </div>

            </section>

        );

    }


    return (

        <section className="crop-details-page">

            <div className="crop-details-container">


                <Link
                    href="/crops"
                    className="back-link"
                >
                    ← Back to Crop Catalogue
                </Link>


                <div className="crop-details-card">


                    {/* HERO */}

                    <div className="crop-details-hero">

                        <div className="crop-details-icon">
                            
                        </div>

                        <div>

                            <span className="crop-category">
                                {crop.category}
                            </span>

                            <h1>
                                {crop.crop_name}
                            </h1>

                            <p>
                                {crop.description}
                            </p>

                        </div>

                    </div>


                    {/* GROWING REQUIREMENTS */}

                    <div className="crop-details-section">

                        <h2>
                            Growing Requirements
                        </h2>

                        <div className="requirements-grid">


                            <div className="requirement-card">

                                <span className="requirement-icon">
                                    
                                </span>

                                <div>

                                    <strong>
                                        Soil Type
                                    </strong>

                                    <p>
                                        {crop.soil_type}
                                    </p>

                                </div>

                            </div>


                            <div className="requirement-card">

                                <span className="requirement-icon">
                                    
                                </span>

                                <div>

                                    <strong>
                                        Water Requirement
                                    </strong>

                                    <p>
                                        {crop.water_requirement}
                                    </p>

                                </div>

                            </div>


                            <div className="requirement-card">

                                <span className="requirement-icon">
                                    ️
                                </span>

                                <div>

                                    <strong>
                                        Sunlight
                                    </strong>

                                    <p>
                                        {crop.sunlight_requirement}
                                    </p>

                                </div>

                            </div>


                            <div className="requirement-card">

                                <span className="requirement-icon">
                                    ️
                                </span>

                                <div>

                                    <strong>
                                        Temperature
                                    </strong>

                                    <p>
                                        {crop.min_temperature}°C -
                                        {" "}
                                        {crop.max_temperature}°C
                                    </p>

                                </div>

                            </div>


                            <div className="requirement-card">

                                <span className="requirement-icon">
                                    ️
                                </span>

                                <div>

                                    <strong>
                                        Season
                                    </strong>

                                    <p>
                                        {crop.season}
                                    </p>

                                </div>

                            </div>


                            <div className="requirement-card">

                                <span className="requirement-icon">
                                    
                                </span>

                                <div>

                                    <strong>
                                        Growing Environment
                                    </strong>

                                    <p>
                                        {crop.environment}
                                    </p>

                                </div>

                            </div>


                        </div>

                    </div>


                    {/* GROWING INFORMATION */}

                    <div className="crop-details-section">

                        <h2>
                            Growing Information
                        </h2>

                        <div className="growing-info-grid">

                            <div>

                                <span>
                                    Growing Period
                                </span>

                                <strong>
                                    {crop.growing_period}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Harvest Period
                                </span>

                                <strong>
                                    {crop.harvest_period}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="crop-details-actions">

                        <div>

                            <h2>
                                Want to grow {crop.crop_name}?
                            </h2>

                            <p>
                                Check whether this crop is
                                compatible with your growing
                                conditions or create a planting
                                plan.
                            </p>

                        </div>


                        <div className="crop-details-action-buttons">

                            <Link
                                href={`/assessment?crop=${crop.crop_id}`}
                                className="assessment-button"
                            >
                                Can I Grow This? →
                            </Link>


                            <Link
                                href={`/plants/plan?crop=${crop.crop_id}`}
                                className="plan-recommendation"
                            >
                                Plan This Plant →
                            </Link>

                        </div>

                    </div>


                </div>

            </div>

        </section>

    );

}