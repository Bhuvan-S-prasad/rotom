"use client"

import { Trash2Icon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Project {
    id: string;
    name: string;
    initial_prompt: string;
    current_code: string | null;
    createdAt: Date;
    user?: {
        name: string | null;
    };
}

interface ProjectCardProps {
    project: Project;
    isPublic?: boolean;
}

export default function ProjectCard({ project, isPublic = false }: ProjectCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/project/${project.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
            } else {
                console.error("Failed to delete project");
                toast.error("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Error deleting project");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
            <div className="relative h-48 bg-gray-100 overflow-hidden border-b border-gray-100">
                {project.current_code ? (
                    <div className="w-[200%] h-[200%] origin-top-left transform scale-50 pointer-events-none select-none">
                        <iframe
                            srcDoc={project.current_code}
                            className="w-full h-full border-none"
                            title={project.name}
                            tabIndex={-1}
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-gray-50 rounded-full">
                                <EyeIcon size={24} />
                            </div>
                            <span className="text-sm">No Preview</span>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {project.name}
                    </h3>
                    {isPublic && project.user && (
                        <p className="text-xs text-gray-400 mb-2">
                            by {project.user.name || "Anonymous"}
                        </p>
                    )}
                    {!isPublic && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                            title="Delete project"
                        >
                            <Trash2Icon size={18} />
                        </button>
                    )}
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                    {project.initial_prompt}
                </p>

                <div className="flex gap-3">
                    {!isPublic ? (
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex-1 text-center py-2.5 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all font-medium text-sm shadow-sm hover:shadow-md"
                        >
                            Open Project
                        </Link>
                    ) : (
                        <Link
                            href={`/preview/${project.id || ''}`}
                            target="_blank"
                            className="flex-1 text-center py-2.5 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all font-medium text-sm shadow-sm hover:shadow-md"
                        >
                            View Project
                        </Link>
                    )}

                    {!isPublic && (
                        <Link
                            href={`/preview/${project.id || ''}`}
                            target="_blank"
                            className="flex items-center justify-center py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:scale-[0.98] transition-all font-medium text-sm shadow-sm hover:shadow-md"
                            title="Preview"
                        >
                            <EyeIcon size={18} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
