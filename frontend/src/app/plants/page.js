"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    getPlantingPlans,
    updatePlantingPlanStatus
} from "../../services/plantingPlanService";


const statusOptions = [
    "Planned",
    "Growing",
    "Harvested",
    "Completed"
];


export default function MyPlantsPage() {

    const router = useRouter();

    const [user, setUser] = useState(null);

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [updatingPlanId, setUpdatingPlanId] =
        useState(null);


    useEffect(() => {

        async function loadPlans() {

            try {

                /*
                    Get the currently logged-in user
                    from localStorage.
                */

                const storedUser =
                    localStorage.getItem(
                        "buildAndBloomUser"
                    );


                /*
                    If there is no logged-in user,
                    redirect to login.
                */

                if (!storedUser) {

                    router.push("/login");

                    return;

                }


                /*
                    Convert stored JSON string
                    into a JavaScript object.
                */

                const parsedUser =
                    JSON.parse(storedUser);


                /*
                    Make sure the stored user
                    has a valid user ID.
                */

                if (!parsedUser.user_id) {

                    setError(
                        "Unable to identify your account. Please log in again."
                    );

                    setLoading(false);

                    return;

                }


                setUser(parsedUser);


                /*
                    Get only the planting plans
                    belonging to this user.
                */

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
                    "Unable to load your planting plans."
                );

            } finally {

                setLoading(false);

            }

        }


        loadPlans();

    }, [router]);


    /*
        UPDATE PLANTING PLAN STATUS
    */

    async function handleStatusChange(
        planId,
        newStatus
    ) {

        if (!user?.user_id) {
            return;
        }


        try {

            setUpdatingPlanId(planId);

            setError("");


            await updatePlantingPlanStatus(
                planId,
                user.user_id,
                newStatus
            );


            /*
                Update the status locally
                after the database update succeeds.
            */

            setPlans((currentPlans) =>
                currentPlans.map((plan) =>
                    plan.plan_id === planId
                        ? {
                            ...plan,
                            status: newStatus
                        }
                        : plan
                )
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to update planting plan status."
            );

        } finally {

            setUpdatingPlanId(null);

        }

    }


    if (loading) {

        return (

            <section className="plants-page">

                <div className="plants-container">

                    <div className="catalogue-state">

                        <p>
                            Loading your planting plans...
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    return (

        <section className="plants-page">

            <div className="plants-container">


                {/* HEADER */}

                <div className="plants-header">

                    <div>

                        <span className="section-badge">
                             Build & Bloom
                        </span>

                        <h1>
                            My Plants
                        </h1>

                        <p>
                            Keep track of the crops you plan
                            to grow and manage your planting
                            activities.
                        </p>

                    </div>


                    <Link
                        href="/crops"
                        className="create-plant-button"
                    >
                        + Plan a Plant
                    </Link>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="assessment-error">

                        <span>
                            ️
                        </span>

                        <div>

                            <strong>
                                Unable to update plans
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* EMPTY STATE */}

                {!error && plans.length === 0 && (

                    <div className="plants-empty">

                        <div className="plants-empty-icon">
                            
                        </div>

                        <h2>
                            No planting plans yet
                        </h2>

                        <p>
                            Start by exploring the crop catalogue
                            and create your first planting plan.
                        </p>

                        <Link
                            href="/crops"
                            className="assessment-submit"
                        >
                            Explore Crops →
                        </Link>

                    </div>

                )}


                {/* PLANS */}

                {plans.length > 0 && (

                    <div className="plants-grid">

                        {plans.map((plan) => (

                            <article
                                className="plant-plan-card"
                                key={plan.plan_id}
                            >


                                {/* CARD HEADER */}

                                <div className="plant-plan-top">

                                    <div className="plant-plan-icon">
                                        
                                    </div>

                                    <div>

                                        <span>
                                            {plan.category}
                                        </span>

                                        <h2>
                                            {plan.plan_name}
                                        </h2>

                                    </div>

                                </div>


                                {/* CROP */}

                                <div className="plant-plan-crop">

                                    <strong>
                                        {plan.crop_name}
                                    </strong>

                                </div>


                                {/* DETAILS */}

                                <div className="plant-plan-details">

                                    <div>

                                        <span>
                                             Location
                                        </span>

                                        <strong>
                                            {plan.location_name ||
                                                "Not specified"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                             Planting Date
                                        </span>

                                        <strong>
                                            {plan.planting_date
                                                ? new Date(
                                                    plan.planting_date
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    }
                                                )
                                                : "Not specified"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                             Growing Method
                                        </span>

                                        <strong>
                                            {plan.growing_method ||
                                                "Not specified"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                             Quantity
                                        </span>

                                        <strong>
                                            {plan.quantity ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="plant-plan-status-section">

                                    <div>

                                        <span className="plant-status-label">
                                            Plant Status
                                        </span>

                                        <select
                                            value={
                                                plan.status ||
                                                "Planned"
                                            }
                                            disabled={
                                                updatingPlanId ===
                                                plan.plan_id
                                            }
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    plan.plan_id,
                                                    event.target.value
                                                )
                                            }
                                            className="plant-status-select"
                                        >

                                            {statusOptions.map(
                                                (status) => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {updatingPlanId ===
                                        plan.plan_id && (

                                        <span className="plant-status-saving">
                                            Saving...
                                        </span>

                                    )}

                                </div>


                                {/* FOOTER */}

                                <div className="plant-plan-footer">

                                    <span
                                        className={`plant-status status-${(
                                            plan.status ||
                                            "Planned"
                                        )
                                            .toLowerCase()
                                            .replaceAll(
                                                " ",
                                                "-"
                                            )}`}
                                    >
                                        {plan.status ||
                                            "Planned"}
                                    </span>


                                    <span className="plant-plan-id">
                                        Plan #{plan.plan_id}
                                    </span>

                                </div>


                            </article>

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

}