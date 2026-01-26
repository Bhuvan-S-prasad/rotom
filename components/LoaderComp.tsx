"use client"

import {
    CircleIcon,
    ScanLineIcon,
    SquareIcon,
    TriangleIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

const steps = [
    { icon: ScanLineIcon, label: "Analyzing..." },
    { icon: SquareIcon, label: "Generating..." },
    { icon: TriangleIcon, label: "Assembling..." },
    { icon: CircleIcon, label: "Finalizing..." },
]

const STEP_DURATION = 45000

function LoaderComp() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((s) => (s + 1) % steps.length)
        }, STEP_DURATION)

        return () => clearInterval(interval)
    }, [])

    const Icon = steps[current].icon

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-indigo-400/40 animate-ping" />

                    <div className="absolute inset-2 rounded-full border border-purple-400/30" />

                    <Icon className="relative z-10 w-8 h-8 text-slate-900 animate-bounce" />
                </div>

                <div className="flex flex-col items-center h-12">
                    <p
                        key={current}
                        className="text-lg font-light text-slate-900 tracking-wide transition-opacity duration-700"
                    >
                        {steps[current].label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        this may take some time
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoaderComp
