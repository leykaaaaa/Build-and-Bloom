"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    useSearchParams,
    useRouter
} from "next/navigation";

import { getCropById } from "../../../services/cropService";
import { createPlantingPlan } from "../../../services/plantingPlanService";
import styles from "./plan.module.css";


export default function PlanPlantPage() {

    const router = useRouter();

    const searchParams = useSearchParams();

    const cropId =
        searchParams.get("crop");


    const [crop, setCrop] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const [form, setForm] = useState({

        plan_name: "",

        location_id: "",

        planting_date: "",

        quantity: "",

        growing_method: "",

        notes: ""

    });


    useEffect(() => {

    const storedUser =
        localStorage.getItem(
            "buildAndBloomUser"
        );


    if (!storedUser) {

        router.push("/login");

    }

}, [router]);

    /*
        Load the selected crop.
    */

    useEffect(() => {

        async function loadCrop() {

            if (!cropId) {

                setError(
                    "No crop was selected."
                );

                setLoading(false);

                return;

            }


            try {

                const data =
                    await getCropById(
                        cropId
                    );

                setCrop(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Unable to load crop information."
                );

            } finally {

                setLoading(false);

            }

        }


        loadCrop();

    }, [cropId]);


    /*
        Handle form changes.
    */

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;


        setForm((previous) => ({

            ...previous,

            [name]: value

        }));

    }


    /*
        Submit planting plan.
    */

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        /*
            Get logged-in user.
        */

        const storedUser =
            localStorage.getItem(
                "buildAndBloomUser"
            );


        /*
            User must be logged in.
        */

        if (!storedUser) {

            setError(
                "Please log in before creating a planting plan."
            );

            return;

        }


        let user;


        try {

            user =
                JSON.parse(
                    storedUser
                );

        } catch (err) {

            console.error(err);

            setError(
                "Your login session is invalid. Please log in again."
            );

            return;

        }


        /*
            Make sure the account has
            a valid user ID.
        */

        if (!user.user_id) {

            setError(
                "Unable to identify your account. Please log in again."
            );

            return;

        }


        /*
            Make sure a crop was loaded.
        */

        if (!cropId) {

            setError(
                "No crop was selected."
            );

            return;

        }


        /*
            Plan name is required.
        */

        if (!form.plan_name.trim()) {

            setError(
                "Please enter a name for your planting plan."
            );

            return;

        }


        setSaving(true);


        try {

            const result =
                await createPlantingPlan({

                    /*
                        IMPORTANT:
                        Use the actual logged-in
                        user's ID instead of 1.
                    */

                    user_id:
                        user.user_id,

                    crop_id:
                        Number(cropId),

                    location_id:
                        form.location_id
                            ? Number(
                                form.location_id
                            )
                            : null,

                    plan_name:
                        form.plan_name.trim(),

                    planting_date:
                        form.planting_date ||
                        null,

                    quantity:
                        form.quantity.trim(),

                    growing_method:
                        form.growing_method,

                    notes:
                        form.notes.trim()

                });


            console.log(
                "Planting plan created:",
                result
            );


            setSuccess(
                "Your planting plan has been created successfully!"
            );


            /*
                Clear the form after success.
            */

            setForm({

                plan_name: "",

                location_id: "",

                planting_date: "",

                quantity: "",

                growing_method: "",

                notes: ""

            });

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to create planting plan."
            );

        } finally {

            setSaving(false);

        }

    }


    /*
        Loading state.
    */

    if (loading) {

        return (

            <section className={styles.planPage}>

                <div className={styles.planContainer}>

                    <div className={styles.catalogueState}>

                        <p>
                            Loading crop information...
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    /*
        Error state when crop
        cannot be loaded.
    */

    if (error && !crop) {

        return (

            <section className={styles.planPage}>

                <div className={styles.planContainer}>

                    <div className={styles.assessmentError}>

                        <span>
                            ️
                        </span>

                        <div>

                            <strong>
                                Unable to load crop
                            </strong>

                            <p>
                                {error}
                            </p>

                            <Link
                                href="/crops"
                                className={styles.errorBackButton}
                            >
                                ← Back to Crops
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        );

    }


    return (

        <section className={styles.planPage}>

            <div className={styles.planContainer}>


                {/* HEADER */}

                <div className={styles.planHeader}>

                    <span className={styles.sectionBadge}>
                         Build & Bloom
                    </span>

                    <h1>
                        Plan This Plant
                    </h1>

                    <p>
                        Create a planting plan and keep track
                        of your growing activities.
                    </p>

                </div>


                {/* SELECTED CROP */}

                {crop && (

                    <div className={styles.selectedCropCard}>

                        <div className={styles.selectedCropIcon}>
                            
                        </div>

                        <div>

                            <span>
                                Selected Crop
                            </span>

                            <h2>
                                {crop.crop_name}
                            </h2>

                            <p>
                                {crop.category}
                            </p>

                        </div>

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className={styles.assessmentError}>

                        <span>
                            ️
                        </span>

                        <div>

                            <strong>
                                Unable to create plan
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* SUCCESS POPUP */}
                {success && (
                    <div
                        className="register-modal-overlay"
                        role="presentation"
                    >
                        <div
                            className="register-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="plan-success-title"
                            aria-describedby="plan-success-description"
                        >
                            <div className="register-modal-icon">
                                
                            </div>

                            <h2 id="plan-success-title">
                                Planting Plan Created!
                            </h2>

                            <p id="plan-success-description">
                                Your planting plan has been saved
                                successfully. You can now view and
                                manage your plant in the My Plants
                                section.
                            </p>

                            <Link
                                href="/plants"
                                className="register-modal-button"
                            >
                                View My Plants
                            </Link>
                        </div>
                    </div>
                )}


                {/* FORM */}

                <form
                    className={styles.planForm}
                    onSubmit={handleSubmit}
                >


                    {/* PLAN NAME */}

                    <div className={styles.formGroup}>

                        <label htmlFor="plan_name">
                            Plan Name
                        </label>

                        <input
                            id="plan_name"
                            name="plan_name"
                            type="text"
                            value={form.plan_name}
                            onChange={handleChange}
                            placeholder="e.g. My Tomato Garden"
                            required
                        />

                    </div>


                    {/* LOCATION */}

                    <div className={styles.formGroup}>

                        <label htmlFor="location_id">
                            Growing Location
                        </label>

                        <select
                            id="location_id"
                            name="location_id"
                            value={form.location_id}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select a location
                            </option>

                            <option value="8"> Alaminos </option>
                            <option value="6"> Agno </option>
                            <option value="7"> Aguilar </option>
                            <option value="9"> Alcala </option>
                            <option value="10"> Anda </option>
                            <option value="11"> Asingan </option>
                            <option value="12"> Balungao </option>
                            <option value="13"> Bani </option>
                            <option value="14"> Basista </option>
                            <option value="15"> Bautista </option>
                            <option value="16"> Bayambang </option>
                            <option value="17"> Binalonan </option>
                            <option value="18"> Binmaley </option>
                            <option value="19"> Bolinao </option>
                            <option value="20"> Bugallon </option>
                            <option value="21"> Burgos </option>
                            <option value="22"> Calasiao </option>
                            <option value="23"> Dasol</option>
                            <option value="1"> Dagupan </option>
                            <option value="24"> Infanta </option>
                            <option value="25"> Labrador </option>
                            <option value="26"> Laloac </option>
                            <option value="2"> Lingayen </option>
                            <option value="27"> Mabini </option>
                            <option value="28"> Malasiqui </option>
                            <option value="29"> Manaoag </option>
                            <option value="30"> Mangaldan </option>
                            <option value="31"> Mangatarem </option>
                            <option value="32"> Mapandan </option>
                            <option value="33"> Natividad </option>
                            <option value="34"> Pozorrubio </option>
                            <option value="35"> Rosales </option>
                            <option value="36"> San Fabian </option>
                            <option value="37"> San Jacinto </option>
                            <option value="38"> San Manuel </option>
                            <option value="39"> San Nicolas </option>
                            <option value="40"> San Quintin </option>
                            <option value="4"> Santa Barbara </option>
                            <option value="41"> Santa Maria </option>
                            <option value="42"> Sison </option>
                            <option value="43"> Sual </option>  

                        </select>

                    </div>


                    {/* PLANTING DATE */}

                    <div className={styles.formGroup}>

                        <label htmlFor="planting_date">
                            Planting Date
                        </label>

                        <input
                            id="planting_date"
                            name="planting_date"
                            type="date"
                            value={form.planting_date}
                            onChange={handleChange}
                        />

                    </div>


                    {/* QUANTITY */}

                    <div className={styles.formGroup}>

                        <label htmlFor="quantity">
                            Quantity
                        </label>

                        <input
                            id="quantity"
                            name="quantity"
                            type="text"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="e.g. 20 plants"
                        />

                    </div>


                    {/* GROWING METHOD */}

                    <div className={styles.formGroup}>

                        <label htmlFor="growing_method">
                            Growing Method
                        </label>

                        <select
                            id="growing_method"
                            name="growing_method"
                            value={form.growing_method}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select a growing method
                            </option>

                            <option value="Open Field">
                                Open Field
                            </option>

                            <option value="Container">
                                Container
                            </option>

                            <option value="Raised Bed">
                                Raised Bed
                            </option>

                            <option value="Greenhouse">
                                Greenhouse
                            </option>

                            <option value="Backyard Garden">
                                Backyard Garden
                            </option>

                        </select>

                    </div>


                    {/* NOTES */}

                    <div className={styles.formGroup}>

                        <label htmlFor="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Add any notes about your planting plan..."
                            rows="5"
                        />

                    </div>


                    {/* ACTIONS */}

                    <div className={styles.planFormActions}>

                        <Link
                            href={`/crops/${cropId}`}
                            className={styles.planCancelButton}
                        >
                            Back to Crop
                        </Link>


                        <button
                            type="submit"
                            className={styles.planSubmitButton}
                            disabled={saving}
                        >

                            {saving
                                ? "Creating Plan..."
                                : "Create Planting Plan"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </section>

    );

}