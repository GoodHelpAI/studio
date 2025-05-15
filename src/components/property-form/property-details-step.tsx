
"use client";

import { useFormContext, Controller } from 'react-hook-form';
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., 500,000" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9.]/g, ''))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="squareFootage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Square Footage (SqFt)</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., 2,000" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9]/g, ''))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="overallBedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bedrooms</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="e.g., 3" {...field} />
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
              <FormLabel>Total Bathrooms</FormLabel>
              <FormControl>
                <Input type="number" step="0.5" min="0" placeholder="e.g., 2.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Built</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1995" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
       <FormField
        control={control}
        name="lotSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lot Size</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 0.25 acres or 10,000 sqft" {...field} />
            </FormControl>
            <FormDescription>Enter value and unit (e.g., acres, sqft).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hasHOA"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
            <FormControl>
              <Checkbox
                checked={field.value}
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
                <Input type="text" placeholder="e.g., 150" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9.]/g, ''))} />
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
