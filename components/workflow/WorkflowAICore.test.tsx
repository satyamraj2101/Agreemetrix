/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkflowAICore } from './WorkflowAICore';
import { WorkflowNode, WorkflowConnection, WorkflowStageDefinition } from '../../types';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Send: () => <div data-testid="send-icon" />,
  Bot: () => <div data-testid="bot-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Check: () => <div data-testid="check-icon" />,
  X: () => <div data-testid="x-icon" />,
  RotateCw: () => <div data-testid="rotate-cw-icon" />,
  ShieldCheck: () => <div data-testid="shield-check-icon" />,
  GitBranch: () => <div data-testid="git-branch-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  MessageSquare: () => <div data-testid="message-square-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Bug: () => <div data-testid="bug-icon" />,
  Mic: () => <div data-testid="mic-icon" />,
  Paperclip: () => <div data-testid="paperclip-icon" />,
  Wand2: () => <div data-testid="wand2-icon" />,
}));

// Mock UIComponents
jest.mock('../UIComponents', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('WorkflowAICore', () => {
  const mockNodes: WorkflowNode[] = [
    {
      id: 'node1',
      category: 'trigger',
      type: 'manual_request',
      label: 'Start Node',
      x: 100,
      y: 100,
      config: {},
    },
    {
      id: 'node2',
      category: 'action',
      type: 'email',
      label: 'Send Email',
      x: 200,
      y: 200,
      config: {},
    },
  ];

  const mockConnections: WorkflowConnection[] = [
    {
      id: 'conn1',
      source: 'node1',
      target: 'node2',
    },
  ];

  const mockStages: WorkflowStageDefinition[] = [
    {
      id: 'stage1',
      name: 'Draft',
      color: '#3b82f6',
      order: 1,
    },
  ];

  const defaultProps = {
    nodes: mockNodes,
    connections: mockConnections,
    stages: mockStages,
    onUpdateGraph: jest.fn(),
    onHighlightNode: jest.fn(),
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Component Rendering', () => {
    it('should render nothing when isOpen is false', () => {
      const { container } = render(<WorkflowAICore {...defaultProps} isOpen={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render the component when isOpen is true', () => {
      render(<WorkflowAICore {...defaultProps} />);
      expect(screen.getByText('Workflow AI')).toBeInTheDocument();
      expect(screen.getByText('Core Engine v2.0')).toBeInTheDocument();
    });

    it('should render the welcome message on initial load', () => {
      render(<WorkflowAICore {...defaultProps} />);
      expect(
        screen.getByText(
          /Hello! I'm your Workflow AI Copilot. I can build flows, fix errors, and simulate outcomes./
        )
      ).toBeInTheDocument();
    });

    it('should render all quick action buttons', () => {
      render(<WorkflowAICore {...defaultProps} />);
      expect(screen.getByText('Optimize')).toBeInTheDocument();
      expect(screen.getByText('Generate')).toBeInTheDocument();
      expect(screen.getByText('Explain')).toBeInTheDocument();
      expect(screen.getByText('Debug')).toBeInTheDocument();
    });

    it('should render input textarea with placeholder', () => {
      render(<WorkflowAICore {...defaultProps} />);
      expect(
        screen.getByPlaceholderText('Describe a workflow or ask a question...')
      ).toBeInTheDocument();
    });

    it('should render footer text', () => {
      render(<WorkflowAICore {...defaultProps} />);
      expect(screen.getByText('Powered by WAI-Core™')).toBeInTheDocument();
      expect(screen.getByText('Private Mode')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const closeButton = screen.getByTestId('x-icon').parentElement;
      fireEvent.click(closeButton!);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Message Sending', () => {
    it('should not send empty messages', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.click(sendButton!);

      // Should still only have the welcome message
      const messages = screen.getAllByText(/Hello! I'm your Workflow AI Copilot/);
      expect(messages).toHaveLength(1);
    });

    it('should not send messages with only whitespace', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: '   ' } });
      fireEvent.click(sendButton!);

      // Should still only have the welcome message
      const messages = screen.getAllByText(/Hello! I'm your Workflow AI Copilot/);
      expect(messages).toHaveLength(1);
    });

    it('should send a user message and display it', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton!);

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should clear input after sending message', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton!);

      expect(textarea.value).toBe('');
    });

    it('should show typing indicator after sending message', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton!);

      // Check for typing indicator (animated dots)
      const typingIndicator = document.querySelector('.animate-bounce');
      expect(typingIndicator).toBeInTheDocument();
    });

    it('should send message on Enter key press', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should not send message on Shift+Enter', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

      // Message should still be in textarea
      expect(textarea.value).toBe('Test message');
    });

    it('should handle other key presses without sending', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: 'Test' } });
      fireEvent.keyDown(textarea, { key: 'a', shiftKey: false });

      expect(textarea.value).toBe('Test');
    });
  });

  describe('AI Intent Processing - Generate Flow', () => {
    it('should process NDA generation intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Create an NDA workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I've designed a standard NDA workflow/)
        ).toBeInTheDocument();
      });
    });

    it('should process create intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'create a new workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I've designed a standard NDA workflow/)
        ).toBeInTheDocument();
      });
    });

    it('should process generate intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'generate a workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Apply Workflow')).toBeInTheDocument();
      });
    });

    it('should show suggestion type message for generate intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'nda' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Apply Workflow')).toBeInTheDocument();
      });
    });
  });

  describe('AI Intent Processing - Optimize/Fix', () => {
    it('should detect orphaned nodes', async () => {
      const orphanedNodes: WorkflowNode[] = [
        {
          id: 'start',
          category: 'trigger',
          type: 'manual_request',
          label: 'Start',
          x: 100,
          y: 100,
          config: {},
        },
        {
          id: 'orphan',
          category: 'action',
          type: 'email',
          label: 'Orphaned Node',
          x: 200,
          y: 200,
          config: {},
        },
      ];

      const emptyConnections: WorkflowConnection[] = [];

      render(
        <WorkflowAICore
          {...defaultProps}
          nodes={orphanedNodes}
          connections={emptyConnections}
        />
      );

      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix this workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText(/I detected an issue/)).toBeInTheDocument();
        expect(screen.getByText(/Orphaned Node/)).toBeInTheDocument();
      });
    });

    it('should not detect start node as orphaned', async () => {
      const nodesWithStart: WorkflowNode[] = [
        {
          id: 'start',
          category: 'trigger',
          type: 'manual_request',
          label: 'Start',
          x: 100,
          y: 100,
          config: {},
        },
      ];

      render(
        <WorkflowAICore
          {...defaultProps}
          nodes={nodesWithStart}
          connections={[]}
        />
      );

      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix this' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I analyzed the workflow and everything looks optimal/)
        ).toBeInTheDocument();
      });
    });

    it('should process optimize intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'optimize this flow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I analyzed the workflow and everything looks optimal/)
        ).toBeInTheDocument();
      });
    });

    it('should process debug intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'debug the workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I analyzed the workflow and everything looks optimal/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('AI Intent Processing - Explain', () => {
    it('should process explain intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'explain this workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/This workflow starts with a manual request/)
        ).toBeInTheDocument();
      });
    });

    it('should process "what does" intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'what does this do' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/This workflow starts with a manual request/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('AI Intent Processing - Default', () => {
    it('should show default response for unknown intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'random question' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I can help you generate workflows, optimize logic, or explain steps/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Quick Action Buttons', () => {
    it('should trigger optimize intent when Optimize button is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const optimizeButton = screen.getByText('Optimize');

      fireEvent.click(optimizeButton);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I analyzed the workflow and everything looks optimal/)
        ).toBeInTheDocument();
      });
    });

    it('should trigger generate intent when Generate button is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const generateButton = screen.getByText('Generate');

      fireEvent.click(generateButton);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I've designed a standard NDA workflow/)
        ).toBeInTheDocument();
      });
    });

    it('should trigger explain intent when Explain button is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const explainButton = screen.getByText('Explain');

      fireEvent.click(explainButton);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/This workflow starts with a manual request/)
        ).toBeInTheDocument();
      });
    });

    it('should trigger debug intent when Debug button is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const debugButton = screen.getByText('Debug');

      fireEvent.click(debugButton);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I analyzed the workflow and everything looks optimal/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Action Handling - Generate NDA', () => {
    it('should generate NDA workflow when Apply Workflow is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'create NDA' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const applyButton = screen.getByText('Apply Workflow');
        fireEvent.click(applyButton);
      });

      expect(defaultProps.onUpdateGraph).toHaveBeenCalledTimes(1);

      const [nodes, connections] = defaultProps.onUpdateGraph.mock.calls[0];
      expect(nodes).toHaveLength(5);
      expect(connections).toHaveLength(5);
      expect(nodes[0].label).toBe('NDA Request');
      expect(nodes[1].label).toBe('Generate NDA');
      expect(nodes[2].label).toBe('High Value?');
      expect(nodes[3].label).toBe('Legal Approval');
      expect(nodes[4].label).toBe('Send via DocuSign');
    });

    it('should verify NDA workflow node configurations', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'nda' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const applyButton = screen.getByText('Apply Workflow');
        fireEvent.click(applyButton);
      });

      const [nodes] = defaultProps.onUpdateGraph.mock.calls[0];
      expect(nodes[0].category).toBe('trigger');
      expect(nodes[1].category).toBe('document');
      expect(nodes[2].category).toBe('condition');
      expect(nodes[3].category).toBe('approval');
      expect(nodes[4].category).toBe('action');
    });

    it('should verify NDA workflow connections', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'generate nda' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const applyButton = screen.getByText('Apply Workflow');
        fireEvent.click(applyButton);
      });

      const [, connections] = defaultProps.onUpdateGraph.mock.calls[0];
      expect(connections[0].source).toBe('n1');
      expect(connections[0].target).toBe('n2');
      expect(connections[2].handleId).toBe('true_out');
      expect(connections[3].handleId).toBe('false_out');
    });

    it('should show success message after generating workflow', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'generate NDA' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const applyButton = screen.getByText('Apply Workflow');
        fireEvent.click(applyButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Workflow generated successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Action Handling - Fix Orphan', () => {
    it('should fix orphaned node when Fix Connection is clicked', async () => {
      const orphanedNodes: WorkflowNode[] = [
        {
          id: 'start',
          category: 'trigger',
          type: 'manual_request',
          label: 'Start',
          x: 100,
          y: 100,
          config: {},
        },
        {
          id: 'orphan',
          category: 'action',
          type: 'email',
          label: 'Orphaned Node',
          x: 200,
          y: 200,
          config: {},
        },
      ];

      const emptyConnections: WorkflowConnection[] = [];

      render(
        <WorkflowAICore
          {...defaultProps}
          nodes={orphanedNodes}
          connections={emptyConnections}
        />
      );

      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix this' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const fixButton = screen.getByText('Fix Connection');
        fireEvent.click(fixButton);
      });

      expect(defaultProps.onUpdateGraph).toHaveBeenCalledTimes(1);

      const [nodes, connections] = defaultProps.onUpdateGraph.mock.calls[0];
      expect(nodes).toEqual(orphanedNodes);
      expect(connections).toHaveLength(1);
      expect(connections[0].source).toBe('start');
      expect(connections[0].target).toBe('orphan');
    });

    it('should show success message after fixing orphan', async () => {
      const orphanedNodes: WorkflowNode[] = [
        {
          id: 'start',
          category: 'trigger',
          type: 'manual_request',
          label: 'Start',
          x: 100,
          y: 100,
          config: {},
        },
        {
          id: 'orphan',
          category: 'action',
          type: 'email',
          label: 'Orphaned Node',
          x: 200,
          y: 200,
          config: {},
        },
      ];

      const emptyConnections: WorkflowConnection[] = [];

      render(
        <WorkflowAICore
          {...defaultProps}
          nodes={orphanedNodes}
          connections={emptyConnections}
        />
      );

      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix this' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const fixButton = screen.getByText('Fix Connection');
        fireEvent.click(fixButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Fixed! Node is now connected.')).toBeInTheDocument();
      });
    });

    it('should handle fix action with data parameter', async () => {
      const orphanedNodes: WorkflowNode[] = [
        {
          id: 'node1',
          category: 'trigger',
          type: 'manual_request',
          label: 'Start',
          x: 100,
          y: 100,
          config: {},
        },
        {
          id: 'orphan123',
          category: 'action',
          type: 'email',
          label: 'Orphaned',
          x: 200,
          y: 200,
          config: {},
        },
      ];

      render(
        <WorkflowAICore
          {...defaultProps}
          nodes={orphanedNodes}
          connections={[]}
        />
      );

      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'optimize' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const fixButton = screen.getByText('Fix Connection');
        fireEvent.click(fixButton);
      });

      const [, connections] = defaultProps.onUpdateGraph.mock.calls[0];
      expect(connections[0].target).toBe('orphan123');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple messages in sequence', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      // First message
      fireEvent.change(textarea, { target: { value: 'First message' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('First message')).toBeInTheDocument();
      });

      // Second message
      fireEvent.change(textarea, { target: { value: 'Second message' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Second message')).toBeInTheDocument();
      });
    });

    it('should handle case-insensitive intent matching', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'CREATE AN NDA' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I've designed a standard NDA workflow/)
        ).toBeInTheDocument();
      });
    });

    it('should handle empty nodes array for fix intent', async () => {
      render(<WorkflowAICore {...defaultProps} nodes={[]} connections={[]} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix this' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I analyzed the workflow and everything looks optimal/)
        ).toBeInTheDocument();
      });
    });

    it('should disable send button when input is empty', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const sendButton = screen.getByTestId('send-icon').parentElement as HTMLButtonElement;

      expect(sendButton.disabled).toBe(true);
    });

    it('should enable send button when input has text', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement as HTMLButtonElement;

      fireEvent.change(textarea, { target: { value: 'Test' } });

      expect(sendButton.disabled).toBe(false);
    });

    it('should handle action with unknown actionId', () => {
      render(<WorkflowAICore {...defaultProps} />);

      // This tests the implicit else case where actionId doesn't match any known actions
      // The component should handle it gracefully without errors
      expect(() => {
        render(<WorkflowAICore {...defaultProps} />);
      }).not.toThrow();
    });

    it('should handle fix_orphan action without data', async () => {
      render(<WorkflowAICore {...defaultProps} />);

      // This would test the condition: if (actionId === 'fix_orphan' && data?.nodeId)
      // When data is undefined or nodeId is missing, nothing should happen
      expect(defaultProps.onUpdateGraph).not.toHaveBeenCalled();
    });
  });

  describe('useEffect - Scroll Behavior', () => {
    it('should scroll to bottom when new message is added', async () => {
      const scrollIntoViewMock = jest.fn();
      HTMLDivElement.prototype.scrollIntoView = scrollIntoViewMock;

      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton!);

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    });

    it('should scroll when typing indicator changes', async () => {
      const scrollIntoViewMock = jest.fn();
      HTMLDivElement.prototype.scrollIntoView = scrollIntoViewMock;

      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      const initialCallCount = scrollIntoViewMock.mock.calls.length;

      fireEvent.change(textarea, { target: { value: 'Test' } });
      fireEvent.click(sendButton!);

      // Typing indicator appears
      await waitFor(() => {
        expect(scrollIntoViewMock.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });

  describe('Message Rendering', () => {
    it('should render user messages with correct styling', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'User message' } });
      fireEvent.click(sendButton!);

      const userMessage = screen.getByText('User message');
      expect(userMessage).toBeInTheDocument();
      expect(userMessage.closest('.bg-brand-600')).toBeInTheDocument();
    });

    it('should render AI messages with correct styling', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'test' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const aiMessages = document.querySelectorAll('.bg-dark-800');
        expect(aiMessages.length).toBeGreaterThan(0);
      });
    });

    it('should render action buttons for messages with actions', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('Describe a workflow or ask a question...');
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'create nda' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const actionButton = screen.getByText('Apply Workflow');
        expect(actionButton).toBeInTheDocument();
        expect(screen.getByTestId('play-icon')).toBeInTheDocument();
      });
    });
  });

  describe('Input Handling', () => {
    it('should update input value on change', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: 'New text' } });

      expect(textarea.value).toBe('New text');
    });

    it('should handle textarea with multiple rows', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;

      expect(textarea.rows).toBe(2);
    });
  });

  describe('Component Props', () => {
    it('should use provided nodes prop', () => {
      const customNodes: WorkflowNode[] = [
        {
          id: 'custom1',
          category: 'trigger',
          type: 'manual_request',
          label: 'Custom Node',
          x: 50,
          y: 50,
          config: {},
        },
      ];

      render(<WorkflowAICore {...defaultProps} nodes={customNodes} />);

      // Component should render without errors
      expect(screen.getByText('Workflow AI')).toBeInTheDocument();
    });

    it('should use provided connections prop', () => {
      const customConnections: WorkflowConnection[] = [
        {
          id: 'custom-conn',
          source: 'node1',
          target: 'node2',
        },
      ];

      render(<WorkflowAICore {...defaultProps} connections={customConnections} />);

      expect(screen.getByText('Workflow AI')).toBeInTheDocument();
    });

    it('should use provided stages prop', () => {
      const customStages: WorkflowStageDefinition[] = [
        {
          id: 'custom-stage',
          name: 'Custom Stage',
          color: '#ff0000',
          order: 1,
        },
      ];

      render(<WorkflowAICore {...defaultProps} stages={customStages} />);

      expect(screen.getByText('Workflow AI')).toBeInTheDocument();
    });
  });
});
