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

export function NavBar() {
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

    return (
        <Navbarr>
            <NavBody>
                <NavbarLogo />
                <NavItems items={navItems} />
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
                            onClick={() => setIsMobileMenuOpen(false)}
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
    );
}

