import "leaflet/dist/leaflet.css";
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Cursor from '@/components/Cursor';
import { AuthProvider } from '@/context/AuthContext';
import SimulatorProvider from '@/components/SimulatorProvider';
import DebugPanel from '@/components/DebugPanel';
import TransitBackground from '@/components/TransitBackground';
import { ThemeProvider } from '@/components/ThemeProvider';
import BusDetailsModal from '@/components/ui/BusDetailsModal';
import './globals.css';

export const metadata: Metadata = {
  title: { template: '%s — EzyBus', default: 'EzyBus — Smart Bus Transit Platform' },
  description: 'Real-time bus tracking, route management and fleet monitoring for modern transit systems.',
  keywords: ['bus tracking', 'transit', 'route management', 'fleet monitoring'],
};

export const viewport = {
  themeColor: '#6366f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white min-h-screen antialiased selection:bg-indigo-500/30">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {/* Global custom cursor */}
            <Cursor />

            {/* Background ambient blobs (hidden via CSS in light mode, soft gradient applied) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-transparent dark:to-transparent" aria-hidden>
              <div className="hero-blob bg-indigo-600 w-[600px] h-[600px] -top-40 -left-40 hidden dark:block" />
              <div className="hero-blob bg-cyan-500 w-[400px] h-[400px] top-1/2 right-0 hidden dark:block" style={{ animationDelay: '4s', opacity: 0.06 }} />
              <div className="hero-blob bg-purple-600 w-[500px] h-[500px] bottom-0 left-1/3 hidden dark:block" style={{ animationDelay: '8s', opacity: 0.07 }} />

              {/* Subtle radial light mode gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:hidden" />

              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.018]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)
                  `,
                  backgroundSize: '64px 64px',
                }}
              />
            </div>

            {/* App shell */}
            <div className="relative flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <SimulatorProvider>
                  {children}
                </SimulatorProvider>
              </main>

              {/* Footer */}
              <footer className="border-t border-slate-800/60 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-slate-600 text-xs">
                  <span>© 2025 EzyBus. Smart Transit Platform.</span>
                  <span className="flex items-center gap-1">Built with <span className="text-red-500">♥</span> for modern cities</span>
                </div>
              </footer>
            </div>
            <DebugPanel />
            <BusDetailsModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
