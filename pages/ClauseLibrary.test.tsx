/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClauseLibrary from './ClauseLibrary';
import { MOCK_CLAUSES } from '../mock/data';

// Mock the UI components
vi.mock('../components/UIComponents', () => ({
  Card: ({ children, className, noPadding, ...props }: any) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
  Button: ({ children, variant, className, ...props }: any) => (
    <button data-testid="button" data-variant={variant} className={className} {...props}>
      {children}
    </button>
  ),
  Input: ({ placeholder, className, value, onChange, ...props }: any) => (
    <input
      data-testid="input"
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
  Badge: ({ children, color }: any) => (
    <span data-testid="badge" data-color={color}>
      {children}
    </span>
  ),
  Select: ({ options, value, onChange, className, ...props }: any) => (
    <select
      data-testid="select"
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon">Search</span>,
  Plus: ({ size }: any) => <span data-testid="plus-icon" data-size={size}>Plus</span>,
  Filter: ({ size }: any) => <span data-testid="filter-icon" data-size={size}>Filter</span>,
  Edit2: ({ size }: any) => <span data-testid="edit-icon" data-size={size}>Edit</span>,
  Trash2: ({ size }: any) => <span data-testid="trash-icon" data-size={size}>Trash</span>,
  AlertTriangle: ({ size }: any) => <span data-testid="alert-icon" data-size={size}>Alert</span>,
  Tag: ({ size }: any) => <span data-testid="tag-icon" data-size={size}>Tag</span>,
}));

// Mock the data
vi.mock('../mock/data', () => ({
  MOCK_CLAUSES: [
    {
      id: 'CL-001',
      name: 'Standard Indemnification',
      category: 'Indemnity',
      content: 'The Vendor agrees to indemnify, defend, and hold harmless the Client from and against any and all claims...',
      riskLevel: 'Low',
      tags: ['Standard', 'Playbook'],
    },
    {
      id: 'CL-002',
      name: 'Aggressive Limitation of Liability',
      category: 'Liability',
      content: "In no event shall Vendor's liability exceed the total fees paid in the preceding 3 months.",
      riskLevel: 'High',
      tags: ['Vendor Paper', 'Review Required'],
    },
    {
      id: 'CL-003',
      name: 'Data Privacy (GDPR)',
      category: 'Compliance',
      content: 'Vendor shall process Personal Data only on documented instructions from the Controller...',
      riskLevel: 'Medium',
      tags: ['GDPR', 'EU'],
    },
    {
      id: 'CL-004',
      name: 'Confidentiality Agreement',
      category: 'Confidentiality',
      content: 'Both parties agree to maintain confidentiality of all proprietary information...',
      riskLevel: 'Low',
      tags: ['Standard', 'NDA'],
    },
  ],
}));

describe('ClauseLibrary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component successfully', () => {
      render(<ClauseLibrary />);
      expect(screen.getByText('Clause Library')).toBeInTheDocument();
    });

    it('should render the header with title and description', () => {
      render(<ClauseLibrary />);
      expect(screen.getByText('Clause Library')).toBeInTheDocument();
      expect(screen.getByText('Manage standard legal language and playbooks.')).toBeInTheDocument();
    });

    it('should render the Add Clause button', () => {
      render(<ClauseLibrary />);
      const buttons = screen.getAllByTestId('button');
      const addButton = buttons.find((btn) => btn.textContent?.includes('Add Clause'));
      expect(addButton).toBeInTheDocument();
    });

    it('should render the search input', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should render the category select dropdown', () => {
      render(<ClauseLibrary />);
      const select = screen.getByTestId('select');
      expect(select).toBeInTheDocument();
    });

    it('should render the More Filters button', () => {
      render(<ClauseLibrary />);
      const buttons = screen.getAllByTestId('button');
      const filterButton = buttons.find((btn) => btn.textContent?.includes('More Filters'));
      expect(filterButton).toBeInTheDocument();
    });

    it('should render the Create New Clause placeholder button', () => {
      render(<ClauseLibrary />);
      expect(screen.getByText('Create New Clause')).toBeInTheDocument();
      expect(screen.getByText('Add to playbook')).toBeInTheDocument();
    });
  });

  describe('Clause Display', () => {
    it('should render all clauses initially', () => {
      render(<ClauseLibrary />);
      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.getByText('Confidentiality Agreement')).toBeInTheDocument();
    });

    it('should display clause categories as badges', () => {
      render(<ClauseLibrary />);
      const badges = screen.getAllByTestId('badge');
      const categoryBadges = badges.filter((badge) =>
        ['Indemnity', 'Liability', 'Compliance', 'Confidentiality'].includes(badge.textContent || '')
      );
      expect(categoryBadges.length).toBeGreaterThan(0);
    });

    it('should display clause content', () => {
      render(<ClauseLibrary />);
      expect(
        screen.getByText(
          (content, element) =>
            element?.textContent?.includes('The Vendor agrees to indemnify') || false
        )
      ).toBeInTheDocument();
    });

    it('should display clause tags', () => {
      render(<ClauseLibrary />);
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Playbook')).toBeInTheDocument();
    });

    it('should display clause IDs', () => {
      render(<ClauseLibrary />);
      expect(screen.getByText('CL-001')).toBeInTheDocument();
      expect(screen.getByText('CL-002')).toBeInTheDocument();
    });

    it('should display high risk indicator for high risk clauses', () => {
      render(<ClauseLibrary />);
      const alertIcons = screen.getAllByTestId('alert-icon');
      expect(alertIcons.length).toBeGreaterThan(0);
    });

    it('should not display risk indicator for non-high risk clauses', () => {
      const { container } = render(<ClauseLibrary />);
      const cards = container.querySelectorAll('[data-testid="card"]');

      // Find the card for Standard Indemnification (Low risk)
      const lowRiskCard = Array.from(cards).find((card) =>
        card.textContent?.includes('Standard Indemnification')
      );

      // Check that it doesn't have an alert icon
      if (lowRiskCard) {
        const alertIcon = within(lowRiskCard as HTMLElement).queryByTestId('alert-icon');
        expect(alertIcon).not.toBeInTheDocument();
      }
    });

    it('should render edit and delete buttons for each clause', () => {
      render(<ClauseLibrary />);
      const editIcons = screen.getAllByTestId('edit-icon');
      const trashIcons = screen.getAllByTestId('trash-icon');

      // Should have one edit and one delete button per clause
      expect(editIcons.length).toBe(4);
      expect(trashIcons.length).toBe(4);
    });
  });

  describe('Search Functionality', () => {
    it('should filter clauses by name when searching', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'Indemnification' } });

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.queryByText('Data Privacy (GDPR)')).not.toBeInTheDocument();
    });

    it('should filter clauses by content when searching', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'Vendor agrees' } });

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.queryByText('Confidentiality Agreement')).not.toBeInTheDocument();
    });

    it('should be case-insensitive when searching', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'GDPR' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });

    it('should show all clauses when search is cleared', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'GDPR' } });
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
    });

    it('should show no clauses when search matches nothing', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'NonexistentClause' } });

      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
      expect(screen.queryByText('Data Privacy (GDPR)')).not.toBeInTheDocument();
      expect(screen.queryByText('Aggressive Limitation of Liability')).not.toBeInTheDocument();
    });

    it('should update search input value when typing', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...') as HTMLInputElement;

      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(searchInput.value).toBe('test search');
    });
  });

  describe('Category Filter Functionality', () => {
    it('should filter clauses by category', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Indemnity' } });

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.queryByText('Data Privacy (GDPR)')).not.toBeInTheDocument();
    });

    it('should show all clauses when "All" category is selected', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Liability' } });
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();

      fireEvent.change(categorySelect, { target: { value: 'All' } });
      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
    });

    it('should filter by Liability category', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Liability' } });

      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });

    it('should filter by Compliance category', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Compliance' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });

    it('should filter by Confidentiality category', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Confidentiality' } });

      expect(screen.getByText('Confidentiality Agreement')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });

    it('should update category select value when changed', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select') as HTMLSelectElement;

      fireEvent.change(categorySelect, { target: { value: 'Indemnity' } });

      expect(categorySelect.value).toBe('Indemnity');
    });
  });

  describe('Combined Filters', () => {
    it('should apply both search and category filters together', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Compliance' } });
      fireEvent.change(searchInput, { target: { value: 'GDPR' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
      expect(screen.queryByText('Aggressive Limitation of Liability')).not.toBeInTheDocument();
    });

    it('should show no results when filters do not match any clause', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Indemnity' } });
      fireEvent.change(searchInput, { target: { value: 'GDPR' } });

      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
      expect(screen.queryByText('Data Privacy (GDPR)')).not.toBeInTheDocument();
    });

    it('should filter correctly when search matches but category does not', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(searchInput, { target: { value: 'Vendor' } });
      fireEvent.change(categorySelect, { target: { value: 'Confidentiality' } });

      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
      expect(screen.queryByText('Aggressive Limitation of Liability')).not.toBeInTheDocument();
    });

    it('should filter correctly when category matches but search does not', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Indemnity' } });
      fireEvent.change(searchInput, { target: { value: 'NonexistentText' } });

      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search string', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: '' } });

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
    });

    it('should handle search with special characters', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: "Vendor's" } });

      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
    });

    it('should handle search with numbers', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: '3 months' } });

      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
    });

    it('should handle partial word search', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'Indem' } });

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
    });

    it('should handle whitespace in search', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: '  GDPR  ' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should initialize with empty filter state', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...') as HTMLInputElement;

      expect(searchInput.value).toBe('');
    });

    it('should initialize with "All" category selected', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select') as HTMLSelectElement;

      expect(categorySelect.value).toBe('All');
    });

    it('should maintain filter state across re-renders', () => {
      const { rerender } = render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...') as HTMLInputElement;

      fireEvent.change(searchInput, { target: { value: 'GDPR' } });
      expect(searchInput.value).toBe('GDPR');

      rerender(<ClauseLibrary />);
      expect(searchInput.value).toBe('GDPR');
    });

    it('should maintain category state across re-renders', () => {
      const { rerender } = render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select') as HTMLSelectElement;

      fireEvent.change(categorySelect, { target: { value: 'Compliance' } });
      expect(categorySelect.value).toBe('Compliance');

      rerender(<ClauseLibrary />);
      expect(categorySelect.value).toBe('Compliance');
    });
  });

  describe('UI Elements', () => {
    it('should render all category options in select', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      expect(within(categorySelect).getByText('All Categories')).toBeInTheDocument();
      expect(within(categorySelect).getByText('Indemnity')).toBeInTheDocument();
      expect(within(categorySelect).getByText('Liability')).toBeInTheDocument();
      expect(within(categorySelect).getByText('Compliance')).toBeInTheDocument();
      expect(within(categorySelect).getByText('Confidentiality')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      render(<ClauseLibrary />);
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('should render filter icon', () => {
      render(<ClauseLibrary />);
      expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
    });

    it('should render plus icons', () => {
      render(<ClauseLibrary />);
      const plusIcons = screen.getAllByTestId('plus-icon');
      expect(plusIcons.length).toBeGreaterThan(0);
    });

    it('should render tag icons for each tag', () => {
      render(<ClauseLibrary />);
      const tagIcons = screen.getAllByTestId('tag-icon');
      // Each clause has tags, so we should have multiple tag icons
      expect(tagIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Clause Cards', () => {
    it('should render multiple tags for clauses with multiple tags', () => {
      render(<ClauseLibrary />);

      // Standard Indemnification has tags: ['Standard', 'Playbook']
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Playbook')).toBeInTheDocument();
    });

    it('should render clause content in quotes', () => {
      render(<ClauseLibrary />);

      // Check that content is wrapped in quotes
      const contentElements = screen.getAllByText((content, element) => {
        return element?.textContent?.startsWith('"') || false;
      });

      expect(contentElements.length).toBeGreaterThan(0);
    });

    it('should render all clause cards', () => {
      render(<ClauseLibrary />);
      const cards = screen.getAllByTestId('card');

      // Should have 4 clause cards + potentially other cards
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Filtering Logic', () => {
    it('should match search in clause name (case-insensitive)', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'limitation' } });

      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });

    it('should match search in clause content (case-insensitive)', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      fireEvent.change(searchInput, { target: { value: 'controller' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });

    it('should match category exactly', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      fireEvent.change(categorySelect, { target: { value: 'Compliance' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
      expect(screen.queryByText('Aggressive Limitation of Liability')).not.toBeInTheDocument();
    });

    it('should require both conditions to match when both filters are active', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      const categorySelect = screen.getByTestId('select');

      // Set category to Indemnity
      fireEvent.change(categorySelect, { target: { value: 'Indemnity' } });
      // Search for something that exists in Indemnity category
      fireEvent.change(searchInput, { target: { value: 'indemnify' } });

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.queryByText('Data Privacy (GDPR)')).not.toBeInTheDocument();
    });
  });

  describe('Risk Level Display', () => {
    it('should show alert icon only for High risk clauses', () => {
      render(<ClauseLibrary />);
      const { container } = render(<ClauseLibrary />);

      // Find all cards
      const allCards = screen.getAllByTestId('card');

      // Find the high risk clause card
      const highRiskCard = allCards.find((card) =>
        card.textContent?.includes('Aggressive Limitation of Liability')
      );

      if (highRiskCard) {
        const alertIcon = within(highRiskCard as HTMLElement).queryByTestId('alert-icon');
        expect(alertIcon).toBeInTheDocument();
      }
    });

    it('should not show alert icon for Low risk clauses', () => {
      const { container } = render(<ClauseLibrary />);
      const allCards = screen.getAllByTestId('card');

      // Find a low risk clause card
      const lowRiskCard = allCards.find((card) =>
        card.textContent?.includes('Standard Indemnification')
      );

      if (lowRiskCard) {
        const alertIcon = within(lowRiskCard as HTMLElement).queryByTestId('alert-icon');
        expect(alertIcon).not.toBeInTheDocument();
      }
    });

    it('should not show alert icon for Medium risk clauses', () => {
      const { container } = render(<ClauseLibrary />);
      const allCards = screen.getAllByTestId('card');

      // Find a medium risk clause card
      const mediumRiskCard = allCards.find((card) =>
        card.textContent?.includes('Data Privacy (GDPR)')
      );

      if (mediumRiskCard) {
        const alertIcon = within(mediumRiskCard as HTMLElement).queryByTestId('alert-icon');
        expect(alertIcon).not.toBeInTheDocument();
      }
    });
  });

  describe('Multiple Clause Scenarios', () => {
    it('should display multiple clauses of the same category', () => {
      render(<ClauseLibrary />);
      const categorySelect = screen.getByTestId('select');

      // There might be multiple clauses in a category
      fireEvent.change(categorySelect, { target: { value: 'All' } });

      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(1);
    });

    it('should handle filtering when multiple clauses match search', () => {
      render(<ClauseLibrary />);
      const searchInput = screen.getByPlaceholderText('Search clauses content...');

      // Search for a common term
      fireEvent.change(searchInput, { target: { value: 'Vendor' } });

      // Should show multiple results
      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have proper layout structure', () => {
      const { container } = render(<ClauseLibrary />);

      // Check for main container
      const mainDiv = container.querySelector('.space-y-6');
      expect(mainDiv).toBeInTheDocument();
    });

    it('should render header section', () => {
      const { container } = render(<ClauseLibrary />);

      expect(screen.getByText('Clause Library')).toBeInTheDocument();
      expect(screen.getByText('Manage standard legal language and playbooks.')).toBeInTheDocument();
    });

    it('should render filter section', () => {
      render(<ClauseLibrary />);

      expect(screen.getByPlaceholderText('Search clauses content...')).toBeInTheDocument();
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should render clauses grid section', () => {
      const { container } = render(<ClauseLibrary />);

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });
});
