"use client"

import Pill from "@/components/Pill";
import { LightbulbIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

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
      else if (!input.trim()) {
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
        throw new Error(data.error || 'Failed to create project');
      }

      setLoading(false)
      console.log("done")
      route.push(`/projects/${data.projectId}`)

    }
    catch (error: any) {
      setLoading(false)
      toast.error(error.message || 'Something went wrong')
    }



  }

  return (
    <div className="relative min-h-screen">
      <Toaster />
      <div className="relative z-10 mt-30">

        <Pill />

        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-5xl font-bold max-w-3xl text-center bg-linear-to-r from-blue-900 to-blue-500 text-transparent bg-clip-text">Vibecode websites with Rotom</h1>
          <p className="text-black font-semibold text-xl max-md:px-2 text-center max-w-sm mt-2">Build stunning websites and portfolios</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <form onSubmit={onSubmitHandler} className="bg-white max-w-2xl w-full rounded-xl p-4 mt-10 border border-blue-800 focus-within:ring-2 ring-blue-500 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 250) + 'px';
              }}
              className="bg-white text-black outline-none resize-none w-full rounded-lg p-2 hide-scrollbar"
              rows={4}
              placeholder="Describe your website in details"
              required
            />
            <button type="submit" className="ml-auto flex items-center gap-2 bg-blue-400 rounded-xl px-4 py-2 border-black">

              {!loading ? <><LightbulbIcon /> <p>Build</p> </>
                : <><p>Building...</p> <Loader2Icon className="animate-spin size-5 text-white" /></>}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
