import { Link, usePage } from "@inertiajs/react";
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Package,
    Trash2,
    Truck,
    Users,
    User,
    Scroll,
} from "lucide-react";

import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { dashboard } from "@/routes";
import type { NavItem } from "@/types";
import type { Auth, UserRole } from "@/types/auth";

type InertiaSharedProps = {
    auth: Auth;
    [key: string]: unknown;
};

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
        roles: ["admin", "preventista"],
    },
    {
        title: "Proveedores",
        href: "/proveedores",
        icon: Truck,
        roles: ["admin", "preventista"],
    },
    {
        title: "Productos",
        href: "/productos",
        icon: Package,
        roles: ["admin", "preventista"],
    },
    {
        title: "Usuarios",
        href: "/usuarios",
        icon: Users,
        roles: ["admin", "preventista"],
    },
    {
        title: "Clientes",
        href: "/clientes",
        icon: User,
        roles: ["admin", "preventista"],
    },
    {
        title: "Pedidos",
        href: "/pedidos",
        icon: Scroll,
        roles: ["admin", "preventista", "cliente"],
    },
    {
        title: "Ventas por proveedor",
        href: "/reportes/ventas-proveedores",
        icon: Truck,
        roles: ["admin"],
    },
    {
        title: "Ordenes",
        href: "/ordenes",
        icon: Scroll,
        roles: ["admin"],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: "Papelera",
        href: "/papelera",
        icon: Trash2,
    },
    {
        title: "Repository",
        href: "https://github.com/laravel/react-starter-kit",
        icon: FolderGit2,
    },
    {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#react",
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage<InertiaSharedProps>();

    const currentRole: UserRole | undefined =
        props.auth.user?.role as UserRole | undefined;

    const canSeeItem = (item: NavItem): boolean => {
        if (!item.roles || item.roles.length === 0) {
            return true;
        }

        return Boolean(
            currentRole && item.roles.includes(currentRole),
        );
    };

    const visibleItems = mainNavItems.filter(canSeeItem);

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="
                border-r border-blue-100
                bg-blue-50
                dark:border-blue-900/50
                dark:bg-slate-900
            "
        >
            <SidebarHeader className="border-b border-blue-200 bg-blue-100 px-3 py-4 dark:border-blue-900/50 dark:bg-slate-900">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="rounded-xl transition-colors hover:bg-blue-100 dark:hover:bg-blue-950/50"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-blue-100 px-2 py-4 dark:bg-slate-900">
                <NavMain items={visibleItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-blue-200 bg-blue-100 px-2 py-3 dark:border-blue-900/50 dark:bg-slate-900">
                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
