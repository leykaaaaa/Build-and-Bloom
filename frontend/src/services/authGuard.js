export function getCurrentUser() {
    if (typeof window === "undefined") {
        return null;
    }

    const user =
        localStorage.getItem("buildAndBloomUser");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error(
            "Failed to read logged-in user:",
            error
        );

        return null;
    }
}


export function isAuthenticated() {
    if (typeof window === "undefined") {
        return false;
    }

    const token =
        localStorage.getItem("buildAndBloomToken");

    return !!token;
}


export function isAdmin() {
    const user = getCurrentUser();

    return (
        user &&
        user.role === "admin"
    );
}