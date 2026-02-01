"use client";
import {
    Navbarr,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/ResizableNavbar";
import { useSession } from "@/lib/auth/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import { useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

export function NavBar() {
    const router = useRouter();

    // Pages that require authentication (all except Home)
    const protectedPaths = ["/projects", "/community", "/pricing"];

    const navItems = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "projects",
            link: "/projects",
        },
        {
            name: "community",
            link: "/community",
        },
        {
            name: "pricing",
            link: "/pricing",
        }
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: session } = useSession();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        if (protectedPaths.includes(link) && !session?.user) {
            e.preventDefault();
            toast.error("Please login to view that page", {
                action: {
                    label: "Login",
                    onClick: () => router.push("/auth/sign-in"),
                },
            });
        }
    };

    return (
        <>
            <Toaster />
            <Navbarr>
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} onItemClick={handleNavClick} />
                    <div className="flex items-center gap-4">
                        {!session?.user ? (
                            <>
                                <NavbarButton variant="secondary" href="/auth/sign-in" as={Link}>Login</NavbarButton>
                                <NavbarButton variant="primary" href="/auth/sign-up" as={Link}>SignUp</NavbarButton>
                            </>
                        ) : (
                            <UserButton size="icon" />
                        )}
                    </div>
                </NavBody>

                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={(e) => {
                                    handleNavClick(e, item.link);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block">{item.name}</span>
                            </a>
                        ))}
                        {!session?.user ? (
                            <div className="flex w-full flex-col gap-4">
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    className="w-full text-white"
                                    href="/auth/sign-in"
                                    as={Link}
                                >
                                    Login
                                </NavbarButton>
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    className="w-full"
                                    href="/auth/sign-up"
                                    as={Link}
                                >
                                    SignUp
                                </NavbarButton>
                            </div>
                        ) : (
                            <UserButton size="icon" />
                        )}
                    </MobileNavMenu>
                </MobileNav>
            </Navbarr>
        </>
    );
}

