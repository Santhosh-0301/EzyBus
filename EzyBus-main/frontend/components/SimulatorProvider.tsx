'use client';

import { useEffect } from 'react';
import { startBusSimulator, stopBusSimulator } from '@/utils/busSimulator';
import { useBusStore } from '@/store/busStore';

/**
 * Mount this once inside a layout to start the bus simulator.
 * It is a client component so it runs only in the browser.
 * Safe to mount multiple times — simulator skips if already running.
 */
export default function SimulatorProvider({ children }: { children?: React.ReactNode }) {
    useEffect(() => {
        const cleanup = startBusSimulator();
        return cleanup;
    }, []);

    return <>{children}</>;
}
