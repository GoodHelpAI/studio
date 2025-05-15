
"use client";

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PropertyFormData } from '@/lib/schema';
import { Car, Caravan } from 'lucide-react'; // Caravan for RV Pad
import { YES_NO_OPTIONS } from '@/lib/constants';

export function GarageCarportStep() {
  const { control, watch, setValue } = useFormContext<PropertyFormData>();

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
              <FormItem className="space-y-3">
                <FormLabel>Is there a Carport?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === 'no') {
                        setValue('carportLength', undefined);
                        setValue('carportWidth', undefined);
                      }
                    }}
                    value={field.value || 'no'}
                    className="flex space-x-2"
                  >
                    {YES_NO_OPTIONS.map(option => (
                      <FormItem key={`carport-${option.id}`} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {carportPresent === 'yes' && (
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
          <CardTitle className="flex items-center gap-2 text-lg"><Caravan className="text-primary"/> RV Pad Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <FormField
            control={control}
            name="rvPadPresent"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Is there an RV Pad?</FormLabel>
                <FormControl>
                  <RadioGroup
                     onValueChange={(value) => {
                      field.onChange(value);
                      if (value === 'no') {
                        setValue('rvPadLength', undefined);
                        setValue('rvPadWidth', undefined);
                      }
                    }}
                    value={field.value || 'no'}
                    className="flex space-x-2"
                  >
                    {YES_NO_OPTIONS.map(option => (
                      <FormItem key={`rvpad-${option.id}`} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {rvPadPresent === 'yes' && (
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

