import { Palette, Smartphone, Zap, Code2 } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: <Zap className="size-6 text-yellow-500" />,
            title: "Lightning Fast Generation",
            description: "Turn your text descriptions into working code in seconds using advanced AI models."
        },
        {
            icon: <Palette className="size-6 text-pink-500" />,
            title: "Beautiful Design",
            description: "Generated UIs come with modern aesthetics, harmonious color palettes, and polished typography."
        },
        {
            icon: <Smartphone className="size-6 text-blue-500" />,
            title: "Fully Responsive",
            description: "Components are built with mobile-first principles, ensuring they look great on any device."
        },
        {
            icon: <Code2 className="size-6 text-green-500" />,
            title: "Community Showcase",
            description: "Publish your designs to the community and share your creations with other designers."
        }
    ];

    return (
        <section className="w-full max-w-5xl px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                    Everything you need to prototype
                </h2>
                <p className="mt-4 text-lg text-zinc-500">
                    Focus on the design and user experience. Let AI handle the implementation details.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="font-semibold text-lg text-zinc-900 mb-2">{feature.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
