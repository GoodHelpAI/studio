
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Added Image import
import { useForm, FormProvider, type SubmitHandler, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, type PropertyFormData } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Send, Check, Home, ListChecks, LayoutGrid, Car, Layers, Wrench, FileCheck2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { BasicInfoStep } from './property-form/basic-info-step';
import { PropertyDetailsStep } from './property-form/property-details-step';
import { RoomsStep } from './property-form/rooms-step';
import { GarageCarportStep } from './property-form/garage-carport-step';
import { FlooringStep } from './property-form/flooring-step';
import { AdditionalDetailsStep } from './property-form/additional-details-step';
import { ReviewStep } from './property-form/review-step';

interface StepConfig {
  id: number;
  title: string; 
  component: React.FC;
  fields: FieldPath<PropertyFormData>[];
  icon?: LucideIcon; 
}

const steps: StepConfig[] = [
  { id: 1, title: 'Basic Information', component: BasicInfoStep, fields: ['address', 'city', 'state', 'zip', 'propertyType'], icon: Home },
  { id: 2, title: 'Property Details', component: PropertyDetailsStep, fields: ['overallBedrooms', 'overallBathrooms', 'hasHOA', 'hoaDues'], icon: ListChecks },
  { id: 3, title: 'Room Specifications', component: RoomsStep, fields: ['rooms'], icon: LayoutGrid },
  { id: 4, title: 'Carport & RV Pad', component: GarageCarportStep, fields: ['carportPresent', 'carportLength', 'carportWidth', 'rvPadPresent', 'rvPadLength', 'rvPadWidth'], icon: Car },
  { id: 5, title: 'Flooring', component: FlooringStep, fields: ['flooringTypes', 'otherFlooringType'], icon: Layers },
  { id: 6, title: 'Additional Details & Features', component: AdditionalDetailsStep, fields: [
    'patios', 'sheds', 'hasDeck', 'fenceHeight', 'fenceMaterial', 'fenceStyle',
    'fireplaceCount', 'fireplaceTypeWood', 'fireplaceTypeGas', 'fireplaceFeaturesLogs', 'fireplaceFeaturesElectricStarter', 'fireplaceVaultedCeilings',
    'programmableThermostat', 'waterHeater', 'acType', 'acOtherType', 'heatType',
    'hasPool', 'hasHotTub', 'hasSprinklers', 'hasAlarm', 'smokeDetectorCount',
    'backyardFeatures', 'communityAmenities',
    'description'
  ], icon: Wrench },
  { id: 7, title: 'Review & Submit', component: ReviewStep, fields: [], icon: FileCheck2 },
];

const N8N_WEBHOOK_URL = 'https://goodhelpai-n8n.onrender.com/webhook-test/06703c6e-8f0a-415c-b55b-99f33003db26';


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
          // Convert camelCase or dot.notation to readable format
          // Example: rooms.0.roomType -> Room 1 Room type
          // Example: kitchenDetails.walkInPantry -> Kitchen details Walk in pantry
          if (fieldName.startsWith('rooms.')) {
            fieldName = fieldName.replace(/^rooms\.(\d+)\.(.*)$/, (match, roomIndex, field) => {
              let readableField = field.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim();
              readableField = readableField.charAt(0).toUpperCase() + readableField.slice(1);
              if (readableField.startsWith('Kitchen details.')) {
                readableField = readableField.replace('Kitchen details.', 'Kitchen ');
              } else if (readableField.startsWith('Garage ')){
                 readableField = readableField.replace('Garage ', ''); // Avoid "Garage Garage Length"
              }
              return `Room ${parseInt(roomIndex) + 1} ${readableField}`;
            });
          } else if (fieldName.startsWith('patios.') || fieldName.startsWith('sheds.')) {
             fieldName = fieldName.replace(/^(patios|sheds)\.(\d+)\.(.*)$/, (match, type, index, field) => {
              let readableField = field.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim();
              readableField = readableField.charAt(0).toUpperCase() + readableField.slice(1);
              const itemType = type.charAt(0).toUpperCase() + type.slice(1, -1); // Patio or Shed
              return `${itemType} ${parseInt(index) + 1} ${readableField}`;
            });
          } else {
             // Generic camelCase to Title Case, with special handling for HOA
             if (fieldName === 'hoaDues') fieldName = 'HOA Dues';
             else if (fieldName === 'acOtherType') fieldName = 'Other A/C Type';
             else if (fieldName === 'otherFlooringType') fieldName = 'Other Flooring Type';
             else {
                fieldName = fieldName.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim();
                fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
             }
          }
          messages.push(`${fieldName}: ${errorField.message}`);
        } else if (Array.isArray(errorField)) {
          errorField.forEach((item, index) => {
            if (item) { // Ensure item is not null/undefined
              messages = messages.concat(getAllErrorMessages(item, `${currentPath}.${index}`));
            }
          });
        } else if (typeof errorField === 'object' && !errorField.type ) { // Check if it's a nested error object
          messages = messages.concat(getAllErrorMessages(errorField, currentPath));
        }
      }
    }
  }
  return messages.filter(Boolean); // Remove any undefined/null messages
}


export function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: 'onTouched', // Validate on blur
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
      description: '',
    },
  });

  const { handleSubmit, trigger, formState: { errors }, setError, clearErrors, getValues } = methods;

  const processForm: SubmitHandler<PropertyFormData> = async (data) => {
    setIsSubmitting(true);
    console.log("Property Data JSON to be sent:", JSON.stringify(data, null, 2));

    if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL_HERE' || !N8N_WEBHOOK_URL) {
        toast({
            title: "Webhook URL Not Configured",
            description: "Please configure the n8n webhook URL in src/components/property-form.tsx.",
            variant: "destructive",
            duration: 7000,
        });
        setIsSubmitting(false);
        return;
    }

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            toast({
                title: "Property Submitted!",
                description: "Property data successfully sent to n8n workflow.",
                variant: "default",
            });
            // Potentially reset form or redirect here
            // methods.reset(); // Example: reset form
            // setCurrentStep(1); // Example: go back to first step
        } else {
            const errorData = await response.text();
            console.error('Failed to send to n8n:', response.status, errorData);
            toast({
                title: "Submission Failed",
                description: `Could not send data to n8n. Status: ${response.status}. Error: ${errorData || 'Unknown error'}`,
                variant: "destructive",
                duration: 9000,
            });
        }
    } catch (error) {
        console.error('Error submitting form to n8n:', error);
        let errorMessage = "An error occurred while trying to send data to n8n.";
        if (error instanceof Error) {
            errorMessage += ` Details: ${error.message}`;
        }
        toast({
            title: "Network Error",
            description: `${errorMessage} Please check your connection or the webhook URL.`,
            variant: "destructive",
            duration: 9000,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    const currentStepConfig = steps[currentStep - 1];
    const currentStepFields = currentStepConfig.fields as FieldPath<PropertyFormData>[];

    // Clear existing errors for the current step's fields to avoid stale messages
    currentStepFields.forEach(field => clearErrors(field));
    if (currentStepConfig.title === 'Property Details') clearErrors('hoaDues');
    if (currentStepConfig.title === 'Flooring') clearErrors('otherFlooringType');
    if (currentStepConfig.title === 'Additional Details & Features') clearErrors('acOtherType');
    if (currentStepConfig.title === 'Room Specifications' && getValues('rooms')) {
      getValues('rooms').forEach((_room, index) => {
        const roomPrefix = `rooms.${index}` as const;
        clearErrors(`${roomPrefix}.roomType`);
        clearErrors(`${roomPrefix}.length`);
        clearErrors(`${roomPrefix}.width`);
        clearErrors(`${roomPrefix}.garageLength`);
        clearErrors(`${roomPrefix}.garageWidth`);
        clearErrors(`${roomPrefix}.garageCarCount`);
        if (getValues(`${roomPrefix}.kitchenDetails`)) {
            Object.keys(getValues(`${roomPrefix}.kitchenDetails`)!).forEach(k => {
                clearErrors(`${roomPrefix}.kitchenDetails.${k}` as any);
            });
        }
      });
    }

    const isValid = currentStepFields.length > 0 ? await trigger(currentStepFields, { shouldFocus: true }) : true;

    let customValidationPassed = true;
    // Custom validation logic (e.g., for HOA, other flooring/AC, room specific logic)
    if (currentStepConfig.title === 'Property Details') {
      if (getValues('hasHOA') && (getValues('hoaDues') === undefined || getValues('hoaDues') === null || getValues('hoaDues')! <= 0)) {
        setError('hoaDues', { type: 'manual', message: 'HOA dues are required if HOA is selected and must be positive.' });
        customValidationPassed = false;
      }
    }
    if (currentStepConfig.title === 'Flooring') {
      if (getValues('flooringTypes')?.includes('other') && (!getValues('otherFlooringType') || getValues('otherFlooringType')!.trim() === '')) {
        setError('otherFlooringType', {type: 'manual', message: 'Please specify other flooring type.'});
        customValidationPassed = false;
      }
    }
    if (currentStepConfig.title === 'Additional Details & Features') {
      if (getValues('acType') === 'other' && (!getValues('acOtherType') || getValues('acOtherType')!.trim() === '')) {
        setError('acOtherType', {type: 'manual', message: 'Please specify other A/C type.'});
        customValidationPassed = false;
      }
    }
    if (currentStepConfig.title === 'Room Specifications' && getValues('rooms')) {
      getValues('rooms').forEach((room, index) => {
        const roomPrefix = `rooms.${index}` as const;
         if (!room.roomType || room.roomType.trim() === '') {
            setError(`${roomPrefix}.roomType`, { type: 'manual', message: 'Room type is required.' });
            customValidationPassed = false;
        }
        // Room dimension validation: positive length/width required unless it's a bathroom type
        if (room.roomType && room.roomType !== 'garage' && room.roomType !== 'bathroom' && room.roomType !== 'half_bathroom') {
            if (room.length === undefined || room.length <= 0) {
                 setError(`${roomPrefix}.length`, { type: 'manual', message: 'Positive length required.' });
                 customValidationPassed = false;
            }
            if (room.width === undefined || room.width <= 0 ) {
                setError(`${roomPrefix}.width`, { type: 'manual', message: 'Positive width required.' });
                customValidationPassed = false;
            }
        }
        // Garage dimension validation: required if car count is specified
        if (room.roomType === 'garage') {
          if (room.garageCarCount && room.garageCarCount !== 'none' && room.garageCarCount !== '') {
            if (room.garageLength === undefined || room.garageLength <=0) {
               setError(`${roomPrefix}.garageLength`, { type: 'manual', message: 'Length required if car count specified.' });
               customValidationPassed = false;
            }
            if (room.garageWidth === undefined || room.garageWidth <=0) {
               setError(`${roomPrefix}.garageWidth`, { type: 'manual', message: 'Width required if car count specified.' });
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
      } else if (!isValid && currentStepFields.length > 0) {
        toastDescription += "\n\nPlease review all fields for missing or invalid entries.";
      } else if (!customValidationPassed) {
         toastDescription += "\n\nPlease review the highlighted fields.";
      } else {
        toastDescription += "\n\nAn unknown validation error occurred.";
      }


      toast({
        title: "Validation Error",
        description: <pre className="whitespace-pre-wrap text-xs">{toastDescription}</pre>,
        variant: "destructive",
        duration: 7000,
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const ActiveStepComponent = steps[currentStep - 1].component;
  const progressValue = (currentStep / steps.length) * 100;

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-5xl mx-auto shadow-2xl">
        <CardHeader className="pb-4 pt-6">
          <CardTitle
            className="text-2xl md:text-3xl text-center font-bold"
          >
            <div className="flex justify-center mb-2">
              <Image
                src="/assets/cudd logo.webp"
                alt="Cudd Realty Logo"
                width={135} 
                height={34}
                className="object-contain"
                data-ai-hint="company logo"
              />
            </div>
            <div style={{ color: '#8c1c19' }}>Measurement Form</div>
          </CardTitle>
          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
            <Progress value={progressValue} className="w-full" />
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(processForm)}>
          <CardContent className="min-h-[300px] py-6 px-4 md:px-6">
            <ActiveStepComponent />
          </CardContent>
          <CardFooter className="flex flex-col pt-6 border-t">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                onClick={handlePreviousStep}
                variant="outline"
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < steps.length ? (
                <Button type="button" onClick={handleNextStep} disabled={isSubmitting}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Property'} <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
             <p className="text-xs text-muted-foreground mt-6 text-center w-full">
              (/◕ヮ◕)/   Made with GoodHelpAI
            </p>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
