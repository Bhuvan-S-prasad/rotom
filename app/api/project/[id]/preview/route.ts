import { getProjectForPreview } from "@/lib/actions/project.actions";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await getProjectForPreview(id);

        if (!result) {
            return NextResponse.json({ error: "Project not found or not accessible" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
