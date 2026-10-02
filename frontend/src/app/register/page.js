"use client";

import Link from "next/link";
import { useState } from "react";

import { registerUser } from "../../services/authService";


const locations = [
    {
        id: 1,
        name: "Dagupan"
    },
    {
        id: 2,
        name: "Lingayen"
    },
    {
        id: 3,
        name: "Urdaneta"
    },
    {
        id: 4,
        name: "Santa Barbara"
    },
    {
        id: 5,
        name: "San Carlos"
    }
];


export default function RegisterPage() {

    const [form, setForm] = useState({

        full_name: "",
        email: "",
        location_id: "",
        password: "",
        confirmPassword: ""

    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);


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


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess(false);


        // Check passwords
        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        if (form.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        setLoading(true);


        try {

            const result =
                await registerUser({

                    full_name:
                        form.full_name,

                    email:
                        form.email,

                    location_id:
                        form.location_id
                            ? Number(
                                form.location_id
                            )
                            : null,

                    password:
                        form.password

                });


            console.log(
                "Registration result:",
                result
            );


            setSuccess(true);


            // Clear form
            setForm({

                full_name: "",
                email: "",
                location_id: "",
                password: "",
                confirmPassword: ""

            });


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to create your account."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <section className="auth-page">

            <div className="auth-card register-card">


                {/* HEADER */}

                <div className="auth-header">

                    <div className="auth-icon">
                        
                    </div>

                    <h1>
                        Create Your Account
                    </h1>

                    <p>
                        Start discovering what you can grow.
                    </p>

                </div>


                {/* SUCCESS */}

                {success && (

                    <div className="auth-success">

                        <strong>
                            Account created successfully!
                        </strong>

                        <p>
                            Your Build & Bloom account
                            has been created. You can
                            now log in.
                        </p>

                        <Link
                            href="/login"
                            className="auth-success-link"
                        >
                            Go to Login →
                        </Link>

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className="auth-error">

                        <strong>
                            Registration failed
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* FORM */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* FULL NAME */}

                    <div className="form-group">

                        <label htmlFor="full_name">
                            Full Name
                        </label>

                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={form.full_name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    {/* LOCATION */}

                    <div className="form-group">

                        <label htmlFor="location_id">
                            Location
                        </label>

                        <select
                            id="location_id"
                            name="location_id"
                            value={form.location_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select your location
                            </option>

                            {locations.map(
                                (location) => (

                                    <option
                                        key={location.id}
                                        value={location.id}
                                    >
                                        {location.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={
                                form.confirmPassword
                            }
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                {/* FOOTER */}

                <div className="auth-footer">

                    <p>

                        Already have an account?{" "}

                        <Link href="/login">
                            Login
                        </Link>

                    </p>

                </div>


            </div>

        </section>

    );

}