import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

type SharedProps = {
    name: string;
};

export default function AppLogo() {
    const { name } = usePage<SharedProps>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center">
                <AppLogoIcon className="size-10 object-contain" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}