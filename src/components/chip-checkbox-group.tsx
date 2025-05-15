
"use client";

import type { Control, FieldPath } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { PropertyFormData } from '@/lib/schema';
import type { Option } from '@/lib/constants';

interface ChipCheckboxGroupProps {
  name: FieldPath<PropertyFormData>;
  control: Control<PropertyFormData>;
  options: Option[];
  label: string;
}

export function ChipCheckboxGroup({ name, control, options, label }: ChipCheckboxGroupProps) {
  return (
    <FormItem>
      <FormLabel className="text-base">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-x-2 gap-y-3 pt-2"> {/* Increased gap-y for vertical spacing */}
            {options.map((option) => {
              const isSelected = field.value?.includes(option.id) ?? false;
              return (
                <div key={option.id}>
                  <Checkbox
                    id={`${name}-${option.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      if (checked) {
                        field.onChange([...currentValues, option.id]);
                      } else {
                        field.onChange(currentValues.filter((id) => id !== option.id));
                      }
                    }}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`${name}-${option.id}`}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out border shadow-sm",
                      isSelected
                        ? "bg-[#8c1c19] text-white border-[#8c1c19] hover:bg-[#731613]" // Primary brand red for selected, white text
                        : "bg-card text-card-foreground border-border hover:bg-accent/20 hover:border-accent"
                    )}
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      />
      <FormMessage />
    </FormItem>
  );
}
