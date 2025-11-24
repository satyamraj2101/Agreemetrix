
import { 
  Contract, ContractStatus, Clause, UserRole, IntegrationApp, RiskItem, Counterparty, 
  FieldTable, SyncLog, DocumentTemplate, User, Department, RoleDefinition, Permission, 
  UserGroup, Organization, WorkflowStage, WorkflowTemplate, ContractVersion, AuditLogEntry, Obligation,
  ApplicationType
} from '../types';

export const MOCK_ORGANIZATION: Organization = {
  id: 'org_001',
  name: 'Pearson Specter Litt',
  domain: 'pearsonspecter.com',
  primaryContactEmail: 'admin@pearsonspecter.com',
  address: '601 Lexington Avenue, New York, NY 10022',
  subscriptionTier: 'Enterprise',
  licenseCount: 50,
  licenseUsed: 12
};

// ... [Existing Mock Data for Departments, Permissions, Roles, Groups, Users, Forms, Email Templates, Tables, Document Templates, Clauses, Workflow Stages, Workflow Templates, Node Descriptions, Comments, Changes, Variables, Contracts, Parties, Integrations, Risks, Sync Logs, Obligations, Versions] ...
// RE-INSERTING ALL EXISTING MOCK DATA BELOW TO MAINTAIN INTEGRITY

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept_legal', name: 'Legal', headId: 'u1', description: 'General Counsel and Corporate Law', memberCount: 5 },
  { id: 'dept_sales', name: 'Sales', headId: 'u4', description: 'Global Sales and Partnerships', memberCount: 12 },
  { id: 'dept_finance', name: 'Finance', headId: 'u5', description: 'Accounting and Procurement', memberCount: 4 },
  { id: 'dept_hr', name: 'Human Resources', headId: 'u6', description: 'Talent and Culture', memberCount: 3 },
  { id: 'dept_it', name: 'IT & Security', headId: 'u7', description: 'Infrastructure and InfoSec', memberCount: 6 }
];

export const MOCK_PERMISSIONS: Permission[] = [
  { id: 'p1', key: 'contract.view', name: 'View Contracts', description: 'Can view contract details', module: 'Contracts' },
  { id: 'p2', key: 'contract.create', name: 'Create Contracts', description: 'Can create new contracts', module: 'Contracts' },
  { id: 'p3', key: 'contract.edit', name: 'Edit Contracts', description: 'Can edit existing contracts', module: 'Contracts' },
  { id: 'p4', key: 'contract.delete', name: 'Delete Contracts', description: 'Can delete contracts', module: 'Contracts' },
  { id: 'p5', key: 'contract.approve', name: 'Approve Contracts', description: 'Can approve workflow stages', module: 'Workflows' },
  { id: 'p6', key: 'user.manage', name: 'Manage Users', description: 'Can add/edit/delete users', module: 'Users' },
  { id: 'p7', key: 'report.view', name: 'View Reports', description: 'Access to BI dashboards', module: 'Reports' },
  { id: 'p8', key: 'settings.manage', name: 'Manage Settings', description: 'Global system configuration', module: 'Settings' },
];

export const MOCK_ROLES: RoleDefinition[] = [
  { 
    id: 'role_admin', name: 'Administrator', description: 'Full system access', isSystem: true, usersCount: 2,
    permissions: ['contract.view', 'contract.create', 'contract.edit', 'contract.delete', 'contract.approve', 'user.manage', 'report.view', 'settings.manage']
  },
  { 
    id: 'role_legal', name: 'Legal Counsel', description: 'Can manage and approve all legal documents', isSystem: false, usersCount: 5,
    permissions: ['contract.view', 'contract.create', 'contract.edit', 'contract.approve', 'report.view']
  },
  { 
    id: 'role_sales', name: 'Sales Representative', description: 'Can request and view own contracts', isSystem: false, usersCount: 12,
    permissions: ['contract.view', 'contract.create']
  },
  { 
    id: 'role_viewer', name: 'Read Only', description: 'View only access', isSystem: true, usersCount: 0,
    permissions: ['contract.view']
  },
  {
    id: 'role_ciso', name: 'CISO', description: 'Chief Information Security Officer', isSystem: false, usersCount: 1,
    permissions: ['contract.view', 'contract.approve']
  },
  {
    id: 'role_finance', name: 'Finance Director', description: 'Financial approval authority', isSystem: false, usersCount: 2,
    permissions: ['contract.view', 'contract.approve']
  }
];

export const MOCK_GROUPS: UserGroup[] = [
  { id: 'g1', name: 'US Legal Team', description: 'Attorneys handling North American jurisdiction', members: ['u1', 'u2'] },
  { id: 'g2', name: 'EU Compliance', description: 'GDPR and EU regulation specialists', members: ['u3'] },
  { id: 'g3', name: 'Deal Desk', description: 'Cross-functional team for high-value deals', members: ['u4', 'u5'] },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Harvey Specter', role: UserRole.ADMIN, email: 'harvey@pearsonspecter.com', status: 'Active', departmentId: 'dept_legal', lastLogin: '2 mins ago' },
  { id: 'u2', name: 'Mike Ross', role: UserRole.LEGAL, email: 'mike@pearsonspecter.com', status: 'Active', departmentId: 'dept_legal', lastLogin: '1 hour ago' },
  { id: 'u3', name: 'Rachel Zane', role: UserRole.ADMIN, email: 'rachel@pearsonspecter.com', status: 'Active', departmentId: 'dept_legal', lastLogin: '4 hours ago' },
  { id: 'u4', name: 'Louis Litt', role: UserRole.SALES, email: 'louis@pearsonspecter.com', status: 'Active', departmentId: 'dept_sales', lastLogin: '1 day ago' },
  { id: 'u5', name: 'Jessica Pearson', role: UserRole.FINANCE, email: 'jessica@pearsonspecter.com', status: 'Inactive', departmentId: 'dept_finance', lastLogin: '2 weeks ago' },
  { id: 'u6', name: 'Donna Paulsen', role: UserRole.HR, email: 'donna@pearsonspecter.com', status: 'Active', departmentId: 'dept_hr', lastLogin: '10 mins ago' },
  { id: 'u7', name: 'Benjamin', role: UserRole.ADMIN, email: 'benjamin@pearsonspecter.com', status: 'Invited', departmentId: 'dept_it', lastLogin: '-' },
];

export const MOCK_FORMS = [
  { id: 'form_vendor', name: 'Vendor Intake Form v2' },
  { id: 'form_nda', name: 'NDA Request Form' },
  { id: 'form_emp', name: 'Employee Offer Request' },
];

export const MOCK_EMAIL_TEMPLATES = [
  { id: 'email_approval_req', name: 'Approval Request Notification' },
  { id: 'email_signed', name: 'Contract Signed - Executed Copy' },
  { id: 'email_review', name: 'Legal Review Needed' },
  { id: 'email_external', name: 'External Signatory Invite' },
  { id: 'email_breach', name: 'Notice of Breach Template' },
  { id: 'email_renewal', name: 'Renewal Notice Template' },
];

// --- MOCK TABLES (FIELDS) ---
export const MOCK_TABLES: FieldTable[] = [
  {
    id: 'tbl_contract',
    name: 'Contract',
    description: 'Core contract metadata and properties.',
    icon: 'FileText',
    fields: [
      { id: 'f1', name: 'Contract Title', key: 'contract.title', type: 'text', source: 'system', required: true, isLocked: true, isIndexed: true },
      { id: 'f2', name: 'Total Value', key: 'contract.value', type: 'currency', source: 'system', required: true, isLocked: true, isIndexed: true },
      { id: 'f3', name: 'Status', key: 'contract.status', type: 'select', source: 'system', required: true, isLocked: true, options: ['Draft', 'Active', 'Expired'] },
      { id: 'f4', name: 'Effective Date', key: 'contract.startDate', type: 'date', source: 'system', required: true, isLocked: true },
      { id: 'f5', name: 'Jurisdiction', key: 'contract.jurisdiction', type: 'select', source: 'system', required: true, isLocked: true, options: ['New York', 'California', 'Delaware', 'London'] },
      { id: 'f6', name: 'Risk Score', key: 'contract.riskScore', type: 'number', source: 'system', required: false, isLocked: true },
      { id: 'f7', name: 'Renewal Date', key: 'contract.renewalDate', type: 'date', source: 'system', required: false, isLocked: true },
      
      { id: 'f8', name: 'Utilization %', key: 'contract.utilization', type: 'number', source: 'custom', required: false, description: 'Percentage of license usage' },
      { id: 'f9', name: 'Liability Cap', key: 'contract.liabilityCap', type: 'currency', source: 'custom', required: false, description: 'Maximum liability amount.' },
      { id: 'f10', name: 'Termination Notice Days', key: 'contract.terminationNotice', type: 'number', source: 'custom', required: false, description: 'Days notice required to terminate.' },
      { id: 'f11', name: 'Payment Terms', key: 'contract.paymentTerms', type: 'select', source: 'custom', required: true, options: ['Net 30', 'Net 45', 'Net 60', 'Immediate'] },
    ]
  },
  {
    id: 'tbl_intake',
    name: 'Intake Form',
    description: 'Fields available for internal request forms.',
    icon: 'ClipboardList',
    fields: [
        { id: 'in_1', name: 'Project Name', key: 'intake.projectName', type: 'text', source: 'system', required: true, isLocked: true },
        { id: 'in_2', name: 'Data Sensitivity', key: 'intake.dataSensitivity', type: 'select', source: 'custom', required: true, options: ['Public', 'Internal', 'Confidential', 'Restricted'] },
        { id: 'in_3', name: 'Involves PII?', key: 'intake.involvesPII', type: 'boolean', source: 'custom', required: true },
        // New Enterprise Fields
        { id: 'in_4', name: 'Business Unit', key: 'intake.businessUnit', type: 'select', source: 'custom', required: true, options: ['Marketing', 'Engineering', 'HR', 'Sales', 'IT', 'Operations'] },
        { id: 'in_5', name: 'Spend Type', key: 'intake.spendType', type: 'select', source: 'custom', required: true, options: ['CapEx', 'OpEx'] },
        { id: 'in_6', name: 'Vendor Tier', key: 'intake.vendorTier', type: 'select', source: 'custom', required: true, options: ['Strategic', 'Preferred', 'Transactional', 'Probationary'] },
        { id: 'in_7', name: 'Software Type', key: 'intake.softwareType', type: 'select', source: 'custom', required: false, options: ['SaaS', 'On-Premise', 'Library/SDK', 'Professional Services'] },
        { id: 'in_8', name: 'Cross-Border?', key: 'intake.isCrossBorder', type: 'boolean', source: 'custom', required: true }
    ]
  },
  {
    id: 'tbl_counterparty',
    name: 'Counterparty',
    description: 'External organizations and vendors.',
    icon: 'Users',
    fields: [
      { id: 'cp1', name: 'Company Name', key: 'counterparty.name', type: 'text', source: 'system', required: true, isLocked: true },
      { id: 'cp2', name: 'Region', key: 'counterparty.region', type: 'select', source: 'custom', required: true, options: ['NA', 'EU', 'APAC', 'LATAM'] },
      { id: 'cp3', name: 'Primary Contact', key: 'counterparty.primaryContactName', type: 'text', source: 'custom', required: false },
    ]
  }
];

// Styling for variables in templates to ensure they match editor insertions
const VAR_STYLE = 'background-color: rgba(20, 184, 166, 0.2); padding: 0 4px; border-radius: 4px; border: 1px solid rgba(20, 184, 166, 0.4); color: #14b8a6; font-family: monospace; display: inline-block;';

// --- DOCUMENT TEMPLATES ---
export const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl_1',
    name: 'Standard Mutual NDA',
    category: 'NDA',
    version: '2.1',
    lastModified: '2024-03-12',
    status: 'Active',
    variables: [],
    conditions: [],
    redactionRules: [],
    tags: ['Standard', 'Low Risk', 'General'],
    content: `...`
  },
  {
    id: 'tpl_2',
    name: 'SaaS Master Services Agreement v4',
    category: 'MSA',
    version: '4.0',
    lastModified: '2024-03-10',
    status: 'Active',
    variables: [],
    conditions: [],
    redactionRules: [],
    tags: ['US Only', 'Services', 'High Value'],
    content: `...`
  },
  {
    id: 'tpl_complex_msa',
    name: 'Complex SaaS MSA (Condition-Heavy)',
    category: 'MSA',
    version: '1.5',
    lastModified: '2024-04-15',
    status: 'Active',
    variables: [
        { name: 'Data Sensitivity', key: 'intake.dataSensitivity' },
        { name: 'Liability Cap', key: 'contract.liabilityCap' },
        { name: 'Region', key: 'counterparty.region' }
    ],
    conditions: [
        { id: 'r1', name: 'GDPR Compliance', field: 'counterparty.region', operator: 'equals', value: 'EU', actionType: 'insert_clause', actionTarget: 'Data Privacy (GDPR)', actionValue: '' },
        { id: 'r2', name: 'High Value Approval', field: 'contract.value', operator: 'greater_than', value: '100000', actionType: 'require_approval', actionTarget: 'CFO', actionValue: '' },
        { id: 'r3', name: 'Payment Terms Check', field: 'contract.paymentTerms', operator: 'contains', value: '60', actionType: 'show_warning', actionTarget: 'Non-standard payment terms detected', actionValue: '' },
        { id: 'r4', name: 'CCPA Compliance', field: 'contract.jurisdiction', operator: 'equals', value: 'California', actionType: 'insert_clause', actionTarget: 'CCPA Compliance Addendum', actionValue: '' }
    ],
    redactionRules: [],
    tags: ['Enterprise', 'GDPR', 'Complex'],
    content: `...`
  }
];

export const MOCK_CLAUSES: Clause[] = [
  {
    id: 'CL-001',
    name: 'Standard Indemnification',
    category: 'Indemnity',
    content: 'The Vendor agrees to indemnify, defend, and hold harmless the Client from and against any and all claims...',
    riskLevel: 'Low',
    tags: ['Standard', 'Playbook']
  },
  {
    id: 'CL-002',
    name: 'Aggressive Limitation of Liability',
    category: 'Liability',
    content: 'In no event shall Vendor\'s liability exceed the total fees paid in the preceding 3 months.',
    riskLevel: 'High',
    tags: ['Vendor Paper', 'Review Required']
  },
  {
    id: 'CL-003',
    name: 'Data Privacy (GDPR)',
    category: 'Compliance',
    content: 'Vendor shall process Personal Data only on documented instructions from the Controller...',
    riskLevel: 'Medium',
    tags: ['GDPR', 'EU']
  },
  {
    id: 'CL-005',
    name: 'CCPA Compliance Addendum',
    category: 'Compliance',
    content: 'Service Provider certifies that it understands the restrictions of the CCPA and will comply...',
    riskLevel: 'Low',
    tags: ['CCPA', 'US-CA']
  }
];

// --- WORKFLOW DEFINITIONS ---

export const INITIAL_STAGES: WorkflowStage[] = [
  { id: 'stg_draft', name: 'Drafting', color: '#94a3b8', order: 0 },
  { id: 'stg_review', name: 'Review', color: '#3b82f6', order: 1 },
  { id: 'stg_negotiation', name: 'Negotiation', color: '#8b5cf6', order: 2 },
  { id: 'stg_approval', name: 'Approval', color: '#eab308', order: 3 },
  { id: 'stg_sign', name: 'Signature', color: '#a855f7', order: 4 },
  { id: 'stg_active', name: 'Active', color: '#22c55e', order: 5 },
];

export const INITIAL_TEMPLATES: WorkflowTemplate[] = [
    {
      id: 'wf_global_procurement',
      name: 'Global Enterprise Procurement (G-EP)',
      description: 'Complex multi-stage procurement flow with tiered approvals, parallel department reviews, and cross-border compliance checks.',
      category: 'Procurement',
      tags: ['Enterprise', 'Complex', 'Global'],
      updated: '2024-05-20',
      status: 'Published',
      schema: {
          stages: INITIAL_STAGES,
          nodes: [
             { id: 'n1', category: 'trigger', type: 'form_submission', label: 'Global Procurement Intake', x: 100, y: 300, config: { formId: 'form_vendor', stageId: 'stg_draft' } },
             { id: 'n2', category: 'ai_agent', type: 'risk_scorer', label: 'AI Vendor Tiering', x: 400, y: 300, config: { aiModel: 'gpt-4o', description: 'Categorize vendor strategic importance' } }
          ],
          connections: [
              { id: 'c1', source: 'n1', target: 'n2' }
          ]
      }
    }
];

export const NODE_DESCRIPTIONS: Record<string, string> = {
  'manual_request': 'Triggers when a user manually initiates a request from the dashboard.',
  'form_submission': 'Triggers when an external intake form (e.g., Vendor Intake) is submitted.',
};

export const MOCK_COMMENTS = [
  {
    id: 'c1',
    user: 'Mike Ross',
    text: 'We need to clarify the indemnity cap here. Standard is 2x, this says unlimited.',
    date: '2h ago',
    resolved: false,
    replies: [
      { user: 'Harvey Specter', text: 'Agreed. Change it to 2x fees paid.', date: '1h ago' }
    ]
  },
];

export const MOCK_CHANGES = [
  { id: 'tc1', type: 'delete', user: 'Mike Ross', date: '2h ago', content: 'perpetual', status: 'pending' },
  { id: 'tc2', type: 'insert', user: 'Mike Ross', date: '2h ago', content: 'three (3) year', status: 'pending' },
];

export const MOCK_VARIABLES = [
  { key: 'counterparty.name', label: 'Counterparty Name', type: 'text', required: true },
  { key: 'counterparty.region', label: 'Counterparty Region', type: 'select', required: true, options: ['NA', 'EU', 'APAC'] },
  { key: 'contract.value', label: 'Total Value', type: 'currency', required: true },
  { key: 'contract.startDate', label: 'Effective Date', type: 'date', required: true },
  { key: 'contract.jurisdiction', label: 'Jurisdiction', type: 'select', required: true, options: ['New York', 'California', 'Delaware', 'London'] },
  { key: 'contract.paymentTerms', label: 'Payment Terms', type: 'select', required: false, options: ['Net 30', 'Net 45', 'Net 60'], defaultValue: 'Net 30' },
  { key: 'intake.dataSensitivity', label: 'Data Sensitivity', type: 'select', required: true, options: ['Low', 'Medium', 'High'] },
  { key: 'contract.terminationNotice', label: 'Termination Notice', type: 'number', required: false },
  { key: 'contract.liabilityCap', label: 'Liability Cap', type: 'currency', required: false },
  { key: 'intake.businessUnit', label: 'Business Unit', type: 'select', required: true, options: ['Marketing', 'IT', 'HR', 'Sales'] },
  { key: 'intake.spendType', label: 'Spend Type', type: 'select', required: true, options: ['CapEx', 'OpEx'] },
  { key: 'intake.vendorTier', label: 'Vendor Tier', type: 'select', required: true, options: ['Strategic', 'Preferred', 'Transactional'] },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'CTR-2024-001',
    title: 'Master Services Agreement - Acme Corp',
    counterparty: 'Acme Corporation',
    value: 150000,
    status: ContractStatus.NEGOTIATION, 
    startDate: '2024-01-15',
    renewalDate: '2025-01-15',
    riskScore: 75,
    owner: 'Sarah Jenkins',
    type: 'MSA',
    versions: [],
    auditLog: [],
    obligations: []
  }
];

export const MOCK_PARTIES: Counterparty[] = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    type: 'Customer', 
    status: 'Active',
    industry: 'Retail',
    region: 'North America', 
    riskScore: 12, 
    activeContracts: 3, 
    totalValue: 450000,
    website: 'www.acme-corp.com',
    legalName: 'Acme Corporation Inc.',
    taxId: '92-1234567',
    dunsNumber: '12-345-6789',
    addressStreet: '100 Main St',
    addressCity: 'Wilmington',
    addressState: 'DE',
    addressZip: '19801',
    addressCountry: 'USA',
    primaryContactName: 'John W. Acme',
    primaryContactEmail: 'j.acme@acme-corp.com',
    primaryContactPhone: '+1 302-555-0199',
    primaryContactRole: 'VP Procurement',
    paymentTerms: 'Net 45',
    currency: 'USD',
    bankName: 'Chase',
    bankAccountLast4: '9876',
    tags: ['Strategic', 'Fortune 500']
  }
];

export const MOCK_INTEGRATIONS: IntegrationApp[] = [
  { 
    id: 'sf', 
    name: 'Salesforce', 
    category: 'CRM', 
    description: 'Sync opportunities and contract metadata.', 
    icon: 'SF', 
    installed: true, 
    status: 'active', 
    mappings: [
      { id: 'm1', externalField: 'Amount', internalVariable: 'contract.value', direction: 'import', dataType: 'number', active: true },
      { id: 'm2', externalField: 'StageName', internalVariable: 'contract.status', direction: 'bidirectional', dataType: 'string', active: true },
    ]
  }
];

export const MOCK_RISKS: RiskItem[] = [
  { id: 'R-001', contractId: 'CTR-2024-001', description: 'Missing Liability Cap', severity: 'High', status: 'Open', dueDate: '2024-03-15' },
  { id: 'R-002', contractId: 'CTR-2024-004', description: 'Non-Standard Payment Terms', severity: 'Medium', status: 'Open', dueDate: '2024-03-20' },
];

export const MOCK_SYNC_LOGS: SyncLog[] = [
  { id: 'log_1', timestamp: '2024-03-15 10:42:12', integrationId: 'sf', direction: 'Inbound', status: 'Success', records: 12, message: 'Opportunities synced successfully' },
  { id: 'log_2', timestamp: '2024-03-15 10:30:00', integrationId: 'sf', direction: 'Outbound', status: 'Success', records: 1, message: 'Contract CTR-2024-001 status updated' },
];

export const MOCK_OBLIGATIONS: Obligation[] = [
  { id: 'obl_1', title: 'Payment Milestone 1', dueDate: '2024-05-01', status: 'Pending', owner: 'Finance Dept', priority: 'High', recurrence: 'One-time' },
  { id: 'obl_2', title: 'Annual Compliance Report', dueDate: '2024-12-31', status: 'Pending', owner: 'Compliance Team', priority: 'Medium', recurrence: 'Annual' },
  { id: 'obl_3', title: 'Service Renewal Notice', dueDate: '2025-03-01', status: 'Pending', owner: 'Account Manager', priority: 'High', recurrence: 'Annual' },
];

export const MOCK_VERSIONS = [
  { id: 'v3', name: 'Version 1.2', date: 'Today, 10:23 AM', author: 'Harvey Specter' },
  { id: 'v2', name: 'Version 1.1', date: 'Yesterday, 4:45 PM', author: 'Mike Ross' },
  { id: 'v1', name: 'Version 1.0', date: 'Oct 12, 2023', author: 'System Auto-Gen' },
];

// --- APPLICATION TYPE MOCK DATA ---
export const MOCK_APP_TYPES: ApplicationType[] = [
  {
    id: 'at_nda',
    name: 'NDA Request',
    key: 'NDA_REQ',
    description: 'Standard Non-Disclosure Agreement request flow.',
    status: 'Published',
    owner: 'Legal Ops',
    lastModified: '2 days ago',
    usageCount: 1240,
    workflowId: 'wf_global_procurement',
    intakeForm: {
      layout: 'wizard',
      sections: [
        { id: 's1', title: 'General Information', order: 1 },
        { id: 's2', title: 'Parties', order: 2 }
      ],
      fields: [
        { ...MOCK_TABLES[1].fields[0], sectionId: 's1' }, // Project Name
        { ...MOCK_TABLES[2].fields[0], sectionId: 's2' }, // Counterparty Name
        { ...MOCK_TABLES[2].fields[2], sectionId: 's2' }, // Contact
      ]
    },
    templateRules: [
      { id: 'tr_1', templateId: 'tpl_1', conditionExpression: "counterparty.region != 'EU'", priority: 1 },
      { id: 'tr_2', templateId: 'tpl_complex_msa', conditionExpression: "counterparty.region == 'EU'", priority: 2 }
    ],
    actions: [
      { actionKey: 'upload_version', label: 'Upload Version', type: 'workflow', enabled: true, allowedRoles: ['role_legal'], stage: 'Negotiation' },
      { actionKey: 'send_review', label: 'Send for Review', type: 'workflow', enabled: true, allowedRoles: ['role_sales'], stage: 'Draft' }
    ],
    notifications: [],
    versions: [],
    attachmentRules: [
        { id: 'att_1', label: 'Vendor Risk Assessment', key: 'risk_assessment', required: true, acceptedTypes: ['.pdf'], maxSizeMB: 10, description: 'Completed security questionnaire' },
        { id: 'att_2', label: 'Insurance Certificate', key: 'coi', required: false, acceptedTypes: ['.pdf', '.jpg', '.png'], maxSizeMB: 5 }
    ],
    storageConfig: {
        provider: 'SharePoint',
        basePath: '/sites/legal/repository/',
        pathPattern: '{{industry}}/{{counterparty_name}}/',
        namingConvention: '{{contract_id}}_{{type}}_v{{version}}',
        autoArchive: false
    },
    permissions: {
        initiation: { accessLevel: 'internal', allowedRoleIds: [], allowedGroupIds: [] },
        visibility: { defaultScope: 'requester', additionalRoleIds: ['role_admin'] },
        managers: ['u1']
    }
  },
  {
    id: 'at_vendor',
    name: 'Vendor Onboarding',
    key: 'VEND_ONB',
    description: 'End-to-end vendor qualification and MSA generation.',
    status: 'Published',
    owner: 'Procurement',
    lastModified: '1 week ago',
    usageCount: 450,
    workflowId: 'wf_ai_vendor_onboarding',
    intakeForm: {
      layout: 'wizard',
      sections: [
        { id: 's1', title: 'Details', order: 1 }
      ],
      fields: MOCK_TABLES[1].fields.map(f => ({...f, sectionId: 's1'}))
    },
    templateRules: [],
    actions: [],
    notifications: [],
    versions: [],
    attachmentRules: [],
    storageConfig: {
        provider: 'SharePoint',
        basePath: '/sites/procurement/',
        pathPattern: '{{year}}/{{counterparty_name}}/',
        namingConvention: '{{type}}_{{id}}',
        autoArchive: true
    },
    permissions: {
        initiation: { accessLevel: 'internal', allowedRoleIds: [], allowedGroupIds: [] },
        visibility: { defaultScope: 'department', additionalRoleIds: [] },
        managers: ['u1', 'u2']
    }
  },
  {
    id: 'at_sales',
    name: 'Sales Order',
    key: 'SALES_ORD',
    description: 'Customer order form processing.',
    status: 'Draft',
    owner: 'Sales Ops',
    lastModified: 'Just now',
    usageCount: 0,
    workflowId: '',
    intakeForm: {
      layout: 'single',
      sections: [],
      fields: []
    },
    templateRules: [],
    actions: [],
    notifications: [],
    versions: [],
    attachmentRules: [],
    storageConfig: {
        provider: 'S3',
        basePath: 's3://contracts-bucket/',
        pathPattern: '{{region}}/{{counterparty_name}}/',
        namingConvention: '{{id}}',
        autoArchive: false
    },
    permissions: {
        initiation: { accessLevel: 'restricted', allowedRoleIds: ['role_sales'], allowedGroupIds: [] },
        visibility: { defaultScope: 'requester', additionalRoleIds: ['role_finance'] },
        managers: ['u4']
    }
  }
];
