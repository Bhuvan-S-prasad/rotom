import { getUserCredits } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const credits = await getUserCredits();
        return NextResponse.json({ credits });
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
