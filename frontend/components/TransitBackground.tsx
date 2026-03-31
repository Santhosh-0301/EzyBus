"use client";

import { motion } from "framer-motion";

export default function TransitBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-15">
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="route1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="route2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Route 1 */}
                <motion.path
                    d="M -100 200 C 300 100, 400 400, 600 400 S 800 600, 1100 500"
                    stroke="url(#route1)"
                    strokeWidth="2"
                    fill="none"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                />
                {/* Nodes for Route 1 */}
                <motion.circle cx="350" cy="280" r="4" fill="#6366f1" filter="url(#glow)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                <motion.circle cx="600" cy="400" r="5" fill="#6366f1" filter="url(#glow)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />

                {/* Route 2 */}
                <motion.path
                    d="M 1100 200 C 800 300, 700 300, 500 500 S 300 700, -100 800"
                    stroke="url(#route2)"
                    strokeWidth="2"
                    fill="none"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "mirror", delay: 2 }}
                />
                {/* Nodes for Route 2 */}
                <motion.circle cx="750" cy="300" r="4" fill="#06b6d4" filter="url(#glow)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
                <motion.circle cx="500" cy="500" r="5" fill="#06b6d4" filter="url(#glow)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 1.5 }} />
                <motion.circle cx="200" cy="740" r="4" fill="#06b6d4" filter="url(#glow)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3.5, repeat: Infinity, delay: 2 }} />

            </svg>
        </div>
    );
}
