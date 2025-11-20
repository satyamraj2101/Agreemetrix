
export enum UserRole {
  ADMIN = 'Admin',
  LEGAL = 'Legal',
  SALES = 'Sales',
  HR = 'HR',
  FINANCE = 'Finance',
  VIEWER = 'Viewer'
}

export enum ContractStatus {
  DRAFT = 'Draft',
  REVIEW = 'In Review',
  APPROVAL = 'Pending Approval',
  SIGNED = 'Signed',
  EXPIRED = 'Expired'
}

export type WorkflowCategory = 'trigger' | 'approval' | 'condition' | 'action' | 'integration' | 'stage' | 'utility';

export type ActionType = 
  | 'generate_document' 
  | 'upload_version' 
  | 'send_review' 
  | 'redlining' 
  | 'signature' 
  | 'email' 
  | 'update_record' 
  | 'slack_notify'
  | 'stage_transition'
  | 'create_task'
  | 'delay';

export interface ConditionRule {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty';
  value: string | number;
  logic: 'AND' | 'OR';
}

export interface WorkflowNodeConfig {
  // General
  description?: string;
  stageId?: string; // The stage this node belongs to or transitions to

  // Approval Config
  approverType?: 'user' | 'role' | 'group' | 'dynamic';
  approverId?: string; // ID of role or user
  approvalOrder?: 'serial' | 'parallel';
  escalationTime?: number; // Hours
  escalationTarget?: string;

  // Condition Config
  rules?: ConditionRule[];
  
  // Integration Config
  integrationId?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  headers?: { key: string; value: string }[];
  payload?: string; // JSON structure
  
  // Action Config
  actionType?: ActionType;
  templateId?: string; // For document generation
  signatureProvider?: 'docusign' | 'adobe' | 'hellosign';
  signers?: { role: string; email?: string; type: 'internal' | 'external' }[];
  emailSubject?: string;
  emailBody?: string;
  recipient?: string; // For email/review
  
  // Utility & Task Config
  delayTime?: number;
  delayUnit?: 'hours' | 'days' | 'weeks';
  taskTitle?: string;
  taskPriority?: 'High' | 'Medium' | 'Low';
  taskAssignee?: string;
  
  // Scheduled Trigger
  cronSchedule?: string;
}

export interface WorkflowNode {
  id: string;
  category: WorkflowCategory;
  type: string; // Specific sub-type like 'salesforce_trigger' or 'generate_doc'
  label: string;
  x: number;
  y: number;
  config: WorkflowNodeConfig;
  isValid?: boolean;
  validationError?: string;
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
  handleId?: 'true_out' | 'false_out' | 'default';
}

export interface WorkflowStageDefinition {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface WorkflowSchema {
  meta: {
    name: string;
    description?: string;
    version: string;
    created: string;
    updated: string;
  };
  stages: WorkflowStageDefinition[];
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

// New Types needed for fixes
export type WorkflowStage = WorkflowStageDefinition;

// Updated to match Schema for full loading
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  updated: string;
  schema: {
    stages: WorkflowStageDefinition[];
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  };
}

export type SyncDirection = 'import' | 'export' | 'bidirectional';

export interface FieldMapping {
  id: string;
  externalField: string;
  internalVariable: string;
  direction: SyncDirection;
  dataType: string;
  active: boolean;
}

// Re-exports with updated definitions
export interface User { id: string; name: string; email: string; role: UserRole; status: string; departmentId?: string; lastLogin?: string; groups?: string[]; }
export interface Organization { id: string; name: string; domain: string; primaryContactEmail: string; address: string; subscriptionTier: string; licenseCount: number; licenseUsed: number; }
export interface Department { id: string; name: string; headId?: string; description?: string; memberCount: number; }
export interface Permission { id: string; key: string; name: string; description: string; module: string; }
export interface RoleDefinition { id: string; name: string; description: string; isSystem: boolean; permissions: string[]; usersCount: number; }
export interface UserGroup { id: string; name: string; description: string; members: string[]; }
export interface Contract { id: string; title: string; counterparty: string; value: number; status: ContractStatus; startDate: string; renewalDate: string; riskScore: number; owner: string; type: string; }
export interface IntegrationApp { id: string; name: string; category: string; description: string; icon: string; installed: boolean; status?: string; mappings?: FieldMapping[]; }
export interface FieldDefinition { id: string; name: string; key: string; type: string; source: string; required: boolean; unique?: boolean; description?: string; visibleDocumentTypes?: string[]; options?: string[]; relatedTableId?: string; integrationAppId?: string; externalObject?: string; externalField?: string; syncDirection?: SyncDirection; }
export interface FieldTable { id: string; name: string; description: string; icon: string; fields: FieldDefinition[]; }
export interface DocumentTemplate { id: string; name: string; category: string; version: string; lastModified: string; status: string; content: string; variables: any[]; conditions: any[]; redactionRules: any[]; tags?: string[]; }
export interface Clause { id: string; name: string; category: string; content: string; riskLevel: string; tags: string[]; }
export interface Counterparty { id: string; name: string; type: string; region: string; riskScore: number; activeContracts: number; totalValue: number; }
export interface RiskItem { id: string; contractId: string; description: string; severity: string; status: string; dueDate: string; }
export interface SyncLog { id: string; timestamp: string; integrationId: string; direction: string; status: string; records: number; message: string; }
export interface ChatMessage { id: string; sender: 'user' | 'system'; text: string; timestamp: Date; }