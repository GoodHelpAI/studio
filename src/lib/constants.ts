import type { LucideIcon } from 'lucide-react';
import {
  Armchair,
  Utensils,
  ChefHat,
  BedDouble,
  Bed,
  Bath,
  Briefcase,
  WashingMachine,
  CarFront,
  Archive,
  Box,
  Sun,
  Home,
  Building,
  LandPlot,
  Building2,
  ClipboardList
} from 'lucide-react';

export interface Option {
  id: string;
  label: string;
}

export interface RoomTypeOption extends Option {
  icon?: LucideIcon;
}

export const PROPERTY_TYPES: Option[] = [
  { id: 'single_family', label: 'Single Family' },
  { id: 'condo', label: 'Condo' },
  { id: 'townhouse', label: 'Townhouse' },
  { id: 'multi_family', label: 'Multi-Family' },
  { id: 'land', label: 'Land' },
];

export const ROOM_TYPES: RoomTypeOption[] = [
  { id: 'living_room', label: 'Living Room', icon: Armchair },
  { id: 'dining_room', label: 'Dining Room', icon: Utensils },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { id: 'primary_bedroom', label: 'Primary Bedroom', icon: BedDouble },
  { id: 'bedroom', label: 'Bedroom', icon: Bed },
  { id: 'bathroom', label: 'Bathroom', icon: Bath },
  { id: 'office', label: 'Office', icon: Briefcase },
  { id: 'laundry', label: 'Laundry Room', icon: WashingMachine },
  { id: 'garage', label: 'Garage', icon: CarFront },
  { id: 'basement', label: 'Basement', icon: Archive },
  { id: 'attic', label: 'Attic', icon: Box },
  { id: 'balcony_patio', label: 'Balcony/Patio', icon: Sun },
  { id: 'entry_foyer', label: 'Entry/Foyer', icon: Building },
  { id: 'utility_room', label: 'Utility Room', icon: Building2 },
  { id: 'other', label: 'Other', icon: ClipboardList },
];


export const INTERIOR_FEATURE_OPTIONS: Option[] = [
  { id: 'hardwood_floors', label: 'Hardwood Floors' },
  { id: 'granite_countertops', label: 'Granite Countertops' },
  { id: 'stainless_steel_appliances', label: 'Stainless Steel Appliances' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'walk_in_closet', label: 'Walk-in Closet' },
  { id: 'central_ac', label: 'Central A/C' },
  { id: 'updated_kitchen', label: 'Updated Kitchen' },
  { id: 'updated_bathroom', label: 'Updated Bathroom' },
  { id: 'smart_home_features', label: 'Smart Home Features' },
  { id: 'security_system', label: 'Security System' },
  { id: 'vaulted_ceilings', label: 'Vaulted Ceilings' },
  { id: 'island_kitchen', label: 'Island Kitchen' },
];

export const EXTERIOR_FEATURE_OPTIONS: Option[] = [
  { id: 'deck', label: 'Deck' },
  { id: 'patio', label: 'Patio' },
  { id: 'fenced_yard', label: 'Fenced Yard' },
  { id: 'swimming_pool', label: 'Swimming Pool' },
  { id: 'attached_garage', label: 'Attached Garage' },
  { id: 'detached_garage', label: 'Detached Garage' },
  { id: 'sprinkler_system', label: 'Sprinkler System' },
  { id: 'shed', label: 'Shed/Outbuilding' },
  { id: 'outdoor_kitchen', label: 'Outdoor Kitchen' },
  { id: 'covered_porch', label: 'Covered Porch' },
  { id: 'rv_parking', label: 'RV Parking' },
  { id: 'solar_panels', label: 'Solar Panels' },
];

export const STATES_OPTIONS: Option[] = [
  { id: "AL", label: "Alabama" }, { id: "AK", label: "Alaska" }, { id: "AZ", label: "Arizona" },
  { id: "AR", label: "Arkansas" }, { id: "CA", label: "California" }, { id: "CO", label: "Colorado" },
  { id: "CT", label: "Connecticut" }, { id: "DE", label: "Delaware" }, { id: "FL", label: "Florida" },
  { id: "GA", label: "Georgia" }, { id: "HI", label: "Hawaii" }, { id: "ID", label: "Idaho" },
  { id: "IL", label: "Illinois" }, { id: "IN", label: "Indiana" }, { id: "IA", label: "Iowa" },
  { id: "KS", label: "Kansas" }, { id: "KY", label: "Kentucky" }, { id: "LA", label: "Louisiana" },
  { id: "ME", label: "Maine" }, { id: "MD", label: "Maryland" }, { id: "MA", label: "Massachusetts" },
  { id: "MI", label: "Michigan" }, { id: "MN", label: "Minnesota" }, { id: "MS", label: "Mississippi" },
  { id: "MO", label: "Missouri" }, { id: "MT", label: "Montana" }, { id: "NE", label: "Nebraska" },
  { id: "NV", label: "Nevada" }, { id: "NH", label: "New Hampshire" }, { id: "NJ", label: "New Jersey" },
  { id: "NM", label: "New Mexico" }, { id: "NY", label: "New York" }, { id: "NC", label: "North Carolina" },
  { id: "ND", label: "North Dakota" }, { id: "OH", label: "Ohio" }, { id: "OK", label: "Oklahoma" },
  { id: "OR", label: "Oregon" }, { id: "PA", label: "Pennsylvania" }, { id: "RI", label: "Rhode Island" },
  { id: "SC", label: "South Carolina" }, { id: "SD", label: "South Dakota" }, { id: "TN", label: "Tennessee" },
  { id: "TX", label: "Texas" }, { id: "UT", label: "Utah" }, { id: "VT", label: "Vermont" },
  { id: "VA", label: "Virginia" }, { id: "WA", label: "Washington" }, { id: "WV", label: "West Virginia" },
  { id: "WI", label: "Wisconsin" }, { id: "WY", label: "Wyoming" },
];

