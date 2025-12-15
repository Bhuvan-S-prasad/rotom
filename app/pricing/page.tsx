import { pricing } from "@/lib/constants"

function Page() {

    const pricingData = pricing;

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-blue-400 pt-28 pb-20">
            <div>
                <p className="text-center uppercase font-bold text-purple-600">PRICING</p>
                <h3 className="text-3xl font-semibold text-center mx-auto mt-2">Pay as you go</h3>

                <div className="flex flex-wrap items-center justify-center gap-6 mt-16 w-full">
                    {pricingData.map((plan) => (
                        <div
                            key={plan.title}
                            className={`p-6 rounded-2xl max-w-80 w-full shadow-[0px_4px_26px] shadow-black/5 ${plan.mostPopular
                                ? 'relative pt-12 bg-linear-to-b from-blue-400 to-blue-600 text-white'
                                : 'bg-white/50'
                                }`}
                        >
                            {plan.mostPopular && (
                                <div className="flex items-center text-xs gap-1 py-1.5 px-2 text-blue-600 absolute top-4 right-4 rounded bg-white font-medium">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-sparkles-icon lucide-sparkles"
                                    >
                                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                                        <path d="M20 2v4" />
                                        <path d="M22 4h-4" />
                                        <circle cx="4" cy="20" r="2" />
                                    </svg>
                                    <p>Most Popular</p>
                                </div>
                            )}

                            <p className={`font-medium ${plan.mostPopular ? 'text-white' : ''}`}>
                                {plan.title}
                            </p>
                            <h4
                                className={`text-3xl font-semibold mt-1 ${plan.mostPopular ? 'text-white' : ''
                                    }`}
                            >
                                ${plan.price}
                                <span
                                    className={`font-normal text-sm ${plan.mostPopular ? 'text-white' : 'text-slate-300'
                                        }`}
                                >
                                    / pay once
                                </span>
                            </h4>

                            <hr
                                className={`my-8 ${plan.mostPopular ? 'border-gray-300' : 'border-slate-300'
                                    }`}
                            />

                            <div
                                className={`space-y-2 ${plan.mostPopular ? 'text-white' : 'text-slate-600'
                                    }`}
                            >
                                {plan.features.map((f) => (
                                    <div key={f} className="flex items-center gap-1.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={plan.mostPopular ? 'text-white' : 'text-blue-600'}
                                        >
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`transition w-full py-3 rounded-lg font-medium mt-8 ${plan.mostPopular
                                    ? 'bg-white hover:bg-slate-100 text-slate-800'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page