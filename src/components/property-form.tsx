
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, type SubmitHandler, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, type PropertyFormData } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Send, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { BasicInfoStep } from './property-form/basic-info-step';
import { PropertyDetailsStep } from './property-form/property-details-step';
import { RoomsStep } from './property-form/rooms-step';
import { GarageCarportStep } from './property-form/garage-carport-step';
import { FlooringStep } from './property-form/flooring-step';
import { AdditionalDetailsStep } from './property-form/additional-details-step';
import { ReviewStep } from './property-form/review-step';

const steps = [
  { id: 1, title: 'Basic Info', component: BasicInfoStep, fields: ['address', 'city', 'state', 'zip', 'propertyType'] },
  { id: 2, title: 'Prop Details', component: PropertyDetailsStep, fields: ['overallBedrooms', 'overallBathrooms', 'hasHOA', 'hoaDues'] },
  { id: 3, title: 'Room Specs', component: RoomsStep, fields: ['rooms'] },
  { id: 4, title: 'Parking Pads', component: GarageCarportStep, fields: ['carportPresent', 'carportLength', 'carportWidth', 'rvPadPresent', 'rvPadLength', 'rvPadWidth'] },
  { id: 5, title: 'Flooring', component: FlooringStep, fields: ['flooringTypes', 'otherFlooringType'] },
  { id: 6, title: 'Extra Details', component: AdditionalDetailsStep, fields: [
    'patios', 'sheds', 'hasDeck', 'fenceHeight', 'fenceMaterial', 'fenceStyle',
    'fireplaceCount', 'fireplaceTypeWood', 'fireplaceTypeGas', 'fireplaceFeaturesLogs', 'fireplaceFeaturesElectricStarter', 'fireplaceVaultedCeilings',
    'programmableThermostat', 'waterHeater', 'acType', 'acOtherType', 'heatType',
    'hasPool', 'hasHotTub', 'hasSprinklers', 'hasAlarm', 'smokeDetectorCount',
    'backyardFeatures', 'communityAmenities',
    'description'
  ]},
  { id: 7, title: 'Review Form', component: ReviewStep, fields: [] },
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
          // Custom formatting for room errors
          if (fieldName.startsWith('rooms.')) {
            fieldName = fieldName.replace(/^rooms\.(\d+)\.(.*)$/, (match, roomIndex, field) => {
              let readableField = field.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim();
              readableField = readableField.charAt(0).toUpperCase() + readableField.slice(1);
              if (readableField.startsWith('Kitchen details.')) {
                readableField = readableField.replace('Kitchen details.', 'Kitchen ');
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
          }
           else {
             fieldName = fieldName.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim();
             fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
          }
          messages.push(`${fieldName}: ${errorField.message}`);
        } else if (Array.isArray(errorField)) {
          errorField.forEach((item, index) => {
            if (item) { 
              messages = messages.concat(getAllErrorMessages(item, `${currentPath}.${index}`));
            }
          });
        } else if (typeof errorField === 'object' && !errorField.type ) { // Check if it's an object of errors, not a field error itself
          messages = messages.concat(getAllErrorMessages(errorField, currentPath));
        }
      }
    }
  }
  return messages.filter(Boolean); // Remove any undefined/null messages
}

interface HorizontalBreadcrumbProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (stepId: number) => void;
}

const HorizontalBreadcrumb: React.FC<HorizontalBreadcrumbProps> = ({ currentStep, completedSteps, onStepClick }) => {
  const activeColor = "#56667a"; // New color for active/completed states
  const upcomingBorderColor = 'rgb(209 213 219)'; // Tailwind gray-300
  const upcomingBgColor = 'rgb(209 213 219)'; // Tailwind gray-300
  const upcomingTextColor = 'text-gray-500';

  return (
    <div className="flex items-start justify-between w-full px-2 sm:px-4 md:px-6 py-4 my-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(step.id) || currentStep > step.id;
        const isActive = currentStep === step.id;
        const isUpcoming = currentStep < step.id && !completedSteps.has(step.id);
        const isLastStep = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 min-h-[2.5em] flex items-center justify-center",
                  isCompleted && !isActive && "cursor-pointer hover:opacity-75",
                  !(isActive || isCompleted) && upcomingTextColor
                )}
                style={isActive || isCompleted ? { color: activeColor } : {}}
                onClick={() => (isCompleted && !isActive) && onStepClick(step.id)}
              >
                {step.title}
              </div>
              <div
                className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2",
                  isCompleted && "text-white", // For the checkmark icon color
                  isCompleted && !isActive && "cursor-pointer hover:opacity-75"
                )}
                style={{
                  borderColor: isActive || isCompleted ? activeColor : upcomingBorderColor,
                  backgroundColor: isCompleted ? activeColor : (isActive ? 'white' : upcomingBgColor),
                }}
                onClick={() => (isCompleted && !isActive) && onStepClick(step.id)}
              >
                {isCompleted ? <Check size={16} /> : null}
              </div>
            </div>
            {!isLastStep && (
              <div className={cn(
                "flex-1 h-0.5 mt-[calc(2.5em+0.75rem+0.25rem)] sm:mt-[calc(2.5em+0.875rem+0.25rem)] mx-1 sm:mx-2"
              )} 
              style={{ backgroundColor: isActive || isCompleted ? activeColor : upcomingBgColor }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};


export function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
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

    // Clear previous manual errors for the current step fields
    currentStepFields.forEach(field => clearErrors(field));
    // Clear specific conditional errors if they exist
    if (currentStepConfig.title === 'Prop Details') clearErrors('hoaDues');
    if (currentStepConfig.title === 'Flooring') clearErrors('otherFlooringType');
    if (currentStepConfig.title === 'Extra Details') clearErrors('acOtherType');
    
    const rooms = getValues('rooms');
    if (currentStepConfig.title === 'Room Specs' && rooms) {
      rooms.forEach((_room, index) => {
        clearErrors(`rooms.${index}.roomType` as const);
        clearErrors(`rooms.${index}.length` as const);
        clearErrors(`rooms.${index}.width` as const);
        clearErrors(`rooms.${index}.garageLength` as const);
        clearErrors(`rooms.${index}.garageWidth` as const);
        clearErrors(`rooms.${index}.garageCarCount` as const);
        Object.keys(getValues(`rooms.${index}.kitchenDetails`) || {}).forEach(k => {
            clearErrors(`rooms.${index}.kitchenDetails.${k}` as any);
        });
      });
    }

    const isValid = currentStepFields.length > 0 ? await trigger(currentStepFields, { shouldFocus: true }) : true;

    let customValidationPassed = true;
    if (currentStepConfig.title === 'Prop Details') {
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
     if (currentStepConfig.title === 'Extra Details') {
      if (getValues('acType') === 'other' && (!getValues('acOtherType') || getValues('acOtherType')!.trim() === '')) {
        setError('acOtherType', {type: 'manual', message: 'Please specify other A/C type.'});
        customValidationPassed = false;
      }
    }
    if (currentStepConfig.title === 'Room Specs' && rooms) {
      rooms.forEach((room, index) => {
         if (!room.roomType || room.roomType.trim() === '') {
            setError(`rooms.${index}.roomType` as const, { type: 'manual', message: 'Room type is required.' });
            customValidationPassed = false;
        }
        // Only validate L/W for non-garage rooms if roomType is present
        if (room.roomType && room.roomType !== 'garage') {
            if (room.length === undefined || room.length <= 0) {
                 setError(`rooms.${index}.length` as const, { type: 'manual', message: 'Positive length required.' });
                 customValidationPassed = false;
            }
            if (room.width === undefined || room.width <= 0) {
                setError(`rooms.${index}.width` as const, { type: 'manual', message: 'Positive width required.' });
                customValidationPassed = false;
            }
        }
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
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      const collectedMessages = getAllErrorMessages(errors);
      let toastDescription = "Please correct the errors on the current step:";
      if (collectedMessages.length > 0) {
        toastDescription += "\n\n- " + collectedMessages.join('\n- ');
      } else if (!isValid && currentStepFields.length > 0) { 
        toastDescription += "\n\nPlease review all fields for missing or invalid entries.";
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

  const handleBreadcrumbClick = (stepId: number) => {
     if (completedSteps.has(stepId) || stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  const ActiveStepComponent = steps[currentStep - 1].component;

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-3xl mx-auto shadow-2xl">
        <CardHeader className="pb-2 pt-4"> 
          <CardTitle
            className="text-2xl md:text-3xl text-center font-bold" 
            style={{ color: '#8c1c19' }} 
          >
            <div>Cudd Realty</div>
            <div>Measurement Form</div>
          </CardTitle>
           <HorizontalBreadcrumb 
            currentStep={currentStep} 
            completedSteps={completedSteps}
            onStepClick={handleBreadcrumbClick}
          />
        </CardHeader>
        <form onSubmit={handleSubmit(processForm)}>
          <CardContent className="min-h-[300px] py-6">
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

