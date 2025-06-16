export interface User {
  id: string;
  last_checkin: Date;
  checkin_frequency_hours: number;
  alert_rules: AlertRule[];
}

export interface AlertRule {
  id: string;
  petDossierId: string;
  description: string;
  type: "medication" | "feeding" | "exercise" | "other";
  frequency: "daily" | "weekly" | "monthly" | "custom";
  customFrequency?: string;
  timeOfDay?: string[];
  isActive: boolean;
  assignedHelpers: string[]; // Helper IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertLog {
  userId: string;
  status: "success" | "fail";
  rule: AlertRule;
  error?: string;
}

export interface PetDossier {
    id: string;
    name: string;
    species: "dog" | "cat" | "other";
    breed?: string;
    age?: number;
    weight?: number;
    medicalConditions?: string[];
    medications?: string[];
    vetContact?: string;
    ownerNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Helper {
    id: string;
    name: string;
    phone: string;
    email: string;
    relationship: string;
    isEmergencyContact: boolean;
    availabilityNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface HugsyUser {
    id: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    pets: string[]; // PetDossier IDs
    helpers: string[]; // Helper IDs
    alertRules: string[]; // AlertRule IDs
    createdAt: Date;
    updatedAt: Date;
}
