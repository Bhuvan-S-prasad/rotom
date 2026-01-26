# Rotom

**Rotom** is an AI-powered web builder agent that allows users to generate, edit, and publish web projects using natural language prompts. Built with Next.js 15, it leverages advanced AI to streamline the web development process.

## 🚀 Features

-   **AI-Powered Project Generation**: Create full web projects from a simple text prompt.
-   **Interactive Editor**: Real-time code editing with a live preview.
-   **Version Control**: Automatically saves versions of your project, allowing you to rollback or fork.
-   **Community Hub**: Publish your projects to the community and explore what others have built.
-   **Credit System**: Integrated credit system for AI usage.
-   **Authentication**: Secure user authentication and account management.

## 🛠️ Tech Stack

-   **Framework**: ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
-   **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
-   **Styling**: ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
-   **Database**: ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
-   **Authentication**: ![Better Auth](https://img.shields.io/badge/Better_Auth-black?style=for-the-badge)
-   **AI**: ![OpenRouter](https://img.shields.io/badge/OpenRouter-black?style=for-the-badge&logo=openai&logoColor=white)
-   **UI Components**: ![Motion](https://img.shields.io/badge/Motion-black?style=for-the-badge&logo=framer&logoColor=white) ![Lucide React](https://img.shields.io/badge/Lucide_React-black?style=for-the-badge&logo=lucide&logoColor=white) ![Sonner](https://img.shields.io/badge/Sonner-black?style=for-the-badge)

## 📂 Project Structure

```bash
rotom/
├── app/                  # Next.js App Router pages and API routes
│   ├── account/          # Account settings and profile
│   ├── api/              # Backend API endpoints
│   ├── auth/             # Authentication pages
│   ├── community/        # Community projects feed
│   ├── preview/          # Full-screen project preview
│   ├── pricing/          # Pricing and subscriptions
│   ├── projects/         # Main project editor and workspace
│   └── ...
├── components/           # Reusable UI components
├── lib/                  # Utility functions, server actions
│   ├── actions/          # Server Actions for data mutation
│   └── prisma.ts         # Prisma client instance
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js**: v18 or later
-   **PostgreSQL**: Ensure you have a running PostgreSQL instance.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/rotom.git
    cd rotom
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/rotom_db"

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET="your_secret_key"
    BETTER_AUTH_URL="http://localhost:3000"

    # AI
    OPENROUTER_API_KEY="your_openrouter_api_key"
    ```

4.  **Database Setup:**
    Run the Prisma migrations to set up your database schema.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ❤️ Special Thanks

This project wouldn't be possible without these amazing open-source libraries and tools:

-   **[Next.js](https://nextjs.org/)** - The React Framework for the Web
-   **[Tailwind CSS](https://tailwindcss.com/)** - Rapidly build modern websites without ever leaving your HTML
-   **[Prisma](https://www.prisma.io/)** - Next-generation Node.js and TypeScript ORM
-   **[Better Auth](https://better-auth.com/)** - The most comprehensive authentication library for TypeScript
-   **[Motion](https://motion.dev/)** - A production-ready motion library for React
-   **[Lucide](https://lucide.dev/)** - Beautiful & consistent icons
-   **[Sonner](https://sonner.emilkowal.ski/)** - An opinionated toast component for React

