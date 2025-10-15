export interface FoodbankHours {
  day: string;
  open: string;
  close: string;
  notes?: string;
}

export interface FoodbankRequirements {
  income?: string;
  id: boolean;
  residency?: string;
}

export interface FoodbankServices {
  freshProduce: boolean;
  preparedMeals: boolean;
  diapers: boolean;
  halal: boolean;
  kosher: boolean;
  other?: string[];
}

export interface Foodbank {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  hours: FoodbankHours[];
  requirements: FoodbankRequirements;
  services: FoodbankServices;
  lastVerified: string;
  queueNotes?: string;
  requiredDocuments?: string[];
  isVerified: boolean;
  score?: number;
}

export interface FoodbankSubmission {
  id: string;
  type: 'new' | 'correction';
  foodbankId?: string; // For corrections
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  data: Partial<Foodbank>;
  notes?: string;
}

export interface FilterOptions {
  openNow?: boolean;
  dayOfWeek?: string;
  incomeRequirement?: boolean;
  idRequired?: boolean;
  residencyRequired?: boolean;
  services?: {
    freshProduce?: boolean;
    preparedMeals?: boolean;
    diapers?: boolean;
    halal?: boolean;
    kosher?: boolean;
  };
}