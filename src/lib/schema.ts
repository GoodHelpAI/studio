import { z } from 'zod';

export const RoomSchema = z.object({
  id: z.string().optional(), // for react-hook-form field array key
  roomType: z.string().min(1, "Room type is required"),
  length: z.preprocess(
    val => (String(val).trim() === '' ? undefined : parseFloat(String(val))),
    z.number().positive("Length must be positive").optional()
  ),
  width: z.preprocess(
    val => (String(val).trim() === '' ? undefined : parseFloat(String(val))),
    z.number().positive("Width must be positive").optional()
  ),
  features: z.string().optional(),
});

export type Room = z.infer<typeof RoomSchema>;

export const propertySchema = z.object({
  // Basic Info
  address: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(1, "State is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format"),
  propertyType: z.string().min(1, "Property type is required"),

  // Property Details
  price: z.preprocess(
    (val) => parseFloat(String(val).replace(/[$,]/g, '')),
    z.number({invalid_type_error: "Price must be a number"}).positive("Price must be a positive number")
  ),
  overallBedrooms: z.preprocess(
    val => parseInt(String(val), 10),
    z.number({invalid_type_error: "Bedrooms must be a number"}).int().min(0, "Bedrooms cannot be negative")
  ),
  overallBathrooms: z.preprocess(
    val => parseFloat(String(val)),
    z.number({invalid_type_error: "Bathrooms must be a number"}).min(0, "Bathrooms cannot be negative")
  ),
  squareFootage: z.preprocess(
    (val) => parseInt(String(val).replace(/,/g, ''), 10),
    z.number({invalid_type_error: "Square footage must be a number"}).int().positive("Square footage must be a positive number")
  ),
  lotSize: z.string().optional(),
  yearBuilt: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number({invalid_type_error: "Year built must be a number"})
     .int()
     .min(1700, "Year built seems too old")
     .max(new Date().getFullYear() + 1, "Year built cannot be too far in the future") // Allow next year for new constructions
  ),
  hasHOA: z.boolean().default(false),
  hoaDues: z.preprocess(
    (val) => (String(val).trim() === '' ? undefined : parseFloat(String(val).replace(/[$,]/g, ''))),
    z.number({invalid_type_error: "HOA Dues must be a number"}).positive("HOA dues must be a positive number").optional()
  ),

  // Rooms
  rooms: z.array(RoomSchema).optional(),

  // Features
  interiorFeatures: z.array(z.string()).optional(),
  exteriorFeatures: z.array(z.string()).optional(),

  // Other
  description: z.string().max(5000, "Description is too long").optional(),
}).refine(data => {
  if (data.hasHOA && (data.hoaDues === undefined || data.hoaDues === null || data.hoaDues <= 0)) {
    return false;
  }
  return true;
}, {
  message: "HOA dues are required if HOA is selected and must be a positive number.",
  path: ["hoaDues"], // Path to the field to attach the error message
});


export type PropertyFormData = z.infer<typeof propertySchema>;
