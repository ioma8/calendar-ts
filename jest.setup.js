import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock global objects for browser environment
if (typeof window !== 'undefined') {
  if (typeof global.URL.createObjectURL === 'undefined') {
    Object.defineProperty(global.URL, 'createObjectURL', {
      value: jest.fn(() => 'mocked-url'),
      writable: true,
    });
  } else {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
  }

  if (typeof global.URL.revokeObjectURL === 'undefined') {
    Object.defineProperty(global.URL, 'revokeObjectURL', {
      value: jest.fn(),
      writable: true,
    });
  } else {
    global.URL.revokeObjectURL = jest.fn();
  }

  Object.defineProperty(global, 'Blob', {
    value: class Blob {
      constructor(content, options) {
        this.content = content;
        this.type = options?.type || 'text/plain';
      }
    },
    writable: true
  });

}
