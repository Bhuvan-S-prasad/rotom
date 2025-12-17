import { iframeScript, Project } from "@/lib/constants";
import { forwardRef, useRef } from "react"

export interface ProjectPreviewRef {
    getCode: () => string | undefined;
}

interface ProjectPreviewProps {
    project: Project;
    isGenerating: boolean;
    device?: 'phone' | 'tablet' | 'desktop';
    showEditorPanel?: boolean;
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({ project, isGenerating, device = 'desktop', showEditorPanel = true }, ref) => {

    const iframeRef = useRef<HTMLIFrameElement>(null)

    const resolutions = {
        phone: 'w-[412px] py-10',
        tablet: 'w-[768px]',
        desktop: 'w-full'
    }

    const injectPreview = (html: string) => {
        if (!html) return '';
        if (!showEditorPanel) return html;

        if (html.includes('</body>')) {
            return html.replace('</body>', iframeScript + '</body>')
        }
        else {
            return html + iframeScript;
        }
    }

    return (
        <div className="flex relative h-full bg-gray-200 flex-1 items-center justify-center overflow-hidden max-sm:ml-2">
            {project.current_code ? (
                <>
                    <iframe
                        ref={iframeRef}
                        srcDoc={injectPreview(project.current_code)}
                        className={`h-full roundedmax-sm:w-full ${resolutions[device]} transition-all justify-center`}

                    />

                </>
            ) : isGenerating && (
                <div>
                    <span>Generating...</span>
                </div>
            )}
        </div>
    )
})

export default ProjectPreview