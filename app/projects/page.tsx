"use client"

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Project {
    id: string;
    name: string;
    initial_prompt: string;
    current_code: string;
    createdAt: string;
}

function Page() {
    const router = useRouter();

    return (
        <div>
            <div className="px-5 min-h-screen md:px-16 lg:px-24 xl:px-32">
                <div className="py-10 min-h-[80vh]">
                    <div className="flex items-center justify-between mb-12">
                        <h1 className="text-2xl font-medium text-white">Projects</h1>
                        <button
                            className="flex items-center gap-2 text-white px-3 rounded-2xl bg-linear-to-br from-purple-500 to-blue-500 hover:opacity-90 active:scale-95 transition-all"
                            onClick={() => router.push('/')}
                        >
                            <PlusIcon size={20} />create project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page