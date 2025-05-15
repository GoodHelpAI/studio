
"use client";

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { PropertyFormData } from '@/lib/schema';

export function PropertyDetailsStep() {
  const { control, watch } = useFormContext<PropertyFormData>();
  const hasHOA = watch('hasHOA');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="overallBedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bedrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="e.g., 3" 
                  {...field} 
                  value={field.value === undefined ? '' : String(field.value)}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="overallBathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bathrooms (e.g., 2.5)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.5" 
                  min="0" 
                  placeholder="e.g., 2.5" 
                  {...field} 
                  value={field.value === undefined ? '' : String(field.value)}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="hasHOA"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Is there an HOA (Homeowners Association)?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      {hasHOA && (
        <FormField
          control={control}
          name="hoaDues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly HOA Dues</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g., 150"
                  {...field}
                  value={field.value === undefined ? '' : String(field.value)}
                  onChange={e => {
                    const numValue = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                    field.onChange(isNaN(numValue) ? undefined : numValue);
                  }}
                />
              </FormControl>
              <FormDescription>Enter the monthly amount.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

    