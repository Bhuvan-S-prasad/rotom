
import { getPublishedProjects } from "@/lib/actions/project.actions";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
    const { projects } = await getPublishedProjects(1, 100);

    return (
        <div className="min-h-scree my-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Showcase</h1>
                    <p className="text-lg text-gray-600">
                        Discover amazing websites created by others.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="h-[400px]">
                            <ProjectCard project={project} isPublic={true} />
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No published projects yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}