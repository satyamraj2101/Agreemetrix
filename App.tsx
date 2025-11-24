
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
import WorkflowManager from './pages/WorkflowManager';
import WorkflowSettings from './pages/WorkflowSettings';
import ManualWorkflowEditor from './pages/ManualWorkflowEditor';
import Repository from './pages/Repository';
import ContractViewer from './pages/ContractViewer';
import Integrations from './pages/Integrations';
import ClauseLibrary from './pages/ClauseLibrary';
import Parties from './pages/Parties';
import RiskDashboard from './pages/RiskDashboard';
import Settings from './pages/Settings';
import Masters from './pages/Masters';
import FieldDatabase from './pages/FieldDatabase';
import DocumentTemplates from './pages/DocumentTemplates';
import BusinessIntelligence from './pages/BusinessIntelligence';
import LegacyMigration from './pages/LegacyMigration';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import ContractCreationWizard from './pages/ContractCreationWizard'; // New Import

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />

        {/* Protected App Routes */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/bi" element={<BusinessIntelligence />} />
          
          {/* Workflow Routes */}
          <Route path="/workflows/manage" element={<WorkflowManager />} />
          <Route path="/workflow-ai" element={<WorkflowBuilder />} />
          <Route path="/workflow-ai/:id" element={<WorkflowBuilder />} /> {/* Parameterized Route */}
          <Route path="/workflows/manual" element={<ManualWorkflowEditor />} />
          <Route path="/workflows/manual/:id" element={<ManualWorkflowEditor />} />
          <Route path="/workflows/settings" element={<WorkflowSettings />} />

          <Route path="/templates" element={<DocumentTemplates />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/fields" element={<FieldDatabase />} />
          <Route path="/contract/new" element={<ContractCreationWizard />} /> {/* New Route */}
          <Route path="/contract/:id" element={<ContractViewer />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/legacy-migration" element={<LegacyMigration />} />
          <Route path="/clauses" element={<ClauseLibrary />} />
          <Route path="/parties" element={<Parties />} />
          <Route path="/risks" element={<RiskDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/masters" element={<Masters />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
