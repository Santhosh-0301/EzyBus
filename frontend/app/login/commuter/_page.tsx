'use client';
import RoleLoginPage from '@/components/RoleLoginPage';

export default function CommuterLoginPage() {
    return (
        <RoleLoginPage
            role="commuter"
            title="Commuter Login"
            icon="🧍"
            accentColor="bg-emerald-600"
            borderColor="border-emerald-500/20"
            shadowColor="shadow-emerald-500/20"
        />
    );
}
