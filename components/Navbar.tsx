import { FloatingDock } from "./ui/FloatingDock";

function Navbar() {
    return (
        <div>
            <FloatingDock items={[
                {
                    title: "Home",
                    icon: <IconHome2 size={20} />,
                    href: "/",
                },
                {
                    title: "About",
                    icon: <IconInfo size={20} />,
                    href: "/about",
                },
                {
                    title: "Contact",
                    icon: <IconMail size={20} />,
                    href: "/contact",
                },
            ]} />
        </div>
    )
}