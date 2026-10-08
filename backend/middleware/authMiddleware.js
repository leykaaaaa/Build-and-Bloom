const jwt = require("jsonwebtoken");


/*
    VERIFY LOGIN
*/
const verifyToken = (req, res, next) => {

    try {

        const token =
            req.headers.authorization?.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        req.user = decoded;


        next();


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired authentication token."

        });

    }

};


/*
    VERIFY ADMIN
*/
const verifyAdmin = (req, res, next) => {

    if (
        !req.user ||
        req.user.role !== "admin"
    ) {

        return res.status(403).json({

            success: false,

            message:
                "Admin access required."

        });

    }


    next();

};


module.exports = {
    verifyToken,
    verifyAdmin
};