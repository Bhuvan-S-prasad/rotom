import { CpuIcon, Github } from "lucide-react"
import Link from "next/link"

function Footer() {
    return (
        <div className="relative z-10 border-t border-gray-700 bg-white overflow-hidden">
            {/* Ambient Gradient Orbs */}
            <div className="absolute top-[-50%] left-[-10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none mix-blend-multiply z-0" />
            <div className="absolute bottom-[-50%] right-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none mix-blend-multiply z-0" />

            <footer className="relative z-10 flex flex-col items-center justify-around w-full py-10 text-sm bg-transparent text-black">
                <div className="flex flex-row items-center gap-2">
                    <h2 className="font-bold text-2xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent"> Rotom </h2>
                </div>
                <p className="mt-4 text-center">Copyright © 2025 <span className="font-semibold text-neutral-200 hover:text-indigo-400 transition-colors">Rotom</span>. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-6">
                    <span className="font-medium text-neutral-600">built by bhuvan</span>
                    <Link href="https://github.com/Bhuvan-S-prasad" target="_blank" className="text-neutral-500 hover:text-white transition-all transform hover:scale-110">
                        <Github size={20} />
                    </Link>
                </div>
            </footer>
        </div>
    )
}

export default Footer
