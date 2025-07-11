// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'whatwg-fetch';
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

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: {
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      status: 'authenticated',
    }
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock NextResponse.json for API route tests
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: (data, init) => ({
        status: init?.status || 200,
        json: async () => data,
      }),
    },
  };
});

// Suppress console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
}) 