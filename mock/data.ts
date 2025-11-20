
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
  { id: '1', name: 'Acme Corporation', type: 'Customer', region: 'North America', riskScore: 12, activeContracts: 3, totalValue: 450000 },
  { id: '2', name: 'TechFlow Inc.', type: 'Vendor', region: 'Europe', riskScore: 45, activeContracts: 1, totalValue: 45000 },
  { id: '3', name: 'Global Logistics Partners', type: 'Partner', region: 'APAC', riskScore: 78, activeContracts: 2, totalValue: 0 },
  { id: '4', name: 'Stratos Consulting', type: 'Vendor', region: 'North America', riskScore: 15, activeContracts: 1, totalValue: 250000 },
  { id: '5', name: 'Office Supplies Co', type: 'Vendor', region: 'North America', riskScore: 5, activeContracts: 5, totalValue: 60000 },
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
      { id: 'm3', externalField: 'Account.Region', internalVariable: 'system.region', direction: 'import', dataType: 'string', active: true },
      { id: 'm4', externalField: 'CloseDate', internalVariable: 'contract.startDate', direction: 'import', dataType: 'date', active: true },
    ]
  },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Get notifications for approvals and tasks.', icon: 'SL', installed: true, status: 'active', mappings: [] },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Sync deals and company records.', icon: 'HS', installed: false },
  { id: 'jira', name: 'Jira', category: 'ERP', description: 'Create tickets from legal requests.', icon: 'JR', installed: true, status: 'syncing', mappings: [] },
  { id: 'docusign', name: 'DocuSign', category: 'Signature', description: 'Send documents for e-signature.', icon: 'DS', installed: true, status: 'active', mappings: [] },
  { id: 'sap', name: 'SAP Ariba', category: 'ERP', description: 'Enterprise procurement integration.', icon: 'SAP', installed: false },
  { id: 'drive', name: 'Google Drive', category: 'Storage', description: 'Backup signed contracts to Drive.', icon: 'GD', installed: false },
  { id: 'onedrive', name: 'OneDrive', category: 'Storage', description: 'Backup signed contracts to OneDrive.', icon: 'OD', installed: false },
];

export const MOCK_RISKS: RiskItem[] = [
  { id: 'R-001', contractId: 'CTR-2024-001', description: 'Missing Liability Cap', severity: 'High', status: 'Open', dueDate: '2024-03-15' },
  { id: 'R-002', contractId: 'CTR-2024-004', description: 'Non-Standard Payment Terms', severity: 'Medium', status: 'Open', dueDate: '2024-03-20' },
  { id: 'R-003', contractId: 'CTR-2024-002', description: 'GDPR Compliance Check', severity: 'Critical', status: 'Mitigated', dueDate: '2024-02-28' },
  { id: 'R-004', contractId: 'CTR-2024-003', description: 'Auto-Renewal Clause Active', severity: 'Low', status: 'Accepted', dueDate: '2025-05-20' },
];

export const MOCK_TABLES: FieldTable[] = [
  {
    id: 'tbl_contracts',
    name: 'Contracts',
    description: 'Core contract metadata and properties.',
    icon: 'FileText',
    fields: [
      { id: 'f1', name: 'Contract Title', key: 'title', type: 'text', source: 'system', required: true },
      { id: 'f2', name: 'Total Value', key: 'value', type: 'currency', source: 'integration', integrationAppId: 'sf', externalField: 'Amount', required: true },
      { id: 'f3', name: 'Start Date', key: 'startDate', type: 'date', source: 'system', required: true },
      { id: 'f4', name: 'Counterparty', key: 'counterparty_id', type: 'relationship', source: 'system', relatedTableId: 'tbl_counterparties', required: true },
    ]
  },
  {
    id: 'tbl_counterparties',
    name: 'Counterparties',
    description: 'Vendors, Customers, and Partners.',
    icon: 'Users',
    fields: [
      { id: 'f5', name: 'Company Name', key: 'name', type: 'text', source: 'system', required: true },
      { id: 'f6', name: 'Region', key: 'region', type: 'select', source: 'integration', integrationAppId: 'sf', externalField: 'BillingCountry', required: false },
      { id: 'f7', name: 'Tax ID', key: 'tax_id', type: 'text', source: 'custom', required: false },
    ]
  },
  {
    id: 'tbl_opportunities',
    name: 'Opportunities',
    description: 'Synced from CRM.',
    icon: 'Briefcase',
    fields: [
      { id: 'f8', name: 'Opp Name', key: 'opp_name', type: 'text', source: 'integration', integrationAppId: 'sf', externalField: 'Name', required: true },
      { id: 'f9', name: 'Stage', key: 'stage', type: 'select', source: 'integration', integrationAppId: 'sf', externalField: 'StageName', required: true },
    ]
  }
];

export const MOCK_SYNC_LOGS: SyncLog[] = [
  { id: 'log-1', timestamp: '2024-03-10 14:30:00', integrationId: 'sf', direction: 'Inbound', status: 'Success', records: 45, message: 'Synced Opportunities' },
  { id: 'log-2', timestamp: '2024-03-10 14:35:00', integrationId: 'sf', direction: 'Outbound', status: 'Success', records: 12, message: 'Updated Contract Status' },
  { id: 'log-3', timestamp: '2024-03-10 15:00:00', integrationId: 'jira', direction: 'Outbound', status: 'Warning', records: 1, message: 'Timeout on ticket creation' },
  { id: 'log-4', timestamp: '2024-03-10 15:15:00', integrationId: 'sf', direction: 'Inbound', status: 'Success', records: 2, message: 'New Accounts synced' },
  { id: 'log-5', timestamp: '2024-03-10 16:00:00', integrationId: 'sf', direction: 'Inbound', status: 'Failed', records: 0, message: 'API Token Invalid' },
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
    conditions: [
      { id: 'c1', name: 'EU Jurisdiction', condition: 'Region == "EU"', content: 'This Agreement shall be governed by the laws of Ireland.' }
    ],
    redactionRules: [],
    tags: ['Standard', 'Low Risk', 'General'],
    content: `<h1>MUTUAL NON-DISCLOSURE AGREEMENT</h1>
<p>This Mutual Non-Disclosure Agreement (the "Agreement") is made effective as of <span class="variable">{{Effective Date}}</span>, by and between Agreemetrix Inc. and <span class="variable">{{Counterparty Name}}</span>.</p>
<p>The parties intend to engage in discussions regarding a potential business relationship...</p>
<h3>1. Confidential Information</h3>
<p>Confidential information shall include...</p>`
  },
  {
    id: 'tpl_2',
    name: 'Master Services Agreement (US)',
    category: 'MSA',
    version: '4.0',
    lastModified: '2024-03-10',
    status: 'Active',
    variables: [
       { id: 'v3', name: 'Contract Value', sourceField: 'tbl_contracts.value' }
    ],
    conditions: [
      { id: 'c2', name: 'High Value', condition: 'Value > 100000', content: '<b>Insurance:</b> Vendor shall maintain liability insurance of at least $2M.' }
    ],
    redactionRules: [
      { id: 'r1', role: UserRole.SALES, description: 'Hide Employee Hourly Rates' }
    ],
    tags: ['US Only', 'Services', 'Finance'],
    content: `<h1>MASTER SERVICES AGREEMENT</h1>
<p>This MSA is entered into...</p>
<h3>4. Fees and Payment</h3>
<p>Client shall pay Vendor the fees set forth in the SOW...</p>
<div class="redaction-target">
   <p><b>Hourly Rates:</b><br/>Senior Engineer: $250/hr<br/>Junior Engineer: $150/hr</p>
</div>`
  },
  {
    id: 'tpl_3',
    name: 'Master Services Agreement (APAC)',
    category: 'MSA',
    version: '1.2',
    lastModified: '2024-02-20',
    status: 'Draft',
    variables: [],
    conditions: [],
    redactionRules: [],
    tags: ['APAC', 'Draft', 'Review Pending'],
    content: `<h1>MASTER SERVICES AGREEMENT (APAC REGION)</h1><p>Template content pending legal review...</p>`
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
    },
    {
        id: 'wf_msa',
        name: 'High-Value MSA Approval',
        description: 'Includes logic gates for contract value and multi-departmental review.',
        category: 'MSA',
        tags: ['Complex', 'Approval Chain'],
        updated: '2024-02-15',
        schema: {
            stages: INITIAL_STAGES,
            nodes: [
                { id: 'n1', category: 'trigger', type: 'crm_opportunity', label: 'Opp Won (SFDC)', x: 50, y: 300, config: { stageId: 'stg_draft' } },
                { id: 'n2', category: 'condition', type: 'condition', label: 'Value > $50k?', x: 350, y: 300, config: { rules: [{id: 'r1', field: 'contract_value', operator: 'greater_than', value: '50000', logic: 'AND'}] } },
                // True Path
                { id: 'n3', category: 'approval', type: 'internal_approval', label: 'Finance Review', x: 650, y: 200, config: { stageId: 'stg_approval', approverType: 'role', approverId: 'Finance' } },
                { id: 'n4', category: 'approval', type: 'internal_approval', label: 'Legal Review', x: 950, y: 200, config: { stageId: 'stg_approval', approverType: 'role', approverId: 'Legal' } },
                // False Path
                { id: 'n5', category: 'action', type: 'generate_document', label: 'Auto-Generate MSA', x: 650, y: 450, config: { stageId: 'stg_review', templateId: 'tpl_2' } },
                
                { id: 'n6', category: 'action', type: 'signature', label: 'Execute Contract', x: 1250, y: 325, config: { stageId: 'stg_sign' } }
            ],
            connections: [
                { id: 'c1', source: 'n1', target: 'n2' },
                { id: 'c2', source: 'n2', target: 'n3', label: 'True', handleId: 'true_out' },
                { id: 'c3', source: 'n2', target: 'n5', label: 'False', handleId: 'false_out' },
                { id: 'c4', source: 'n3', target: 'n4' },
                { id: 'c5', source: 'n4', target: 'n6' },
                { id: 'c6', source: 'n5', target: 'n6' }
            ]
        }
    },
    {
        id: 'wf_vendor',
        name: 'Vendor Onboarding',
        description: 'Streamlined intake for new suppliers with compliance checks.',
        category: 'Vendor',
        tags: ['Procurement', 'Compliance'],
        updated: '2024-03-10',
        schema: {
            stages: INITIAL_STAGES,
            nodes: [
                { id: 'n1', category: 'trigger', type: 'form_submission', label: 'Vendor Portal', x: 100, y: 250, config: { stageId: 'stg_draft' } },
                { id: 'n2', category: 'integration', type: 'webhook_out', label: 'Risk Scan API', x: 400, y: 250, config: { endpoint: 'https://api.riskcheck.com/scan' } },
                { id: 'n3', category: 'condition', type: 'condition', label: 'Risk Score < 50?', x: 700, y: 250, config: { rules: [{id: 'r1', field: 'risk_score', operator: 'less_than', value: '50', logic: 'AND'}] } },
                { id: 'n4', category: 'action', type: 'generate_document', label: 'Standard Agreement', x: 1000, y: 150, config: { stageId: 'stg_sign', templateId: 'tpl_1' } },
                { id: 'n5', category: 'action', type: 'email', label: 'Reject Vendor', x: 1000, y: 350, config: { stageId: 'stg_active', emailSubject: 'Application Status' } }
            ],
            connections: [
                { id: 'c1', source: 'n1', target: 'n2' },
                { id: 'c2', source: 'n2', target: 'n3' },
                { id: 'c3', source: 'n3', target: 'n4', label: 'True', handleId: 'true_out' },
                { id: 'c4', source: 'n3', target: 'n5', label: 'False', handleId: 'false_out' }
            ]
        }
    }
];