"use client"

import * as motion from "motion/react-client"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
   const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const toggleSwitch = () => setIsDark(!isDark);
    return (
        <div className="relative">
        <button
            className="fixed toggle-container top-4 right-4 py-2 px-1.5 dark:bg-slate-700 bg-slate-700"
            style={{
                ...container,
                justifyContent: "flex-" + (isDark ? "start" : "end"),
            }}
            onClick={toggleSwitch}
        >
            <motion.div
                className="toggle-handle absolute top-1/2 -translate-y-1/2 dark:bg-white bg-black"
                style={handle}
                layout
                transition={{
                    type: "spring",
                    visualDuration: 0.2,
                    bounce: 0.2,
                }}
            />
        </button>
        </div>
    )
}

const container = {
    width: 91,
    height: 46,
    borderRadius: 50,
    cursor: "pointer",
    display: "flex"
}

const handle = {
    width: 37,
    height: 37,
    borderRadius: "50%",
}
