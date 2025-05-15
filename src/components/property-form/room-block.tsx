
"use client";

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import type { PropertyFormData } from '@/lib/schema';
import { ROOM_TYPES, type RoomTypeOption } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RoomBlockProps {
  index: number;
  onRemove: (index: number) => void;
}

export function RoomBlock({ index, onRemove }: RoomBlockProps) {
  const { control, watch } = useFormContext<PropertyFormData>();
  const roomPathPrefix = `rooms.${index}` as const;

  // Watch the specific roomType field for dynamic icon update
  const selectedRoomTypeId = watch(`${roomPathPrefix}.roomType`);
  const IconComponent = ROOM_TYPES.find(rt => rt.id === selectedRoomTypeId)?.icon;

  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
         <CardTitle className="text-lg flex items-center gap-2">
          {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
          Room {index + 1}
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive/80"
          aria-label="Remove room"
        >
          <XCircle className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <FormField
          control={control}
          name={`${roomPathPrefix}.roomType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROOM_TYPES.map((type: RoomTypeOption) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        {type.icon && <type.icon className="h-4 w-4 text-muted-foreground" />}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`${roomPathPrefix}.length`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (ft)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 12" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${roomPathPrefix}.width`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (ft)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name={`${roomPathPrefix}.features`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features / Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Hardwood floors, large window" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
