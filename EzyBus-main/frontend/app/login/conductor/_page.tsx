'use client';
import RoleLoginPage from '@/components/RoleLoginPage';

export default function ConductorLoginPage() {
    return (
        <RoleLoginPage
            role="conductor"
            title="Conductor Login"
            icon="👨‍✈️"
            accentColor="bg-amber-500"
            borderColor="border-amber-500/20"
            shadowColor="shadow-amber-500/20"
        />
    );
}
