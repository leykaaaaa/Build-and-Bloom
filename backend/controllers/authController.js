const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
    REGISTER
*/
const registerUser = async (req, res) => {

    try {

        const {
            full_name,
            email,
            location_id,
            password
        } = req.body;


        // Validate required fields
        if (
            !full_name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Full name, email, and password are required."
            });

        }


        // Check if email already exists
        const [existingUsers] = await pool.query(
            `
            SELECT user_id
            FROM users
            WHERE email = ?
            `,
            [email]
        );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists."
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const [result] = await pool.query(
            `
            INSERT INTO users (
                full_name,
                email,
                password,
                location_id
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                full_name,
                email,
                hashedPassword,
                location_id || null
            ]
        );


        res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            user: {
                user_id: result.insertId,
                full_name,
                email,
                location_id:
                    location_id || null
            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create account."

        });

    }

};


/*
    LOGIN
*/
const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validate fields
        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        // Find user
        const [users] = await pool.query(
            `
            SELECT
    user_id,
    full_name,
    email,
    password,
    role,
    location_id
FROM users
WHERE email = ?
            `,
            [email]
        );


        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const user = users[0];


        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }
        
        const token = jwt.sign(
    {
        user_id: user.user_id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "2h"
    }
);


        // Do NOT send password to frontend
        res.json({

    success: true,

    message:
        "Login successful.",

    token,

    user: {

    user_id:
        user.user_id,

    full_name:
        user.full_name,

    email:
        user.email,

    role:
        user.role,

    location_id:
        user.location_id

}

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to login."

        });

    }

};


/*
    GET ALL USERS
*/
const getAllUsers = async (req, res) => {

    try {

        const [users] = await pool.query(
            `
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.location_id,
                l.location_name,
                u.created_at
            FROM users u
            LEFT JOIN locations l
                ON u.location_id = l.location_id
            ORDER BY u.created_at DESC
            `
        );

        res.json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        console.error(
            "User retrieval error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve users."
        });

    }

};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
};
