"use server"

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import prisma from "../prisma";

export async function getUserCredits() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) throw new Error("USER_NOT_FOUND");

    return user.credits;
}