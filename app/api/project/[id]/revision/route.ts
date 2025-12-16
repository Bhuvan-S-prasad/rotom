import { makeRevision } from "@/lib/actions/project.actions";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        await makeRevision(id, message);
        return NextResponse.json({ success: true, message: "Revision processing started" });
    } catch (error: any) {
        if (error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message === "INSUFFICIENT_CREDITS") {
            return NextResponse.json({ error: "Not enough credits" }, { status: 403 });
        }
        if (error.message === "PROJECT_NOT_FOUND") {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
