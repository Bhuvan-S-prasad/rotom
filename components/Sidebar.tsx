import { Message, Project, Version } from "@/lib/constants";
import { BotIcon, ChevronLeft, ChevronRight, Clock, CodeIcon, EyeIcon, MessageSquare, RefreshCcw, SendIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Props {
    isMenuOpen: boolean;
    project: Project;
    setProject: (project: Project) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
}

function Sidebar({ isMenuOpen, project, setProject, isGenerating, setIsGenerating }: Props) {
    const messageRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");

    const handleRollBack = async (versionId: string) => {
        try {
            setIsGenerating(true);
            const response = await fetch(`/api/project/${project.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ versionId }),
            });

            if (!response.ok) {
                console.error("Failed to rollback");
                return;
            }

            const updatedProject = await response.json();
            setProject(updatedProject);
        } catch (error) {
            console.error("Error rolling back:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;

        // Optimistic update for user message
        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        };

        const updatedConversation = [...project.conversation, newUserMessage];
        setProject({
            ...project,
            conversation: updatedConversation
        });

        const currentInput = input;
        setInput("");
        setIsGenerating(true);

        try {
            const response = await fetch(`/api/project/${project.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: currentInput }),
            });

            if (!response.ok) {
                console.error("Failed to send message");
                // Ideally handle error state here (e.g. toast notification)
                return;
            }

            const updatedProject = await response.json();
            setProject(updatedProject);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [project.conversation.length, project.versions.length, isGenerating]);

    return (
        <div
            className={`h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col ${isMenuOpen ? "w-full sm:w-96 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full overflow-hidden"
                }`}
        >
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pt-5 bg-dot-pattern">
                {[...project.conversation, ...project.versions]
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map((item) => {
                        const isMessage = "content" in item;

                        if (isMessage) {
                            const msg = item as Message;
                            const isUser = msg.role === "user";
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className={`shrink-0 size-8 rounded-full flex items-center justify-center shadow-sm ${isUser ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-blue-600"
                                        }`}>
                                        {isUser ? <div className="text-xs font-bold">U</div> : <BotIcon size={16} />}
                                    </div>

                                    <div className={`max-w-[85%] space-y-1 ${isUser ? "items-end flex flex-col" : "items-start flex flex-col"}`}>
                                        <div
                                            className={`p-3.5 px-5 rounded-2xl shadow-sm text-sm leading-relaxed ${isUser
                                                ? "bg-linear-to-br from-gray-900 to-gray-800 text-white rounded-tr-none"
                                                : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-gray-400 px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        } else {
                            const ver = item as Version;
                            const isCurrent = project.current_version_index === ver.id;

                            return (
                                <div key={ver.id} className="flex justify-center my-4">
                                    <div className={`w-[90%] bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${isCurrent ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-200'}`}>
                                        <div className="bg-gray-50/50 p-2.5 px-4 border-b border-gray-100 flex items-center gap-2">
                                            <div className="p-1 bg-green-100 text-green-600 rounded-md">
                                                <CodeIcon size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-gray-700">Code Updated</p>
                                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(ver.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-2 bg-white flex items-center justify-between gap-2">
                                            {isCurrent ? (
                                                <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                                                    Current
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleRollBack(ver.id)}
                                                    className="flex-1 text-xs flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md hover:bg-gray-100 text-gray-600 transition-colors font-medium border border-transparent hover:border-gray-200"
                                                >
                                                    <RefreshCcw size={12} /> Rollback
                                                </button>
                                            )}

                                            <Link
                                                target="_blank"
                                                href={`/preview/${project.id}/${ver.id}`}
                                                className="flex items-center gap-1.5 text-xs py-1.5 px-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                                            >
                                                <EyeIcon size={12} /> View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}

                {isGenerating && (
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 size-8 rounded-full bg-white border border-gray-200 text-blue-600 flex items-center justify-center shadow-sm">
                            <Sparkles size={16} className="animate-pulse" />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Generating code</span>
                            <div className="flex gap-1">
                                <span className="size-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="size-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="size-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messageRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form
                    onSubmit={handleSendMessage}
                    className="relative flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm"
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        rows={1}
                        placeholder="Describe what you want to build..."
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none resize-none min-h-[44px] max-h-32 custom-scrollbar"
                        disabled={isGenerating}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isGenerating}
                        className={`p-2.5 rounded-lg transition-all duration-200 ${input.trim() && !isGenerating
                            ? "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:scale-105"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {isGenerating ? (
                            <div className="size-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <SendIcon size={18} />
                        )}
                    </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    AI can make mistakes. Review generated code.
                </p>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                .bg-dot-pattern {
                    background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
}

export default Sidebar;