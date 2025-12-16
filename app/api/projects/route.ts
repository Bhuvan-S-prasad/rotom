import { getUserProjects } from "@/lib/actions/project.actions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const projects = await getUserProjects();
        return NextResponse.json({ projects });
    } catch (error: any) {
        if (error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
