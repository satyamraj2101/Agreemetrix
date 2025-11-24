
import { 
  Contract, ContractStatus, Clause, UserRole, IntegrationApp, RiskItem, Counterparty, 
  FieldTable, SyncLog, DocumentTemplate, User, Department, RoleDefinition, Permission, 
  UserGroup, Organization, WorkflowStage, WorkflowTemplate, ContractVersion, AuditLogEntry, Obligation
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
    content: `
      <h1 style="text-align: center;">MUTUAL NON-DISCLOSURE AGREEMENT</h1>
      <p>This Mutual Non-Disclosure Agreement (the "Agreement") is made effective as of <span class="variable" data-id="contract.startDate" style="${VAR_STYLE}">{{contract.startDate}}</span> (the "Effective Date"), by and between <strong>Agreemetrix Inc.</strong> ("Party A") and <strong><span class="variable" data-id="counterparty.name" style="${VAR_STYLE}">{{counterparty.name}}</span></strong> ("Party B").</p>
      
      <h2>1. Purpose</h2>
      <p>The parties wish to explore a potential business opportunity of mutual interest (the "Opportunity") and in connection with the Opportunity, each party may disclose to the other certain confidential technical and business information.</p>

      <h2>2. Confidential Information</h2>
      <p>"Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects.</p>

      <h2>3. Obligations</h2>
      <p>Each party agrees to hold the other party's Confidential Information in strict confidence and to take all reasonable precautions to protect such Confidential Information.</p>

      <h2>4. Term</h2>
      <p>This Agreement shall survive for a period of <span class="variable" data-id="contract.terminationNotice" style="${VAR_STYLE}">{{contract.terminationNotice}}</span> years from the Effective Date.</p>

      <p style="margin-top: 40px;">IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.</p>
    `
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
    content: `
      <h1 style="text-align: center;">MASTER SERVICES AGREEMENT</h1>
      <p>This Master Services Agreement is entered into as of <span class="variable" data-id="contract.startDate" style="${VAR_STYLE}">{{contract.startDate}}</span> by and between Agreemetrix Inc. and <span class="variable" data-id="counterparty.name" style="${VAR_STYLE}">{{counterparty.name}}</span>.</p>
      
      <h2>1. Services</h2>
      <p>Provider shall provide the services described in one or more Statements of Work (SOW) executed by the parties.</p>

      <h2>2. Fees and Payment</h2>
      <p>Customer shall pay Provider the fees set forth in each SOW. All fees are due within <span class="variable" data-id="contract.paymentTerms" style="${VAR_STYLE}">{{contract.paymentTerms}}</span> days from the invoice date.</p>

      <h2>3. Term and Termination</h2>
      <p>This Agreement shall commence on the Effective Date and continue until terminated. Either party may terminate for convenience with <span class="variable" data-id="contract.terminationNotice" style="${VAR_STYLE}">{{contract.terminationNotice}}</span> days prior written notice.</p>

      <h2>4. Governing Law</h2>
      <p>This Agreement shall be governed by the laws of <span class="variable" data-id="contract.jurisdiction" style="${VAR_STYLE}">{{contract.jurisdiction}}</span>.</p>
    `
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
    content: `
      <h1 style="text-align: center;">ENTERPRISE MASTER SERVICES AGREEMENT</h1>
      <p>This Agreement is entered into by and between <strong><span class="variable" data-id="counterparty.name" style="${VAR_STYLE}">{{counterparty.name}}</span></strong> and <strong>Agreemetrix Inc.</strong></p>
      
      <h2>1. Services</h2>
      <p>Provider shall provide the SaaS services described in the Order Form.</p>

      <h2>2. Data Protection</h2>
      <p>Standard data protection terms apply as per our Privacy Policy.</p>

      <h2>3. Liability</h2>
      <p>The total liability of either party shall not exceed <span class="variable" data-id="contract.liabilityCap" style="${VAR_STYLE}">{{contract.liabilityCap}}</span> (or two times (2x) the fees paid in the prior 12 months if not specified).</p>

      <h2>4. Service Levels</h2>
      <p>Provider will use commercially reasonable efforts to make the Services available 99.9% of the time.</p>
    `
  },
  {
    id: 'tpl_breach',
    name: 'Notice of Data Breach',
    category: 'Notices',
    version: '1.0',
    lastModified: '2024-01-15',
    status: 'Active',
    variables: [],
    conditions: [],
    redactionRules: [],
    tags: ['Critical', 'Compliance'],
    content: `
      <h1 style="text-align: center; color: #ef4444;">NOTICE OF DATA BREACH</h1>
      <p>Date: <span class="variable" data-id="system.date" style="${VAR_STYLE}">{{system.date}}</span></p>
      <p>To: <span class="variable" data-id="counterparty.name" style="${VAR_STYLE}">{{counterparty.name}}</span></p>
      <p><strong>Re: Notification of Security Incident</strong></p>
      
      <p>We are writing to inform you of a recent security incident that may have affected your data.</p>
      
      <h2>What Happened?</h2>
      <p>On [Date], we detected unauthorized access to...</p>

      <h2>What Information Was Involved?</h2>
      <p>The information involved in this incident includes...</p>

      <h2>What We Are Doing</h2>
      <p>We have taken immediate steps to secure our systems and have engaged forensic experts...</p>
    `
  },
  {
    id: 'tpl_renewal_upsell',
    name: 'Renewal + Upsell Letter',
    category: 'Sales',
    version: '1.2',
    lastModified: '2024-02-20',
    status: 'Active',
    variables: [],
    conditions: [],
    redactionRules: [],
    tags: ['Revenue', 'Automated'],
    content: `
      <h1 style="text-align: center;">RENEWAL NOTICE</h1>
      <p>Dear <span class="variable" data-id="counterparty.primaryContactName" style="${VAR_STYLE}">{{counterparty.primaryContactName}}</span>,</p>
      
      <p>Your subscription for <span class="variable" data-id="intake.projectName" style="${VAR_STYLE}">{{intake.projectName}}</span> is set to renew on <strong><span class="variable" data-id="contract.renewalDate" style="${VAR_STYLE}">{{contract.renewalDate}}</span></strong>.</p>
      
      <p>We noticed your utilization is currently at <strong><span class="variable" data-id="contract.utilization" style="${VAR_STYLE}">{{contract.utilization}}</span>%</strong>. Based on this, we recommend upgrading to our Enterprise Tier to avoid overage charges.</p>
      
      <p>Please find the renewal quote attached.</p>
      
      <p>Sincerely,<br/>The Agreemetrix Team</p>
    `
  },
  {
    id: 'tpl_royalty_stmt',
    name: 'Monthly Royalty Statement',
    category: 'Finance',
    version: '1.0',
    lastModified: '2023-11-30',
    status: 'Active',
    variables: [],
    conditions: [],
    redactionRules: [],
    tags: ['Finance', 'Generated'],
    content: `
      <h1 style="text-align: center;">ROYALTY STATEMENT</h1>
      <p><strong>Period:</strong> [Month, Year]</p>
      <p><strong>Licensor:</strong> <span class="variable" data-id="counterparty.name" style="${VAR_STYLE}">{{counterparty.name}}</span></p>
      
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Product</th>
                <th style="padding: 8px;">Units Sold</th>
                <th style="padding: 8px;">Net Sales</th>
                <th style="padding: 8px;">Royalty Rate</th>
                <th style="padding: 8px;">Royalty Due</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 8px;">Software License A</td>
                <td style="padding: 8px;">1,200</td>
                <td style="padding: 8px;">$120,000</td>
                <td style="padding: 8px;">5%</td>
                <td style="padding: 8px;">$6,000</td>
            </tr>
        </tbody>
      </table>
      
      <p style="margin-top: 20px;"><strong>Total Royalty Due:</strong> $6,000</p>
    `
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
             // STAGE: DRAFTING & INTAKE
             { id: 'n1', category: 'trigger', type: 'form_submission', label: 'Global Procurement Intake', x: 100, y: 300, config: { formId: 'form_vendor', stageId: 'stg_draft' } },
             { id: 'n2', category: 'ai_agent', type: 'risk_scorer', label: 'AI Vendor Tiering', x: 400, y: 300, config: { aiModel: 'gpt-4o', description: 'Categorize vendor strategic importance' } },
             
             // STAGE: REVIEW (PARALLEL)
             { id: 'n3', category: 'utility', type: 'split_parallel', label: 'Dept. Routing', x: 700, y: 300, config: { splitType: 'fanout' } },
             
             // Branch: IT
             { id: 'n4', category: 'condition', type: 'condition', label: 'Is Software/SaaS?', x: 1000, y: 100, config: { rules: [{id:'r_sw', field:'intake.softwareType', operator:'is_not_empty', value:'', logic:'AND'}] } },
             { id: 'n5', category: 'approval', type: 'internal_approval', label: 'InfoSec Review', x: 1300, y: 50, config: { approverType: 'role', approverId: 'role_ciso' } },
             { id: 'n6', category: 'approval', type: 'internal_approval', label: 'Arch. Board', x: 1600, y: 50, config: { approverType: 'group', approverId: 'g_arch' } },
             
             // Branch: Marketing
             { id: 'n7', category: 'condition', type: 'condition', label: 'Is Marketing?', x: 1000, y: 300, config: { rules: [{id:'r_mkt', field:'intake.businessUnit', operator:'equals', value:'Marketing', logic:'AND'}] } },
             { id: 'n8', category: 'approval', type: 'internal_approval', label: 'Brand Compliance', x: 1300, y: 300, config: { approverType: 'user', approverId: 'u_brand_lead' } },

             // Branch: HR
             { id: 'n9', category: 'condition', type: 'condition', label: 'Is HR/Services?', x: 1000, y: 500, config: { rules: [{id:'r_hr', field:'intake.businessUnit', operator:'equals', value:'HR', logic:'AND'}] } },
             { id: 'n10', category: 'approval', type: 'internal_approval', label: 'Data Privacy (PII)', x: 1300, y: 500, config: { approverType: 'role', approverId: 'role_dpo' } },

             // JOIN
             { id: 'n11', category: 'utility', type: 'split_parallel', label: 'Consolidate Reviews', x: 1900, y: 300, config: { joinType: 'all' } }, // Visually representing join

             // STAGE: NEGOTIATION & DOC GEN
             { id: 'n12', category: 'document', type: 'generate_document', label: 'Generate MSA/SOW', x: 2200, y: 300, config: { templateId: 'tpl_complex_msa', stageId: 'stg_negotiation' } },
             { id: 'n13', category: 'action', type: 'send_review', label: 'Vendor Negotiation', x: 2500, y: 300, config: {} },
             { id: 'n14', category: 'trigger', type: 'contract_imported', label: 'Redline Received', x: 2800, y: 300, config: { autoTag: true } },
             { id: 'n15', category: 'ai_agent', type: 'clause_suggestion', label: 'AI Redline Analysis', x: 3100, y: 300, config: {} },
             { id: 'n16', category: 'approval', type: 'internal_approval', label: 'Legal Final Review', x: 3400, y: 300, config: { approverType: 'role', approverId: 'role_legal' } },

             // STAGE: APPROVAL (TIERED FINANCIAL)
             { id: 'n17', category: 'condition', type: 'condition', label: 'Value > $100k?', x: 3700, y: 300, config: { rules: [{id:'r_val1', field:'contract.value', operator:'greater_than', value:100000, logic:'AND'}] } },
             { id: 'n18', category: 'approval', type: 'internal_approval', label: 'Finance Director', x: 4000, y: 200, config: { approverType: 'role', approverId: 'role_finance' } },
             { id: 'n19', category: 'condition', type: 'condition', label: 'Value > $500k?', x: 4300, y: 200, config: { rules: [{id:'r_val2', field:'contract.value', operator:'greater_than', value:500000, logic:'AND'}] } },
             { id: 'n20', category: 'approval', type: 'internal_approval', label: 'CFO Approval', x: 4600, y: 100, config: { approverType: 'user', approverId: 'u_cfo' } },
             
             // STAGE: SIGNATURE
             { id: 'n21', category: 'action', type: 'signature', label: 'DocuSign Envelope', x: 4900, y: 300, config: { signatureProvider: 'docusign', stageId: 'stg_sign' } },

             // STAGE: ACTIVE / INTEGRATION
             { id: 'n22', category: 'integration', type: 'update_salesforce', label: 'Sync SAP (PO)', x: 5200, y: 300, config: { targetObject: 'PurchaseOrder' } },
             { id: 'n23', category: 'action', type: 'slack_notify', label: 'Notify Stakeholders', x: 5500, y: 300, config: { slackChannel: '#procurement-alerts', stageId: 'stg_active' } },
             { id: 'n24', category: 'integration', type: 'webhook_out', label: 'Jira Provisioning', x: 5500, y: 450, config: { method: 'POST' } },
             { id: 'n25', category: 'utility', type: 'delay', label: '30 Day Check', x: 5800, y: 300, config: { delayDuration: 30, delayUnit: 'days' } },
             { id: 'n26', category: 'action', type: 'send_email', label: 'Satisfaction Survey', x: 6100, y: 300, config: {} }
          ],
          connections: [
              { id: 'c1', source: 'n1', target: 'n2' },
              { id: 'c2', source: 'n2', target: 'n3' },
              
              // Split
              { id: 'c3', source: 'n3', target: 'n4' },
              { id: 'c4', source: 'n3', target: 'n7' },
              { id: 'c5', source: 'n3', target: 'n9' },

              // IT Path
              { id: 'c6', source: 'n4', target: 'n5', handleId: 'true_out', label: 'Yes' },
              { id: 'c7', source: 'n5', target: 'n6' },
              { id: 'c8', source: 'n6', target: 'n11' },
              { id: 'c9', source: 'n4', target: 'n11', handleId: 'false_out' }, // Bypass

              // Marketing Path
              { id: 'c10', source: 'n7', target: 'n8', handleId: 'true_out', label: 'Yes' },
              { id: 'c11', source: 'n8', target: 'n11' },
              { id: 'c12', source: 'n7', target: 'n11', handleId: 'false_out' }, // Bypass

              // HR Path
              { id: 'c13', source: 'n9', target: 'n10', handleId: 'true_out', label: 'Yes' },
              { id: 'c14', source: 'n10', target: 'n11' },
              { id: 'c15', source: 'n9', target: 'n11', handleId: 'false_out' }, // Bypass

              // Consolidate to Gen
              { id: 'c16', source: 'n11', target: 'n12' },
              { id: 'c17', source: 'n12', target: 'n13' },
              { id: 'c18', source: 'n13', target: 'n14' },
              { id: 'c19', source: 'n14', target: 'n15' },
              { id: 'c20', source: 'n15', target: 'n16' },
              
              // Financial Approval Chain
              { id: 'c21', source: 'n16', target: 'n17' },
              { id: 'c22', source: 'n17', target: 'n18', handleId: 'true_out', label: '>100k' },
              { id: 'c23', source: 'n17', target: 'n21', handleId: 'false_out' }, // Skip to sign
              { id: 'c24', source: 'n18', target: 'n19' },
              { id: 'c25', source: 'n19', target: 'n20', handleId: 'true_out', label: '>500k' },
              { id: 'c26', source: 'n19', target: 'n21', handleId: 'false_out' }, // Skip to sign
              { id: 'c27', source: 'n20', target: 'n21' },

              // Post-Sign
              { id: 'c28', source: 'n21', target: 'n22' },
              { id: 'c29', source: 'n22', target: 'n23' },
              { id: 'c30', source: 'n22', target: 'n24' },
              { id: 'c31', source: 'n23', target: 'n25' },
              { id: 'c32', source: 'n25', target: 'n26' }
          ]
      }
    },
    {
      id: 'wf_ai_vendor_onboarding',
      name: 'AI-Powered Vendor Onboarding',
      description: 'Automated risk scoring, parallel compliance checks, and ERP provisioning.',
      category: 'Procurement',
      tags: ['AI-Native', 'High Risk', 'Compliance'],
      updated: '2024-04-10',
      status: 'Published',
      schema: {
          stages: INITIAL_STAGES,
          nodes: [
             { id: 'n1', category: 'trigger', type: 'form_submission', label: 'Vendor Intake Form', x: 100, y: 300, config: { formId: 'form_vendor', stageId: 'stg_draft' } },
             { id: 'n2', category: 'ai_agent', type: 'risk_scorer', label: 'AI Risk Analysis', x: 400, y: 300, config: { aiModel: 'gpt-4o', riskThreshold: 75 } },
             { id: 'n3', category: 'condition', type: 'condition', label: 'Security Check', x: 700, y: 300, config: { rules: [{id:'r1', field:'counterparty.securityScore', operator:'less_than', value:70, logic:'AND'}] } },
             { id: 'n4', category: 'utility', type: 'split_parallel', label: 'Parallel Review', x: 1000, y: 200, config: { splitType: 'fanout' } },
             { id: 'n5', category: 'approval', type: 'internal_approval', label: 'InfoSec Review', x: 1300, y: 100, config: { approverType: 'role', approverId: 'role_ciso' } },
             { id: 'n6', category: 'approval', type: 'internal_approval', label: 'Legal Review', x: 1300, y: 300, config: { approverType: 'role', approverId: 'role_legal' } },
             { id: 'n7', category: 'document', type: 'generate_document', label: 'Generate MSA', x: 1600, y: 300, config: { templateId: 'tpl_complex_msa', stageId: 'stg_negotiation' } },
             { id: 'n8', category: 'action', type: 'signature', label: 'DocuSign', x: 1900, y: 300, config: { signatureProvider: 'docusign', stageId: 'stg_sign' } },
             { id: 'n9', category: 'integration', type: 'update_salesforce', label: 'Provision ERP', x: 2200, y: 300, config: { targetObject: 'Account', stageId: 'stg_active' } }
          ],
          connections: [
              { id: 'c1', source: 'n1', target: 'n2' },
              { id: 'c2', source: 'n2', target: 'n3' },
              { id: 'c3', source: 'n3', target: 'n4', handleId: 'true_out', label: 'Low Score' },
              { id: 'c4', source: 'n3', target: 'n7', handleId: 'false_out', label: 'Pass' },
              { id: 'c5', source: 'n4', target: 'n5' },
              { id: 'c6', source: 'n4', target: 'n6' },
              { id: 'c7', source: 'n5', target: 'n7' },
              { id: 'c8', source: 'n6', target: 'n7' },
              { id: 'c9', source: 'n7', target: 'n8' },
              { id: 'c10', source: 'n8', target: 'n9' }
          ]
      }
    },
    // ... (Other workflows remain unchanged for brevity but are part of the mock)
];

export const NODE_DESCRIPTIONS: Record<string, string> = {
  'manual_request': 'Triggers when a user manually initiates a request from the dashboard.',
  'form_submission': 'Triggers when an external intake form (e.g., Vendor Intake) is submitted.',
  // ... (rest of descriptions)
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
  {
    id: 'c2',
    user: 'Jessica Pearson',
    text: 'Is this jurisdiction correct for EU clients?',
    date: '1d ago',
    resolved: true,
    replies: []
  }
];

export const MOCK_CHANGES = [
  { id: 'tc1', type: 'delete', user: 'Mike Ross', date: '2h ago', content: 'perpetual', status: 'pending' },
  { id: 'tc2', type: 'insert', user: 'Mike Ross', date: '2h ago', content: 'three (3) year', status: 'pending' },
  { id: 'tc3', type: 'insert', user: 'Harvey Specter', date: '30m ago', content: 'Subject to Section 5.2...', status: 'accepted' }
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
  // New variables
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
  },
  // New Contracts using the Complex Workflow
  {
    id: 'CTR-2024-050',
    title: 'Global AWS Infrastructure 2024',
    counterparty: 'Amazon Web Services',
    value: 2500000,
    status: ContractStatus.APPROVAL,
    startDate: '2024-06-01',
    renewalDate: '2027-06-01',
    riskScore: 20,
    owner: 'Benjamin',
    type: 'Infrastructure',
    versions: [],
    auditLog: [],
    obligations: []
  },
  {
    id: 'CTR-2024-051',
    title: 'Salesforce Seat Expansion Q3',
    counterparty: 'Salesforce Inc',
    value: 450000,
    status: ContractStatus.REVIEW,
    startDate: '2024-07-01',
    renewalDate: '2025-07-01',
    riskScore: 15,
    owner: 'Louis Litt',
    type: 'SaaS',
    versions: [],
    auditLog: [],
    obligations: []
  },
  {
    id: 'CTR-2024-052',
    title: 'Q4 Marketing Campaign - Agency',
    counterparty: 'Ogilvy',
    value: 85000,
    status: ContractStatus.DRAFT,
    startDate: '2024-09-01',
    renewalDate: '2024-12-31',
    riskScore: 45,
    owner: 'Donna Paulsen',
    type: 'Services',
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
  },
  // ... (rest of parties)
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
  },
  // ... (rest of integrations)
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
