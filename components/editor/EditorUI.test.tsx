import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileText, Bold, Palette } from 'lucide-react';
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

  it('should toggle chevron rotation when opening/closing', () => {
    const { container } = render(
      <CollapsibleSection title="Test Section" defaultOpen={false}>
        <div>Content</div>
      </CollapsibleSection>
    );

    const header = screen.getByText('Test Section').closest('div');
    const chevron = container.querySelector('svg[class*="rotate"]');

    expect(chevron).not.toHaveClass('rotate-180');

    fireEvent.click(header!);
    expect(chevron).toHaveClass('rotate-180');
  });

  it('should handle multiple toggles correctly', () => {
    render(
      <CollapsibleSection title="Test Section" defaultOpen={true}>
        <div>Test Content</div>
      </CollapsibleSection>
    );

    const header = screen.getByText('Test Section').closest('div');

    fireEvent.click(header!);
    let content = screen.getByText('Test Content').closest('div');
    expect(content).toHaveClass('max-h-0');

    fireEvent.click(header!);
    content = screen.getByText('Test Content').closest('div');
    expect(content).toHaveClass('max-h-[2000px]');
  });
});

describe('RibbonButton', () => {
  it('should render with label and icon', () => {
    render(<RibbonButton icon={Bold} label="Bold" />);
    expect(screen.getByText('Bold')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<RibbonButton icon={Bold} label="Bold" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Bold'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply active styles when active is true', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" active={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-brand-500/10');
  });

  it('should apply disabled styles when disabled is true', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" disabled={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('opacity-40');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<RibbonButton icon={Bold} label="Bold" onClick={handleClick} disabled={true} />);

    fireEvent.click(screen.getByText('Bold'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render badge when badge prop is true', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" badge={true} />);
    const badge = container.querySelector('.bg-red-500');
    expect(badge).toBeInTheDocument();
  });

  it('should not render badge when badge prop is false', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" badge={false} />);
    const badge = container.querySelector('.bg-red-500');
    expect(badge).not.toBeInTheDocument();
  });

  it('should apply custom color when provided', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" color="text-red-500" />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-red-500');
  });

  it('should apply custom className', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" className="custom-class" />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render subLabel when provided', () => {
    render(<RibbonButton icon={Bold} label="Bold" subLabel="Ctrl+B" />);
    expect(screen.getByText('Ctrl+B')).toBeInTheDocument();
  });

  it('should not render subLabel when not provided', () => {
    render(<RibbonButton icon={Bold} label="Bold" />);
    expect(screen.queryByText('Ctrl+B')).not.toBeInTheDocument();
  });

  it('should set button type attribute', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" type="submit" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should default to button type', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should set title attribute to label', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold Text" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('title', 'Bold Text');
  });

  it('should handle active and disabled states together', () => {
    const { container } = render(<RibbonButton icon={Bold} label="Bold" active={true} disabled={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-brand-500/10');
    expect(button).toBeDisabled();
  });
});

describe('RibbonIconButton', () => {
  it('should render icon', () => {
    const { container } = render(<RibbonIconButton icon={Bold} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(<RibbonIconButton icon={Bold} onClick={handleClick} />);

    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply active styles when active is true', () => {
    const { container } = render(<RibbonIconButton icon={Bold} active={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-brand-500/20');
  });

  it('should apply disabled styles when disabled is true', () => {
    const { container } = render(<RibbonIconButton icon={Bold} disabled={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('opacity-40');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    const { container } = render(<RibbonIconButton icon={Bold} onClick={handleClick} disabled={true} />);

    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should set title attribute', () => {
    const { container } = render(<RibbonIconButton icon={Bold} title="Bold" />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('title', 'Bold');
  });

  it('should apply custom color class', () => {
    const { container } = render(<RibbonIconButton icon={Bold} color="text-red-500" />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-red-500');
  });

  it('should handle active and disabled states together', () => {
    const { container } = render(<RibbonIconButton icon={Bold} active={true} disabled={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-brand-500/20');
    expect(button).toBeDisabled();
  });
});

describe('RibbonDivider', () => {
  it('should render divider element', () => {
    const { container } = render(<RibbonDivider />);
    const divider = container.querySelector('.bg-dark-700\\/50');
    expect(divider).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<RibbonDivider />);
    const divider = container.querySelector('div');
    expect(divider).toHaveClass('w-px');
    expect(divider).toHaveClass('h-8');
  });
});

describe('RibbonGroup', () => {
  it('should render with label', () => {
    render(<RibbonGroup label="Format" />);
    expect(screen.getByText('Format')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <RibbonGroup label="Format">
        <div>Child Content</div>
      </RibbonGroup>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render without children', () => {
    render(<RibbonGroup label="Format" />);
    expect(screen.getByText('Format')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(<RibbonGroup label="Format" />);
    const group = container.querySelector('.group\\/ribbon');
    expect(group).toBeInTheDocument();
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
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(<RibbonActionGroup />);
    const group = container.querySelector('div');
    expect(group).toHaveClass('flex');
    expect(group).toHaveClass('flex-wrap');
  });
});

describe('RibbonSelect', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render all options', () => {
    render(<RibbonSelect value="option1" options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should call onChange when selection changes', () => {
    const handleChange = vi.fn();
    render(<RibbonSelect value="option1" onChange={handleChange} options={options} />);

    const select = screen.getByDisplayValue('Option 1');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should display selected value', () => {
    render(<RibbonSelect value="option2" options={options} />);
    const select = screen.getByDisplayValue('Option 2') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('should render icon when provided', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} icon={Bold} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should not render icon when not provided', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} />);
    const icons = container.querySelectorAll('svg');
    // Only ChevronDown should be present
    expect(icons.length).toBe(1);
  });

  it('should apply custom className', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} className="custom-class" />);
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('should apply custom width', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} width="w-32" />);
    const wrapper = container.querySelector('.w-32');
    expect(wrapper).toBeInTheDocument();
  });

  it('should use default width when not provided', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} />);
    const wrapper = container.querySelector('.w-24');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render ChevronDown icon', () => {
    const { container } = render(<RibbonSelect value="option1" options={options} />);
    const chevron = container.querySelector('.pointer-events-none svg');
    expect(chevron).toBeInTheDocument();
  });
});

describe('RibbonColorPicker', () => {
  it('should render icon', () => {
    const { container } = render(<RibbonColorPicker icon={Palette} color="#ff0000" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should display color indicator with correct color', () => {
    const { container } = render(<RibbonColorPicker icon={Palette} color="#ff0000" />);
    const colorIndicator = container.querySelector('.rounded-full');
    expect(colorIndicator).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('should render button', () => {
    const { container } = render(<RibbonColorPicker icon={Palette} color="#ff0000" />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle different color values', () => {
    const { container } = render(<RibbonColorPicker icon={Palette} color="rgb(255, 0, 0)" />);
    const colorIndicator = container.querySelector('.rounded-full');
    expect(colorIndicator).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });
});

describe('LayoutSettingsModal', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <LayoutSettingsModal isOpen={false} onClose={vi.fn()} title="Settings" onApply={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Settings" onApply={vi.fn()} />
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(
      <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Layout Settings" onApply={vi.fn()} />
    );
    expect(screen.getByText('Layout Settings')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Settings" onApply={vi.fn()}>
        <div>Modal Content</div>
      </LayoutSettingsModal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <LayoutSettingsModal isOpen={true} onClose={handleClose} title="Settings" onApply={vi.fn()} />
    );

    const closeButton = container.querySelector('button');
    fireEvent.click(closeButton!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <LayoutSettingsModal isOpen={true} onClose={handleClose} title="Settings" onApply={vi.fn()} />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onApply when Apply button is clicked', () => {
    const handleApply = vi.fn();
    render(
      <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Settings" onApply={handleApply} />
    );

    fireEvent.click(screen.getByText('Apply'));
    expect(handleApply).toHaveBeenCalledTimes(1);
  });

  it('should render without children', () => {
    render(
      <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Settings" onApply={vi.fn()} />
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render X icon in close button', () => {
    const { container } = render(
      <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Settings" onApply={vi.fn()} />
    );
    const closeButton = container.querySelector('button');
    expect(closeButton?.querySelector('svg')).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should apply primary variant styles by default', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('from-brand-500');
  });

  it('should apply secondary variant styles', () => {
    const { container } = render(<Button variant="secondary">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-white/5');
  });

  it('should apply ghost variant styles', () => {
    const { container } = render(<Button variant="ghost">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('text-slate-400');
  });

  it('should apply danger variant styles', () => {
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
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    const { container } = render(<Button disabled>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('should handle type attribute', () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});

describe('Input', () => {
  it('should render input element', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should not render label when not provided', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
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
    const handleChange = vi.fn();
    const { container } = render(<Input onChange={handleChange} />);
    const input = container.querySelector('input');

    fireEvent.change(input!, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should handle disabled state', () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });
});

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render select element', () => {
    const { container } = render(<Select options={options} />);
    expect(container.querySelector('select')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(<Select label="Choose Option" options={options} />);
    expect(screen.getByText('Choose Option')).toBeInTheDocument();
  });

  it('should not render label when not provided', () => {
    const { container } = render(<Select options={options} />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Select options={options} className="custom-class" />);
    const select = container.querySelector('select');
    expect(select).toHaveClass('custom-class');
  });

  it('should pass through other props', () => {
    const handleChange = vi.fn();
    const { container } = render(<Select options={options} onChange={handleChange} />);
    const select = container.querySelector('select');

    fireEvent.change(select!, { target: { value: 'option2' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should display selected value', () => {
    const { container } = render(<Select options={options} value="option2" />);
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('should render ChevronDown icon', () => {
    const { container } = render(<Select options={options} />);
    const chevron = container.querySelector('.pointer-events-none svg');
    expect(chevron).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    const { container } = render(<Select options={options} disabled />);
    const select = container.querySelector('select');
    expect(select).toBeDisabled();
  });

  it('should render options with correct key attributes', () => {
    const { container } = render(<Select options={options} />);
    const optionElements = container.querySelectorAll('option');
    expect(optionElements).toHaveLength(3);
  });
});

describe('Edge Cases and Corner Cases', () => {
  describe('CollapsibleSection edge cases', () => {
    it('should handle empty title', () => {
      render(
        <CollapsibleSection title="">
          <div>Content</div>
        </CollapsibleSection>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      render(<CollapsibleSection title="Test">{null}</CollapsibleSection>);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle multiple children', () => {
      render(
        <CollapsibleSection title="Test">
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </CollapsibleSection>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });

  describe('RibbonButton edge cases', () => {
    it('should handle very long labels', () => {
      render(<RibbonButton icon={Bold} label="This is a very long label that should be truncated" />);
      expect(screen.getByText('This is a very long label that should be truncated')).toBeInTheDocument();
    });

    it('should handle empty label', () => {
      const { container } = render(<RibbonButton icon={Bold} label="" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('should handle all props together', () => {
      const handleClick = vi.fn();
      render(
        <RibbonButton
          icon={Bold}
          label="Bold"
          active={true}
          onClick={handleClick}
          badge={true}
          color="text-blue-500"
          className="custom"
          subLabel="Ctrl+B"
          type="submit"
        />
      );
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Ctrl+B')).toBeInTheDocument();
    });
  });

  describe('RibbonSelect edge cases', () => {
    it('should handle empty options array', () => {
      const { container } = render(<RibbonSelect value="" options={[]} />);
      expect(container.querySelector('select')).toBeInTheDocument();
    });

    it('should handle single option', () => {
      const options = [{ value: 'only', label: 'Only Option' }];
      render(<RibbonSelect value="only" options={options} />);
      expect(screen.getByText('Only Option')).toBeInTheDocument();
    });

    it('should handle options with special characters', () => {
      const options = [
        { value: 'special', label: 'Option with <>&"' },
      ];
      render(<RibbonSelect value="special" options={options} />);
      expect(screen.getByText('Option with <>&"')).toBeInTheDocument();
    });
  });

  describe('Select edge cases', () => {
    it('should handle empty options array', () => {
      const { container } = render(<Select options={[]} />);
      expect(container.querySelector('select')).toBeInTheDocument();
    });

    it('should handle options with duplicate values', () => {
      const options = [
        { value: 'dup', label: 'First' },
        { value: 'dup', label: 'Second' },
      ];
      render(<Select options={options} />);
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('LayoutSettingsModal edge cases', () => {
    it('should handle rapid open/close toggles', () => {
      const { rerender } = render(
        <LayoutSettingsModal isOpen={false} onClose={vi.fn()} title="Settings" onApply={vi.fn()} />
      );
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();

      rerender(
        <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Settings" onApply={vi.fn()} />
      );
      expect(screen.getByText('Settings')).toBeInTheDocument();

      rerender(
        <LayoutSettingsModal isOpen={false} onClose={vi.fn()} title="Settings" onApply={vi.fn()} />
      );
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('should handle complex children', () => {
      render(
        <LayoutSettingsModal isOpen={true} onClose={vi.fn()} title="Settings" onApply={vi.fn()}>
          <div>
            <Input label="Name" />
            <Select label="Type" options={[{ value: '1', label: 'Type 1' }]} />
            <Button>Test</Button>
          </div>
        </LayoutSettingsModal>
      );
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Button edge cases', () => {
    it('should handle invalid variant gracefully', () => {
      const { container } = render(<Button variant="invalid">Click</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      const { container } = render(<Button></Button>);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('should handle complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  describe('RibbonColorPicker edge cases', () => {
    it('should handle invalid color values', () => {
      const { container } = render(<RibbonColorPicker icon={Palette} color="invalid-color" />);
      const colorIndicator = container.querySelector('.rounded-full');
      expect(colorIndicator).toHaveStyle({ backgroundColor: 'invalid-color' });
    });

    it('should handle transparent color', () => {
      const { container } = render(<RibbonColorPicker icon={Palette} color="transparent" />);
      const colorIndicator = container.querySelector('.rounded-full');
      expect(colorIndicator).toHaveStyle({ backgroundColor: 'transparent' });
    });
  });
});
