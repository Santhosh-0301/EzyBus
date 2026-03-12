'use client';
import RoleLoginPage from '@/components/RoleLoginPage';

export default function AdminLoginPage() {
    return (
        <RoleLoginPage
            role="admin"
            title="Admin Login"
            icon="⚙️"
            accentColor="bg-purple-600"
            borderColor="border-purple-500/20"
            shadowColor="shadow-purple-500/20"
        />
    );
}
