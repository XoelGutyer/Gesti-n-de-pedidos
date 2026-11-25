import type { ComponentPropsWithoutRef } from "react";
import { Link } from "@inertiajs/react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { toUrl } from "@/lib/utils";
import type { NavItem } from "@/types";

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ""}`}
        >
            <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                    {items.map((item) => {
                        const href = toUrl(item.href);
                        const externo =
                            typeof href === "string" && href.startsWith("http");

                        const contenido = (
                            <>
                                {item.icon && (
                                    <item.icon className="size-5" />
                                )}
                                <span>{item.title}</span>
                            </>
                        );

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={{ children: item.title }}
                                    className="
                                        rounded-lg transition-colors
                                        text-slate-600
                                        hover:bg-blue-50 hover:text-blue-700
                                        dark:text-slate-300
                                        dark:hover:bg-blue-950/50 dark:hover:text-blue-300
                                    "
                                >
                                    {externo ? (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {contenido}
                                        </a>
                                    ) : (
                                        <Link href={href}>
                                            {contenido}
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
