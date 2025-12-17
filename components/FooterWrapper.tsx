"use client"

import { usePathname } from "next/navigation"
import Footer from "./Footer"

export default function FooterWrapper() {
    const pathname = usePathname()
    const isProjectDetailPage = pathname.startsWith("/projects/") && pathname.split("/").length > 2

    if (isProjectDetailPage) {
        return null
    }

    return <Footer />
}
