"use server"

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
    console.log("[Project DEBUG] Session retrieved")

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });


    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.credits < 20) throw new Error("INSUFFICIENT_CREDITS");

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
        data: { credits: { decrement: 20 } }
    })

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'Project created. Initializing...',
            projectId: project.id
        }
    })

    console.log("[Project DEBUG] Project creation complete: ", project.id);
    return { projectId: project.id };
}

export async function enhanceProjectPrompt(projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const project = await prisma.websiteProject.findUnique({
        where: { id: projectId },
    });

    if (!project) throw new Error("PROJECT_NOT_FOUND");

    console.log("[Project DEBUG] Starting Prompt Enhancement...")
    const promptEnhancer = await openai.chat.completions.create({
        model: 'mistralai/devstral-2512:free',
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
            { role: "user", content: project.initial_prompt },
        ],
    })

    const enhancedPrompt = promptEnhancer.choices[0].message.content || "";

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: `I have enhanced your prompt to: "${enhancedPrompt}"`,
            projectId: project.id
        }
    })

    return enhancedPrompt;
}

export async function generateProjectWebsite(projectId: string, enhancedPrompt: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'generating your website...',
            projectId: projectId
        }
    })

    // Generate website code

    console.log("[Project DEBUG] Enhanced Prompt: ", enhancedPrompt);
    console.log("[Project DEBUG] Starting Code Generation (this may take a while)...");

    const codeGenerationResponse = await openai.chat.completions.create({
        model: 'mistralai/devstral-2512:free',
        messages: [
            {
                role: "system",
                content: `
                You are an expert senior frontend engineer and UI designer.
                Create a complete, production-ready, single-page website based on the following request:
                "${enhancedPrompt}"

CORE REQUIREMENTS (NON-NEGOTIABLE)
- Output VALID HTML ONLY
- The HTML must be fully self-contained and render correctly when opened directly in a browser
- Use Tailwind CSS for ALL styling
- Include this EXACT script inside <head>:
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
- Do NOT use any external CSS files
- Do NOT use any UI frameworks other than Tailwind
- All interactivity must be implemented using vanilla JavaScript
- Place JavaScript inside a <script> tag before closing </body>

DESIGN & UX STANDARDS
- Use modern SaaS-grade UI design
- Clean layout, strong visual hierarchy, generous whitespace
- Thoughtful typography (use Google Fonts via CDN if needed)
- Smooth hover states, transitions, and micro-interactions
- Elegant animations using Tailwind utilities (transition, duration, ease, animate-*)
- Responsive across all screen sizes using Tailwind breakpoints:
sm: md: lg: xl:

IMAGES & MEDIA (IMPORTANT)
- Use high-quality, realistic placeholder images
- Prefer:
https://picsum.photos
https://images.unsplash.com (static demo URLs only)
- Images should feel context-aware (hero images, cards, avatars, dashboards, etc.)
- Vary aspect ratios appropriately:
- Hero sections → wide (16:9)
- Cards → balanced (4:3 or square)
- Avatars → circular or square
- Avoid generic 600x400 placeholders unless absolutely necessary

LAYOUT & COMPONENTS
- Use semantic HTML (header, main, section, footer)
- Include polished components where relevant:
- Hero section
- Navigation bar
- Feature cards or sections
- CTA buttons
- Forms (if applicable)
- Footer
- All components must be styled entirely with Tailwind utility classes

ACCESSIBILITY & QUALITY
- Proper meta tags (charset, viewport, description)
- Buttons and inputs must have visible focus states
- Use readable contrast and accessible font sizes
- Avoid unnecessary clutter — clarity over decoration

HARD RULES (STRICT)
- Output ONLY raw HTML
- NO explanations, comments, markdown, or code fences
- NO analysis or reasoning text
- NO placeholders like “TODO” or “add later”
- The result must be ready to deploy    
                `
            },
            { role: "user", content: enhancedPrompt || `` },
        ],
    })

    const code = codeGenerationResponse.choices[0].message.content || '';
    console.log("[Project DEBUG] Code Generated. Length: ", code.length);

    //create version for the project

    const version = await prisma.version.create({
        data: {
            code: code.replace(/```[a-z]*\n?/gi, '')
                .replace(/```$/g, '')
                .trim(),
            description: 'Initial version',
            projectId: projectId
        }
    })

    await prisma.conversation.create({
        data: {
            role: 'assistant',
            content: 'Website generated successfully',
            projectId: projectId
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
    console.log("[Project DEBUG] Project creation complete: ", projectId);
    return { projectId: projectId };
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

    if (!project.isPublished) {
        if (user.credits < 20) throw new Error("INSUFFICIENT_CREDITS");

        await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { decrement: 20 }
            }
        });
    }

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

    if (user.credits < 10) throw new Error("INSUFFICIENT_CREDITS");

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
            credits: { decrement: 10 }
        }
    })

    const promptEnhanceResponse = await openai.chat.completions.create({
        model: 'mistralai/devstral-2512:free',
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
        model: 'mistralai/devstral-2512:free',
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

// delete project
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

// get project code for preview
export async function getProjectPreview(projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");

    const project = await prisma.websiteProject.findFirst({
        where: { id: projectId, userId },
        include: { versions: true }
    });

    if (!project) throw new Error("PROJECT_NOT_FOUND");

    return project;
}

export async function saveProjectCode(projectId: string, code: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) throw new Error("UNAUTHORIZED");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("USER_NOT_FOUND");

    if (!code) throw new Error("CODE_NOT_FOUND");

    const project = await prisma.websiteProject.findFirst({
        where: { id: projectId, userId },
        include: { versions: true }
    });

    if (!project) throw new Error("PROJECT_NOT_FOUND");

    await prisma.websiteProject.update({
        where: { id: projectId, userId },
        data: {
            current_code: code,
            current_version_index: project.current_version_index
        }
    })
}

export async function getPublishedProjects(page: number = 1, limit: number = 6) {
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
        prisma.websiteProject.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        }),
        prisma.websiteProject.count({ where: { isPublished: true } })
    ]);

    return {
        projects,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}