import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChevronDown, X, FileText } from 'lucide-react';
import {
  CollapsibleSection,
  RibbonButton,
  RibbonIconButton,
  RibbonDivider,
  RibbonGroup,
  RibbonActionGroup,
  RibbonSelect,
  RibbonColorPicker,
  LayoutSettingsModal,
  Button,
  Input,
  Select,
} from './EditorUI';

describe('CollapsibleSection', () => {
  it('should render with title', () => {
    render(
      <CollapsibleSection title="Test Section">
        <div>Content</div>
      </CollapsibleSection>
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('should render children when open', () => {
    render(
      <CollapsibleSection title="Test Section" defaultOpen={true}>
        <div>Test Content</div>
      </CollapsibleSection>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should toggle open/closed state when clicked', () => {
    render(
      <CollapsibleSection title="Test Section" defaultOpen={true}>
        <div>Test Content</div>
      </CollapsibleSection>
    );

    const header = screen.getByText('Test Section').closest('div');
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    fireEvent.click(header!);
    const content = screen.getByText('Test Content').closest('div');
    expect(content).toHaveClass('max-h-0');
  });

  it('should start closed when defaultOpen is false', () => {
    render(
      <CollapsibleSection title="Test Section" defaultOpen={false}>
        <div>Test Content</div>
      </CollapsibleSection>
    );

    const content = screen.getByText('Test Content').closest('div');
    expect(content).toHaveClass('max-h-0');
  });

  it('should render with icon when provided', () => {
    render(
      <CollapsibleSection title="Test Section" icon={FileText}>
        <div>Content</div>
      </CollapsibleSection>
    );

    const iconContainer = screen.getByText('Test Section').parentElement;
    expect(iconContainer?.querySelector('svg')).toBeInTheDocument();
  });

  it('should render without icon when not provided', () => {
    render(
      <CollapsibleSection title="Test Section">
        <div>Content</div>
      </CollapsibleSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('should render rightElement when provided', () => {
    render(
      <CollapsibleSection title="Test Section" rightElement={<span>Right</span>}>
        <div>Content</div>
      </CollapsibleSection>
    );

    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <CollapsibleSection title="Test Section" className="custom-class">
        <div>Content</div>
      </CollapsibleSection>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply default className when not provided', () => {
    const { container } = render(
      <CollapsibleSection title="Test Section">
        <div>Content</div>
      </CollapsibleSection>
    );

    expect(container.firstChild).toHaveClass('border-b');
  });

  it('should rotate chevron icon when toggled', () => {
    const { container } = render(
      <CollapsibleSection title="Test Section" defaultOpen={true}>
        <div>Content</div>
      </CollapsibleSection>
    );

    const chevron = container.querySelector('.rotate-180');
    expect(chevron).toBeInTheDocument();

    const header = screen.getByText('Test Section').closest('div');
    fireEvent.click(header!);

    const chevronAfter = container.querySelector('.rotate-180');
    expect(chevronAfter).not.toBeInTheDocument();
  });
});

describe('RibbonButton', () => {
  it('should render with label', () => {
    render(<RibbonButton icon={FileText} label="Test Button" />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<RibbonButton icon={FileText} label="Test Button" onClick={onClick} />);

    fireEvent.click(screen.getByText('Test Button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<RibbonButton icon={FileText} label="Test Button" onClick={onClick} disabled={true} />);

    fireEvent.click(screen.getByText('Test Button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should apply active styles when active', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" active={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-brand-500/10');
  });

  it('should apply disabled styles when disabled', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" disabled={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('opacity-40');
  });

  it('should render badge when provided', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" badge={true} />);
    const badge = container.querySelector('.bg-red-500');
    expect(badge).toBeInTheDocument();
  });

  it('should not render badge when not provided', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" />);
    const badge = container.querySelector('.bg-red-500');
    expect(badge).not.toBeInTheDocument();
  });

  it('should render subLabel when provided', () => {
    render(<RibbonButton icon={FileText} label="Test Button" subLabel="Sub" />);
    expect(screen.getByText('Sub')).toBeInTheDocument();
  });

  it('should not render subLabel when not provided', () => {
    render(<RibbonButton icon={FileText} label="Test Button" />);
    expect(screen.queryByText('Sub')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" className="custom-class" />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should apply custom color to icon', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" color="text-red-500" />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-red-500');
  });

  it('should use default button type', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should use custom button type when provided', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" type="submit" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should set title attribute to label', () => {
    const { container } = render(<RibbonButton icon={FileText} label="Test Button" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('title', 'Test Button');
  });
});

describe('RibbonIconButton', () => {
  it('should render icon', () => {
    const { container } = render(<RibbonIconButton icon={FileText} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<RibbonIconButton icon={FileText} onClick={onClick} />);

    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const onClick = vi.fn();
    const { container } = render(<RibbonIconButton icon={FileText} onClick={onClick} disabled={true} />);

    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should apply active styles when active', () => {
    const { container } = render(<RibbonIconButton icon={FileText} active={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-brand-500/20');
  });

  it('should apply disabled styles when disabled', () => {
    const { container } = render(<RibbonIconButton icon={FileText} disabled={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('opacity-40');
  });

  it('should set title attribute', () => {
    const { container } = render(<RibbonIconButton icon={FileText} title="Test Title" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('title', 'Test Title');
  });

  it('should apply custom color to icon', () => {
    const { container } = render(<RibbonIconButton icon={FileText} color="text-blue-500" />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-blue-500');
  });
});

describe('RibbonDivider', () => {
  it('should render divider', () => {
    const { container } = render(<RibbonDivider />);
    const divider = container.querySelector('.w-px');
    expect(divider).toBeInTheDocument();
  });

  it('should have correct styling', () => {
    const { container } = render(<RibbonDivider />);
    const divider = container.querySelector('.w-px');
    expect(divider).toHaveClass('h-8', 'bg-dark-700/50');
  });
});

describe('RibbonGroup', () => {
  it('should render label', () => {
    render(<RibbonGroup label="Test Group" />);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <RibbonGroup label="Test Group">
        <div>Child Content</div>
      </RibbonGroup>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render without children', () => {
    render(<RibbonGroup label="Test Group" />);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('should have correct styling', () => {
    const { container } = render(<RibbonGroup label="Test Group" />);
    const group = container.querySelector('.flex.flex-col');
    expect(group).toHaveClass('border-r', 'border-dark-800/50');
  });
});

describe('RibbonActionGroup', () => {
  it('should render children', () => {
    render(
      <RibbonActionGroup>
        <div>Action 1</div>
        <div>Action 2</div>
      </RibbonActionGroup>
    );
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('should render without children', () => {
    const { container } = render(<RibbonActionGroup />);
    expect(container.querySelector('.flex.flex-wrap')).toBeInTheDocument();
  });

  it('should have correct styling', () => {
    const { container } = render(<RibbonActionGroup />);
    const group = container.querySelector('.flex.flex-wrap');
    expect(group).toHaveClass('max-w-[80px]', 'justify-center');
  });
});

describe('RibbonSelect', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  it('should render select with options', () => {
    render(<RibbonSelect value="option1" options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const onChange = vi.fn();
    const { container } = render(<RibbonSelect value="option1" onChange={onChange} options={options} />);

    const select = container.querySelector('select');
    fireEvent.change(select!, { target: { value: 'option2' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should render with icon when provided', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} icon={FileText} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should not render icon when not provided', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} />);
    const icons = container.querySelectorAll('svg');
    // Only ChevronDown should be present
    expect(icons.length).toBe(1);
  });

  it('should apply custom className', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom width', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} width="w-32" />);
    expect(container.firstChild).toHaveClass('w-32');
  });

  it('should apply default width when not provided', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} />);
    expect(container.firstChild).toHaveClass('w-24');
  });

  it('should set select value correctly', () => {
    const { container } = render(<RibbonSelect value="option2" options={options} />);
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });
});

describe('RibbonColorPicker', () => {
  it('should render with icon', () => {
    const { container } = render(<RibbonColorPicker icon={FileText} color="#ff0000" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should display color indicator', () => {
    const { container } = render(<RibbonColorPicker icon={FileText} color="#ff0000" />);
    const colorIndicator = container.querySelector('.w-4.h-1');
    expect(colorIndicator).toBeInTheDocument();
    expect(colorIndicator).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('should render with different colors', () => {
    const { container } = render(<RibbonColorPicker icon={FileText} color="#00ff00" />);
    const colorIndicator = container.querySelector('.w-4.h-1');
    expect(colorIndicator).toHaveStyle({ backgroundColor: '#00ff00' });
  });
});

describe('LayoutSettingsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    onApply: vi.fn(),
  };

  it('should render when isOpen is true', () => {
    render(<LayoutSettingsModal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<LayoutSettingsModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <LayoutSettingsModal {...defaultProps}>
        <div>Modal Content</div>
      </LayoutSettingsModal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<LayoutSettingsModal {...defaultProps} onClose={onClose} />);

    const closeButton = container.querySelector('button');
    fireEvent.click(closeButton!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<LayoutSettingsModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onApply when Apply button is clicked', () => {
    const onApply = vi.fn();
    render(<LayoutSettingsModal {...defaultProps} onApply={onApply} />);

    fireEvent.click(screen.getByText('Apply'));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('should render title in header', () => {
    render(<LayoutSettingsModal {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should render X icon in close button', () => {
    const { container } = render(<LayoutSettingsModal {...defaultProps} />);
    const closeButton = container.querySelector('button');
    expect(closeButton?.querySelector('svg')).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should apply primary variant by default', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('should apply secondary variant', () => {
    const { container } = render(<Button variant="secondary">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-white/5');
  });

  it('should apply ghost variant', () => {
    const { container } = render(<Button variant="ghost">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('text-slate-400');
  });

  it('should apply danger variant', () => {
    const { container } = render(<Button variant="danger">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-red-500/10');
  });

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should pass through other props', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    const onClick = vi.fn();
    const { container } = render(<Button onClick={onClick} disabled>Click Me</Button>);

    const button = container.querySelector('button');
    expect(button).toBeDisabled();

    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should apply disabled styles', () => {
    const { container } = render(<Button disabled>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('disabled:opacity-50');
  });
});

describe('Input', () => {
  it('should render input field', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should not render label when not provided', () => {
    render(<Input />);
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-class');
  });

  it('should pass through other props', () => {
    const { container } = render(<Input placeholder="Enter text" type="email" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should handle value changes', () => {
    const onChange = vi.fn();
    const { container } = render(<Input onChange={onChange} />);

    const input = container.querySelector('input');
    fireEvent.change(input!, { target: { value: 'test value' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should render label element correctly', () => {
    const { container } = render(<Input label="Test Label" />);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-xs', 'font-bold');
  });
});

describe('Select', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];

  it('should render select field', () => {
    const { container } = render(<Select options={options} />);
    expect(container.querySelector('select')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select label="Test Label" options={options} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should not render label when not provided', () => {
    render(<Select options={options} />);
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Select options={options} className="custom-class" />);
    const select = container.querySelector('select');
    expect(select).toHaveClass('custom-class');
  });

  it('should pass through other props', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={options} onChange={onChange} value="opt2" />);

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('opt2');

    fireEvent.change(select, { target: { value: 'opt3' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should render ChevronDown icon', () => {
    const { container } = render(<Select options={options} />);
    const chevron = container.querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('should render label element correctly', () => {
    const { container } = render(<Select label="Test Label" options={options} />);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-xs', 'font-bold');
  });

  it('should handle empty options array', () => {
    const { container } = render(<Select options={[]} />);
    const select = container.querySelector('select');
    expect(select?.children.length).toBe(0);
  });
});
