
export enum UserRole {
  ADMIN = 'Admin',
  LEGAL = 'Legal',
  SALES = 'Sales',
  HR = 'HR',
  FINANCE = 'Finance'
}

export enum ContractStatus {
  DRAFT = 'Draft',
  REVIEW = 'In Review',
  APPROVAL = 'Pending Approval',
  SIGNED = 'Signed',
  EXPIRED = 'Expired'
}

export interface Contract {
  id: string;
  title: string;
  counterparty: string;
  value: number;
  status: ContractStatus;
  startDate: string;
  renewalDate: string;
  riskScore: number; // 0-100
  owner: string;
  type: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface WorkflowNode {
  id: string;
  stageId?: string; // New: Link node to a specific lifecycle stage
  label: string;
  type: 'trigger' | 'action' | 'condition' | 'approval';
  role?: UserRole;
  details?: string;
}

export interface Clause {
  id: string;
  name: string;
  category: string;
  content: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  tags: string[];
}

export interface IntegrationNode {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  x: number;
  y: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
  workflowPreview?: WorkflowNode[];
}

export type SyncDirection = 'import' | 'export' | 'bidirectional';

export interface FieldMapping {
  id: string;
  externalField: string;
  internalVariable: string;
  direction: SyncDirection;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  active: boolean;
}

export interface IntegrationApp {
  id: string;
  name: string;
  category: 'CRM' | 'ERP' | 'Communication' | 'Storage' | 'Signature';
  description: string;
  icon: string;
  installed: boolean;
  status?: 'active' | 'error' | 'syncing';
  mappings?: FieldMapping[]; // New: Store field mappings
}

export interface RiskItem {
  id: string;
  contractId: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Mitigated' | 'Accepted';
  dueDate: string;
}

export interface Counterparty {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor' | 'Partner';
  region: string;
  riskScore: number;
  activeContracts: number;
  totalValue: number;
}

// Logic Engine Types
export type LogicOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
export type LogicActionType = 'route_to' | 'assign_role' | 'require_field' | 'auto_approve';

export interface LogicRule {
  id: string;
  variable: string;
  operator: LogicOperator;
  value: string;
  actionType: LogicActionType;
  target: string; // Node ID, Role Name, or Field ID
}

// Field Database Types
export interface FieldDefinition {
  id: string;
  name: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'email' | 'currency' | 'relationship' | 'json';
  source: 'system' | 'custom' | 'integration';
  integrationAppId?: string; // e.g. 'sf'
  externalField?: string; // e.g. 'Amount'
  relatedTableId?: string; // for relationships
  required: boolean;
}

export interface FieldTable {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  fields: FieldDefinition[];
}

export interface SyncLog {
  id: string;
  timestamp: string;
  integrationId: string;
  direction: 'Inbound' | 'Outbound';
  status: 'Success' | 'Failed' | 'Warning';
  records: number;
  message: string;
}

// --- DOCUMENT TEMPLATE TYPES ---
export interface TemplateVariable {
  id: string;
  name: string;
  sourceField: string; // Links to FieldDefinition key
}

export interface ConditionalSection {
  id: string;
  name: string;
  condition: string; // Simple string rep for MVP
  content: string;
}

export interface RedactionRule {
  id: string;
  role: UserRole;
  description: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string; // MSA, NDA, etc.
  version: string;
  lastModified: string;
  status: 'Draft' | 'Active' | 'Archived';
  content: string; // HTML mock content
  variables: TemplateVariable[];
  conditions: ConditionalSection[];
  redactionRules: RedactionRule[];
}

// --- WORKFLOW TEMPLATE TYPES ---
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  nodes: WorkflowNode[];
  updated: string;
}
