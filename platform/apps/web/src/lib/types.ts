export type NavigationPage = 
  | 'marketing'
  | 'use-cases'
  | 'dashboard'
  | 'departments'
  | 'suppliers'
  | 'renewals'
  | 'capture'
  | 'analyst'
  | 'briefings';

export type RecommendationType = 'BID' | 'NO-BID' | 'TEAM';

export type PipelineStage = 'qualification' | 'teaming' | 'proposal' | 'submitted' | 'won' | 'lost';

export interface DepartmentProfile {
  id: string;
  name: string;
  code: string;
  totalValue: number; 
  contractCount: number;
  topSuppliers: { name: string; value: number; share: number }[];
  topCategories: { category: string; value: number }[];
  renewalExposure: { urgent: number; soon: number; watch: number };
  spendingTrend: { year: string; amount: number }[];
  subAgencies: { name: string; spending: number; contracts: number }[];
  expiringCount30Days?: number;
  description?: string;
  activeContracts?: number;
  topSupplier?: string;
}

export interface SupplierProfile {
  id: string;
  name: string;
  totalContractValue: number;
  marketShare: number; 
  influenceScore: number; 
  contractCount: number;
  isTeamingPartnerCandidate: boolean;
  setAsideCapabilities: string[]; 
  clearances: string[]; 
  coreCompetencies: string[];
  departmentFootprint: { deptName: string; value: number; share: number }[];
  contactEmail?: string;
  contactPerson?: string;
  location: string;
  headquarters?: string;
  winRate?: string;
  totalValue?: string;
  activeContractsCount?: number;
  topDepartments?: string[];
}

export interface ExpiringContract {
  id: string;
  referenceNumber: string;
  title: string;
  department: string;
  subAgency: string;
  incumbent: string;
  value: number;
  expirationDate: string;
  daysLeft: number;
  status: string;
  naicsCode: string;
  setAside: string;
  description: string;
  pwinEstimate?: number;
  scopeSummary?: string;
  rfpReference?: string;
  category?: string;
  winProbability?: number;
  expiryDate?: string;
  riskLevel?: string;
  supplier?: string;
  incumbentAdvantage?: string;
}

export interface CaptureItem {
  id: string;
  contractId?: string;
  title: string;
  referenceNumber: string;
  agency: string;
  value: number;
  stage: PipelineStage;
  winProbability: number; 
  recommendation: RecommendationType;
  teamingPartner?: string;
  owner: string;
  dueDate: string;
  assignedTeam: string[];
  nextMilestone: string;
  riskCount: number;
  notes: string;
}

export interface AIAnalysisResult {
  winProbability: number;
  recommendation: RecommendationType;
  executiveSummary: string;
  keyStrengths: string[];
  identifiedRisks: { risk: string; severity: 'Low' | 'Medium' | 'High'; mitigation: string }[];
  recommendedTeaming: string[];
  actionPlan: string[];
  evaluationCriteria: { criterion: string; score: number; notes: string }[];
}

export type Contract = ExpiringContract;
export type DepartmentStat = DepartmentProfile;
export type ActiveView = string;
