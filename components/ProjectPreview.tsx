import { iframeScript, Project } from "@/lib/constants";
import { forwardRef, useEffect, useRef, useState } from "react"
import EditorPanel from "./EditorPannel";

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

    const [selectedElement, setSelectedElement] = useState<any>(null);

    const resolutions = {
        phone: 'w-[412px] py-10',
        tablet: 'w-[768px]',
        desktop: 'w-full'
    }

    const handleUpdate = (updates: any) => {
        if (!iframeRef.current?.contentWindow) return;
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT', payload: updates }, '*')
    }

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(event.data.payload);
            }
            else if (event.data.type === 'CLEAR_SELECTION') {
                setSelectedElement(null);
            }
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

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
                        className={`h-full rounded max-sm:w-full ${resolutions[device]} transition-all justify-center`}

                    />
                    {showEditorPanel && selectedElement && (
                        <EditorPanel selectedElement={selectedElement}
                            onUpdate={handleUpdate}
                            onClose={() => {
                                setSelectedElement(null);
                                if (iframeRef.current?.contentWindow) {
                                    iframeRef.current.contentWindow.postMessage({ type: 'CLEAR_SELECTION_REQUEST' }, '*')
                                }
                            }} />)}

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