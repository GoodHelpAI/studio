
"use client";

import { useFormContext, Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { XCircle, Wind, PlugZap, ChefHat, Warehouse, KeyRound } from 'lucide-react'; // KeyRound for Walk-in Closet
import type { PropertyFormData, KitchenDetails, Room } from '@/lib/schema';
import { 
  ROOM_TYPES, type RoomTypeOption, YES_NO_OPTIONS, YES_NO_NA_OPTIONS, 
  FRIDGE_OPTIONS, RANGE_TYPE_OPTIONS, RANGE_OVEN_OPTIONS, COOKTOP_TYPE_OPTIONS, KITCHEN_COUNTERTOP_OPTIONS,
  GARAGE_CAR_COUNT_OPTIONS, GARAGE_DOOR_OPENER_OPTIONS 
} from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface RoomBlockProps {
  index: number;
  onRemove: (index: number) => void;
}

const kitchenFeatureBooleanFields: (keyof KitchenDetails)[] = [
  'island', 'raisedBar', 'eatInKitchen', 'graniteKTop', 'laminateKTop', 'corianKTop', 'tileKTop',
  'walkInPantry', 'tileBacksplash', 'butlersPantry', 'cabinets36inch', 'cabinets42inch',
  'ssAppliances', 'microwaveFlush', 'microwaveKTop', 'dishwasher', 'disposal',
  'compactor', 'wineCooler', 'hoodAVent', 'outdoorGrill'
];

export const formatKitchenFeatureLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') 
    .replace(/^./, str => str.toUpperCase()); 
};


export function RoomBlock({ index, onRemove }: RoomBlockProps) {
  const { control, watch, setValue, getValues } = useFormContext<PropertyFormData>();
  const roomPathPrefix = `rooms.${index}` as const;
  const roomTypePath = `${roomPathPrefix}.roomType` as const;
  const kitchenDetailsPath = `${roomPathPrefix}.kitchenDetails` as const;
  const garageCarCountPath = `${roomPathPrefix}.garageCarCount` as const;
  const garageDoorOpenersPath = `${roomPathPrefix}.garageDoorOpeners` as const;
  const garageLengthPath = `${roomPathPrefix}.garageLength` as const;
  const garageWidthPath = `${roomPathPrefix}.garageWidth` as const;
  const fanPath = `${roomPathPrefix}.fan` as const;
  const washerDryerHookupsPath = `${roomPathPrefix}.washerDryerHookups` as const;
  const hasWalkInClosetPath = `${roomPathPrefix}.hasWalkInCloset` as const;


  const selectedRoomTypeId = watch(roomTypePath);
  const roomTypeDetails = ROOM_TYPES.find(rt => rt.id === selectedRoomTypeId);
  const RoomIcon = roomTypeDetails?.icon;

  const isKitchen = selectedRoomTypeId === 'kitchen';
  const isBathroom = selectedRoomTypeId === 'bathroom' || selectedRoomTypeId === 'half_bathroom';
  const isGarage = selectedRoomTypeId === 'garage';
  const isUtility = selectedRoomTypeId === 'laundry' || selectedRoomTypeId === 'utility_room';
  const isBedroomType = selectedRoomTypeId === 'bedroom' || selectedRoomTypeId === 'primary_bedroom';

  const showFanOptions = !isBathroom && !isGarage && selectedRoomTypeId;
  const showWasherDryerHookups = (isUtility || isGarage) && selectedRoomTypeId;


  if (isKitchen && !getValues(kitchenDetailsPath)) {
    setValue(kitchenDetailsPath, {
      island: false, raisedBar: false, eatInKitchen: false, graniteKTop: false, laminateKTop: false,
      corianKTop: false, tileKTop: false, otherKTop: '', walkInPantry: false, tileBacksplash: false,
      butlersPantry: false, cabinets36inch: false, cabinets42inch: false, ssAppliances: false,
      microwaveFlush: false, microwaveKTop: false, dishwasher: false, disposal: false,
      fridge: '', compactor: false, wineCooler: false, rangeType: '', rangeOven: '',
      cooktopType: '', hoodAVent: false, outdoorGrill: false,
    });
  }


  let cardTitle = `Room ${index + 1}`;
  if (roomTypeDetails) {
    const allRooms = getValues('rooms') || [];
    const countOfThisType = allRooms.slice(0, index + 1).filter(r => r.roomType === selectedRoomTypeId).length;
    cardTitle = `${roomTypeDetails.label} ${countOfThisType > 0 ? countOfThisType : ''}`.trim();
  }


  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {RoomIcon && <RoomIcon className="h-5 w-5 text-primary" />}
          {cardTitle}
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
          name={roomTypePath}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value !== 'kitchen') setValue(kitchenDetailsPath, undefined);
                  if (value !== 'garage') {
                    setValue(garageCarCountPath, '');
                    setValue(garageDoorOpenersPath, '');
                    setValue(garageLengthPath, undefined);
                    setValue(garageWidthPath, undefined);
                  } else {
                     setValue(garageCarCountPath, getValues(garageCarCountPath) || 'none');
                     setValue(garageDoorOpenersPath, getValues(garageDoorOpenersPath) || 'none');
                  }
                  setValue(fanPath, getValues(fanPath) || 'no');
                  setValue(washerDryerHookupsPath, getValues(washerDryerHookupsPath) || 'na');
                  if (value !== 'bedroom' && value !== 'primary_bedroom') {
                    setValue(hasWalkInClosetPath, false); 
                  }
                }} 
                value={field.value || ''}
              >
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
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>Length (ft)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 12" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${roomPathPrefix}.width`}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>Width (ft)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {showFanOptions && (
          <FormField
            control={control}
            name={fanPath}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex items-center"><Wind className="mr-2 h-4 w-4 text-primary" />Has Fan?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || 'no'}
                    className="flex space-x-2"
                  >
                    {YES_NO_OPTIONS.map(option => ( 
                      <FormItem key={`fan-${option.id}`} className="flex items-center space-x-2 space-y-0">
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
        )}

        {showWasherDryerHookups && (
          <FormField
            control={control}
            name={washerDryerHookupsPath}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex items-center"><PlugZap className="mr-2 h-4 w-4 text-primary" />Washer/Dryer Hookups?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || 'na'}
                    className="flex space-x-2"
                  >
                     {YES_NO_NA_OPTIONS.map(option => ( 
                      <FormItem key={`wd-${option.id}`} className="flex items-center space-x-2 space-y-0">
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
        )}

        {isBedroomType && (
          <FormField
            control={control}
            name={hasWalkInClosetPath}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md shadow-sm">
                 <FormControl>
                    <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </FormControl>
                <FormLabel className="font-normal flex items-center"><KeyRound className="mr-2 h-4 w-4 text-primary"/>Walk-in Closet?</FormLabel>
              </FormItem>
            )}
          />
        )}

        {isKitchen && getValues(kitchenDetailsPath) && (
          <div className="space-y-4 pt-4 border-t mt-4">
            <h4 className="text-md font-semibold flex items-center"><ChefHat className="mr-2 h-5 w-5 text-primary" />Kitchen Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {kitchenFeatureBooleanFields.map(featureKey => (
                <FormField
                  key={featureKey}
                  control={control}
                  name={`${kitchenDetailsPath}.${featureKey}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 border rounded-md shadow-sm">
                      <FormControl>
                        <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">{formatKitchenFeatureLabel(featureKey)}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <FormField
              control={control}
              name={`${kitchenDetailsPath}.fridge`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refrigerator</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select fridge option" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {FRIDGE_OPTIONS.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`${kitchenDetailsPath}.rangeType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Range Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select range type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {RANGE_TYPE_OPTIONS.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`${kitchenDetailsPath}.rangeOven`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Range Oven</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select oven type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {RANGE_OVEN_OPTIONS.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`${kitchenDetailsPath}.cooktopType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooktop Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select cooktop type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {COOKTOP_TYPE_OPTIONS.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={control}
                name={`${kitchenDetailsPath}.otherKTop`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Countertop Material (if selected)</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify other material" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        )}

        {isGarage && (
          <div className="space-y-4 pt-4 border-t mt-4">
            <h4 className="text-md font-semibold flex items-center"><Warehouse className="mr-2 h-5 w-5 text-primary" />Garage Details</h4>
            <FormField
              control={control}
              name={garageCarCountPath}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Garage Spaces</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'none'}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select garage capacity" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {GARAGE_CAR_COUNT_OPTIONS.map(option => (
                        <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
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
                name={garageLengthPath}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>Garage Length (ft)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 20" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={garageWidthPath}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>Garage Width (ft)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 20" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={garageDoorOpenersPath}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Garage Door Openers</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'none'}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select number of openers" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {GARAGE_DOOR_OPENER_OPTIONS.map(option => (
                        <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={control}
          name={`${roomPathPrefix}.features`}
          render={({ field }) => (
            <FormItem className="mt-4 pt-4 border-t">
              <FormLabel>Features / Notes for this Room</FormLabel>
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
