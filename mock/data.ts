
import { 
  Contract, ContractStatus, Clause, UserRole, IntegrationApp, RiskItem, Counterparty, 
  FieldTable, SyncLog, DocumentTemplate, User, Department, RoleDefinition, Permission, 
  UserGroup, Organization, WorkflowStage, WorkflowTemplate 
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

// --- NEW MOCKS FOR WORKFLOW PROPERTIES ---
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
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'CTR-2024-001',
    title: 'Master Services Agreement - Acme Corp',
    counterparty: 'Acme Corporation',
    value: 150000,
    status: ContractStatus.REVIEW,
    startDate: '2024-01-15',
    renewalDate: '2025-01-15',
    riskScore: 75,
    owner: 'Sarah Jenkins',
    type: 'MSA'
  },
  {
    id: 'CTR-2024-002',
    title: 'Software License - TechFlow',
    counterparty: 'TechFlow Inc.',
    value: 45000,
    status: ContractStatus.SIGNED,
    startDate: '2023-11-01',
    renewalDate: '2024-11-01',
    riskScore: 20,
    owner: 'Mike Ross',
    type: 'SaaS'
  },
  {
    id: 'CTR-2024-003',
    title: 'NDA - Global Logistics',
    counterparty: 'Global Logistics Partners',
    value: 0,
    status: ContractStatus.DRAFT,
    startDate: '2024-05-20',
    renewalDate: '2026-05-20',
    riskScore: 10,
    owner: 'Jessica Pearson',
    type: 'NDA'
  },
  {
    id: 'CTR-2024-004',
    title: 'Consulting Agreement - Stratos',
    counterparty: 'Stratos Consulting',
    value: 250000,
    status: ContractStatus.APPROVAL,
    startDate: '2024-06-01',
    renewalDate: '2024-12-31',
    riskScore: 88,
    owner: 'Louis Litt',
    type: 'Consulting'
  },
  {
    id: 'CTR-2024-005',
    title: 'Vendor Supplier Agreement',
    counterparty: 'Office Supplies Co',
    value: 12000,
    status: ContractStatus.SIGNED,
    startDate: '2023-02-01',
    renewalDate: '2024-02-01',
    riskScore: 5,
    owner: 'Donna Paulsen',
    type: 'Vendor'
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
    id: 'CL-004',
    name: 'Mutual Confidentiality',
    category: 'Confidentiality',
    content: 'Both parties agree to keep confidential all proprietary information disclosed during the term...',
    riskLevel: 'Low',
    tags: ['Standard']
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
  },
  { 
    id: '2', 
    name: 'TechFlow Inc.', 
    type: 'Vendor', 
    status: 'Active',
    industry: 'Technology',
    region: 'Europe', 
    riskScore: 45, 
    activeContracts: 1, 
    totalValue: 45000,
    website: 'www.techflow.io',
    legalName: 'TechFlow Systems GmbH',
    vatNumber: 'DE123456789',
    addressStreet: 'Alexanderplatz 1',
    addressCity: 'Berlin',
    addressState: 'Berlin',
    addressZip: '10178',
    addressCountry: 'Germany',
    primaryContactName: 'Klaus Muller',
    primaryContactEmail: 'k.muller@techflow.io',
    primaryContactPhone: '+49 30 123456',
    primaryContactRole: 'Account Director',
    paymentTerms: 'Net 30',
    currency: 'EUR',
    bankName: 'Deutsche Bank',
    bankAccountLast4: '4421',
    tags: ['SaaS', 'Critical Infra']
  },
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
      { id: 'm1', externalField: 'Amount', internalVariable: 'system.value', direction: 'import', dataType: 'number', active: true },
      { id: 'm2', externalField: 'StageName', internalVariable: 'contract.status', direction: 'bidirectional', dataType: 'string', active: true },
    ]
  },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Get notifications for approvals and tasks.', icon: 'SL', installed: true, status: 'active', mappings: [] },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Sync deals and company records.', icon: 'HS', installed: false },
  { id: 'docusign', name: 'DocuSign', category: 'Signature', description: 'Send documents for e-signature.', icon: 'DS', installed: true, status: 'active', mappings: [] },
  { id: 'jira', name: 'Jira', category: 'Ticketing', description: 'Create tickets from legal requests.', icon: 'JR', installed: false },
  { id: 'sap', name: 'SAP Ariba', category: 'ERP', description: 'Enterprise procurement and supply chain sync.', icon: 'SAP', installed: false },
  { id: 'drive', name: 'Google Drive', category: 'Storage', description: 'Sync contract files to Drive folders.', icon: 'GD', installed: false },
];

export const MOCK_RISKS: RiskItem[] = [
  { id: 'R-001', contractId: 'CTR-2024-001', description: 'Missing Liability Cap', severity: 'High', status: 'Open', dueDate: '2024-03-15' },
  { id: 'R-002', contractId: 'CTR-2024-004', description: 'Non-Standard Payment Terms', severity: 'Medium', status: 'Open', dueDate: '2024-03-20' },
];

export const MOCK_TABLES: FieldTable[] = [
  {
    id: 'tbl_contracts',
    name: 'Contracts',
    description: 'Core contract metadata and properties.',
    icon: 'FileText',
    fields: [
      { id: 'f1', name: 'Contract Title', key: 'title', type: 'text', source: 'system', required: true, isIndexed: true, lastModified: '2023-10-01', modifiedBy: 'System' },
      { id: 'f2', name: 'Total Value', key: 'value', type: 'currency', source: 'integration', integrationAppId: 'sf', externalField: 'Amount', externalObject: 'Opportunity', syncDirection: 'import', required: true, isIndexed: true, lastModified: '2023-11-15', modifiedBy: 'Admin' },
    ]
  },
];

export const MOCK_SYNC_LOGS: SyncLog[] = [
  { id: 'log_1', timestamp: '2024-03-15 10:42:12', integrationId: 'sf', direction: 'Inbound', status: 'Success', records: 12, message: 'Opportunities synced successfully' },
  { id: 'log_2', timestamp: '2024-03-15 10:30:00', integrationId: 'sf', direction: 'Outbound', status: 'Success', records: 1, message: 'Contract CTR-2024-001 status updated' },
  { id: 'log_3', timestamp: '2024-03-14 15:20:00', integrationId: 'slack', direction: 'Outbound', status: 'Failed', records: 1, message: 'Rate limit exceeded' },
  { id: 'log_4', timestamp: '2024-03-14 09:15:00', integrationId: 'docusign', direction: 'Inbound', status: 'Success', records: 1, message: 'Envelope signed and completed' },
  { id: 'log_5', timestamp: '2024-03-13 14:10:05', integrationId: 'sf', direction: 'Inbound', status: 'Warning', records: 5, message: 'Partial sync: 2 records skipped' },
  { id: 'log_6', timestamp: '2024-03-12 11:00:00', integrationId: 'docusign', direction: 'Outbound', status: 'Success', records: 1, message: 'Envelope sent for signature' },
  { id: 'log_7', timestamp: '2024-03-12 10:15:00', integrationId: 'sf', direction: 'Inbound', status: 'Success', records: 24, message: 'Account details updated' },
  { id: 'log_8', timestamp: '2024-03-11 16:45:00', integrationId: 'slack', direction: 'Outbound', status: 'Failed', records: 1, message: 'Channel not found (404)' },
];

export const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl_1',
    name: 'Standard Mutual NDA',
    category: 'NDA',
    version: '2.1',
    lastModified: '2024-03-12',
    status: 'Active',
    variables: [
      { id: 'v1', name: 'Counterparty Name', sourceField: 'tbl_counterparties.name' },
      { id: 'v2', name: 'Effective Date', sourceField: 'tbl_contracts.startDate' }
    ],
    conditions: [],
    redactionRules: [],
    tags: ['Standard', 'Low Risk', 'General'],
    content: `<h1>MUTUAL NON-DISCLOSURE AGREEMENT</h1>`
  },
  {
    id: 'tpl_2',
    name: 'Master Services Agreement (US)',
    category: 'MSA',
    version: '4.0',
    lastModified: '2024-03-10',
    status: 'Active',
    variables: [],
    conditions: [],
    redactionRules: [],
    tags: ['US Only', 'Services'],
    content: `<h1>MASTER SERVICES AGREEMENT</h1>`
  }
];

export const INITIAL_STAGES: WorkflowStage[] = [
  { id: 'stg_draft', name: 'Drafting', color: '#94a3b8', order: 0 },
  { id: 'stg_review', name: 'Review', color: '#3b82f6', order: 1 },
  { id: 'stg_approval', name: 'Approval', color: '#eab308', order: 2 },
  { id: 'stg_sign', name: 'Signature', color: '#a855f7', order: 3 },
  { id: 'stg_active', name: 'Active', color: '#22c55e', order: 4 },
];

export const INITIAL_TEMPLATES: WorkflowTemplate[] = [
    {
      id: 'wf_nda',
      name: 'Standard NDA Flow',
      description: 'Basic automated NDA generation with rapid signature routing.',
      category: 'NDA',
      tags: ['Simple', 'Automated'],
      updated: '2024-03-01',
      schema: {
          stages: INITIAL_STAGES,
          nodes: [
             { id: 'n1', category: 'trigger', type: 'manual_request', label: 'NDA Request', x: 100, y: 200, config: { stageId: 'stg_draft' } },
             { id: 'n2', category: 'action', type: 'generate_document', label: 'Generate NDA', x: 400, y: 200, config: { stageId: 'stg_review', templateId: 'tpl_1' } },
             { id: 'n3', category: 'action', type: 'signature', label: 'Send for eSign', x: 700, y: 200, config: { stageId: 'stg_sign', signatureProvider: 'docusign' } },
             { id: 'n4', category: 'action', type: 'slack_notify', label: 'Notify Sales', x: 1000, y: 200, config: { stageId: 'stg_active' } }
          ],
          connections: [
              { id: 'c1', source: 'n1', target: 'n2' },
              { id: 'c2', source: 'n2', target: 'n3' },
              { id: 'c3', source: 'n3', target: 'n4' }
          ]
      }
    }
];

export const MOCK_VERSIONS = [
  { id: 'v3', name: 'Version 1.2', date: 'Today, 10:23 AM', author: 'Harvey Specter' },
  { id: 'v2', name: 'Version 1.1', date: 'Yesterday, 4:45 PM', author: 'Mike Ross' },
  { id: 'v1', name: 'Version 1.0', date: 'Oct 12, 2023', author: 'System Auto-Gen' },
];

// EXPANDED DESCRIPTIONS
export const NODE_DESCRIPTIONS: Record<string, string> = {
  'manual_request': 'Triggers when a user manually initiates a request from the dashboard.',
  'form_submission': 'Triggers when an external intake form (e.g., Vendor Intake) is submitted.',
  'crm_opportunity': 'Triggers when a CRM opportunity matches specific criteria (e.g., "Closed Won").',
  'webhook_in': 'Triggers via an inbound HTTP/API call from another system.',
  'scheduled_run': 'Runs on a recurring schedule (e.g., monthly compliance check).',
  'contract_imported': 'Triggers when a new contract file is uploaded or imported.',
  
  'internal_approval': 'Pauses execution until a specific user, role, or group approves.',
  'parallel_approval': 'Sends approval requests to multiple stakeholders simultaneously.',
  'send_review': 'Sends the document for redlining/review to internal or external parties.',
  
  'condition': 'Branches the workflow based on rules (e.g., Value > $50k).',
  'delay': 'Waits for a specified duration or until a specific date.',
  'split_parallel': 'Splits execution into multiple concurrent paths.',
  
  'generate_document': 'Creates a document from a standard template using available data.',
  'insert_clause': 'Inserts a specific clause into the document based on logic.',
  'redaction': 'Automatically redacts sensitive fields based on viewer role.',
  'upload_version': 'Uploads a new version of the document to the repository.',
  
  'signature': 'Sends the document for electronic signature via DocuSign/Adobe.',
  'wet_ink': 'Marks the contract as signed manually (wet signature) and requests upload.',
  
  'update_salesforce': 'Updates fields on a Salesforce record.',
  'slack_notify': 'Sends a custom message to a Slack channel or user.',
  'send_email': 'Sends an automated email using a template.',
  'webhook_out': 'Sends an outbound webhook payload to an external URL.',
  
  'llm_flow_gen': 'AI Agent: Generates a workflow structure from natural language.',
  'risk_scorer': 'AI Agent: Scores clauses or whole contracts for risk.',
  'obligation_extractor': 'AI Agent: Extracts key dates and obligations from text.',
  'clause_suggestion': 'AI Agent: Suggests alternative language during negotiation.',
  
  'stage_transition': 'Updates the lifecycle stage of the contract (e.g., to "Active").',
};
