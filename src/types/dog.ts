export interface DogInfo {
  name: string;
  breed: string;
  age: number;
  weight: number;
  sex: 'male' | 'female';
  neutered: boolean;
  activityLevel: 'low' | 'moderate' | 'high';
  previousHealthIssues: string[];
  currentMedications: string[];
  dietaryPreferences: string;
  allergies: string[];
  environment: 'apartment' | 'house-small-yard' | 'house-large-yard' | 'farm';
  exerciseHours: number;
  symptoms: string[];
}

export interface HealthPrediction {
  riskLevel: 'low' | 'moderate' | 'high';
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
    prevention: string[];
  }>;
}

export interface SupplementRecommendation {
  name: string;
  purpose: string;
  dosage: string;
  frequency: string;
  benefits: string[];
  precautions: string[];
  priority: 'essential' | 'recommended' | 'optional';
}

export interface AssessmentResult {
  dogInfo: DogInfo;
  healthPredictions: HealthPrediction;
  supplementRecommendations: SupplementRecommendation[];
  generalAdvice: string[];
  vetVisitRecommended: boolean;
  confidence: number;
}