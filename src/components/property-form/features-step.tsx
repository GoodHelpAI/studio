
"use client";

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { PropertyFormData } from '@/lib/schema';
import { INTERIOR_FEATURE_OPTIONS, EXTERIOR_FEATURE_OPTIONS } from '@/lib/constants';
import { ChipCheckboxGroup } from '@/components/chip-checkbox-group';

export function FeaturesStep() {
  const { control } = useFormContext<PropertyFormData>();

  return (
    <div className="space-y-8">
      <ChipCheckboxGroup
        control={control}
        name="interiorFeatures"
        label="Interior Features"
        options={INTERIOR_FEATURE_OPTIONS}
      />
      <ChipCheckboxGroup
        control={control}
        name="exteriorFeatures"
        label="Exterior Features"
        options={EXTERIOR_FEATURE_OPTIONS}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Additional Property Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe any other notable features, recent upgrades, or selling points of the property."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
