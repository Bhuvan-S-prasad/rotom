import { MessageSquare, Sparkles, Layout } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: <MessageSquare className="size-6 text-white" />,
            color: "bg-blue-600",
            title: "1. Describe",
            description: "Simply type what you want to build. Be as vague or detailed as you like—Rotom understands context."
        },
        {
            icon: <Sparkles className="size-6 text-white" />,
            color: "bg-purple-600",
            title: "2. Generate",
            description: "Our AI analyzes your prompt, enhances it with design best practices, and writes the code instantly."
        },
        {
            icon: <Layout className="size-6 text-white" />,
            color: "bg-pink-600",
            title: "3. Preview",
            description: "See your site come to life in the preview pane. Iterate by asking for changes in natural language."
        }
    ];

    return (
        <section className="w-full max-w-5xl px-4 py-20 border-t border-zinc-100">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                    How it works
                </h2>
                <p className="mt-4 text-lg text-zinc-500">
                    From idea to interface in three simple steps.
                </p>
            </div>

            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-zinc-100 -z-10" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border md:border-none border-zinc-100">
                            <div className={`w-24 h-24 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/5 rotate-3 hover:rotate-6 transition-transform duration-300`}>
                                {step.icon}
                            </div>
                            <h3 className="font-bold text-xl text-zinc-900 mb-3">{step.title}</h3>
                            <p className="text-zinc-500 leading-relaxed max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
