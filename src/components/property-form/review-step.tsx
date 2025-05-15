
"use client";

import { useFormContext } from 'react-hook-form';
import type { PropertyFormData, Room, KitchenDetails, Patio, Shed } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  PROPERTY_TYPES, ROOM_TYPES, STATES_OPTIONS,
  GARAGE_CAR_COUNT_OPTIONS, GARAGE_DOOR_OPENER_OPTIONS, FLOORING_TYPE_OPTIONS,
  FENCE_HEIGHT_OPTIONS, FENCE_MATERIAL_OPTIONS, FENCE_STYLE_OPTIONS,
  WATER_HEATER_OPTIONS, AC_TYPE_OPTIONS, HEAT_TYPE_OPTIONS, SMOKE_DETECTOR_COUNT_OPTIONS,
  BACKYARD_FEATURE_OPTIONS, COMMUNITY_AMENITY_OPTIONS, FRIDGE_OPTIONS, RANGE_TYPE_OPTIONS,
  RANGE_OVEN_OPTIONS, COOKTOP_TYPE_OPTIONS, FIREPLACE_COUNT_OPTIONS, YES_NO_OPTIONS, YES_NO_NA_OPTIONS
  // INTERIOR_FEATURE_OPTIONS, EXTERIOR_FEATURE_OPTIONS // No longer used here
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { formatKitchenFeatureLabel } from './room-block'; 

const getLabelById = (id: string | number | undefined, options: Array<{id: string, label: string}>, returnIdAsFallback = true) => {
  if (id === undefined || id === null || String(id).trim() === '') return 'N/A';
  const stringId = String(id);
  const foundOption = options.find(opt => opt.id === stringId);
  return foundOption ? foundOption.label : (returnIdAsFallback ? stringId : 'N/A');
};

const formatBooleanYesNo = (value?: boolean) => (value ? 'Yes' : 'No');
const formatStringYesNo = (value?: string) => (value === 'yes' ? 'Yes' : (value === 'no' ? 'No' : 'N/A'));


const DisplayField: React.FC<{ label: string; value?: string | number | boolean | null; className?: string, isBadge?: boolean }> = ({ label, value, className, isBadge }) => (
  <div className={cn("mb-2", className)}>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    {isBadge && typeof value === 'string' ? <Badge variant="secondary">{value}</Badge> : <p className="text-base text-foreground">{String(value ?? 'N/A')}</p>}
  </div>
);

const DisplayList: React.FC<{ label: string; values?: string[]; options?: Array<{id: string, label: string}>, className?: string }> = ({ label, values, options, className }) => (
  <div className={cn("mb-2", className)}>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    {(!values || values.length === 0) ? <p className="text-muted-foreground italic text-sm">None selected</p> : (
      <div className="flex flex-wrap gap-1 mt-1">
        {values.map(val => (
          <Badge key={val} variant="outline" className="font-normal">{options ? getLabelById(val, options) : val}</Badge>
        ))}
      </div>
    )}
  </div>
);

const renderKitchenDetails = (details?: KitchenDetails) => {
  if (!details) return <DisplayField label="Kitchen Specifics" value="Not specified" />;
  const kitchenFeatures: React.ReactNode[] = [];

  Object.entries(details).forEach(([key, value]) => {
    if (typeof value === 'boolean' && value) {
      kitchenFeatures.push(<DisplayField key={key} label={formatKitchenFeatureLabel(key)} value={formatBooleanYesNo(value)} className="text-xs" />);
    } else if (typeof value === 'string' && value && value !== 'none' && value !== '') {
      let optionsArray;
      if (key === 'fridge') optionsArray = FRIDGE_OPTIONS;
      else if (key === 'rangeType') optionsArray = RANGE_TYPE_OPTIONS;
      else if (key === 'rangeOven') optionsArray = RANGE_OVEN_OPTIONS;
      else if (key === 'cooktopType') optionsArray = COOKTOP_TYPE_OPTIONS;
      else if (key === 'otherKTop') { /* No options array for free text */ }
      kitchenFeatures.push(<DisplayField key={key} label={formatKitchenFeatureLabel(key)} value={optionsArray ? getLabelById(value, optionsArray) : value} className="text-xs" />);
    }
  });
  if (kitchenFeatures.length === 0) return <p className="text-xs text-muted-foreground italic">No specific kitchen features selected.</p>;

  return <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">{kitchenFeatures}</div>;
};


export function ReviewStep() {
  const { getValues } = useFormContext<PropertyFormData>();
  const data = getValues();

  const renderRoom = (room: Room, index: number) => {
    let roomTitle = `Room ${index + 1}`;
    const roomTypeDetails = ROOM_TYPES.find(rt => rt.id === room.roomType);
    if (roomTypeDetails) {
        const allRooms = data.rooms || [];
        const countOfThisType = allRooms.slice(0, index + 1).filter(r => r.roomType === room.roomType).length;
        roomTitle = `${roomTypeDetails.label} ${countOfThisType > 0 ? countOfThisType : ''}`.trim();
    }

    return (
    <Card key={index} className="mb-4 bg-muted/10">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md">{roomTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <DisplayField label="Dimensions" value={room.length && room.width ? `${room.length}ft x ${room.width}ft` : 'N/A'} />
        {room.fan && room.fan !== '' && <DisplayField label="Fan" value={getLabelById(room.fan, YES_NO_OPTIONS)} />}
        {room.washerDryerHookups && room.washerDryerHookups !== '' && <DisplayField label="W/D Hookups" value={getLabelById(room.washerDryerHookups, YES_NO_NA_OPTIONS)} />}
        {(room.roomType === 'bedroom' || room.roomType === 'primary_bedroom') && room.hasWalkInCloset !== undefined &&
          <DisplayField label="Walk-in Closet" value={formatBooleanYesNo(room.hasWalkInCloset)} />
        }
        
        {room.roomType === 'kitchen' && room.kitchenDetails && (
          <div className="col-span-full mt-2 pt-2 border-t">
            <h5 className="text-xs font-semibold mb-1 text-muted-foreground">Kitchen Details:</h5>
            {renderKitchenDetails(room.kitchenDetails)}
          </div>
        )}
        {room.roomType === 'garage' && (
          <div className="col-span-full mt-2 pt-2 border-t">
            <h5 className="text-xs font-semibold mb-1 text-muted-foreground">Garage Details:</h5>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
              <DisplayField label="Garage Capacity" value={getLabelById(room.garageCarCount, GARAGE_CAR_COUNT_OPTIONS)} className="text-xs"/>
              <DisplayField label="Garage Door Openers" value={getLabelById(room.garageDoorOpeners, GARAGE_DOOR_OPENER_OPTIONS)} className="text-xs"/>
              <DisplayField label="Garage Dimensions" value={room.garageLength && room.garageWidth ? `${room.garageLength}ft x ${room.garageWidth}ft` : 'N/A'} className="text-xs"/>
            </div>
          </div>
        )}
         {room.features && <DisplayField label="Notes" value={room.features} className="col-span-full mt-2 pt-2 border-t"/>}
      </CardContent>
    </Card>
  )};
  
  const renderDimensionedItem = (item: Patio | Shed | undefined, label: string, index: number) => {
    if (!item || (!item.length && !item.width)) return null;
    return (
      <DisplayField key={`${label}-${index}`} label={`${label} ${index + 1} Dimensions`} value={item.length && item.width ? `${item.length}ft x ${item.width}ft` : (item.length ? `${item.length}ft long` : (item.width ? `${item.width}ft wide` : 'N/A'))} />
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
              <DisplayField label="Total Bedrooms" value={String(data.overallBedrooms)} />
              <DisplayField label="Total Bathrooms" value={String(data.overallBathrooms)} />
              <DisplayField label="HOA" value={formatBooleanYesNo(data.hasHOA)} />
              {data.hasHOA && <DisplayField label="Monthly HOA Dues" value={data.hoaDues ? `$${data.hoaDues}` : 'N/A'} />}
            </div>
          </div>
          <Separator />

          {data.rooms && data.rooms.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Rooms</h3>
                {data.rooms.map(renderRoom)}
              </div>
              <Separator />
            </>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Carport & RV Pad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DisplayField label="Carport Present" value={formatStringYesNo(data.carportPresent)} />
              {data.carportPresent === 'yes' && <DisplayField label="Carport Dimensions" value={data.carportLength && data.carportWidth ? `${data.carportLength}ft x ${data.carportWidth}ft` : 'N/A'} />}
              <DisplayField label="RV Pad Present" value={formatStringYesNo(data.rvPadPresent)} />
              {data.rvPadPresent === 'yes' && <DisplayField label="RV Pad Dimensions" value={data.rvPadLength && data.rvPadWidth ? `${data.rvPadLength}ft x ${data.rvPadWidth}ft` : 'N/A'} />}
            </div>
          </div>
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Flooring</h3>
            <DisplayList label="Flooring Types" values={data.flooringTypes} options={FLOORING_TYPE_OPTIONS} />
            {data.flooringTypes?.includes('other') && <DisplayField label="Other Flooring Type" value={data.otherFlooringType} />}
          </div>
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Additional Details & Features</h3>
            <DisplayField label="Has Deck" value={formatBooleanYesNo(data.hasDeck)} />
            {data.patios?.map((p, i) => renderDimensionedItem(p, "Patio", i))}
            {data.sheds?.map((s, i) => renderDimensionedItem(s, "Shed", i))}
            
            <h4 className="text-md font-medium mt-3 mb-1 text-muted-foreground">Fence</h4>
            <DisplayField label="Fence Height" value={getLabelById(data.fenceHeight, FENCE_HEIGHT_OPTIONS)} />
            <DisplayList label="Fence Material(s)" values={data.fenceMaterial} options={FENCE_MATERIAL_OPTIONS} />
            <DisplayList label="Fence Style(s)" values={data.fenceStyle} options={FENCE_STYLE_OPTIONS} />

            <h4 className="text-md font-medium mt-3 mb-1 text-muted-foreground">Fireplace</h4>
            <DisplayField label="Number of Fireplaces" value={getLabelById(data.fireplaceCount, FIREPLACE_COUNT_OPTIONS, false)} />
            <DisplayField label="Wood Burning Fireplace" value={formatBooleanYesNo(data.fireplaceTypeWood)} />
            <DisplayField label="Gas Fireplace" value={formatBooleanYesNo(data.fireplaceTypeGas)} />
            <DisplayField label="Gas Logs" value={formatBooleanYesNo(data.fireplaceFeaturesLogs)} />
            <DisplayField label="Electric Starter" value={formatBooleanYesNo(data.fireplaceFeaturesElectricStarter)} />
            <DisplayField label="Vaulted Ceilings (near FP)" value={formatBooleanYesNo(data.fireplaceVaultedCeilings)} />
            
            <h4 className="text-md font-medium mt-3 mb-1 text-muted-foreground">Utilities & Systems</h4>
            <DisplayField label="Programmable Thermostat" value={formatBooleanYesNo(data.programmableThermostat)} />
            <DisplayField label="Water Heater" value={getLabelById(data.waterHeater, WATER_HEATER_OPTIONS)} />
            <DisplayField label="A/C Type" value={getLabelById(data.acType, AC_TYPE_OPTIONS)} />
            {data.acType === 'other' && <DisplayField label="Other A/C Type" value={data.acOtherType} />}
            <DisplayField label="Heat Type" value={getLabelById(data.heatType, HEAT_TYPE_OPTIONS)} />
            {data.heatType === 'other' && <DisplayField label="Other Heat Type" value={/* data.otherHeatType - need to add this field if heatType can be 'other' with specification */ 'N/A'} />}
            <DisplayField label="Pool" value={formatBooleanYesNo(data.hasPool)} />
            <DisplayField label="Hot Tub/Spa" value={formatBooleanYesNo(data.hasHotTub)} />
            <DisplayField label="Sprinkler System" value={formatBooleanYesNo(data.hasSprinklers)} />
            <DisplayField label="Alarm System" value={formatBooleanYesNo(data.hasAlarm)} />
            <DisplayField label="Smoke Detectors" value={getLabelById(data.smokeDetectorCount, SMOKE_DETECTOR_COUNT_OPTIONS, false)} />

            <h4 className="text-md font-medium mt-3 mb-1 text-muted-foreground">Landscaping & Community</h4>
            {/* <DisplayField label="Landscaping Description" value={data.landscapingDescription} /> Removed */}
            <DisplayList label="Backyard Features" values={data.backyardFeatures} options={BACKYARD_FEATURE_OPTIONS} />
            <DisplayList label="Community Amenities" values={data.communityAmenities} options={COMMUNITY_AMENITY_OPTIONS} />
            
            <h4 className="text-md font-medium mt-3 mb-1 text-muted-foreground">Property Description</h4>
            {/* DisplayList for interiorFeatures removed */}
            {/* DisplayList for exteriorFeatures removed */}
            {data.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mt-3 mb-1">Additional Overall Description</p>
                <p className="text-base text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{data.description}</p>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
