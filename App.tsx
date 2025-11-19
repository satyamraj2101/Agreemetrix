
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bi" element={<BusinessIntelligence />} />
          <Route path="/workflow-ai" element={<WorkflowBuilder />} />
          <Route path="/templates" element={<DocumentTemplates />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/fields" element={<FieldDatabase />} />
          <Route path="/contract/:id" element={<ContractViewer />} />
          <Route path="/integrations" element={<Integrations />} />
          
          {/* New Fully Implemented Modules */}
          <Route path="/clauses" element={<ClauseLibrary />} />
          <Route path="/parties" element={<Parties />} />
          <Route path="/risks" element={<RiskDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/masters" element={<Masters />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
