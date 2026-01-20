/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import '@testing-library/jest-dom';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock Date.now for consistent timestamps in tests
global.Date.now = jest.fn(() => 1234567890);

