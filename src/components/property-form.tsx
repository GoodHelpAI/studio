
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
import { FeaturesStep } from './property-form/features-step';
import { ReviewStep } from './property-form/review-step';

const steps = [
  { id: 1, title: 'Basic Information', component: BasicInfoStep, fields: ['address', 'city', 'state', 'zip', 'propertyType'] },
  { id: 2, title: 'Property Details', component: PropertyDetailsStep, fields: ['price', 'overallBedrooms', 'overallBathrooms', 'squareFootage', 'lotSize', 'yearBuilt', 'hasHOA', 'hoaDues'] },
  { id: 3, title: 'Room Specifications', component: RoomsStep, fields: ['rooms'] }, // Validation for rooms is complex for per-step, usually done globally
  { id: 4, title: 'Features & Description', component: FeaturesStep, fields: ['interiorFeatures', 'exteriorFeatures', 'description'] },
  { id: 5, title: 'Review & Submit', component: ReviewStep, fields: [] }, // No specific fields to validate for review step itself
];

export function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
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
      price: undefined,
      overallBedrooms: undefined,
      overallBathrooms: undefined,
      squareFootage: undefined,
      lotSize: '',
      yearBuilt: undefined,
      hasHOA: false,
      hoaDues: undefined,
      rooms: [],
      interiorFeatures: [],
      exteriorFeatures: [],
      description: '',
    },
  });

  const { handleSubmit, trigger, formState: { errors } } = methods;

  const processForm: SubmitHandler<PropertyFormData> = (data) => {
    console.log("Property Data JSON:", JSON.stringify(data, null, 2));
    toast({
      title: "Property Submitted!",
      description: "Property data has been successfully processed and logged.",
      variant: "default",
    });
    // methods.reset(); // Optionally reset form
    // setCurrentStep(1); // Go back to first step
  };

  const handleNextStep = async () => {
    const currentStepFields = steps[currentStep - 1].fields as (keyof PropertyFormData)[];
    // For rooms, validation is more complex and typically global. Skip specific field trigger for rooms step.
    const isValid = currentStepFields.length > 0 ? await trigger(currentStepFields) : true;
    
    if (currentStep === 2 && methods.getValues('hasHOA') && (methods.getValues('hoaDues') === undefined || methods.getValues('hoaDues') === null || methods.getValues('hoaDues')! <= 0) ) {
        methods.setError('hoaDues', { type: 'manual', message: 'HOA dues are required if HOA is selected and must be positive.' });
         toast({
            title: "Validation Error",
            description: "HOA dues are required if HOA is selected and must be positive.",
            variant: "destructive",
          });
        return; // Stop if HOA is true but dues are empty or not positive
    }


    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors on the current step before proceeding.",
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
