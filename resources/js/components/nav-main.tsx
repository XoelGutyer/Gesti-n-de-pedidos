import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Menú principal
            </SidebarGroupLabel>

            <SidebarMenu className="gap-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="
                                rounded-lg transition-colors
                                text-slate-600
                                hover:bg-blue-50 hover:text-blue-700
                                dark:text-slate-300
                                dark:hover:bg-blue-950/50 dark:hover:text-blue-300
                                data-[active=true]:bg-blue-600
                                data-[active=true]:text-white
                                data-[active=true]:font-semibold
                                data-[active=true]:hover:bg-blue-700
                                dark:data-[active=true]:bg-blue-600
                                dark:data-[active=true]:text-white
                            "
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="size-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
