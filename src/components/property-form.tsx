
"use client";

import { useState } from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, type PropertyFormData } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

import { BasicInfoStep } from './property-form/basic-info-step';
import { PropertyDetailsStep } from './property-form/property-details-step';
import { RoomsStep } from './property-form/rooms-step';
import { GarageCarportStep } from './property-form/garage-carport-step';
import { FlooringStep } from './property-form/flooring-step';
import { AdditionalDetailsStep } from './property-form/additional-details-step';
import { ReviewStep } from './property-form/review-step';

const steps = [
  { id: 1, title: 'Basic Information', component: BasicInfoStep, fields: ['address', 'city', 'state', 'zip', 'propertyType'] },
  { id: 2, title: 'Property Details', component: PropertyDetailsStep, fields: ['overallBedrooms', 'overallBathrooms', 'hasHOA', 'hoaDues'] },
  { id: 3, title: 'Room Specifications', component: RoomsStep, fields: ['rooms'] },
  { id: 4, title: 'Carport & RV Pad', component: GarageCarportStep, fields: ['carportPresent', 'carportLength', 'carportWidth', 'rvPadPresent', 'rvPadLength', 'rvPadWidth'] },
  { id: 5, title: 'Flooring', component: FlooringStep, fields: ['flooringTypes', 'otherFlooringType'] },
  { id: 6, title: 'Additional Details & Features', component: AdditionalDetailsStep, fields: [
    'patios', 'sheds', 'hasDeck', 'fenceHeight', 'fenceMaterial', 'fenceStyle', 
    'fireplaceCount', 'fireplaceTypeWood', 'fireplaceTypeGas', 'fireplaceFeaturesLogs', 'fireplaceFeaturesElectricStarter', 'fireplaceVaultedCeilings',
    'programmableThermostat', 'waterHeater', 'acType', 'acOtherType', 'heatType', 
    'hasPool', 'hasHotTub', 'hasSprinklers', 'hasAlarm', 'smokeDetectorCount',
    'backyardFeatures', 'communityAmenities', 'landscapingDescription',
    'interiorFeatures', 'exteriorFeatures', 'description'
  ]},
  { id: 7, title: 'Review & Submit', component: ReviewStep, fields: [] },
];

export function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: 'onTouched',
    defaultValues: {
      address: '',
      city: '',
      state: '',
      zip: '',
      propertyType: '',
      overallBedrooms: undefined,
      overallBathrooms: undefined,
      hasHOA: false,
      hoaDues: undefined,
      rooms: [],
      carportPresent: false,
      carportLength: undefined,
      carportWidth: undefined,
      rvPadPresent: false,
      rvPadLength: undefined,
      rvPadWidth: undefined,
      flooringTypes: [],
      otherFlooringType: '',
      patios: [],
      sheds: [],
      hasDeck: false,
      fenceHeight: '',
      fenceMaterial: [],
      fenceStyle: [],
      fireplaceCount: undefined,
      fireplaceTypeWood: false,
      fireplaceTypeGas: false,
      fireplaceFeaturesLogs: false,
      fireplaceFeaturesElectricStarter: false,
      fireplaceVaultedCeilings: false,
      programmableThermostat: false,
      waterHeater: '',
      acType: '',
      acOtherType: '',
      heatType: '',
      hasPool: false,
      hasHotTub: false,
      hasSprinklers: false,
      hasAlarm: false,
      smokeDetectorCount: undefined,
      backyardFeatures: [],
      communityAmenities: [],
      landscapingDescription: '',
      interiorFeatures: [],
      exteriorFeatures: [],
      description: '',
    },
  });

  const { handleSubmit, trigger, formState: { errors }, setError, clearErrors } = methods;

  const processForm: SubmitHandler<PropertyFormData> = (data) => {
    console.log("Property Data JSON:", JSON.stringify(data, null, 2));
    toast({
      title: "Property Submitted!",
      description: "Property data has been successfully processed and logged.",
      variant: "default",
    });
  };

  const handleNextStep = async () => {
    const currentStepConfig = steps[currentStep - 1];
    const currentStepFields = currentStepConfig.fields as (keyof PropertyFormData)[];
    
    // Clear previous manual errors for current step fields before re-validating
    currentStepFields.forEach(field => clearErrors(field));
    
    const isValid = currentStepFields.length > 0 ? await trigger(currentStepFields, { shouldFocus: true }) : true;
    
    let customValidationPassed = true;
    // Custom validation logic
    if (currentStepConfig.title === 'Property Details') {
      if (methods.getValues('hasHOA') && (methods.getValues('hoaDues') === undefined || methods.getValues('hoaDues') === null || methods.getValues('hoaDues')! <= 0)) {
        setError('hoaDues', { type: 'manual', message: 'HOA dues are required if HOA is selected and must be positive.' });
        customValidationPassed = false;
      }
    }
    if (currentStepConfig.title === 'Flooring') {
      if (methods.getValues('flooringTypes')?.includes('other') && (!methods.getValues('otherFlooringType') || methods.getValues('otherFlooringType')!.trim() === '')) {
        setError('otherFlooringType', {type: 'manual', message: 'Please specify other flooring type.'});
        customValidationPassed = false;
      }
    }
     if (currentStepConfig.title === 'Additional Details & Features') {
      if (methods.getValues('acType') === 'other' && (!methods.getValues('acOtherType') || methods.getValues('acOtherType')!.trim() === '')) {
        setError('acOtherType', {type: 'manual', message: 'Please specify other A/C type.'});
        customValidationPassed = false;
      }
    }
    if (currentStepConfig.title === 'Room Specifications') {
      const rooms = methods.getValues('rooms');
      rooms?.forEach((room, index) => {
        if (room.roomType === 'garage') {
          if (room.garageCarCount && room.garageCarCount !== 'none' && room.garageCarCount !== '') {
            if (room.garageLength === undefined || room.garageLength <=0) {
               setError(`rooms.${index}.garageLength` as const, { type: 'manual', message: 'Garage length required for selected car count.' });
               customValidationPassed = false;
            }
            if (room.garageWidth === undefined || room.garageWidth <=0) {
               setError(`rooms.${index}.garageWidth` as const, { type: 'manual', message: 'Garage width required for selected car count.' });
               customValidationPassed = false;
            }
          }
        }
      });
    }


    if (isValid && customValidationPassed) {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
       const fieldErrors = Object.keys(errors);
       let errorMessages = "Please correct the errors on the current step: ";
       if(fieldErrors.length > 0) {
         errorMessages += fieldErrors.map(fieldName => {
            const field = fieldName as keyof PropertyFormData; // Type assertion
            return errors[field]?.message;
         }).filter(Boolean).join('; ');
       } else if (!customValidationPassed) {
          // Add messages from manual setError calls if no RHF errors
          if (methods.formState.errors.hoaDues?.message) errorMessages += methods.formState.errors.hoaDues.message + "; ";
          if (methods.formState.errors.otherFlooringType?.message) errorMessages += methods.formState.errors.otherFlooringType.message + "; ";
          if (methods.formState.errors.acOtherType?.message) errorMessages += methods.formState.errors.acOtherType.message + "; ";
          // Add errors from rooms array
          methods.getValues('rooms')?.forEach((_room, index) => {
            const garageLengthError = methods.formState.errors.rooms?.[index]?.garageLength?.message;
            const garageWidthError = methods.formState.errors.rooms?.[index]?.garageWidth?.message;
            if (garageLengthError) errorMessages += `Room ${index+1}: ${garageLengthError}; `;
            if (garageWidthError) errorMessages += `Room ${index+1}: ${garageWidthError}; `;
          });
       }


      toast({
        title: "Validation Error",
        description: errorMessages || "Please check the form for errors.",
        variant: "destructive",
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const ActiveStepComponent = steps[currentStep - 1].component;

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-3xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center font-bold text-primary">
            Property Pro Lister
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {steps[currentStep - 1].title} - Step {currentStep} of {steps.length}
          </CardDescription>
          <Progress value={(currentStep / steps.length) * 100} className="w-full mt-2" />
        </CardHeader>
        <form onSubmit={handleSubmit(processForm)}>
          <CardContent className="min-h-[300px] py-6">
            <ActiveStepComponent />
          </CardContent>
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              onClick={handlePreviousStep}
              variant="outline"
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit">
                Submit Property <Send className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
