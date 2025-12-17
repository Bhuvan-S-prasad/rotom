import { X, Type, Layout, Palette, MousePointer2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        className: string;
        text: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;
        };

    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}

function EditorPanel({ selectedElement, onUpdate, onClose }: EditorPanelProps) {

    const [values, setValues] = useState(selectedElement)

    useEffect(() => {
        setValues(selectedElement)
    }, [selectedElement])

    const handleChange = (field: string, value: string) => {
        if (!values) return;
        const newValue = { ...values, [field]: value } as typeof values;
        setValues(newValue);
        onUpdate({ [field]: value })
    }

    const handleStyleChange = (styleName: string, value: string) => {
        if (!values) return;
        const newStyles = { ...values.styles, [styleName]: value };
        setValues({ ...values, styles: newStyles });
        onUpdate({ styles: { [styleName]: value } })
    }

    if (!selectedElement || !values) return null;

    return (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-right-5 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                        <MousePointer2 size={14} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm">Edit Element</h3>
                        <p className="text-[10px] text-gray-400 font-mono lowercase">&lt;{values.tagName}&gt;</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

                {/* Content Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Type size={12} />
                        <span>Content</span>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Text Content</label>
                            <textarea
                                value={values.text}
                                onChange={(e) => handleChange('text', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[80px] text-gray-700 resize-none font-sans"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Class Name</label>
                            <input
                                type='text'
                                value={values.className || ''}
                                onChange={(e) => handleChange('className', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-mono text-xs"
                                placeholder="e.g. flex items-center..."
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Layout Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Layout size={12} />
                        <span>Layout</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Padding</label>
                            <input
                                type="text"
                                value={values.styles.padding}
                                onChange={(e) => handleStyleChange('padding', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700"
                                placeholder="e.g. 1rem"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Margin</label>
                            <input
                                type="text"
                                value={values.styles.margin}
                                onChange={(e) => handleStyleChange('margin', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700"
                                placeholder="e.g. 1rem"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Appearance Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Palette size={12} />
                        <span>Appearance</span>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Font Size</label>
                            <input
                                type="text"
                                value={values.styles.fontSize}
                                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700"
                                placeholder="e.g. 16px"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-600">Background</label>
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1.5">
                                    <div className="relative overflow-hidden w-6 h-6 rounded-md border border-gray-200 shadow-sm shrink-0">
                                        <input
                                            type="color"
                                            value={values.styles.backgroundColor === 'rgba(0, 0, 0, 0)' ? '#ffffff' : values.styles.backgroundColor}
                                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 truncate flex-1 font-mono">
                                        {values.styles.backgroundColor === 'rgba(0, 0, 0, 0)' ? 'None' : values.styles.backgroundColor}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-600">Text Color</label>
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1.5">
                                    <div className="relative overflow-hidden w-6 h-6 rounded-md border border-gray-200 shadow-sm shrink-0">
                                        <input
                                            type="color"
                                            value={values.styles.color === 'rgba(0, 0, 0, 0)' ? '#000000' : values.styles.color}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 truncate flex-1 font-mono">
                                        {values.styles.color}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
export default EditorPanel