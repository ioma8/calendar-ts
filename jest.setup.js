import '@testing-library/jest-dom'

// Mock global objects for browser environment
if (typeof window !== 'undefined') {
  Object.defineProperty(global, 'URL', {
    value: {
      createObjectURL: jest.fn(() => 'mocked-url'),
      revokeObjectURL: jest.fn(),
    },
    writable: true
  });

  Object.defineProperty(global, 'Blob', {
    value: class Blob {
      constructor(content, options) {
        this.content = content;
        this.type = options?.type || 'text/plain';
      }
    },
    writable: true
  });

  // Mock document.createElement for download tests
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = jest.fn((tagName) => {
    if (tagName === 'a') {
      return {
        click: jest.fn(),
        href: '',
        download: '',
        style: {}
      };
    }
    return originalCreateElement(tagName);
  });
}
