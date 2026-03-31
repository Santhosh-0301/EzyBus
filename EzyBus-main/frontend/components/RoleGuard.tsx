"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RoleGuard({ allowedRole, children }: { allowedRole: string, children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/login/commuter"); // Default login if none specified
            return;
        }

        if (user.role !== allowedRole) {
            router.push(`/dashboard/${user.role}`);
        }
    }, [user, loading, allowedRole, router]);

    if (loading || !user || user.role !== allowedRole) return null;

    return <>{children}</>;
}
