// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

// Mock environment variables
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.REDIS_TOKEN = 'test-token';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Global Request mock for Node test environment
global.Request = jest.fn().mockImplementation((input, init) => ({
  ...input,
  ...init,
  headers: new Headers(init?.headers),
}));

// Extend expect with Jest matchers
expect.extend({
  toHaveBeenCalledWith(received, ...args) {
    const pass = received.mock.calls.some(call => 
      args.every((arg, i) => 
        typeof arg === 'function' ? arg(call[i]) : arg === call[i]
      )
    );
    return {
      pass,
      message: () => 
        `expected ${received.getMockName()} to have been called with ${args.join(', ')}`,
    };
  },
  toBeNull(received) {
    const pass = received === null;
    return {
      pass,
      message: () => `expected ${received} to be null`,
    };
  },
  toEqual(received, expected) {
    const pass = JSON.stringify(received) === JSON.stringify(expected);
    return {
      pass,
      message: () => `expected ${JSON.stringify(received)} to equal ${JSON.stringify(expected)}`,
    };
  },
  toBe(received, expected) {
    const pass = received === expected;
    return {
      pass,
      message: () => `expected ${received} to be ${expected}`,
    };
  },
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Global test setup
global.fetch = jest.fn() 