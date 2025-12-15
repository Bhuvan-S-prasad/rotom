import { CpuIcon } from "lucide-react"
import Link from "next/link"

function Footer() {
    return (
        <footer className="flex flex-col items-center justify-around w-full py-10 text-sm bg-neutral-900 text-gray-400">
            <div className="flex flex-row items-center gap-2">
                <CpuIcon />
                <h2 className="font-semibold text-2xl"> Rotom </h2>
            </div>
            <p className="mt-4 text-center">Copyright © 2025 <span className="text-purple-400 hover:text-blue-300 transition-colors">Rotom</span>. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-6">
                <Link href="#" className="font-medium text-gray-400 hover:text-white transition-all">
                    Brand Guidelines
                </Link>
                <div className="h-4 w-px bg-gray-600"></div>
                <Link href="#" className="font-medium text-gray-400 hover:text-white transition-all">
                    Trademark Policy
                </Link>
            </div>
        </footer>
    )
}

export default Footer
