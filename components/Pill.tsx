function Pill() {
    return (
        <div className="flex justify-center mt-16">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-400 via-purple-500 to-blue-700 blur-[6px] opacity-70 border-blue-600" />

                <div className="relative inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-black bg-linear-to-b from-white/10 to-white/5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition hover:bg-white/10" >
                    <span className="text-blue-400 font-semibold">⚡</span>
                    <span>Introducing Rotom</span>
                </div>
            </div>
        </div>
    );
}


export default Pill