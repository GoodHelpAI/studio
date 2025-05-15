
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
    'backyardFeatures', 'communityAmenities',
    'description'
  ]},
  { id: 7, title: 'Review & Submit', component: ReviewStep, fields: [] },
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
          if (fieldName.startsWith('rooms.')) {
            fieldName = fieldName.replace(/^rooms\.(\d+)\.(.*)$/, (match, index, field) => {
              let readableField = field.replace(/([A-Z0-9])/g, ' $1').toLowerCase().trim();
              if (field === 'roomType') readableField = 'room type';
              else if (field === 'length') readableField = 'length';
              else if (field === 'width') readableField = 'width';
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
            if (item) { 
              messages = messages.concat(getAllErrorMessages(item, `${currentPath}.${index}`));
            }
          });
        } else if (typeof errorField === 'object' && !errorField.type ) { 
          messages = messages.concat(getAllErrorMessages(errorField, currentPath));
        }
      }
    }
  }
  return messages.filter(Boolean); 
}


export function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const { handleSubmit, trigger, formState: { errors }, setError, clearErrors } = methods;

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

    // Clear errors specific to the current step before re-validating
    if (currentStepConfig.title === 'Room Specifications') {
      const rooms = methods.getValues('rooms');
      rooms?.forEach((_room, index) => {
        clearErrors(`rooms.${index}.roomType` as const);
        clearErrors(`rooms.${index}.length` as const);
        clearErrors(`rooms.${index}.width` as const);
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

    const isValid = currentStepFields.length > 0 ? await trigger(currentStepFields, { shouldFocus: true }) : true;

    let customValidationPassed = true;
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
         if (!room.roomType || room.roomType.trim() === '') {
            setError(`rooms.${index}.roomType` as const, { type: 'manual', message: 'Room type is required.' });
            customValidationPassed = false;
        }
        // Only validate length/width if roomType is selected
        if (room.roomType && (room.length === undefined || room.length <= 0)) {
             setError(`rooms.${index}.length` as const, { type: 'manual', message: 'Positive length required.' });
             customValidationPassed = false;
        }
        if (room.roomType && (room.width === undefined || room.width <= 0)) {
            setError(`rooms.${index}.width` as const, { type: 'manual', message: 'Positive width required.' });
            customValidationPassed = false;
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

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-3xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle
            className="text-2xl md:text-3xl text-center font-bold pt-4"
            style={{ color: '#8c1c19' }} 
          >
            Cudd Realty Measurement Form
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

