import { headers } from "next/headers";
import { auth } from "../auth/auth";
import prisma from "../prisma";
import openai from "../utils/openai/openai";

export async function createUserProject(
    initialPrompt: string
) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });


    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.credits < 5) throw new Error("INSUFFICIENT_CREDITS");

    const project = await prisma.websiteProject.create({
        data: {
            name: initialPrompt.length > 40
                ? initialPrompt.substring(0, 40)
                : initialPrompt,
            initial_prompt: initialPrompt,
            userId
        }
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            totalCreation: { increment: 1 }
        }
    });

    await prisma.conversation.create({
        data: {
            role: 'user',
            content: initialPrompt,
            projectId: project.id
        }
    })

    await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 5 } }
    })

    const promptEnhancer = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content: `
                    you are an expert prompt engineer who specialises in prompt enhancement and optimization to get full work from the LLM through prompts.
                    take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

                    enhance the prompt by:
                    1. Addng specific details like color scheme, layout, typography, and design elements.
                    2. Describing the user experience and interaction flow.
                    3. including modern web design trends and best practices.
                    4. specifying the key sections and features
                    5. mentioning responsive design requirements
                    6. adding any missing but important elements

                    return ONLY enhanced prompt, nothing else. make it detailed but concise around 2 to 3 paragraphs max
                    `
            },
            { role: "user", content: initialPrompt },
        ],
    })

    const enhancedPrompt = promptEnhancer.choices[0].message.content

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: `I have enhanced your prompt to: "${enhancedPrompt}"`,
            projectId: project.id
        }
    })

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'generating your website...',
            projectId: project.id
        }
    })

    // Generate website code

    const codeGenerationResponse = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content: `
                    You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "${enhancedPrompt}"

    CRITICAL REQUIREMENTS:
    - You MUST output valid HTML ONLY. 
    - Use Tailwind CSS for ALL styling
    - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    - Use Tailwind utility classes extensively for styling, animations, and responsiveness
    - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
    - Use modern, beautiful design with great UX using Tailwind classes
    - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
    - Use Tailwind animations and transitions (animate-*, transition-*)
    - Include all necessary meta tags
    - Use Google Fonts CDN if needed for custom fonts
    - Use placeholder images from https://placehold.co/600x400
    - Use Tailwind gradient classes for beautiful backgrounds
    - Make sure all buttons, cards, and components use Tailwind styling

    CRITICAL HARD RULES:
    1. You MUST put ALL output ONLY into message.content.
    2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
    3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
    4. Do NOT include markdown, explanations, notes, or code fences.

    The HTML should be complete and ready to render as-is with Tailwind CSS.`
            },
            { role: "user", content: enhancedPrompt || `` },
        ],
    })

    const code = codeGenerationResponse.choices[0].message.content || '';

    //create version for the project

    const version = await prisma.version.create({
        data: {
            code: code.replace(/```[a-z]*\n?/gi, '')
                .replace(/```$/g, '')
                .trim(),
            description: 'Initial version',
            projectId: project.id
        }
    })

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'Website generated successfully',
            projectId: project.id
        }
    })

    await prisma.websiteProject.update({
        where: { id: project.id },
        data: {
            current_code: code.replace(/```[a-z]*\n?/gi, '')
                .replace(/```$/g, '')
                .trim(),
            current_version_index: version.id
        }
    })
    return { projectId: project.id };
}


// find single project
export async function getUserProject() {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });


    if (!user) throw new Error("USER_NOT_FOUND");

    const project = await prisma.websiteProject.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            conversation: {
                orderBy: { timestamp: 'asc' }
            },
            versions: { orderBy: { timestamp: 'asc' } }
        }
    });

    if (!project) return null;

    return project;

}


// find all projects
export async function getUserProjects() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");

    const projects = await prisma.websiteProject.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
    });

    if (!projects) return null;

    return projects;
}

// to toggle project publish

export async function togglePublish(projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");

    const project = await prisma.websiteProject.findFirst({
        where: { id: projectId, userId },
    });

    if (!project) throw new Error("PROJECT_NOT_FOUND");

    const updatedProject = await prisma.websiteProject.update({
        where: { id: project.id },
        data: {
            isPublished: !project.isPublished
        }
    });
    return updatedProject;
}

// get project by id
export async function getProjectById(projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");

    const project = await prisma.websiteProject.findUnique({
        where: { id: projectId, userId },
        include: {
            conversation: {
                orderBy: { timestamp: 'asc' }
            },
            versions: { orderBy: { timestamp: 'asc' } }
        }
    });

    if (!project) return null;

    return project;
}


// make revisions
export async function makeRevision(projectId: string, message: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");

    if (user.credits < 5) throw new Error("INSUFFICIENT_CREDITS");

    if (!message || message.trim() === "") throw new Error("MESSAGE_REQUIRED");

    const currentProject = await prisma.websiteProject.findUnique({
        where: { id: projectId, userId },
        include: {
            versions: true
        }
    });

    if (!currentProject) throw new Error("PROJECT_NOT_FOUND");

    await prisma.conversation.create({
        data: {
            role: "user",
            content: message,
            projectId: projectId
        }
    })

    await prisma.user.update({
        where: { id: userId },
        data: {
            credits: { decrement: 5 }
        }
    })

    const promptEnhanceResponse = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: 'system',
                content: `
                You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

    Enhance this by:
    1. Being specific about what elements to change
    2. Mentioning design details (colors, spacing, sizes)
    3. Clarifying the desired outcome
    4. Using clear technical terms

    Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).
                `
            },
            {
                role: 'user',
                content: `user request: "${message}"`
            }
        ]
    })

    const enhancedPrompt = promptEnhanceResponse.choices[0].message.content || '';

    await prisma.conversation.create({
        data: {
            role: "assistant",
            content: `I have enhanced your prompt: "${enhancedPrompt}"`,
            projectId: projectId
        }
    })

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'Now making changes to website...',
            projectId: projectId
        }
    })


    // generate website code

    const codeGenerationResponse = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: 'system',
                content: `
                You are an expert web developer. 

    CRITICAL REQUIREMENTS:
    - Return ONLY the complete updated HTML code with the requested changes.
    - Use Tailwind CSS for ALL styling (NO custom CSS).
    - Use Tailwind utility classes for all styling changes.
    - Include all JavaScript in <script> tags before closing </body>
    - Make sure it's a complete, standalone HTML document with Tailwind CSS
    - Return the HTML Code Only, nothing else

    Apply the requested changes while maintaining the Tailwind CSS styling approach
                `
            },
            {
                role: 'user',
                content: `Here is the current website code: ${currentProject.current_code} the user wants the chanee: "${enhancedPrompt}"`
            }
        ]
    })

    const code = codeGenerationResponse.choices[0].message.content || '';

    const version = await prisma.version.create({
        data: {
            code: code.replace(/```[a-z]*\n?/gi, '')
                .replace(/```$/g, '')
                .trim(),
            description: 'changes made',
            projectId
        }
    })

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'Changes made to website',
            projectId
        }
    })

    await prisma.websiteProject.update({
        where: { id: projectId },
        data: {
            current_code: code.replace(/```[a-z]*\n?/gi, '')
                .replace(/```$/g, '')
                .trim(),
            current_version_index: version.id
        }
    })
}

// version rollbacks
export async function rollbackToVersion(projectId: string, versionId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");



    const project = await prisma.websiteProject.findUnique({
        where: { id: projectId, userId },
        include: { versions: true }
    });

    if (!project) throw new Error("PROJECT_NOT_FOUND");

    const version = project.versions.find((v: { id: string }) => v.id === versionId);

    if (!version) throw new Error("VERSION_NOT_FOUND");

    await prisma.websiteProject.update({
        where: { id: projectId },
        data: {
            current_code: version.code,
            current_version_index: version.id
        }
    })

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'rolled back to previous version',
            projectId
        }
    })

}

export async function deleteProject(projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");

    await prisma.websiteProject.delete({ where: { id: projectId, userId } });
}

