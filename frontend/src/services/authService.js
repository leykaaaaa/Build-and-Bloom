const API_URL = "http://localhost:5000";


export async function registerUser(userData) {

    const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );


    const result = await response.json();


    if (!response.ok) {

        throw new Error(
            result.message ||
            "Failed to create account."
        );

    }


    return result;

}


export async function loginUser(loginData) {

    const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)
        }
    );


    const result = await response.json();


    if (!response.ok) {

        throw new Error(
            result.message ||
            "Failed to login."
        );

    }


    return result;

}