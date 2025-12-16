import { AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params

    return (
        <main className="min-h-screen bg-linear-to-t from-blue-800 to-white mt-15 container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
            <AuthView path={path} className="bg-blue-400/30 ring ring-blue-600 text-black " />
        </main>
    )
}