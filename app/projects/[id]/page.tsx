"use client"

import ProjectPreview, { ProjectPreviewRef } from "@/components/ProjectPreview"
import Sidebar from "@/components/Sidebar"
import { togglePublish } from "@/lib/actions/project.actions"
import { Project } from "@/lib/constants"
import { router } from "better-auth/api"
import { CpuIcon, Download, EyeIcon, EyeOffIcon, LaptopIcon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, ViewIcon, XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

function Page() {

    const router = useRouter()
    const projectId = useParams()

    const [project, setProject] = useState<Project | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(true)

    const [isGenerating, setIsGenerating] = useState(true)
    const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop")

    const [isPublishing, setIsPublishing] = useState(false)
    const previewRef = useRef<ProjectPreviewRef>(null)

    const handlePublish = async () => {
        if (!project) return
        try {
            setIsPublishing(true)
            await togglePublish(project.id)
            setProject(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null)
            toast.success(project.isPublished ? "Project unpublished" : "Project published successfully")
            router.refresh()
        } catch (error) {
            console.error("Error publishing project:", error)
            toast.error("Failed to update publish status")
        } finally {
            setIsPublishing(false)
        }
    }

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/project/${projectId.id}`)
            if (!response.ok) {
                console.error("Failed to fetch project")
                return
            }
            const data = await response.json()
            console.log(data)
            setProject(data)
            setIsGenerating(data.current_code ? false : true)
        } catch (error) {
            console.error("Error fetching project:", error)
        }
    }

    const downloadCode = () => {
        const code = previewRef.current?.getCode() || project?.current_code
        if (!code) {
            if (isGenerating) {
                return
            }
            return
        }

        const element = document.createElement('a')
        const file = new Blob([code], { type: "text/html" })
        element.href = URL.createObjectURL(file)
        element.download = `index.html`
        element.click()
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
        <div className="flex flex-col h-screen w-full bg-white text-black">
            <header className="flex max-sm:flex-col sm:items-center justify-between gap-4 px-6 py-4 border-b">

                <div className="flex items-center gap-4 sm:min-w-96 text-nowrap">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <Image
                            src="/favicon.png"
                            width={24}
                            height={24}
                            alt="Project Icon"
                            onClick={() => router.push("/")}
                            className="hover:cursor-pointer"
                        />
                    </div>
                    <div className="max-w-60 sm:max-w-xs">
                        <h2 className="text-sm font-semibold truncate text-gray-900">{project.name}</h2>
                        <p className="text-xs text-gray-500">Latest version</p>
                    </div>

                    <div className="sm:hidden flex-1 justify-end">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                            {isMenuOpen ? <MessageSquareIcon className="size-5 text-gray-600" /> : <XIcon className="size-5 text-gray-600" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setDevice('phone')}
                        className={`p-2 rounded-md transition-all duration-200 ${device === 'phone' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
                        title="Mobile view"
                    >
                        <SmartphoneIcon size={18} />
                    </button>
                    <button
                        onClick={() => setDevice('tablet')}
                        className={`p-2 rounded-md transition-all duration-200 ${device === 'tablet' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
                        title="Tablet view"
                    >
                        <TabletIcon size={18} />
                    </button>
                    <button
                        onClick={() => setDevice('desktop')}
                        className={`p-2 rounded-md transition-all duration-200 ${device === 'desktop' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
                        title="Desktop view"
                    >
                        <LaptopIcon size={18} />
                    </button>
                </div>

                <div className="flex items-center justify-end gap-3 flex-1 text-sm">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg font-medium text-gray-600 transition-colors">
                        <SaveIcon size={16} /> Save
                    </button>
                    <Link
                        target='_blank'
                        href={`/preview/${projectId?.id || ''}`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg font-medium text-gray-600 transition-colors"
                    >
                        <ViewIcon size={16} />  Preview
                    </Link>
                    <button onClick={downloadCode} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg font-medium text-gray-600 transition-colors">
                        <Download size={16} />
                        <span>Download</span>
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm disabled:opacity-50 ${project.isPublished
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                            : "bg-black text-white hover:bg-gray-800"
                            }`}>
                        {isPublishing ? (
                            <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        ) : project.isPublished ? (
                            <EyeOffIcon size={16} />
                        ) : (
                            <EyeIcon size={16} />
                        )}
                        <span>
                            {isPublishing ? "Updating..." : (project.isPublished ? "Unpublish" : "Publish")}
                        </span>
                    </button>
                </div>
            </header>

            <div className="flex-1 bg-gray-50 flex overflow-auto">
                <div>
                    <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
                </div>


                <div className="flex-1 p-2">
                    <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} />
                </div>

            </div>
        </div>
    )
}

export default Page