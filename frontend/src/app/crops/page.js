"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getCrops } from "../../services/cropService";
import CropImage from "../../components/CropImage";
import styles from "./crops.module.css";

export default function CropsPage() {

    const router = useRouter();

    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");


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
    // LOAD CROPS
    // =========================================================

    useEffect(() => {

        async function loadCrops() {

            try {

                const data =
                    await getCrops();

                setCrops(data);

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load crop information."
                );

            } finally {

                setLoading(false);

            }

        }

        loadCrops();

    }, []);

    const categories = [...new Set(
        crops
            .map((crop) => crop.category?.trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
    const filteredCrops = crops.filter((crop) => {
        const matchesCategory =
            !selectedCategory || crop.category === selectedCategory;
        const searchableFields = [
            crop.crop_name,
            crop.category,
            crop.description,
            crop.soil_type,
            crop.water_requirement,
            crop.sunlight_requirement,
            crop.season,
            crop.environment,
        ];
        const matchesSearch =
            !normalizedSearch ||
            searchableFields.some((value) =>
                String(value || "").toLocaleLowerCase().includes(normalizedSearch)
            );

        return matchesCategory && matchesSearch;
    });

    return (

        <section className={styles.cataloguePage}>

            <div className={styles.catalogueHeader}>

                <span className={styles.sectionBadge}>
                    Build & Bloom
                </span>

                <h1>
                    Crop Catalogue
                </h1>

                <p>
                    Explore crops and learn about their
                    growing requirements before making
                    a planting decision.
                </p>

            </div>


            {loading && (

                <div className={styles.catalogueState}>

                    <p>
                        Loading crops...
                    </p>

                </div>

            )}


            {error && (

                <div className={`${styles.catalogueState} ${styles.errorState}`}>

                    <p>
                        {error}
                    </p>

                </div>

            )}

            {!loading && !error && crops.length > 0 && (
                <div className={styles.catalogueToolbar}>
                    <label className={styles.searchField}>
                        <span className={styles.searchIcon} aria-hidden="true" />
                        <span className={styles.visuallyHidden}>Search crops</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search by crop, category, or growing need..."
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className={styles.clearSearch}
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear crop search"
                            >
                                ×
                            </button>
                        )}
                    </label>

                    <label className={styles.categoryFilter}>
                        <span className={styles.visuallyHidden}>Filter by category</span>
                        <select
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value)}
                        >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>

                    <p className={styles.resultCount} aria-live="polite">
                        <strong>{filteredCrops.length}</strong>
                        {" "}of {crops.length} crops
                    </p>
                </div>
            )}

            {!loading && !error && crops.length === 0 && (
                <div className={styles.emptyState}>
                    <span aria-hidden="true"></span>
                    <h2>No crops available yet</h2>
                    <p>Please check back later for crops in the catalogue.</p>
                </div>
            )}

            {!loading && !error && (
                filteredCrops.length > 0 ? (
                    <div className={styles.cropGrid}>
                        {filteredCrops.map((crop) => (
                            <article
                                className={styles.cropCard}
                                key={crop.crop_id}
                            >
                                <CropImage
                                    cropName={crop.crop_name}
                                    className={styles.cropCardImage}
                                    sizes="(max-width: 650px) 90vw, (max-width: 1050px) 45vw, 30vw"
                                />

                                <div className={styles.cropCardContent}>
                                    <span className={styles.cropCategory}>
                                        {crop.category}
                                    </span>

                                    <h2>{crop.crop_name}</h2>
                                    <p>{crop.description}</p>

                                    <div className={styles.cropInfo}>
                                        <div>
                                            <strong>Soil</strong>
                                            <span>{crop.soil_type}</span>
                                        </div>
                                        <div>
                                            <strong>Water</strong>
                                            <span>{crop.water_requirement}</span>
                                        </div>
                                        <div>
                                            <strong>Sunlight</strong>
                                            <span>{crop.sunlight_requirement}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/crops/${crop.crop_id}`}
                                        className={styles.viewCropButton}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : crops.length > 0 ? (
                    <div className={styles.emptyState}>
                        <span aria-hidden="true"></span>
                        <h2>No matching crops</h2>
                        <p>Try another crop name or category, or clear your filters.</p>
                        <button
                            type="button"
                            className={styles.resetFilters}
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("");
                            }}
                        >
                            Clear search and filters
                        </button>
                    </div>
                ) : null
            )}

        </section>

    );

}