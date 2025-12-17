"use client"

import { usePathname } from "next/navigation"
import { NavBar } from "./Navbar"

export function NavbarWrapper() {
    const pathname = usePathname()

    // Check if the current path starts with /projects/ and has an ID following it
    // This allows /projects (list) to show navbar, but /projects/[id] to hide it
    // Assuming the structure is exactly /projects/[id]
    const isProjectDetailPage = pathname.startsWith("/projects/") && pathname.split("/").length > 2

    if (isProjectDetailPage) {
        return null
    }

    return <NavBar />
}
