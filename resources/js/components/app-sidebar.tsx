import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Package, Trash2, Truck, Users, User, Scroll } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import type { Auth, UserRole } from '@/types/auth';

type InertiaSharedProps = {
    auth: Auth;
    [key: string]: unknown;
};

const mainNavItems: NavItem[] = [
    
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin'],
    },
    //aca agrego los items del menu lateral
    {
        title: 'Proveedores',
        href: '/proveedores',
        icon: Truck,
        roles: ['admin'],
    },

    {
    title: 'Productos',
    href: '/productos',
    icon: Package,
    roles: ['admin'],
    },

    {
    title: 'Usuarios',
    href: '/usuarios',
    icon: Users,
    roles: ['admin'],
    },
    
    {
    title: 'Clientes',
    href: '/clientes',
    icon: User,
    roles: ['admin', 'preventista'],
    },

    {
    title: 'Pedidos',
    href: '/pedidos',
    icon: Scroll,
    roles: ['admin', 'preventista', 'cliente'],
    },

    {
    title: 'Ventas por proveedor',
    href: '/reportes/ventas-proveedores',
    icon: Truck, 
    },

    {
    title: 'Ordenes',
    href: '/ordenes',
    icon: Scroll,
    roles: ['admin'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Papelera',
        href: '/papelera',
        icon: Trash2,
    },
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {

    const { props, url } = usePage<InertiaSharedProps>();
    const currentRole: UserRole | undefined = props.auth.user?.role as UserRole | undefined;
    
    const canSeeItem = (item: NavItem): boolean => {
        if (!item.roles || item.roles.length === 0) {
            return true;
        }

        return Boolean(currentRole && item.roles.includes(currentRole));
    };

    const visibleItems = mainNavItems.filter(canSeeItem);

    const isActiveRoute = (href: string): boolean => {
        const targetPath = new URL(href, window.location.origin).pathname;
        return url === targetPath || url.startsWith(`${targetPath}/`);
    };
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
