
"use client";

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PropertyFormData } from '@/lib/schema';
import { Car, Rss } from 'lucide-react'; // Rss for RV Pad (antenna like)

export function GarageCarportStep() {
  const { control, watch } = useFormContext<PropertyFormData>();

  const carportPresent = watch('carportPresent');
  const rvPadPresent = watch('rvPadPresent');

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Car className="text-primary"/> Carport Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="carportPresent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">Is there a Carport?</FormLabel>
              </FormItem>
            )}
          />
          {carportPresent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={control}
                name="carportLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carport Length (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 18" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="carportWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carport Width (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
         <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Rss className="text-primary"/> RV Pad Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="rvPadPresent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">Is there an RV Pad?</FormLabel>
              </FormItem>
            )}
          />
          {rvPadPresent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={control}
                name="rvPadLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RV Pad Length (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 40" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="rvPadWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RV Pad Width (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
