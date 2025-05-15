
"use client";

import { useState } from 'react';
import { useForm, FormProvider, type SubmitHandler, type FieldPath } from 'react-hook-form';
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

// Helper function to recursively collect all error messages from RHF's error state
function getAllErrorMessages(errorsObject: any, pathPrefix = ''): string[] {
  let messages: string[] = [];
  if (!errorsObject) return messages;

  for (const key in errorsObject) {
    if (Object.prototype.hasOwnProperty.call(errorsObject, key)) {
      const errorField = errorsObject[key];
      const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;

      if (errorField) {
        if (typeof errorField.message === 'string') {
          let fieldName = currentPath;
          // Make room error paths more user-friendly
          if (fieldName.startsWith('rooms.')) {
            fieldName = fieldName.replace(/^rooms\.(\d+)\.(.*)$/, (match, index, field) => {
              let readableField = field.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim(); 
              if (field === 'roomType') readableField = 'room type';
              else if (field === 'garageLength') readableField = 'garage length';
              else if (field === 'garageWidth') readableField = 'garage width';
              else if (field === 'garageCarCount') readableField = 'garage car count';
              else if (field === 'garageDoorOpeners') readableField = 'garage door openers';
              return `Room ${parseInt(index) + 1} ${readableField.charAt(0).toUpperCase() + readableField.slice(1)}`;
            });
          } else {
             fieldName = fieldName.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim();
             fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
          }
          messages.push(`${fieldName}: ${errorField.message}`);
        } else if (Array.isArray(errorField)) {
          errorField.forEach((item, index) => {
            if (item) { // Only process if there's an error object for this item
              messages = messages.concat(getAllErrorMessages(item, `${currentPath}.${index}`));
            }
          });
        } else if (typeof errorField === 'object' && !errorField.type /* Check if it's a nested errors object and not a FieldError itself */) {
          messages = messages.concat(getAllErrorMessages(errorField, currentPath));
        }
      }
    }
  }
  return messages.filter(Boolean); // Remove any undefined/empty messages
}


export function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: 'onTouched', // Consider 'onChange' or 'onBlur' if more immediate feedback is desired. 'onTouched' is a good balance.
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
      carportPresent: 'no',
      carportLength: undefined,
      carportWidth: undefined,
      rvPadPresent: 'no',
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
    
    // Clear previous manual errors for current step's specific custom validations
    if (currentStepConfig.title === 'Room Specifications') {
      const rooms = methods.getValues('rooms');
      rooms?.forEach((_room, index) => {
        clearErrors(`rooms.${index}.garageLength` as const);
        clearErrors(`rooms.${index}.garageWidth` as const);
      });
    } else if (currentStepConfig.title === 'Property Details') {
        clearErrors('hoaDues');
    } else if (currentStepConfig.title === 'Flooring') {
        clearErrors('otherFlooringType');
    } else if (currentStepConfig.title === 'Additional Details & Features') {
        clearErrors('acOtherType');
    }
    // For Zod errors or general field errors, `trigger` will update them.
    // No need to call clearErrors broadly for Zod-managed fields if re-triggering.
    
    const isValid = currentStepFields.length > 0 ? await trigger(currentStepFields, { shouldFocus: true }) : true;
    
    let customValidationPassed = true;
    // Custom validation logic, setError will update methods.formState.errors
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
               setError(`rooms.${index}.garageLength` as const, { type: 'manual', message: 'Length required if car count specified.' });
               customValidationPassed = false;
            }
            if (room.garageWidth === undefined || room.garageWidth <=0) {
               setError(`rooms.${index}.garageWidth` as const, { type: 'manual', message: 'Width required if car count specified.' });
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
      const collectedMessages = getAllErrorMessages(methods.formState.errors);
      let toastDescription = "Please correct the errors on the current step:";
      if (collectedMessages.length > 0) {
        toastDescription += "\n\n- " + collectedMessages.join('\n- ');
      } else {
        // This case should ideally not happen if validation fails, as errors should be in formState
        toastDescription += "\n\nPlease review all fields for missing or invalid entries.";
      }

      toast({
        title: "Validation Error",
        description: <pre className="whitespace-pre-wrap text-xs">{toastDescription}</pre>,
        variant: "destructive",
        duration: 5000, // Give a bit more time to read
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
