"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getCrops } from "../../services/cropService";

export default function CropsPage() {

    const router = useRouter();

    const [crops, setCrops] = useState([]);
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


    return (

        <section className="catalogue-page">

            <div className="catalogue-header">

                <span className="section-badge">
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

                <div className="catalogue-state">

                    <p>
                        Loading crops...
                    </p>

                </div>

            )}


            {error && (

                <div className="catalogue-state error-state">

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {!loading && !error && (

                <div className="crop-grid">

                    {crops.map((crop) => (

                        <article
                            className="crop-card"
                            key={crop.crop_id}
                        >

                            <div className="crop-card-icon">
                                
                            </div>


                            <div className="crop-card-content">

                                <span className="crop-category">
                                    {crop.category}
                                </span>

                                <h2>
                                    {crop.crop_name}
                                </h2>

                                <p>
                                    {crop.description}
                                </p>


                                <div className="crop-info">

                                    <div>

                                        <strong>
                                             Soil
                                        </strong>

                                        <span>
                                            {crop.soil_type}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                             Water
                                        </strong>

                                        <span>
                                            {crop.water_requirement}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            ️ Sunlight
                                        </strong>

                                        <span>
                                            {crop.sunlight_requirement}
                                        </span>

                                    </div>

                                </div>


                                <Link
                                    href={`/crops/${crop.crop_id}`}
                                    className="view-crop-button"
                                >
                                    View Details →
                                </Link>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>

    );

}