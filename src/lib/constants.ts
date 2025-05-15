
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
  ClipboardList,
  BookOpen, // For Study
  DoorOpen, // For Half Bath / Powder Room
  Wind, // For Fan
  PlugZap, // For Hookups
  Construction, // For Shed
  SprayCan, // For Sprinklers
  Trees, // For Landscaping / Backyard trees
  Fence, // For Fence
  Flame, // For Fireplace
  ThermometerSun, // For AC/Heat
  Droplet, // For Water Heater
  ShieldCheck, // For Alarm
  Users, // For Community Amenities
  Sparkles, // For general features
  LampDesk, // Study alt
  Waves, // Pool/Hot tub
  Palette, // Flooring
  Warehouse, // Garage alt
  Caravan, // RV Pad
  SquareFoot, // Dimensions
  Tv, // For Media Room
  Gamepad2, // For Game Room
} from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  icon?: LucideIcon;
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
  { id: 'bathroom', label: 'Full Bathroom', icon: Bath },
  { id: 'half_bathroom', label: 'Half Bathroom', icon: DoorOpen },
  { id: 'office', label: 'Office', icon: Briefcase },
  { id: 'study', label: 'Study', icon: BookOpen },
  { id: 'media_room', label: 'Media Room', icon: Tv },
  { id: 'game_room', label: 'Game Room', icon: Gamepad2 },
  { id: 'laundry', label: 'Laundry Room', icon: WashingMachine },
  { id: 'garage', label: 'Garage', icon: Warehouse },
  { id: 'basement', label: 'Basement', icon: Archive },
  { id: 'attic', label: 'Attic', icon: Box },
  { id: 'balcony_patio', label: 'Balcony/Porch', icon: Sun }, // Merged balcony & porch
  { id: 'entry_foyer', label: 'Entry/Foyer', icon: Building },
  { id: 'utility_room', label: 'Utility Room', icon: Building2 },
  { id: 'other', label: 'Other', icon: ClipboardList },
];

export const YES_NO_OPTIONS: Option[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

export const YES_NO_NA_OPTIONS: Option[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'na', label: 'N/A' },
];


// Kitchen Specifics
export const KITCHEN_COUNTERTOP_OPTIONS: Option[] = [
  { id: 'granite', label: 'Granite' },
  { id: 'laminate', label: 'Laminate' },
  { id: 'corian', label: 'Corian' },
  { id: 'tile', label: 'Tile' },
  { id: 'other', label: 'Other (Specify)' },
];
export const FRIDGE_OPTIONS: Option[] = [
  { id: 'white', label: 'White' },
  { id: 'black', label: 'Black' },
  { id: 'ss', label: 'Stainless Steel' },
  { id: 'none', label: 'None / Not Included' },
];
export const RANGE_TYPE_OPTIONS: Option[] = [
  { id: 'gas', label: 'Gas' },
  { id: 'electric', label: 'Electric' },
  { id: 'none', label: 'None / Not Included' },
];
export const RANGE_OVEN_OPTIONS: Option[] = [
  { id: 'single_oven', label: 'Single Oven' },
  { id: 'double_oven', label: 'Double Oven' },
  { id: 'none', label: 'None / Not Included' },
];
export const COOKTOP_TYPE_OPTIONS: Option[] = [
  { id: 'gas', label: 'Gas' },
  { id: 'electric', label: 'Electric' },
  { id: 'glass', label: 'Glass/Smooth Top' },
  { id: 'none', label: 'None / Not Included' },
];


// Garage/Carport
export const GARAGE_CAR_COUNT_OPTIONS: Option[] = [
  { id: 'none', label: 'N/A or No Garage' },
  { id: '1', label: '1 Car' },
  { id: '2', label: '2 Cars' },
  { id: '3', label: '3+ Cars' },
];
export const GARAGE_DOOR_OPENER_OPTIONS: Option[] = [
  { id: 'none', label: 'N/A or No Openers' },
  { id: '0', label: '0 Openers' },
  { id: '1', label: '1 Opener' },
  { id: '2', label: '2 Openers' },
  { id: '3', label: '3+ Openers' },
];

// Flooring
export const FLOORING_TYPE_OPTIONS: Option[] = [
  { id: 'carpet', label: 'Carpet', icon: Palette },
  { id: 'tile', label: 'Tile', icon: Palette },
  { id: 'vinyl_plank', label: 'Vinyl Plank', icon: Palette },
  { id: 'linoleum', label: 'Linoleum', icon: Palette },
  { id: 'wood', label: 'Wood', icon: Palette },
  { id: 'laminate_wood', label: 'Laminate Wood', icon: Palette },
  { id: 'stained_concrete', label: 'Stained Concrete', icon: Palette },
  { id: 'marble', label: 'Marble', icon: Palette },
  { id: 'other', label: 'Other', icon: Palette },
];

// Fence
export const FENCE_HEIGHT_OPTIONS: Option[] = [
  { id: '6ft', label: '6 Foot' },
  { id: '8ft', label: '8 Foot' },
  { id: 'none', label: 'No Fence / Other' },
];
export const FENCE_MATERIAL_OPTIONS: Option[] = [
  { id: 'wood', label: 'Wood' },
  { id: 'chain_link', label: 'Chain Link' },
  { id: 'iron', label: 'Iron' },
  { id: 'vinyl', label: 'Vinyl' },
];
export const FENCE_STYLE_OPTIONS: Option[] = [
  { id: 'board_on_board', label: 'Board on Board' },
  { id: 'standard', label: 'Standard/Side-by-Side' },
  { id: 'shadow_box', label: 'Shadow Box' },
  { id: 'privacy', label: 'Privacy (Solid)'}
];

// Fireplace
export const FIREPLACE_COUNT_OPTIONS: Option[] = [
  { id: '0', label: '0' },
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3+' },
];


// Utilities & Systems
export const WATER_HEATER_OPTIONS: Option[] = [
  { id: 'gas', label: 'Gas' },
  { id: 'electric', label: 'Electric' },
  { id: 'tankless', label: 'Tankless' },
  { id: 'none', label: 'None / Other' },
];
export const AC_TYPE_OPTIONS: Option[] = [
  { id: 'gas', label: 'Gas (Central)' },
  { id: 'electric', label: 'Electric (Central)' },
  { id: 'window_units', label: 'Window Unit(s)'},
  { id: 'mini_split', label: 'Mini-Split(s)'},
  { id: 'other', label: 'Other' },
  { id: 'none', label: 'None' },
];
export const HEAT_TYPE_OPTIONS: Option[] = [
  { id: 'gas', label: 'Gas (Forced Air)' },
  { id: 'electric', label: 'Electric (Forced Air)' },
  { id: 'heat_pump', label: 'Heat Pump' },
  { id: 'radiant', label: 'Radiant Heat'},
  { id: 'other', label: 'Other'},
  { id: 'none', label: 'None' },
];
export const SMOKE_DETECTOR_COUNT_OPTIONS: Option[] = [
  { id: '0', label: '0' }, { id: '1', label: '1' }, { id: '2', label: '2' }, { id: '3', label: '3' },
  { id: '4', label: '4' }, { id: '5', label: '5' }, { id: '6', label: '6+' },
];

// Backyard & Community
export const BACKYARD_FEATURE_OPTIONS: Option[] = [
  { id: 'trees', label: 'Mature Trees' },
  { id: 'no_trees', label: 'No Trees / Cleared' },
  { id: 'grass', label: 'Grass Lawn' },
  { id: 'xeriscape', label: 'Xeriscape / Low Water'},
  { id: 'garden_area', label: 'Garden Area'},
];
export const COMMUNITY_AMENITY_OPTIONS: Option[] = [
  { id: 'pool', label: 'Community Pool' },
  { id: 'park', label: 'Park' },
  { id: 'walking_paths', label: 'Walking/Jogging Paths' },
  { id: 'clubhouse', label: 'Clubhouse' },
  { id: 'weight_room', label: 'Fitness Center/Weight Room' },
  { id: 'green_belt', label: 'Greenbelt Access' },
  { id: 'playgrounds', label: 'Playgrounds' },
  { id: 'tennis', label: 'Tennis Courts' },
  { id: 'pond_lake', label: 'Pond/Lake Access' },
  { id: 'gated_community', label: 'Gated Community'},
];

// Revised General Features (examples, can be expanded)
// These are no longer directly used in chip groups in AdditionalDetailsStep but kept for potential other uses.
export const INTERIOR_FEATURE_OPTIONS: Option[] = [
  { id: 'updated_kitchen_general', label: 'Updated Kitchen (General)' }, // Use if kitchen details aren't granular enough
  { id: 'updated_bathroom_general', label: 'Updated Bathroom(s) (General)' },
  { id: 'smart_home_features', label: 'Smart Home Features' },
  { id: 'security_system_owned', label: 'Security System (Owned)' },
  { id: 'high_ceilings', label: 'High Ceilings' },
  { id: 'ceiling_fans_general', label: 'Ceiling Fans (General)' },
  { id: 'formal_dining', label: 'Formal Dining Room'}, // if not captured as a separate room
  // 'walk_in_closet' is now room-specific
  // 'granite_countertops', 'stainless_steel_appliances', 'island_kitchen_general' handled in kitchen details
  // 'central_ac' handled by AC_TYPE_OPTIONS
  // 'fireplace', 'vaulted_ceilings' (near fp) handled in fireplace section
  { id: 'wine_cellar', label: 'Wine Cellar'},
];

export const EXTERIOR_FEATURE_OPTIONS: Option[] = [
  { id: 'covered_porch_general', label: 'Covered Porch (General)' }, // If 'balcony_patio' room type isn't specific enough
  { id: 'gutters', label: 'Gutters'},
  { id: 'outdoor_lighting', label: 'Outdoor Lighting'},
  { id: 'workshop', label: 'Workshop (Separate)'},
  { id: 'guest_house', label: 'Guest House / Casita'},
  { id: 'mature_landscaping', label: 'Mature Landscaping (General)'}, // Supplement to backyard features
  { id: 'corner_lot', label: 'Corner Lot'},
  { id: 'cul_de_sac_lot', label: 'Cul-de-sac Lot'},
  { id: 'waterfront', label: 'Waterfront / Water View'},
  { id: 'golf_course_lot', label: 'Golf Course Lot'},
  // 'deck', 'patio', 'fenced_yard', 'swimming_pool', 'sprinkler_system', 'shed' handled in specific sections
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

    
