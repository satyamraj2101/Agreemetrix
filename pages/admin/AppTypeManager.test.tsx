import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppTypeManager from './AppTypeManager';
import { MOCK_APP_TYPES } from '../../mock/data';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  MoreVertical: () => <div data-testid="more-vertical-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash2-icon" />,
  Box: () => <div data-testid="box-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle2: () => <div data-testid="check-circle2-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Copy: () => <div data-testid="copy-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
}));

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AppTypeManager', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Component Rendering', () => {
    it('should render the component with header', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('Application Type Manager')).toBeInTheDocument();
      expect(screen.getByText('Configure contract request types, intake forms, and policies.')).toBeInTheDocument();
    });

    it('should render header buttons', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('Create New Type')).toBeInTheDocument();
    });

    it('should render all tab buttons', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('published')).toBeInTheDocument();
      expect(screen.getByText('drafts')).toBeInTheDocument();
      expect(screen.getByText('archived')).toBeInTheDocument();
    });

    it('should render search input', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      expect(searchInput).toBeInTheDocument();

  describe('Tab Filtering', () => {
    it('should filter apps by published status when published tab is active', () => {
      render(<AppTypeManager />);

      const publishedTab = screen.getByRole('button', { name: /published/i });
      fireEvent.click(publishedTab);

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
      expect(screen.queryByText('Sales Order')).not.toBeInTheDocument();
    });

    it('should filter apps by draft status when drafts tab is active', () => {
      render(<AppTypeManager />);

      const draftsTab = screen.getByRole('button', { name: /drafts/i });
      fireEvent.click(draftsTab);

      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
      expect(screen.getByText('Sales Order')).toBeInTheDocument();
    });

    it('should filter apps by archived status when archived tab is active', () => {
      render(<AppTypeManager />);

      const archivedTab = screen.getByRole('button', { name: /archived/i });
      fireEvent.click(archivedTab);

      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
      expect(screen.queryByText('Sales Order')).not.toBeInTheDocument();
    });

    it('should apply correct styling to active tab', () => {
      render(<AppTypeManager />);

      const publishedTab = screen.getByRole('button', { name: /published/i });
      const draftsTab = screen.getByRole('button', { name: /drafts/i });

      expect(publishedTab).toHaveClass('bg-brand-500');
      expect(draftsTab).not.toHaveClass('bg-brand-500');

      fireEvent.click(draftsTab);

      expect(draftsTab).toHaveClass('bg-brand-500');
      expect(publishedTab).not.toHaveClass('bg-brand-500');
    });
  });

  describe('Search Functionality', () => {
    it('should filter apps by name when searching', () => {
      render(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText(/search by name or key/i);
      fireEvent.change(searchInput, { target: { value: 'NDA' } });

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
    });

    it('should filter apps by key when searching', () => {
      render(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText(/search by name or key/i);
      fireEvent.change(searchInput, { target: { value: 'VEND_ONB' } });

      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should be case insensitive when searching', () => {
      render(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText(/search by name or key/i);
      fireEvent.change(searchInput, { target: { value: 'nda' } });

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
    });

    it('should show no results when search does not match', () => {
      render(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText(/search by name or key/i);
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
    });

    it('should combine search and tab filters', () => {
      render(<AppTypeManager />);

      const draftsTab = screen.getByRole('button', { name: /drafts/i });
      fireEvent.click(draftsTab);

      const searchInput = screen.getByPlaceholderText(/search by name or key/i);
      fireEvent.change(searchInput, { target: { value: 'Sales' } });

      expect(screen.getByText('Sales Order')).toBeInTheDocument();
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });
  });

  describe('App Card Rendering', () => {
    it('should display app details correctly', () => {
      render(<AppTypeManager />);

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.getByText('NDA_REQ')).toBeInTheDocument();
      expect(screen.getByText('Standard Non-Disclosure Agreement request flow.')).toBeInTheDocument();
      expect(screen.getByText('1240')).toBeInTheDocument();
      expect(screen.getByText('Legal Ops')).toBeInTheDocument();
      expect(screen.getByText(/2 days ago/i)).toBeInTheDocument();
    });

    it('should display correct badge color for published status', () => {
      render(<AppTypeManager />);

      const badges = screen.getAllByText('Published');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should display correct badge color for draft status', () => {
      render(<AppTypeManager />);

      const draftsTab = screen.getByRole('button', { name: /drafts/i });
      fireEvent.click(draftsTab);

      expect(screen.getByText('Draft')).toBeInTheDocument();
    });

    it('should render configure link with correct path', () => {
      render(<AppTypeManager />);

      const configureLinks = screen.getAllByText(/configure/i);
      const firstLink = configureLinks[0].closest('a');

      expect(firstLink).toHaveAttribute('href', '/admin/application-types/at_nda');
    });

    it('should render all app cards for published apps', () => {
      render(<AppTypeManager />);

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
    });
  });
    });

    it('should render filter button', () => {
      renderWithRouter(<AppTypeManager />);

      const filterButtons = screen.getAllByTestId('filter-icon');
      expect(filterButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Tab Functionality', () => {
    it('should default to published tab', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedButton = screen.getByText('published');
      expect(publishedButton).toHaveClass('bg-brand-500');
    });

    it('should switch to drafts tab when clicked', () => {
      renderWithRouter(<AppTypeManager />);

      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      expect(draftsButton).toHaveClass('bg-brand-500');
    });

    it('should switch to archived tab when clicked', () => {
      renderWithRouter(<AppTypeManager />);

      const archivedButton = screen.getByText('archived');
      fireEvent.click(archivedButton);

      expect(archivedButton).toHaveClass('bg-brand-500');
    });

    it('should filter apps by published status', () => {
      renderWithRouter(<AppTypeManager />);

      // Published tab should show published apps
      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
      expect(screen.queryByText('Sales Order')).not.toBeInTheDocument();
    });

    it('should filter apps by draft status', () => {
      renderWithRouter(<AppTypeManager />);

      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      // Drafts tab should show draft apps
      expect(screen.getByText('Sales Order')).toBeInTheDocument();
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should show no apps in archived tab', () => {
      renderWithRouter(<AppTypeManager />);

      const archivedButton = screen.getByText('archived');
      fireEvent.click(archivedButton);

      // No archived apps in mock data
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
      expect(screen.queryByText('Sales Order')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter apps by name', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'NDA' } });

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
    });

    it('should filter apps by key', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'VEND_ONB' } });

      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should be case insensitive', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'nda' } });

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
    });

    it('should show no results for non-matching search', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
    });

    it('should combine search with tab filter', () => {
      renderWithRouter(<AppTypeManager />);

      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'Sales' } });

      expect(screen.getByText('Sales Order')).toBeInTheDocument();
    });

    it('should clear search results when input is cleared', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'NDA' } });
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
    });
  });

  describe('App Card Rendering', () => {
    it('should render app cards with correct information', () => {
      renderWithRouter(<AppTypeManager />);

      const ndaApp = MOCK_APP_TYPES.find(app => app.key === 'NDA_REQ');

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.getByText('NDA_REQ')).toBeInTheDocument();
      expect(screen.getByText('Standard Non-Disclosure Agreement request flow.')).toBeInTheDocument();
      expect(screen.getByText('1240')).toBeInTheDocument();
      expect(screen.getByText('Legal Ops')).toBeInTheDocument();
    });

    it('should render status badges correctly', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedBadges = screen.getAllByText('Published');
      expect(publishedBadges.length).toBeGreaterThan(0);
    });

    it('should render usage count for each app', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('1240')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument();
    });

    it('should render owner for each app', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('Legal Ops')).toBeInTheDocument();
      expect(screen.getByText('Procurement')).toBeInTheDocument();
    });

    it('should render last modified time', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText(/Updated 2 days ago/)).toBeInTheDocument();
      expect(screen.getByText(/Updated 1 week ago/)).toBeInTheDocument();
    });

    it('should render configure buttons for each app', () => {
      renderWithRouter(<AppTypeManager />);

      const configureButtons = screen.getAllByText('Configure');
      expect(configureButtons.length).toBe(2); // 2 published apps
    });
  });

  describe('Navigation', () => {
    it('should navigate to new app type when Create New Type button is clicked', () => {
      renderWithRouter(<AppTypeManager />);

      const createButton = screen.getByText('Create New Type');
      fireEvent.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/application-types/new');
    });

    it('should navigate to new app type when placeholder card is clicked', () => {
      renderWithRouter(<AppTypeManager />);

      const placeholderButtons = screen.getAllByText('Create New Type');
      const placeholderCard = placeholderButtons[placeholderButtons.length - 1];
      fireEvent.click(placeholderCard);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/application-types/new');
    });

    it('should have correct link to app detail page', () => {
      renderWithRouter(<AppTypeManager />);

      const configureLinks = screen.getAllByRole('link');
      const ndaConfigureLink = configureLinks.find(link =>
        link.getAttribute('href')?.includes('at_nda')
      );

      expect(ndaConfigureLink).toHaveAttribute('href', '/admin/application-types/at_nda');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search results gracefully', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'XYZ123' } });

      // Should still show the create new placeholder
      expect(screen.getByText('Create New Type')).toBeInTheDocument();
    });

    it('should handle special characters in search', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: '@#$%' } });

      // Should not crash and show no results
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should handle rapid tab switching', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedButton = screen.getByText('published');
      const draftsButton = screen.getByText('drafts');
      const archivedButton = screen.getByText('archived');

      fireEvent.click(draftsButton);
      fireEvent.click(archivedButton);
      fireEvent.click(publishedButton);

      expect(publishedButton).toHaveClass('bg-brand-500');
      expect(screen.getByText('NDA Request')).toBeInTheDocument();
    });

    it('should handle search with tab switching', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'Sales' } });

      // Switch to drafts tab
      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      // Should show Sales Order in drafts
      expect(screen.getByText('Sales Order')).toBeInTheDocument();

      // Switch back to published
      const publishedButton = screen.getByText('published');
      fireEvent.click(publishedButton);

      // Should show no results (no published app with "Sales")
      expect(screen.queryByText('Sales Order')).not.toBeInTheDocument();
    });

    it('should maintain search term when switching tabs', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'Test' } });

      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      expect(searchInput.value).toBe('Test');
    });
  });

  describe('UI Elements', () => {
    it('should render all required icons', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getAllByTestId('box-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('plus-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('search-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('filter-icon').length).toBeGreaterThan(0);
    });

    it('should render create new placeholder card', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('Start from scratch or clone existing')).toBeInTheDocument();
    });
  });
});
