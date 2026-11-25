import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header
            className="
                flex h-16 shrink-0 items-center gap-2
                border-b border-blue-100 bg-white px-6
                transition-[width,height] ease-linear
                group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
                dark:border-blue-900/50 dark:bg-slate-900
                md:px-4
            "
        >
            <div className="flex items-center gap-2">
                <SidebarTrigger
                    className="
                        -ml-1 rounded-lg text-slate-600
                        hover:bg-blue-50 hover:text-blue-700
                        dark:text-slate-300
                        dark:hover:bg-blue-950/50 dark:hover:text-blue-300
                    "
                />

                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
