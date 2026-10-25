"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { getCropById } from "../../../services/cropService";
import styles from "./crop-details.module.css";

function getCropIcon(category) {
    const normalizedCategory = (category || "").toLowerCase();

    if (normalizedCategory.includes("fruit")) return "";
    if (normalizedCategory.includes("herb")) return "";
    if (normalizedCategory.includes("leaf")) return "";
    if (normalizedCategory.includes("flower")) return "";
    if (normalizedCategory.includes("grain")) return "";
    if (normalizedCategory.includes("root")) return "";

    return "";
}

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


    const cropIcon = getCropIcon(crop?.category);

    const requirementCards = [
        { label: "Soil Type", value: crop?.soil_type || "Not specified", icon: " " },
        { label: "Water Requirement", value: crop?.water_requirement || "Not specified", icon: "" },
        { label: "Sunlight", value: crop?.sunlight_requirement || "Not specified", icon: "️" },
        {
            label: "Temperature",
            value: crop?.min_temperature != null && crop?.max_temperature != null
                ? `${crop.min_temperature}°C - ${crop.max_temperature}°C`
                : "Not specified",
            icon: "️",
        },
        { label: "Season", value: crop?.season || "Not specified", icon: "️" },
        { label: "Growing Environment", value: crop?.environment || "Not specified", icon: "" },
    ];

    const growingInfo = [
        { label: "Growing Period", value: crop?.growing_period || "Not specified" },
        { label: "Harvest Period", value: crop?.harvest_period || "Not specified" },
    ];

    if (loading) {

        return (

            <section className={styles.cropDetailsPage}>

                <div className={styles.catalogueState}>

                    <p>
                        Loading crop information...
                    </p>

                </div>

            </section>

        );

    }


    if (error || !crop) {

        return (

            <section className={styles.cropDetailsPage}>

                <div className={`${styles.catalogueState} ${styles.errorState}`}>

                    <p>
                        {error || "Crop not found."}
                    </p>

                    <Link
                        href="/crops"
                        className={styles.backButton}
                    >
                        Back to Crop Catalogue
                    </Link>

                </div>

            </section>

        );

    }


    return (

        <section className={styles.cropDetailsPage}>

            <div className={styles.cropDetailsContainer}>


                <Link
                    href="/crops"
                    className={styles.backLink}
                >
                    ← Back to Crop Catalogue
                </Link>


                <div className={styles.cropDetailsCard}>


                    {/* HERO */}

                    <div className={styles.cropDetailsHero}>

                        <div className={styles.cropDetailsIcon} aria-hidden="true">
                            {cropIcon}
                        </div>

                        <div>

                            <span className={styles.cropCategory}>
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

                    <div className={styles.cropDetailsSection}>

                        <h2>
                            Growing Requirements
                        </h2>

                        <div className={styles.requirementsGrid}>

                            {requirementCards.map((requirement) => (
                                <div key={requirement.label} className={styles.requirementCard}>
                                    <span className={styles.requirementIcon} aria-hidden="true">
                                        {requirement.icon}
                                    </span>

                                    <div>
                                        <strong>
                                            {requirement.label}
                                        </strong>

                                        <p>
                                            {requirement.value}
                                        </p>
                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>


                    {/* GROWING INFORMATION */}

                    <div className={styles.cropDetailsSection}>

                        <h2>
                            Growing Information
                        </h2>

                        <div className={styles.growingInfoGrid}>

                            {growingInfo.map((item) => (
                                <div key={item.label}>
                                    <span>
                                        {item.label}
                                    </span>

                                    <strong>
                                        {item.value}
                                    </strong>
                                </div>
                            ))}

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className={styles.cropDetailsActions}>

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


                        <div className={styles.cropDetailsActionButtons}>

                            <Link
                                href={`/assessment?crop=${crop.crop_id}`}
                                className={styles.assessmentButton}
                            >
                                Can I Grow This?
                            </Link>


                            <Link
                                href={`/plants/plan?crop=${crop.crop_id}`}
                                className={styles.planRecommendation}
                            >
                                Plan This Plant
                            </Link>

                        </div>

                    </div>


                </div>

            </div>

        </section>

    );

}