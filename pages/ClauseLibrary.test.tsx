import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClauseLibrary from './ClauseLibrary';
import { MOCK_CLAUSES } from '../mock/data';

// Mock the UI components
jest.mock('../components/UIComponents', () => ({
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
  Input: ({ placeholder, value, onChange, className, ...props }: any) => (
    <input
      data-testid="input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
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
jest.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon">Search</span>,
  Plus: () => <span data-testid="plus-icon">Plus</span>,
  Filter: () => <span data-testid="filter-icon">Filter</span>,
  Edit2: () => <span data-testid="edit-icon">Edit</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
  AlertTriangle: () => <span data-testid="alert-icon">Alert</span>,
  Tag: () => <span data-testid="tag-icon">Tag</span>,
}));

// Mock the data
jest.mock('../mock/data', () => ({
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
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component with title and description', () => {
      render(<ClauseLibrary />);

      expect(screen.getByText('Clause Library')).toBeInTheDocument();
      expect(screen.getByText('Manage standard legal language and playbooks.')).toBeInTheDocument();
    });

    it('should render the Add Clause button', () => {
      render(<ClauseLibrary />);

      const addButton = screen.getByText('Add Clause').closest('button');
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute('data-variant', 'primary');
    });

    it('should render the search input with placeholder', () => {
      render(<ClauseLibrary />);

      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should render the category filter dropdown', () => {
      render(<ClauseLibrary />);

      const categorySelect = screen.getByTestId('select');
      expect(categorySelect).toBeInTheDocument();
      expect(categorySelect).toHaveValue('All');
    });

    it('should render the More Filters button', () => {
      render(<ClauseLibrary />);

      const moreFiltersButton = screen.getByText('More Filters').closest('button');
      expect(moreFiltersButton).toBeInTheDocument();
      expect(moreFiltersButton).toHaveAttribute('data-variant', 'ghost');
    });

    it('should render all clause cards', () => {
      render(<ClauseLibrary />);

      const cards = screen.getAllByTestId('card');
      // 4 clause cards + 1 "Create New Clause" placeholder
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    it('should render the Create New Clause placeholder button', () => {
      render(<ClauseLibrary />);

      expect(screen.getByText('Create New Clause')).toBeInTheDocument();
      expect(screen.getByText('Add to playbook')).toBeInTheDocument();
    });
  });

  describe('Clause Card Rendering', () => {
    it('should render clause names', () => {
      render(<ClauseLibrary />);

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
    });

    it('should render clause categories as badges', () => {
      render(<ClauseLibrary />);

      const badges = screen.getAllByTestId('badge');
      const badgeTexts = badges.map(badge => badge.textContent);

      expect(badgeTexts).toContain('Indemnity');
      expect(badgeTexts).toContain('Liability');
      expect(badgeTexts).toContain('Compliance');
    });

    it('should render clause content', () => {
      render(<ClauseLibrary />);

      expect(screen.getByText(/"The Vendor agrees to indemnify, defend, and hold harmless the Client from and against any and all claims..."/)).toBeInTheDocument();
    });

    it('should render clause IDs', () => {
      render(<ClauseLibrary />);

      expect(screen.getByText('CL-001')).toBeInTheDocument();
      expect(screen.getByText('CL-002')).toBeInTheDocument();
      expect(screen.getByText('CL-003')).toBeInTheDocument();
    });

    it('should render clause tags', () => {
      render(<ClauseLibrary />);

      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Playbook')).toBeInTheDocument();
      expect(screen.getByText('Vendor Paper')).toBeInTheDocument();
      expect(screen.getByText('GDPR')).toBeInTheDocument();
    });

    it('should render high risk indicator for high risk clauses', () => {
      render(<ClauseLibrary />);

      const alertIcons = screen.getAllByTestId('alert-icon');
      expect(alertIcons.length).toBeGreaterThan(0);
    });

    it('should not render high risk indicator for non-high risk clauses', () => {
      render(<ClauseLibrary />);

      const cards = screen.getAllByTestId('card');
      const lowRiskCard = cards.find(card =>
        within(card).queryByText('Standard Indemnification')
      );

      if (lowRiskCard) {
        expect(within(lowRiskCard).queryByTestId('alert-icon')).not.toBeInTheDocument();
      }
    });

    it('should render edit and delete buttons for each clause', () => {
      render(<ClauseLibrary />);

      const editIcons = screen.getAllByTestId('edit-icon');
      const trashIcons = screen.getAllByTestId('trash-icon');

      expect(editIcons.length).toBeGreaterThan(0);
      expect(trashIcons.length).toBeGreaterThan(0);
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
      fireEvent.change(searchInput, { target: { value: 'GDPR' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
    });

    it('should be case-insensitive when searching', () => {
      render(<ClauseLibrary />);

      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      fireEvent.change(searchInput, { target: { value: 'liability' } });

      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
    });

    it('should show no clauses when search matches nothing', () => {
      render(<ClauseLibrary />);

      const searchInput = screen.getByPlaceholderText('Search clauses content...');
      fireEvent.change(searchInput, { target: { value: 'NonExistentClause' } });

      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
      expect(screen.queryByText('Data Privacy (GDPR)')).not.toBeInTheDocument();
    });

    it('should update search filter state', () => {
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
      fireEvent.change(categorySelect, { target: { value: 'All' } });

      expect(screen.getByText('Standard Indemnification')).toBeInTheDocument();
      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.getByText('Aggressive Limitation of Liability')).toBeInTheDocument();
    });

    it('should filter by Compliance category', () => {
      render(<ClauseLibrary />);

      const categorySelect = screen.getByTestId('select');
      fireEvent.change(categorySelect, { target: { value: 'Compliance' } });

      expect(screen.getByText('Data Privacy (GDPR)')).toBeInTheDocument();
      expect(screen.queryByText('Standard Indemnification')).not.toBeInTheDocument();
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
    });
  });
});
