import {Timestamp} from "firebase-admin/firestore";

export interface User {
  id: string;
  last_checkin: Date;
  checkin_frequency_hours: number;
  alert_rules: AlertRule[];
}

// The shape of a single alert instruction
export interface AlertRule {
  method: "SMS" | "EMAIL";
  to: string; // The phone number or email address
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

// The main user document shape
export interface HugsyUser {
  email: string;
  last_checkin: Timestamp; // Changed to use Timestamp directly
  checkin_frequency_hours: number;
  pet_dossier?: PetDossier;
  alert_rules?: AlertRule[];
}
