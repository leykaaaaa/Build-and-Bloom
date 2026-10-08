"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    isAuthenticated,
    isAdmin
} from "../../services/authGuard";

export default function AdminLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
            return;
        }

        if (!isAdmin()) {
            router.replace("/dashboard");
        }
    }, [router]);

    if (
        !isAuthenticated() ||
        !isAdmin()
    ) {
        return null;
    }

    return children;
}