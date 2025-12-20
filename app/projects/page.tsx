import { getUserProjects } from "@/lib/actions/project.actions";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = 'force-dynamic';

async function Page() {
    const projects = await getUserProjects();

    return (
        <div className="mt-20 min-h-screen">
            <div className="container mb-20 mx-auto px-4 md:px-8 py-12 max-w-7xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Projects</h1>
                        <p className="text-gray-500 mt-2">Manage and view all your generated websites</p>
                    </div>

                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all font-medium"
                    >
                        <PlusIcon size={20} className="stroke-[2.5]" />
                        <span>Create Project</span>
                    </Link>
                </div>

                {!projects || projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white rounded-3xl border border-dashed border-gray-300 p-8 text-center animate-in fade-in duration-500">
                        <div className="p-4 bg-blue-50 rounded-full mb-4">
                            <PlusIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Start your journey by creating your first AI-generated website. It only takes a prompt!
                        </p>
                        <Link
                            href="/"
                            className="text-blue-600 font-medium hover:text-blue-700 hover:underline underline-offset-4"
                        >
                            Create your first project &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Page