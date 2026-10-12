export type Role = 'FAMILY_CAREGIVER' | 'PROFESSIONAL_CAREGIVER' | 'CARE_COORDINATOR' | 'CLINICAL_STAFF';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  active: boolean;
}

export interface Patient {
  id: number;
  fullName: string;
  age: number;
  dateOfBirth?: string;
  gender: string;
  bloodGroup: string;
  emergencyContact: string;
  primaryCaregiverId?: number;
  primaryCaregiverName?: string;
  conditions: string;
  allergies: string;
  medications: string;
  mobilityStatus: string;
  cognitiveStatus: string;
  currentMood?: string;
  currentAppetite?: string;
  currentSleep?: string;
  currentMobility?: string;
  currentBehavior?: string;
  updatedAt: string;
}

export interface Observation {
  id: number;
  patientId: number;
  patientName: string;
  caregiverId: number;
  caregiverName: string;
  rawText: string;
  inputMethod: 'TEXT' | 'VOICE';
  status: string;
  createdAt: string;
  category?: string;
  severity?: 'INFO' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  sentiment?: string;
  appetite?: string;
  cognitiveChange?: string;
  mobilityChange?: string;
  recommendedAction?: string;
  escalationLevel?: string;
  isEmergency?: boolean;
  summaryText?: string;
}

export interface ObservationExtractionResult {
  category: string;
  severity: string;
  sentiment: string;
  appetite: string;
  cognitiveChange: string;
  mobilityChange: string;
  timeReference: string;
  recommendedAction: string;
  escalationLevel: string;
  isEmergency: boolean;
  summaryText: string;
  extractedSignals: string[];
}

export interface Handover {
  id: number;
  patientId: number;
  patientName: string;
  outgoingCaregiverId: number;
  outgoingCaregiverName: string;
  incomingCaregiverId?: number;
  incomingCaregiverName?: string;
  shiftName: string;
  topObservations: string[];
  emergingPattern: string;
  watchItems: string[];
  completedTasks: string[];
  pendingTasks: string[];
  reviewed: boolean;
  reviewedAt?: string;
  createdAt: string;
}

export interface BurnoutRisk {
  caregiverId: number;
  caregiverName: string;
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: string[];
  recommendations: string[];
  overdueTasksCount: number;
  activeTasksCount: number;
  totalObservationsCount: number;
}

export interface CareTask {
  id: number;
  title: string;
  description: string;
  patientId: number;
  patientName: string;
  assignedCaregiverId?: number;
  assignedCaregiverName?: string;
  createdById?: number;
  createdByName?: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface AlertItem {
  id: number;
  patientId?: number;
  patientName?: string;
  observationId?: number;
  alertType: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  read: boolean;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface FamilyDiscussion {
  id: number;
  familyGroupId: number;
  userId: number;
  userName: string;
  userRole: string;
  message: string;
  category: string;
  parentMessageId?: number;
  createdAt: string;
}

export interface FamilySummary {
  patientName: string;
  neutralSummary: string;
  agreementPoints: string[];
  disagreementPoints: string[];
  suggestedActionItems: string[];
}

export interface ClinicalScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  whatToCheck: string[];
  whatToDoNow: string[];
  whenToContactClinician: string[];
  whenToSeekEmergencyHelp: string[];
}

export interface GuidanceResponse {
  title: string;
  scenario: string;
  immediateActions: string[];
  warningSigns: string[];
  recommendedEscalation: string;
  isEmergency: boolean;
  disclaimer: string;
}

export interface DashboardSummary {
  role: Role;
  greeting: string;
  userName: string;
  stats: Record<string, any>;
  recentObservations: Observation[];
  pendingTasks: CareTask[];
  activeAlerts: AlertItem[];
  burnoutRisk?: BurnoutRisk;
  primaryPatient?: Patient;
  clinicalAiSummary?: string;
}

export interface PatientIntelligence {
  status: string;
  riskLevel: string;
  riskScore: number;
  progression: string;
  observationsAnalyzed: number;
  baselineObservations: number;
  totalChanges: number;
  affectedDomains: number;
  changedDomains: string[];
  domainChanges: Record<string, number>;
  evidence: string[];
  explanation: string;
  recommendedAction: string;
}
