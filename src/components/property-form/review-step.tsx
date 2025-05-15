
"use client";

import { useFormContext } from 'react-hook-form';
import type { PropertyFormData, Room } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PROPERTY_TYPES, ROOM_TYPES, INTERIOR_FEATURE_OPTIONS, EXTERIOR_FEATURE_OPTIONS, STATES_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const getLabelById = (id: string | undefined, options: Array<{id: string, label: string}>) => {
  if (!id) return 'N/A';
  return options.find(opt => opt.id === id)?.label || id;
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return 'N/A';
  return value.toLocaleString();
};

const DisplayField: React.FC<{ label: string; value?: string | number | null; className?: string }> = ({ label, value, className }) => (
  <div className={cn("mb-2", className)}>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-base text-foreground">{String(value ?? 'N/A')}</p>
  </div>
);

export function ReviewStep() {
  const { getValues } = useFormContext<PropertyFormData>();
  const data = getValues();

  const renderRoom = (room: Room, index: number) => (
    <Card key={index} className="mb-4 bg-muted/30">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md">Room {index + 1}: {getLabelById(room.roomType, ROOM_TYPES)}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <DisplayField label="Dimensions" value={room.length && room.width ? `${room.length}ft x ${room.width}ft` : 'N/A'} />
        <DisplayField label="Features" value={room.features || 'N/A'} className="col-span-2"/>
      </CardContent>
    </Card>
  );

  const renderFeaturesList = (features: string[] | undefined, options: Array<{id: string, label: string}>) => {
    if (!features || features.length === 0) return <p className="text-muted-foreground italic">None selected</p>;
    return (
      <div className="flex flex-wrap gap-2">
        {features.map(id => (
          <Badge key={id} variant="secondary" className="text-sm">{getLabelById(id, options)}</Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Review Property Details</CardTitle>
          <CardDescription>Please verify all information before submitting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DisplayField label="Address" value={data.address} />
              <DisplayField label="City" value={data.city} />
              <DisplayField label="State" value={getLabelById(data.state, STATES_OPTIONS)} />
              <DisplayField label="Zip Code" value={data.zip} />
              <DisplayField label="Property Type" value={getLabelById(data.propertyType, PROPERTY_TYPES)} className="md:col-span-2"/>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DisplayField label="Price" value={formatCurrency(data.price)} />
              <DisplayField label="Square Footage" value={`${formatNumber(data.squareFootage)} SqFt`} />
              <DisplayField label="Total Bedrooms" value={formatNumber(data.overallBedrooms)} />
              <DisplayField label="Total Bathrooms" value={String(data.overallBathrooms)} />
              <DisplayField label="Year Built" value={String(data.yearBuilt)} />
              <DisplayField label="Lot Size" value={data.lotSize} />
              <DisplayField label="HOA" value={data.hasHOA ? 'Yes' : 'No'} />
              {data.hasHOA && <DisplayField label="Monthly HOA Dues" value={formatCurrency(data.hoaDues)} />}
            </div>
          </div>
          
          {data.rooms && data.rooms.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Rooms</h3>
                {data.rooms.map(renderRoom)}
              </div>
            </>
          )}
          
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Features</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Interior Features</p>
                {renderFeaturesList(data.interiorFeatures, INTERIOR_FEATURE_OPTIONS)}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Exterior Features</p>
                {renderFeaturesList(data.exteriorFeatures, EXTERIOR_FEATURE_OPTIONS)}
              </div>
              {data.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Additional Description</p>
                  <p className="text-base text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{data.description}</p>
                </div>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
