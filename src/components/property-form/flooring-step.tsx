
"use client";

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChipCheckboxGroup } from '@/components/chip-checkbox-group';
import { FLOORING_TYPE_OPTIONS } from '@/lib/constants';
import type { PropertyFormData } from '@/lib/schema';
import { Palette } from 'lucide-react';

export function FlooringStep() {
  const { control, watch } = useFormContext<PropertyFormData>();
  const selectedFlooringTypes = watch('flooringTypes') || [];
  const isOtherFlooringSelected = selectedFlooringTypes.includes('other');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
          <Palette className="mr-2 h-5 w-5" /> Flooring Types
        </h3>
        <ChipCheckboxGroup
          control={control}
          name="flooringTypes"
          label="Select all applicable flooring types in the property:"
          options={FLOORING_TYPE_OPTIONS}
        />
      </div>

      {isOtherFlooringSelected && (
        <FormField
          control={control}
          name="otherFlooringType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specify Other Flooring Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bamboo, Cork" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

    