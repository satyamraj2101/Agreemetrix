
export enum UserRole {
  ADMIN = 'Admin',
  LEGAL = 'Legal',
  SALES = 'Sales',
  HR = 'HR',
  FINANCE = 'Finance',
  VIEWER = 'Viewer',
  EXTERNAL = 'External_Guest' // New for Negotiation
}

export enum ContractStatus {
  DRAFT = 'Draft',
  REVIEW = 'In Review',
  NEGOTIATION = 'Negotiation', // New Stage
  APPROVAL = 'Pending Approval',
  SIGNED = 'Signed',
  ACTIVE = 'Active',
  EXPIRED = 'Expired'
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress?: string;
  hash?: string; // Compliance hash
}

export interface ContractVersion {
  id: string;
  versionNumber: string;
  createdDate: string;
  createdBy: string;
  description: string;
  fileSize: string;
  changesCount: number;
  isCurrent: boolean;
}

export interface Obligation {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'At Risk' | 'Breached';
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  recurrence?: 'Monthly' | 'Quarterly' | 'Annual' | 'One-time';
}

export type WorkflowCategory = 'trigger' | 'approval' | 'condition' | 'action' | 'integration' | 'stage' | 'utility' | 'ai_agent' | 'document';

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
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'in_list';
  value: string | number;
  logic: 'AND' | 'OR';
}

export interface WorkflowNodeConfig {
  label?: string;
  description?: string;
  retryPolicy?: { maxAttempts: number; backoff: 'linear' | 'exponential' };
  runAsUser?: string;
  formId?: string;
  validateRules?: boolean;
  crmObject?: string;
  matchRule?: string;
  crmTriggerStage?: string;
  cronExpression?: string;
  timezone?: string;
  webhookSecret?: string;
  responseCode?: string;
  importSource?: string;
  autoTag?: boolean;
  approverType?: 'user' | 'role' | 'group' | 'dynamic';
  approverId?: string;
  approvalOrder?: 'serial' | 'parallel';
  quorum?: number;
  escalationTime?: number;
  escalationAction?: string;
  fallbackApprover?: string;
  templateId?: string;
  outputFormat?: 'pdf' | 'docx' | 'html';
  includeRedlines?: boolean;
  clauseId?: string;
  position?: 'append' | 'replace' | 'prepend';
  redactionMap?: Record<string, boolean>;
  conditionExpression?: string;
  rules?: ConditionRule[];
  delayDuration?: number;
  delayUnit?: 'minutes' | 'hours' | 'days' | 'weeks';
  interruptible?: boolean;
  splitType?: 'fanout' | 'map';
  joinType?: 'all' | 'any';
  aiModel?: string;
  aiPrompt?: string;
  riskThreshold?: number;
  extractTypes?: string[];
  integrationId?: string;
  targetObject?: string;
  upsert?: boolean;
  fieldMappings?: Record<string, string>;
  emailRecipient?: string;
  emailSubject?: string;
  emailTemplateId?: string;
  slackChannel?: string;
  slackButtons?: boolean;
  webhookUrl?: string;
  method?: string;
  authType?: string;
  payload?: string;
  stageId?: string;
  signatureProvider?: 'docusign' | 'adobe' | 'hellosign';
  signers?: { role: string; email?: string; type: 'internal' | 'external'; order: number }[];
}

export interface WorkflowComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface WorkflowNode {
  id: string;
  category: WorkflowCategory;
  type: string;
  label: string;
  x: number;
  y: number;
  config: WorkflowNodeConfig;
  isValid?: boolean;
  validationError?: string;
  comments?: WorkflowComment[];
  lastModified?: string;
  modifiedBy?: string;
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

export type WorkflowStage = WorkflowStageDefinition;

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  updated: string;
  status?: string;
  schema: {
    stages: WorkflowStageDefinition[];
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  };
}

export interface UserPresence {
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  selection?: string[];
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

export type FieldDataType = 
  | 'text' | 'rich_text' | 'number' | 'currency' | 'date' | 'datetime' 
  | 'boolean' | 'select' | 'multi_select' | 'relationship' | 'file' 
  | 'user' | 'formula' | 'json' | 'email' | 'phone' | 'url' | 'encrypted' | 'vector';

export interface FieldValidationRule {
  type: 'regex' | 'range' | 'required_if' | 'custom';
  value: string;
  message: string;
}

export interface FieldVisibilityRule {
  roleId: string;
  access: 'read_write' | 'read_only' | 'masked' | 'hidden';
}

export interface FieldDefinition {
  id: string;
  name: string;
  key: string;
  type: FieldDataType | string;
  source: 'system' | 'custom' | 'integration';
  isLocked?: boolean; // If true, field cannot be deleted or key changed
  description?: string;
  required: boolean;
  unique?: boolean;
  defaultValue?: string;
  isPII?: boolean;
  isEncrypted?: boolean;
  isIndexed?: boolean;
  formula?: string;
  validationRules?: FieldValidationRule[];
  options?: string[];
  relatedTableId?: string;
  integrationAppId?: string;
  externalObject?: string;
  externalField?: string;
  syncDirection?: SyncDirection;
  transformation?: string;
  visibleDocumentTypes?: string[];
  visibilityRules?: FieldVisibilityRule[];
  usageCount?: number;
  lastModified?: string;
  modifiedBy?: string;
}

export interface FieldTable { 
  id: string; 
  name: string; 
  description: string; 
  icon: string; 
  fields: FieldDefinition[]; 
}

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  type?: 'text' | 'suggestion' | 'error' | 'success' | 'narrative';
  actions?: { label: string; actionId: string; data?: any }[];
}

export interface User { id: string; name: string; email: string; role: UserRole; status: string; departmentId?: string; lastLogin?: string; groups?: string[]; }
export interface Organization { id: string; name: string; domain: string; primaryContactEmail: string; address: string; subscriptionTier: string; licenseCount: number; licenseUsed: number; }
export interface Department { id: string; name: string; headId?: string; description?: string; memberCount: number; }
export interface Permission { id: string; key: string; name: string; description: string; module: string; }
export interface RoleDefinition { id: string; name: string; description: string; isSystem: boolean; permissions: string[]; usersCount: number; }
export interface UserGroup { id: string; name: string; description: string; members: string[]; }
export interface Contract { 
  id: string; 
  title: string; 
  counterparty: string; 
  value: number; 
  status: ContractStatus; 
  startDate: string; 
  renewalDate: string; 
  riskScore: number; 
  owner: string; 
  type: string;
  // Extended Fields
  versions?: ContractVersion[];
  auditLog?: AuditLogEntry[];
  obligations?: Obligation[];
}
export interface IntegrationApp { id: string; name: string; category: string; description: string; icon: string; installed: boolean; status?: string; mappings?: FieldMapping[]; }
export interface DocumentTemplate { id: string; name: string; category: string; version: string; lastModified: string; status: string; content: string; variables: any[]; conditions: any[]; redactionRules: any[]; tags?: string[]; }
export interface Clause { id: string; name: string; category: string; content: string; riskLevel: string; tags: string[]; }

export interface Counterparty { 
  id: string; 
  name: string; 
  type: string;
  status: 'Active' | 'Onboarding' | 'Inactive' | 'Blocked';
  region: string; 
  industry: string;
  website?: string;
  riskScore: number; 
  activeContracts: number; 
  totalValue: number; 
  legalName?: string;
  dbaName?: string;
  taxId?: string;
  vatNumber?: string;
  dunsNumber?: string;
  incorporationDate?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  addressCountry?: string;
  paymentTerms?: string;
  currency?: string;
  bankName?: string;
  bankAccountLast4?: string;
  swiftCode?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  primaryContactRole?: string;
  tags?: string[];
  notes?: string;
}

export interface RiskItem { id: string; contractId: string; description: string; severity: string; status: string; dueDate: string; }
export interface SyncLog { id: string; timestamp: string; integrationId: string; direction: string; status: string; records: number; message: string; }
export interface ChatMessage { id: string; sender: 'user' | 'system'; text: string; timestamp: Date; }
