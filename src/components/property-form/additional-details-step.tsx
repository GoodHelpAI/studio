
"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChipCheckboxGroup } from '@/components/chip-checkbox-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, XCircle, Fence, Flame, Sun, Trees, Droplet, ThermometerSun, ShieldCheck, Users, Sparkles, Construction } from 'lucide-react';
import type { PropertyFormData } from '@/lib/schema';
import {
  FENCE_HEIGHT_OPTIONS, FENCE_MATERIAL_OPTIONS, FENCE_STYLE_OPTIONS,
  FIREPLACE_COUNT_OPTIONS, WATER_HEATER_OPTIONS, AC_TYPE_OPTIONS, HEAT_TYPE_OPTIONS,
  SMOKE_DETECTOR_COUNT_OPTIONS, BACKYARD_FEATURE_OPTIONS, COMMUNITY_AMENITY_OPTIONS
} from '@/lib/constants';

export function AdditionalDetailsStep() {
  const { control, watch } = useFormContext<PropertyFormData>();

  const { fields: patioFields, append: appendPatio, remove: removePatio } = useFieldArray({ control, name: "patios" });
  const { fields: shedFields, append: appendShed, remove: removeShed } = useFieldArray({ control, name: "sheds" });

  const acType = watch('acType');

  return (
    <div className="space-y-8">
      {/* Patios and Deck */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Sun className="text-primary"/> Patios & Deck</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="hasDeck"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md mb-4">
                <FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal">Has Deck?</FormLabel>
              </FormItem>
            )}
          />
          {patioFields.map((field, index) => (
            <Card key={field.id} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel>Patio {index + 1} Dimensions</FormLabel>
                <Button type="button" variant="ghost" size="icon" onClick={() => removePatio(index)} className="text-destructive"><XCircle size={18}/></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={control} name={`patios.${index}.length`} render={({ field: f }) => (
                  <FormItem><FormLabel className="text-sm">Length (ft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name={`patios.${index}.width`} render={({ field: f }) => (
                  <FormItem><FormLabel className="text-sm">Width (ft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 8" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </Card>
          ))}
          {patioFields.length < 2 && (
            <Button type="button" variant="outline" size="sm" onClick={() => appendPatio({ length: undefined, width: undefined })}><PlusCircle className="mr-2 h-4 w-4"/>Add Patio</Button>
          )}
        </CardContent>
      </Card>
      <Separator />

      {/* Sheds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Construction className="text-primary"/> Sheds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shedFields.map((field, index) => (
            <Card key={field.id} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel>Shed {index + 1} Dimensions</FormLabel>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeShed(index)} className="text-destructive"><XCircle size={18}/></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={control} name={`sheds.${index}.length`} render={({ field: f }) => (
                  <FormItem><FormLabel className="text-sm">Length (ft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 8" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name={`sheds.${index}.width`} render={({ field: f }) => (
                  <FormItem><FormLabel className="text-sm">Width (ft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 6" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </Card>
          ))}
          {shedFields.length < 2 && (
            <Button type="button" variant="outline" size="sm" onClick={() => appendShed({ length: undefined, width: undefined })}><PlusCircle className="mr-2 h-4 w-4"/>Add Shed</Button>
          )}
        </CardContent>
      </Card>
      <Separator />

      {/* Fence */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Fence className="text-primary"/> Fence Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField control={control} name="fenceHeight" render={({ field }) => (
            <FormItem><FormLabel>Fence Height</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Select height" /></SelectTrigger></FormControl><SelectContent>{FENCE_HEIGHT_OPTIONS.map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <ChipCheckboxGroup control={control} name="fenceMaterial" label="Fence Material(s)" options={FENCE_MATERIAL_OPTIONS} />
          <ChipCheckboxGroup control={control} name="fenceStyle" label="Fence Style(s)" options={FENCE_STYLE_OPTIONS} />
        </CardContent>
      </Card>
      <Separator />
      
      {/* Fireplace */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Flame className="text-primary"/> Fireplace Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField control={control} name="fireplaceCount" render={({ field }) => (
            <FormItem><FormLabel>Number of Fireplaces</FormLabel><Select onValueChange={field.onChange} value={field.value === undefined ? '' : String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Select count" /></SelectTrigger></FormControl><SelectContent>{FIREPLACE_COUNT_OPTIONS.map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="fireplaceTypeWood" render={({ field }) => (<FormItem className="flex items-center gap-2 p-2 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Wood Burning</FormLabel></FormItem>)}/>
            <FormField control={control} name="fireplaceTypeGas" render={({ field }) => (<FormItem className="flex items-center gap-2 p-2 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Gas</FormLabel></FormItem>)}/>
            <FormField control={control} name="fireplaceFeaturesLogs" render={({ field }) => (<FormItem className="flex items-center gap-2 p-2 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Gas Logs</FormLabel></FormItem>)}/>
            <FormField control={control} name="fireplaceFeaturesElectricStarter" render={({ field }) => (<FormItem className="flex items-center gap-2 p-2 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Electric Starter</FormLabel></FormItem>)}/>
            <FormField control={control} name="fireplaceVaultedCeilings" render={({ field }) => (<FormItem className="flex items-center gap-2 p-2 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Vaulted Ceilings (near FP)</FormLabel></FormItem>)}/>
          </div>
        </CardContent>
      </Card>
      <Separator />

      {/* Utilities & Systems */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Droplet className="text-primary"/> Utilities & Systems</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField control={control} name="programmableThermostat" render={({ field }) => (<FormItem className="flex items-center gap-2 p-3 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Programmable Thermostat</FormLabel></FormItem>)}/>
          <FormField control={control} name="waterHeater" render={({ field }) => (
            <FormItem><FormLabel>Water Heater</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>{WATER_HEATER_OPTIONS.map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <FormField control={control} name="acType" render={({ field }) => (
            <FormItem><FormLabel>A/C Type</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>{AC_TYPE_OPTIONS.map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
          {acType === 'other' && <FormField control={control} name="acOtherType" render={({ field }) => (<FormItem><FormLabel>Specify Other A/C Type</FormLabel><FormControl><Input placeholder="e.g. Geothermal" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)}/>}
          
          <FormField control={control} name="heatType" render={({ field }) => (
            <FormItem><FormLabel>Heat Type</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>{HEAT_TYPE_OPTIONS.map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={control} name="hasPool" render={({ field }) => (<FormItem className="flex items-center gap-2 p-3 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Pool</FormLabel></FormItem>)}/>
            <FormField control={control} name="hasHotTub" render={({ field }) => (<FormItem className="flex items-center gap-2 p-3 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Hot Tub/Spa</FormLabel></FormItem>)}/>
            <FormField control={control} name="hasSprinklers" render={({ field }) => (<FormItem className="flex items-center gap-2 p-3 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Sprinkler System</FormLabel></FormItem>)}/>
            <FormField control={control} name="hasAlarm" render={({ field }) => (<FormItem className="flex items-center gap-2 p-3 border rounded"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">Alarm System (Monitored/Owned)</FormLabel></FormItem>)}/>
          </div>
           <FormField control={control} name="smokeDetectorCount" render={({ field }) => (
            <FormItem><FormLabel>Number of Smoke Detectors</FormLabel><Select onValueChange={field.onChange} value={field.value === undefined ? '' : String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Select count" /></SelectTrigger></FormControl><SelectContent>{SMOKE_DETECTOR_COUNT_OPTIONS.map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
        </CardContent>
      </Card>
      <Separator />

      {/* Landscaping & Community */}
       <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Trees className="text-primary"/> Landscaping & Community</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField control={control} name="landscapingDescription" render={({ field }) => (
            <FormItem><FormLabel>Landscaping Details</FormLabel><FormControl><Textarea placeholder="Describe landscaping features, e.g., flower beds, rock gardens, specific trees." {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
          )}/>
          <ChipCheckboxGroup control={control} name="backyardFeatures" label="Backyard Features" options={BACKYARD_FEATURE_OPTIONS} />
          <ChipCheckboxGroup control={control} name="communityAmenities" label="Community Amenities" options={COMMUNITY_AMENITY_OPTIONS} />
        </CardContent>
      </Card>
      <Separator />

       {/* General Features (Revised) */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="text-primary"/> Other Notable Features</CardTitle></CardHeader>
        <CardContent className="space-y-4">
           <ChipCheckboxGroup control={control} name="interiorFeatures" label="Interior Features" options={INTERIOR_FEATURE_OPTIONS}/>
           <ChipCheckboxGroup control={control} name="exteriorFeatures" label="Exterior Features" options={EXTERIOR_FEATURE_OPTIONS}/>
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base">Additional Property Description (Overall)</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Describe any other notable features, recent upgrades, or selling points of the property."
                        className="min-h-[120px]"
                        {...field}
                        value={field.value ?? ''}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </CardContent>
      </Card>


    </div>
  );
}

    