import { CpuIcon } from "lucide-react"
import Link from "next/link"

function Footer() {
    return (
        <div className="relative z-10 border-t border-gray-700 bg-transparent">
            <footer className="flex flex-col items-center justify-around w-full py-10 text-sm bg-white text-black">
                <div className="flex flex-row items-center gap-2">
                    <CpuIcon />
                    <h2 className="font-semibold text-2xl"> Rotom </h2>
                </div>
                <p className="mt-4 text-center">Copyright © 2025 <span className="text-black hover:text-purple-600 transition-colors">Rotom</span>. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-6">
                    <Link href="#" className="font-medium text-gray-400 hover:text-black transition-all">
                        Brand Guidelines
                    </Link>
                    <div className="h-4 w-px bg-black"></div>
                    <Link href="#" className="font-medium text-gray-400 hover:text-black transition-all">
                        Trademark Policy
                    </Link>
                </div>
            </footer>
        </div>
    )
}

export default Footer
