
"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { PropertyFormData } from '@/lib/schema';
import { RoomBlock } from './room-block';

export function RoomsStep() {
  const { control } = useFormContext<PropertyFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const addRoom = () => {
    append({ 
      roomType: '', 
      length: undefined, 
      width: undefined, 
      features: '',
      fan: 'na', // default for fan
      washerDryerHookups: 'na', // default for W/D
      kitchenDetails: undefined // Initialize as undefined
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary">Room Specifications</h3>
        <Button type="button" onClick={addRoom} variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>
      {fields.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          No rooms added yet. Click "Add Room" to get started.
        </p>
      )}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <RoomBlock key={field.id} index={index} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}

    