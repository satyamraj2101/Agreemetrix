/**
 * Unit Tests for AppTypeManager Component
 *
 * This test suite provides comprehensive coverage for the AppTypeManager component,
 * including:
 *
 * 1. Component Rendering - Tests all UI elements, icons, buttons, and cards
 * 2. Tab Functionality - Tests switching between published, drafts, and archived tabs
 * 3. Search Functionality - Tests filtering by name and key with various inputs
 * 4. App Card Rendering - Tests display of app information, badges, and metadata
 * 5. Navigation - Tests routing to detail pages and creation flow
 * 6. Edge Cases - Tests special characters, whitespace, long strings, and empty results
 * 7. Filter Logic - Tests combined filtering of tabs and search
 * 8. State Management - Tests initialization and updates of component state
 * 9. Accessibility - Tests interactive elements and semantic HTML
 * 10. Integration Tests - Tests complete user workflows
 *
 * Coverage Goals:
 * - Line Coverage: 100%
 * - Branch Coverage: 100%
 * - Function Coverage: 100%
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
      const createButtons = screen.getAllByText('Create New Type');
      expect(createButtons.length).toBeGreaterThan(0);
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
    });

    it('should render filter button', () => {
      renderWithRouter(<AppTypeManager />);

      const filterButtons = screen.getAllByTestId('filter-icon');
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it('should render all required icons', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getAllByTestId('box-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('plus-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('search-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('filter-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('file-text-icon').length).toBeGreaterThan(0);
    });

    it('should render create new placeholder card', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('Start from scratch or clone existing')).toBeInTheDocument();
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
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
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

    it('should apply correct styling to active tab', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedButton = screen.getByText('published');
      const draftsButton = screen.getByText('drafts');

      expect(publishedButton).toHaveClass('bg-brand-500');
      expect(draftsButton).not.toHaveClass('bg-brand-500');

      fireEvent.click(draftsButton);

      expect(draftsButton).toHaveClass('bg-brand-500');
      expect(publishedButton).not.toHaveClass('bg-brand-500');
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

    it('should search by lowercase key', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'vend_onb' } });

      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
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

    it('should handle partial name matches', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'Vendor' } });

      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should handle partial key matches', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'NDA_' } });

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.queryByText('Vendor Onboarding')).not.toBeInTheDocument();
    });
  });

  describe('App Card Rendering', () => {
    it('should render app cards with correct information', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.getByText('NDA_REQ')).toBeInTheDocument();
      expect(screen.getByText('Standard Non-Disclosure Agreement request flow.')).toBeInTheDocument();
      expect(screen.getByText('1240')).toBeInTheDocument();
      expect(screen.getByText('Legal Ops')).toBeInTheDocument();
    });

    it('should render status badges correctly for published apps', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedBadges = screen.getAllByText('Published');
      expect(publishedBadges.length).toBe(2);
    });

    it('should render status badge correctly for draft apps', () => {
      renderWithRouter(<AppTypeManager />);

      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      expect(screen.getByText('Draft')).toBeInTheDocument();
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

    it('should render app description', () => {
      renderWithRouter(<AppTypeManager />);

      expect(screen.getByText('Standard Non-Disclosure Agreement request flow.')).toBeInTheDocument();
      expect(screen.getByText('End-to-end vendor qualification and MSA generation.')).toBeInTheDocument();
    });

    it('should render all published apps on initial load', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedApps = MOCK_APP_TYPES.filter(app => app.status === 'Published');
      publishedApps.forEach(app => {
        expect(screen.getByText(app.name)).toBeInTheDocument();
      });
    });

    it('should render copy button for each app', () => {
      renderWithRouter(<AppTypeManager />);

      const copyIcons = screen.getAllByTestId('copy-icon');
      expect(copyIcons.length).toBe(2); // 2 published apps
    });

    it('should render more vertical icon for each app', () => {
      renderWithRouter(<AppTypeManager />);

      const moreIcons = screen.getAllByTestId('more-vertical-icon');
      expect(moreIcons.length).toBe(2); // 2 published apps
    });

    it('should render clock icon for last modified time', () => {
      renderWithRouter(<AppTypeManager />);

      const clockIcons = screen.getAllByTestId('clock-icon');
      expect(clockIcons.length).toBe(2); // 2 published apps
    });

    it('should render settings icon in configure button', () => {
      renderWithRouter(<AppTypeManager />);

      const settingsIcons = screen.getAllByTestId('settings-icon');
      expect(settingsIcons.length).toBe(2); // 2 published apps
    });
  });

  describe('Navigation', () => {
    it('should navigate to new app type when Create New Type button is clicked', () => {
      renderWithRouter(<AppTypeManager />);

      const createButtons = screen.getAllByText('Create New Type');
      const headerButton = createButtons[0];
      fireEvent.click(headerButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/application-types/new');
    });

    it('should navigate to new app type when placeholder card is clicked', () => {
      renderWithRouter(<AppTypeManager />);

      const placeholderButtons = screen.getAllByText('Create New Type');
      const placeholderCard = placeholderButtons[placeholderButtons.length - 1];
      fireEvent.click(placeholderCard);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/application-types/new');
    });

    it('should have correct link to app detail page for NDA', () => {
      renderWithRouter(<AppTypeManager />);

      const configureLinks = screen.getAllByRole('link');
      const ndaConfigureLink = configureLinks.find(link =>
        link.getAttribute('href')?.includes('at_nda')
      );

      expect(ndaConfigureLink).toHaveAttribute('href', '/admin/application-types/at_nda');
    });

    it('should have correct link to app detail page for Vendor', () => {
      renderWithRouter(<AppTypeManager />);

      const configureLinks = screen.getAllByRole('link');
      const vendorConfigureLink = configureLinks.find(link =>
        link.getAttribute('href')?.includes('at_vendor')
      );

      expect(vendorConfigureLink).toHaveAttribute('href', '/admin/application-types/at_vendor');
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

    it('should handle whitespace in search', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: '   NDA   ' } });

      expect(screen.getByText('NDA Request')).toBeInTheDocument();
    });

    it('should handle numeric search', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: '123' } });

      // Should not crash
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should handle very long search strings', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      const longString = 'a'.repeat(1000);
      fireEvent.change(searchInput, { target: { value: longString } });

      // Should not crash
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should handle search with only spaces', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: '     ' } });

      // Should show all apps (spaces should match nothing specific)
      expect(screen.getByText('NDA Request')).toBeInTheDocument();
      expect(screen.getByText('Vendor Onboarding')).toBeInTheDocument();
    });
  });

  describe('Filter Logic', () => {
    it('should filter by both name and key simultaneously', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');

      // Search should match either name OR key
      fireEvent.change(searchInput, { target: { value: 'Request' } });
      expect(screen.getByText('NDA Request')).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'REQ' } });
      expect(screen.getByText('NDA Request')).toBeInTheDocument();
    });

    it('should apply tab filter before search filter', () => {
      renderWithRouter(<AppTypeManager />);

      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'NDA' } });

      // NDA is published, not draft, so should not appear
      expect(screen.queryByText('NDA Request')).not.toBeInTheDocument();
    });

    it('should handle archived status filter correctly', () => {
      renderWithRouter(<AppTypeManager />);

      const archivedButton = screen.getByText('archived');
      fireEvent.click(archivedButton);

      // No archived apps in mock data
      const appCards = screen.queryByText('NDA Request');
      expect(appCards).not.toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should initialize with published tab active', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedButton = screen.getByText('published');
      expect(publishedButton).toHaveClass('bg-brand-500');
    });

    it('should initialize with empty search term', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...') as HTMLInputElement;
      expect(searchInput.value).toBe('');
    });

    it('should update search term state on input change', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(searchInput.value).toBe('test');
    });

    it('should update active tab state on tab click', () => {
      renderWithRouter(<AppTypeManager />);

      const draftsButton = screen.getByText('drafts');
      const publishedButton = screen.getByText('published');

      expect(publishedButton).toHaveClass('bg-brand-500');
      expect(draftsButton).not.toHaveClass('bg-brand-500');

      fireEvent.click(draftsButton);

      expect(draftsButton).toHaveClass('bg-brand-500');
      expect(publishedButton).not.toHaveClass('bg-brand-500');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible search input', () => {
      renderWithRouter(<AppTypeManager />);

      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should have clickable tab buttons', () => {
      renderWithRouter(<AppTypeManager />);

      const publishedButton = screen.getByText('published');
      const draftsButton = screen.getByText('drafts');
      const archivedButton = screen.getByText('archived');

      expect(publishedButton.tagName).toBe('BUTTON');
      expect(draftsButton.tagName).toBe('BUTTON');
      expect(archivedButton.tagName).toBe('BUTTON');
    });

    it('should have clickable create buttons', () => {
      renderWithRouter(<AppTypeManager />);

      const createButtons = screen.getAllByText('Create New Type');
      createButtons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user workflow: search and navigate', () => {
      renderWithRouter(<AppTypeManager />);

      // Search for an app
      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'NDA' } });

      // Verify filtered results
      expect(screen.getByText('NDA Request')).toBeInTheDocument();

      // Click configure link
      const configureLinks = screen.getAllByRole('link');
      const ndaLink = configureLinks.find(link =>
        link.getAttribute('href')?.includes('at_nda')
      );
      expect(ndaLink).toBeInTheDocument();
    });

    it('should handle complete user workflow: tab switch and create', () => {
      renderWithRouter(<AppTypeManager />);

      // Switch to drafts
      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      // Verify draft apps shown
      expect(screen.getByText('Sales Order')).toBeInTheDocument();

      // Click create new
      const createButtons = screen.getAllByText('Create New Type');
      fireEvent.click(createButtons[0]);

      // Verify navigation called
      expect(mockNavigate).toHaveBeenCalledWith('/admin/application-types/new');
    });

    it('should handle complete user workflow: search, tab switch, and clear', () => {
      renderWithRouter(<AppTypeManager />);

      // Search
      const searchInput = screen.getByPlaceholderText('Search by name or key...');
      fireEvent.change(searchInput, { target: { value: 'Sales' } });

      // Switch to drafts
      const draftsButton = screen.getByText('drafts');
      fireEvent.click(draftsButton);

      // Verify results
      expect(screen.getByText('Sales Order')).toBeInTheDocument();

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });

      // Should show all draft apps
      expect(screen.getByText('Sales Order')).toBeInTheDocument();
    });
  });
});
