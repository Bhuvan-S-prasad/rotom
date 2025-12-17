"use client"

import ProjectPreview from "@/components/ProjectPreview"
import { Project } from "@/lib/constants"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

function Page() {

    const projectId = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [isGenerating, setIsGenerating] = useState(true)

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/project/${projectId.id}`)
            if (!response.ok) {
                console.error("Failed to fetch project")
                return
            }
            const data = await response.json()
            setProject(data)
            setIsGenerating(data.current_code ? false : true)
        } catch (error) {
            console.error("Error fetching project:", error)
        }
    }

    useEffect(() => {
        fetchProject()
    }, [projectId.id])


    if (!project) return (
        <div className="flex items-center justify-center h-screen w-full bg-white text-black">
            <span className="animate-pulse">Loading project...</span>
        </div>
    )

    return (
        <div className="h-screen w-screen bg-gray-100 overflow-hidden">
            <ProjectPreview
                project={project}
                isGenerating={isGenerating}
                device="desktop"
                showEditorPanel={true}
            />
        </div>
    )
}

export default Page