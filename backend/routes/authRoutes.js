const express = require("express");

const {
    registerUser,
    loginUser,
    getAllUsers
} = require("../controllers/authController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
    "/users",
    verifyToken,
    verifyAdmin,
    getAllUsers
);


router.get(
    "/test-auth",
    verifyToken,
    (req, res) => {

        res.json({

            success: true,

            message:
                "Authentication verified.",

            user:
                req.user

        });

    }
);


router.get(
    "/test-admin",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        res.json({

            success: true,

            message:
                "Admin authentication verified.",

            user:
                req.user

        });

    }
);

module.exports = router;