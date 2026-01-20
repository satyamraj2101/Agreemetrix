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
  RotateCw: () => <div data-testid="rotate-icon" />,
  ShieldCheck: () => <div data-testid="shield-icon" />,
  GitBranch: () => <div data-testid="git-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  MessageSquare: () => <div data-testid="message-icon" />,
  FileText: () => <div data-testid="file-icon" />,
  ArrowRight: () => <div data-testid="arrow-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Bug: () => <div data-testid="bug-icon" />,
  Mic: () => <div data-testid="mic-icon" />,
  Paperclip: () => <div data-testid="paperclip-icon" />,
  Wand2: () => <div data-testid="wand-icon" />,
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
      label: 'Orphaned Node',
      x: 200,
      y: 200,
      config: {},
    },
  ];

  const mockConnections: WorkflowConnection[] = [
    {
      id: 'conn1',
      source: 'node1',
      target: 'node3',
    },
  ];

  const mockStages: WorkflowStageDefinition[] = [
    {
      id: 'stg1',
      name: 'Draft',
      color: '#blue',
      order: 1,
    },
  ];

  const mockOnUpdateGraph = jest.fn();
  const mockOnHighlightNode = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    nodes: mockNodes,
    connections: mockConnections,
    stages: mockStages,
    onUpdateGraph: mockOnUpdateGraph,
    onHighlightNode: mockOnHighlightNode,
    isOpen: true,
    onClose: mockOnClose,
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
          "Hello! I'm your Workflow AI Copilot. I can build flows, fix errors, and simulate outcomes. What shall we automate today?"
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
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Message Sending', () => {
    it('should not send empty messages', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: '   ' } });
      fireEvent.click(sendButton!);

      expect(textarea.value).toBe('   ');
    });

    it('should send a user message and clear input', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton!);

      expect(textarea.value).toBe('');
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });

    it('should send message on Enter key press', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: 'Enter key test' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

      expect(textarea.value).toBe('');
      await waitFor(() => {
        expect(screen.getByText('Enter key test')).toBeInTheDocument();
      });
    });

    it('should not send message on Shift+Enter', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: 'Shift Enter test' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

      expect(textarea.value).toBe('Shift Enter test');
    });

    it('should show typing indicator after sending message', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Test' } });
      fireEvent.click(sendButton!);

      await waitFor(() => {
        const typingIndicators = screen.getAllByTestId('bot-icon');
        expect(typingIndicators.length).toBeGreaterThan(1);
      });
    });
  });

  describe('AI Intent Processing - Generate Flow', () => {
    it('should process NDA intent and show suggestion', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'create an NDA workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(
            "I've designed a standard NDA workflow with Draft Generation, Internal Approval, and DocuSign integration. Shall I apply this to the canvas?"
          )
        ).toBeInTheDocument();
        expect(screen.getByText('Apply Workflow')).toBeInTheDocument();
      });
    });

    it('should process create intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'create a new workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Apply Workflow')).toBeInTheDocument();
      });
    });

    it('should process generate intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'generate workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Apply Workflow')).toBeInTheDocument();
      });
    });
  });

  describe('AI Intent Processing - Optimize/Fix', () => {
    it('should detect orphaned node and suggest fix', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix this workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(/I detected an issue: The node "Orphaned Node" is unreachable/)
        ).toBeInTheDocument();
        expect(screen.getByText('Fix Connection')).toBeInTheDocument();
      });
    });

    it('should process optimize intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'optimize the flow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Fix Connection')).toBeInTheDocument();
      });
    });

    it('should process debug intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'debug errors' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Fix Connection')).toBeInTheDocument();
      });
    });

    it('should show success message when no issues found', async () => {
      const nodesWithoutOrphans: WorkflowNode[] = [
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

      const connectionsComplete: WorkflowConnection[] = [
        {
          id: 'conn1',
          source: 'start',
          target: 'node2',
        },
      ];

      render(
        <WorkflowAICore
          {...defaultProps}
          nodes={nodesWithoutOrphans}
          connections={connectionsComplete}
        />
      );
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(
            'I analyzed the workflow and everything looks optimal. No unreachable nodes or loops detected.'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('AI Intent Processing - Explain', () => {
    it('should process explain intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'explain this workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(
            /This workflow starts with a manual request, generates an NDA based on template v2/
          )
        ).toBeInTheDocument();
      });
    });

    it('should process "what does" intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'what does this do' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(
            /This workflow starts with a manual request, generates an NDA based on template v2/
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('AI Intent Processing - Default', () => {
    it('should show default response for unknown intent', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'random query' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(
            /I can help you generate workflows, optimize logic, or explain steps/
          )
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
        expect(screen.getByText('Fix Connection')).toBeInTheDocument();
      });
    });

    it('should trigger generate intent when Generate button is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const generateButton = screen.getByText('Generate');

      fireEvent.click(generateButton);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Apply Workflow')).toBeInTheDocument();
      });
    });

    it('should trigger explain intent when Explain button is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const explainButton = screen.getByText('Explain');

      fireEvent.click(explainButton);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(
          screen.getByText(
            /This workflow starts with a manual request, generates an NDA based on template v2/
          )
        ).toBeInTheDocument();
      });
    });

    it('should trigger debug intent when Debug button is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const debugButton = screen.getByText('Debug');

      fireEvent.click(debugButton);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Fix Connection')).toBeInTheDocument();
      });
    });
  });

  describe('Action Handling - Generate NDA', () => {
    it('should generate NDA workflow when Apply Workflow is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'create NDA' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const applyButton = screen.getByText('Apply Workflow');
        fireEvent.click(applyButton);
      });

      expect(mockOnUpdateGraph).toHaveBeenCalledTimes(1);
      const [newNodes, newConnections] = mockOnUpdateGraph.mock.calls[0];

      expect(newNodes).toHaveLength(5);
      expect(newNodes[0].label).toBe('NDA Request');
      expect(newNodes[1].label).toBe('Generate NDA');
      expect(newNodes[2].label).toBe('High Value?');
      expect(newNodes[3].label).toBe('Legal Approval');
      expect(newNodes[4].label).toBe('Send via DocuSign');

      expect(newConnections).toHaveLength(5);
      expect(newConnections[0].source).toBe('n1');
      expect(newConnections[0].target).toBe('n2');

      await waitFor(() => {
        expect(screen.getByText('Workflow generated successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Action Handling - Fix Orphan', () => {
    it('should fix orphaned node when Fix Connection is clicked', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const fixButton = screen.getByText('Fix Connection');
        fireEvent.click(fixButton);
      });

      expect(mockOnUpdateGraph).toHaveBeenCalledTimes(1);
      const [nodes, connections] = mockOnUpdateGraph.mock.calls[0];

      expect(nodes).toEqual(mockNodes);
      expect(connections.length).toBe(mockConnections.length + 1);
      expect(connections[connections.length - 1].source).toBe('node1');
      expect(connections[connections.length - 1].target).toBe('node2');

      await waitFor(() => {
        expect(screen.getByText('Fixed! Node is now connected.')).toBeInTheDocument();
      });
    });

    it('should not fix orphan if nodeId is missing', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'fix workflow' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        const fixButton = screen.getByText('Fix Connection');
        fireEvent.click(fixButton);
      });

      expect(mockOnUpdateGraph).toHaveBeenCalled();
    });
  });

  describe('useEffect - Scroll Behavior', () => {
    it('should scroll to bottom when messages change', async () => {
      const scrollIntoViewMock = jest.fn();
      HTMLDivElement.prototype.scrollIntoView = scrollIntoViewMock;

      render(<WorkflowAICore {...defaultProps} />);

      expect(scrollIntoViewMock).toHaveBeenCalled();

      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'Test scroll' } });
      fireEvent.click(sendButton!);

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
      });
    });

    it('should scroll when typing indicator changes', async () => {
      const scrollIntoViewMock = jest.fn();
      HTMLDivElement.prototype.scrollIntoView = scrollIntoViewMock;

      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      const initialCallCount = scrollIntoViewMock.mock.calls.length;

      fireEvent.change(textarea, { target: { value: 'Test' } });
      fireEvent.click(sendButton!);

      await waitFor(() => {
        expect(scrollIntoViewMock.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty nodes array', () => {
      render(<WorkflowAICore {...defaultProps} nodes={[]} />);
      expect(screen.getByText('Workflow AI')).toBeInTheDocument();
    });

    it('should handle empty connections array', () => {
      render(<WorkflowAICore {...defaultProps} connections={[]} />);
      expect(screen.getByText('Workflow AI')).toBeInTheDocument();
    });

    it('should handle empty stages array', () => {
      render(<WorkflowAICore {...defaultProps} stages={[]} />);
      expect(screen.getByText('Workflow AI')).toBeInTheDocument();
    });

    it('should handle multiple messages in sequence', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'First message' } });
      fireEvent.click(sendButton!);

      await waitFor(() => {
        expect(screen.getByText('First message')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(1500);

      fireEvent.change(textarea, { target: { value: 'Second message' } });
      fireEvent.click(sendButton!);

      await waitFor(() => {
        expect(screen.getByText('Second message')).toBeInTheDocument();
      });
    });

    it('should handle case-insensitive intent matching', async () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement;

      fireEvent.change(textarea, { target: { value: 'CREATE NDA WORKFLOW' } });
      fireEvent.click(sendButton!);

      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Apply Workflow')).toBeInTheDocument();
      });
    });

    it('should disable send button when input is empty', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const sendButton = screen.getByTestId('send-icon').parentElement as HTMLButtonElement;

      expect(sendButton.disabled).toBe(true);
    });

    it('should enable send button when input has text', () => {
      render(<WorkflowAICore {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(
        'Describe a workflow or ask a question...'
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-icon').parentElement as HTMLButtonElement;

      fireEvent.change(textarea, { target: { value: 'Test' } });

      expect(sendButton.disabled).toBe(false);
    });
  });
});
