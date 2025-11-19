
import { Contract, ContractStatus, Clause, UserRole, IntegrationApp, RiskItem, Counterparty, FieldTable, SyncLog, DocumentTemplate } from '../types';

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

export const MOCK_USERS = [
  { id: 1, name: 'Harvey Specter', role: UserRole.LEGAL, email: 'harvey@agreemetrix.ai' },
  { id: 2, name: 'Mike Ross', role: UserRole.LEGAL, email: 'mike@agreemetrix.ai' },
  { id: 3, name: 'Rachel Zane', role: UserRole.ADMIN, email: 'rachel@agreemetrix.ai' },
  { id: 4, name: 'Sales Team Lead', role: UserRole.SALES, email: 'sales@agreemetrix.ai' },
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
    content: `<h1>MASTER SERVICES AGREEMENT (APAC REGION)</h1><p>Template content pending legal review...</p>`
  }
];
