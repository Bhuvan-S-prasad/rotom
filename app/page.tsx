"use client"

import Pill from "@/components/Pill";
import { LightbulbIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import LoaderComp from "@/components/LoaderComp";
import { getUserCredits } from "@/lib/actions/user.actions";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {

  const [input, setInput] = useState('');
  const route = useRouter()
  const [loading, setLoading] = useState(false)

  const { data: session } = authClient.useSession();


  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!session?.user) {
        return toast.error('please sign in to create a project')
      }

      const credits = await getUserCredits();
      if (credits < 20) {
        toast.error("Insufficient Credits", {
          description: "You need 20 credits to create a project.",
          action: {
            label: "Buy Credits",
            onClick: () => route.push("/pricing"),
          },
        });
        return;
      }

      if (!input.trim()) {
        return toast.error('Please enter a message')
      }
      setLoading(true)
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          toast.error("Insufficient Credits", {
            description: "You need 20 credits to create a project.",
            action: {
              label: "Buy Credits",
              onClick: () => route.push("/pricing"),
            },
          });
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Failed to create project');
      }

      setLoading(false)
      route.push(`/projects/${data.projectId}`)

    }
    catch (error: any) {
      setLoading(false)
      toast.error(error.message || 'Something went wrong')
    }



  }

  if (loading) {
    return (
      <div className="h-screen max-w-screen flex items-center justify-center">
        <LoaderComp />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gray-50/30 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Toaster />

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-4 py-20">

        <Pill />

        <div className="flex flex-col items-center justify-center mt-8 text-center relative">

          {/* Floating Elements - Left */}
          <div className="hidden lg:flex absolute -left-32 top-10 w-24 h-24 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl -rotate-6 animate-float items-center justify-center z-0">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 shadow-inner flex items-center justify-center text-white font-bold opacity-80">
              UI
            </div>
          </div>

          {/* Floating Elements - Right */}
          <div className="hidden lg:flex absolute -right-32 top-20 w-28 h-20 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl rotate-6 animate-float-delayed items-center justify-center z-0">
            <div className="flex gap-1">
              <div className="h-8 w-2 bg-zinc-800 rounded-full opacity-20 transform translate-y-2" />
              <div className="h-12 w-2 bg-blue-500 rounded-full shadow-lg" />
              <div className="h-6 w-2 bg-zinc-800 rounded-full opacity-20 transform translate-y-4" />
            </div>
          </div>


          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 max-w-4xl text-pretty relative z-10">
            Design beautiful prototypes <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent bg-size-[200%_auto] animate-shimmer">at the speed of thought.</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg md:text-xl mt-6 max-w-xl text-pretty relative z-10">
            Rotom is the AI-powered mockup generator that turns your ideas into production-ready frontend code instantly.
          </p>
        </div>

        <div className="w-full max-w-2xl mt-12 relative z-10">
          <form
            onSubmit={onSubmitHandler}
            className="group relative bg-white/80 backdrop-blur-sm w-full rounded-2xl p-2 border border-zinc-200 shadow-xl shadow-blue-500/5 focus-within:shadow-blue-500/20 focus-within:border-blue-500/50 transition-all duration-300"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 250) + 'px';
              }}
              className="w-full bg-transparent text-lg text-zinc-900 placeholder:text-zinc-400 p-4 min-h-[60px] outline-none resize-none rounded-xl"
              rows={1}
              placeholder="Describe your website..."
              required
            />

            <div className="flex items-center justify-between px-2 pb-2">
              <div className="text-xs text-zinc-400 font-medium px-2">
                Press Enter to build
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white rounded-xl px-5 py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
              >
                {!loading ? (
                  <>
                    <LightbulbIcon className="size-4" />
                    <span>Generate</span>
                  </>
                ) : (
                  <>
                    <span>Building</span>
                    <Loader2Icon className="animate-spin size-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      <Features />
      <HowItWorks />

    </div>
  );
}
