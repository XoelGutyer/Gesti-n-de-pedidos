
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
    value: string;
    label: string;
}

interface Props {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Seleccione una opción",
    searchPlaceholder = "Buscar...",
    emptyText = "Sin resultados.",
    disabled = false,
}: Props) {
    const [open, setOpen] = useState(false);
    const selected = options.find((o) => o.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between rounded-lg border border-blue-200",
                        "bg-white px-3 py-2.5 text-sm font-normal text-slate-900",
                        "shadow-sm transition-colors",
                        "hover:bg-blue-50 hover:text-blue-700",
                        "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30",
                        "dark:border-blue-900/70 dark:bg-slate-950 dark:text-white",
                        "dark:hover:bg-slate-800 dark:hover:text-blue-300",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                >
                    <span
                        className={cn(
                            "truncate",
                            !selected && "text-slate-500 dark:text-slate-400"
                        )}
                    >
                        {selected ? selected.label : placeholder}
                    </span>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className={cn(
                    "w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg",
                    "border border-blue-100 bg-white p-0 shadow-lg",
                    "dark:border-blue-900/70 dark:bg-slate-900"
                )}
                align="start"
            >
                <Command
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                >
                    <CommandInput
                        placeholder={searchPlaceholder}
                        className="border-blue-100 focus:ring-blue-500 dark:border-blue-900/50"
                    />

                    <CommandList>
                        <CommandEmpty className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            {emptyText}
                        </CommandEmpty>

                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={`${option.label}__${option.value}`}
                                onSelect={() => {
                                    onChange(
                                        option.value === value ? "" : option.value
                                    );
                                    setOpen(false);
                                }}
                                className={cn(
                                    "cursor-pointer px-3 py-2 text-sm",
                                    "aria-selected:bg-blue-50 aria-selected:text-blue-700",
                                    "dark:aria-selected:bg-blue-950/60 dark:aria-selected:text-blue-300"
                                )}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400",
                                        value === option.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />

                                <span className="truncate">
                                    {option.label}
                                </span>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
