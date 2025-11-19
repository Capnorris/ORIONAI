import { PowerSyncProvider } from '@/providers/powersync-provider';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PowerSyncProvider>
            {children}
        </PowerSyncProvider>
    );
}
