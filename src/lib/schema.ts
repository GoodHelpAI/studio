
import { z } from 'zod';

export const KitchenDetailsSchema = z.object({
  island: z.boolean().default(false).optional(),
  raisedBar: z.boolean().default(false).optional(),
  eatInKitchen: z.boolean().default(false).optional(),
  graniteKTop: z.boolean().default(false).optional(),
  laminateKTop: z.boolean().default(false).optional(),
  corianKTop: z.boolean().default(false).optional(),
  tileKTop: z.boolean().default(false).optional(),
  otherKTop: z.string().optional(), // For other countertop materials
  walkInPantry: z.boolean().default(false).optional(),
  tileBacksplash: z.boolean().default(false).optional(),
  butlersPantry: z.boolean().default(false).optional(),
  cabinets36inch: z.boolean().default(false).optional(),
  cabinets42inch: z.boolean().default(false).optional(),
  ssAppliances: z.boolean().default(false).optional(),
  microwaveFlush: z.boolean().default(false).optional(),
  microwaveKTop: z.boolean().default(false).optional(),
  dishwasher: z.boolean().default(false).optional(),
  disposal: z.boolean().default(false).optional(),
  fridge: z.enum(['white', 'black', 'ss', 'none', '']).default('').optional(),
  compactor: z.boolean().default(false).optional(),
  wineCooler: z.boolean().default(false).optional(),
  rangeType: z.enum(['gas', 'electric', 'none', '']).default('').optional(),
  rangeOven: z.enum(['single_oven', 'double_oven', 'none', '']).default('').optional(),
  cooktopType: z.enum(['gas', 'electric', 'glass', 'none', '']).default('').optional(),
  hoodAVent: z.boolean().default(false).optional(),
  outdoorGrill: z.boolean().default(false).optional(),
}).optional();
export type KitchenDetails = z.infer<typeof KitchenDetailsSchema>;

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
  fan: z.enum(['yes', 'no', 'na', '']).default('na').optional(),
  washerDryerHookups: z.enum(['yes', 'no', 'na', '']).default('na').optional(),
  kitchenDetails: KitchenDetailsSchema,
  // Garage specific fields, only relevant if roomType is 'garage'
  garageCarCount: z.enum(['1', '2', '3', 'none', '']).default('').optional(),
  garageDoorOpeners: z.enum(['0', '1', '2', '3', '']).default('').optional(),
  garageLength: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Length must be positive").optional()),
  garageWidth: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Width must be positive").optional()),
});
export type Room = z.infer<typeof RoomSchema>;

export const PatioSchema = z.object({
  id: z.string().optional(),
  length: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Length must be positive").optional()),
  width: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Width must be positive").optional()),
});
export type Patio = z.infer<typeof PatioSchema>;

export const ShedSchema = z.object({
  id: z.string().optional(),
  length: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Length must be positive").optional()),
  width: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Width must be positive").optional()),
});
export type Shed = z.infer<typeof ShedSchema>;


export const propertySchema = z.object({
  // Basic Info
  address: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(1, "State is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format"),
  propertyType: z.string().min(1, "Property type is required"),

  // Property Details (Simplified)
  overallBedrooms: z.preprocess(
    val => parseInt(String(val), 10),
    z.number({invalid_type_error: "Bedrooms must be a number"}).int().min(0, "Bedrooms cannot be negative")
  ),
  overallBathrooms: z.preprocess(
    val => parseFloat(String(val)),
    z.number({invalid_type_error: "Bathrooms must be a number"}).min(0, "Bathrooms cannot be negative")
  ),
  hasHOA: z.boolean().default(false),
  hoaDues: z.preprocess(
    (val) => (String(val).trim() === '' ? undefined : parseFloat(String(val).replace(/[$,]/g, ''))),
    z.number({invalid_type_error: "HOA Dues must be a number"}).positive("HOA dues must be a positive number").optional()
  ),

  // Rooms
  rooms: z.array(RoomSchema).optional(),

  // Carport, RV Pad (Garage details moved to RoomSchema)
  carportPresent: z.boolean().default(false).optional(),
  carportLength: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Length must be positive").optional()),
  carportWidth: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Width must be positive").optional()),
  rvPadPresent: z.boolean().default(false).optional(),
  rvPadLength: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Length must be positive").optional()),
  rvPadWidth: z.preprocess(val => (String(val).trim() === '' ? undefined : parseFloat(String(val))), z.number().positive("Width must be positive").optional()),
  
  // Flooring
  flooringTypes: z.array(z.string()).optional(),
  otherFlooringType: z.string().optional(),

  // Additional Details
  patios: z.array(PatioSchema).max(2).optional(),
  sheds: z.array(ShedSchema).max(2).optional(),
  hasDeck: z.boolean().default(false).optional(),

  fenceHeight: z.enum(['6ft', '8ft', 'none', '']).default('').optional(),
  fenceMaterial: z.array(z.string()).optional(), // Allow multiple fence materials
  fenceStyle: z.array(z.string()).optional(), // Allow multiple fence styles

  fireplaceCount: z.preprocess(val => (String(val).trim() === '' ? undefined : parseInt(String(val), 10)), z.number().int().min(0, "Cannot be negative").optional()),
  fireplaceTypeWood: z.boolean().default(false).optional(),
  fireplaceTypeGas: z.boolean().default(false).optional(),
  fireplaceFeaturesLogs: z.boolean().default(false).optional(),
  fireplaceFeaturesElectricStarter: z.boolean().default(false).optional(),
  fireplaceVaultedCeilings: z.boolean().default(false).optional(), // Assumed near fireplace
  
  programmableThermostat: z.boolean().default(false).optional(), // General home feature

  waterHeater: z.enum(['gas', 'electric', 'tankless', 'none', '']).default('').optional(),
  acType: z.enum(['gas', 'electric', 'window_units', 'mini_split', 'other', 'none', '']).default('').optional(),
  acOtherType: z.string().optional(),
  heatType: z.enum(['gas', 'electric', 'heat_pump', 'radiant', 'other', 'none', '']).default('').optional(),
  
  hasPool: z.boolean().default(false).optional(),
  hasHotTub: z.boolean().default(false).optional(),
  hasSprinklers: z.boolean().default(false).optional(),
  hasAlarm: z.boolean().default(false).optional(),
  smokeDetectorCount: z.preprocess(val => (String(val).trim() === '' ? undefined : parseInt(String(val), 10)), z.number().int().min(0, "Cannot be negative").optional()),
  
  backyardFeatures: z.array(z.string()).optional(),
  communityAmenities: z.array(z.string()).optional(),
  landscapingDescription: z.string().max(500, "Landscaping description too long").optional(),

  // Features (general interior/exterior, revised)
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
  path: ["hoaDues"],
}).refine(data => {
  if (data.flooringTypes?.includes('other') && (!data.otherFlooringType || data.otherFlooringType.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Please specify other flooring type.",
  path: ["otherFlooringType"],
}).refine(data => {
  if (data.acType === 'other' && (!data.acOtherType || data.acOtherType.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Please specify other A/C type.",
  path: ["acOtherType"],
});

export type PropertyFormData = z.infer<typeof propertySchema>;
