"use client"

import { NavBarr } from "@/components/NavBarr";
import Pill from "@/components/Pill";
import { LightbulbIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className=" mt-5 flex items-center justify-center">
        <NavBarr />
      </div>

      <Pill />

      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-5xl font-semibold max-w-3xl text-center bg-linear-to-r from-white to-blue-500 text-transparent bg-clip-text">Vibecode websites with Rotom</h1>
        <p className="text-gray-200 text-xl max-md:px-2 text-center max-w-sm mt-2">Build stunning websites and portfolios</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <form onSubmit={() => { }} className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-blue-600/70 focus-within:ring-2 ring-blue-500 transition-all">
          <textarea onChange={() => { }} className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="Describe your presentation in details" required />
          <button className="ml-auto flex items-center gap-2 bg-blue-400 rounded-xl px-4 py-2">
            <LightbulbIcon />
            build
          </button>
        </form>
      </div>


    </div>
  );
}
