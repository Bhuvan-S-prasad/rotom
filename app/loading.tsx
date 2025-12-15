import { Loader2Icon } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2Icon className="size-7 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-400">Loading...</span>
        </div>
    );
}
