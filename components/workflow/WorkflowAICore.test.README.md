# WorkflowAICore Component Tests

This directory contains comprehensive unit tests for the `WorkflowAICore` component.

## Test Coverage

The test suite covers:

- **Component Rendering**: Tests for conditional rendering based on `isOpen` prop
- **Message Sending**: User input handling, validation, and message display
- **AI Intent Processing**:
  - Generate flow intents (NDA, create, generate)
  - Optimize/fix intents (detecting orphaned nodes)
  - Explain intents
  - Default fallback responses
- **Quick Action Buttons**: All four quick action buttons (Optimize, Generate, Explain, Debug)
- **Action Handling**:
  - Generate NDA workflow
  - Fix orphaned nodes
- **Edge Cases**: Empty inputs, case-insensitive matching, multiple messages, etc.
- **useEffect Hooks**: Scroll behavior on message updates
- **User Interactions**: Keyboard events (Enter, Shift+Enter), button clicks

## Prerequisites

Install the required testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest ts-jest
```

## Configuration

### Jest Configuration (jest.config.js)

Create a `jest.config.js` file in the root directory:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
  collectCoverageFrom: ['components/**/*.{ts,tsx}', '!components/**/*.test.{ts,tsx}'],
};
```

### Jest Setup (jest.setup.js)

Create a `jest.setup.js` file in the root directory:

```javascript
import '@testing-library/jest-dom';
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

The test file (`WorkflowAICore.test.tsx`) is organized into the following sections:

1. **Component Rendering**: Tests basic rendering and conditional display
2. **Close Functionality**: Tests the close button behavior
3. **Message Sending**: Tests user input and message submission
4. **AI Intent Processing**: Tests all AI response types
5. **Quick Action Buttons**: Tests all quick action buttons
6. **Action Handling**: Tests workflow generation and node fixing
7. **Edge Cases**: Tests boundary conditions and error scenarios
8. **useEffect - Scroll Behavior**: Tests automatic scrolling
9. **Message Rendering**: Tests message display styling
10. **Input Handling**: Tests textarea interactions
11. **Component Props**: Tests prop handling

## Coverage Goals

The test suite aims for:
- **Line Coverage**: 100%
- **Statement Coverage**: 100%
- **Function Coverage**: 100%
- **Branch Coverage**: 100%

All major code paths, including:
- All conditional branches in `processAIIntent`
- Both action handlers in `handleAction`
- All user interaction paths
- Edge cases and error scenarios

## Notes

- Tests use `jest.useFakeTimers()` to control the `setTimeout` in `handleSendMessage`
- All lucide-react icons are mocked to avoid rendering issues
- The UIComponents module is mocked with simple implementations
- Tests verify both the UI state and callback invocations
