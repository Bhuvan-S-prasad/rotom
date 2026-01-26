"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { Toaster } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { GlobalErrorProvider } from "@/lib/context/global-error-context"
import { ErrorDisplay } from "@/components/ErrorDisplay"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={() => {
                // Clear router cache (protected routes)
                router.refresh()
            }}
            Link={Link}
        >
            <GlobalErrorProvider>
                {children}
                <ErrorDisplay />
            </GlobalErrorProvider>
            <Toaster richColors position="top-center" />
        </AuthUIProvider>
    )
}