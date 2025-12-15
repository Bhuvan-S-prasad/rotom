"use client"

import { NavBar } from "@/components/Navbar";
import Pill from "@/components/Pill";
import { LightbulbIcon, Loader2Icon } from "lucide-react";
import ColorBends from "@/components/ui/ColorBends";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Toaster } from "sonner";

export default function Home() {

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true);

  }

  return (
    <div className="relative min-h-screen">
      <Toaster />
      {/* <div className="fixed inset-0 z-0">
        <ColorBends
          colors={["#ff5fd2", "#8b5cf6", "#2563eb"]}
          rotation={0.2}
          speed={0.3}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0}
          parallax={0.5}
          noise={0.1}
        />
      </div> */}

      <div className="relative z-10 mt-30">


        <Pill />

        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-5xl font-bold max-w-3xl text-center bg-linear-to-r from-blue-900 to-blue-500 text-transparent bg-clip-text">Vibecode websites with Rotom</h1>
          <p className="text-black font-semibold text-xl max-md:px-2 text-center max-w-sm mt-2">Build stunning websites and portfolios</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <form onSubmit={onSubmitHandler} className="bg-white max-w-2xl w-full rounded-xl p-4 mt-10 border border-blue-800 focus-within:ring-2 ring-blue-500 transition-all">
            <textarea
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
            <button className="ml-auto flex items-center gap-2 bg-blue-400 rounded-xl px-4 py-2 border-black" onClick={onSubmitHandler}>

              {!loading ? <><LightbulbIcon /> <p>Build</p> </>
                : <><p>Building...</p> <Loader2Icon className="animate-spin size-5 text-white" /></>}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
