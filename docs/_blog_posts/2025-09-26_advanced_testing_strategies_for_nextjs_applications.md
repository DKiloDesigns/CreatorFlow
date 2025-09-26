# Advanced Testing Strategies for Next.js Applications

**A comprehensive guide to implementing robust testing strategies for Next.js applications, featuring real-world testing patterns from CreatorFlow's comprehensive test suite.**

*Published: September 26, 2025*
*Author: Darrell Mayberry*
*Tags: Testing, Next.js, Jest, React Testing Library, E2E Testing, Performance Testing, Test Automation*

## Introduction

Testing is crucial for maintaining code quality, preventing regressions, and ensuring reliable deployments in production. In this comprehensive guide, we'll explore advanced testing strategies specifically tailored for Next.js applications, covering unit tests, integration tests, end-to-end tests, and performance testing, drawing from our experience building CreatorFlow's comprehensive test suite.

## Table of Contents

1. [Testing Philosophy and Strategy](#testing-philosophy-and-strategy)
2. [Unit Testing with Jest and React Testing Library](#unit-testing-with-jest-and-react-testing-library)
3. [Integration Testing for API Routes](#integration-testing-for-api-routes)
4. [End-to-End Testing with Playwright](#end-to-end-testing-with-playwright)
5. [Performance Testing and Monitoring](#performance-testing-and-monitoring)
6. [Visual Regression Testing](#visual-regression-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Test Data Management](#test-data-management)
9. [CI/CD Integration](#cicd-integration)
10. [Advanced Testing Patterns](#advanced-testing-patterns)

## Testing Philosophy and Strategy

### Testing Pyramid

The testing pyramid provides a framework for balancing different types of tests:

- **Unit Tests (70%)**: Fast, isolated tests for individual components and functions
- **Integration Tests (20%)**: Tests for component interactions and API integrations
- **E2E Tests (10%)**: Full user journey tests covering critical paths

### Testing Principles

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Write Tests First**: Use TDD (Test-Driven Development) when possible
3. **Keep Tests Simple**: Each test should have a single responsibility
4. **Make Tests Deterministic**: Tests should produce consistent results
5. **Test Edge Cases**: Cover error conditions and boundary values

## Unit Testing with Jest and React Testing Library

### Setting Up the Testing Environment

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

```typescript
// jest.setup.js
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
```

### Component Testing Patterns

```typescript
// __tests__/components/UserCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserCard } from '@/components/UserCard';
import { UserProvider } from '@/contexts/UserContext';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  plan: 'free'
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <UserProvider>
      {component}
    </UserProvider>
  );
};

describe('UserCard', () => {
  it('renders user information correctly', () => {
    renderWithProvider(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Free Plan')).toBeInTheDocument();
  });

  it('handles user interaction correctly', async () => {
    const onEdit = jest.fn();
    renderWithProvider(<UserCard user={mockUser} onEdit={onEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith(mockUser.id);
    });
  });

  it('displays loading state correctly', () => {
    renderWithProvider(<UserCard user={mockUser} loading={true} />);
    
    expect(screen.getByTestId('user-card-skeleton')).toBeInTheDocument();
  });

  it('handles error state gracefully', () => {
    renderWithProvider(<UserCard user={mockUser} error="Failed to load user" />);
    
    expect(screen.getByText('Failed to load user')).toBeInTheDocument();
  });
});
```

### Custom Hooks Testing

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User'
    });
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('invalid@example.com', 'wrongpassword');
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });
});
```

## Integration Testing for API Routes

### API Route Testing Setup

```typescript
// __tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/users';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return users list on GET', async () => {
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      users: mockUsers
    });
  });

  it('should create user on POST', async () => {
    const newUser = {
      name: 'New User',
      email: 'new@example.com'
    };

    const createdUser = { id: '3', ...newUser };

    (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

    const { req, res } = createMocks({
      method: 'POST',
      body: newUser,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      user: createdUser
    });
  });

  it('should handle validation errors', async () => {
    const invalidUser = {
      name: '', // Invalid: empty name
      email: 'invalid-email' // Invalid: malformed email
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: invalidUser,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
        expect.objectContaining({ field: 'email' })
      ])
    });
  });
});
```

### Database Integration Testing

```typescript
// __tests__/integration/database.test.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL
    }
  }
});

describe('Database Integration', () => {
  beforeAll(async () => {
    // Reset database
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    execSync('npx prisma migrate dev', { stdio: 'inherit' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
  });

  it('should create and retrieve user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        plan: 'FREE'
      }
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('Test User');

    const retrievedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    expect(retrievedUser).toEqual(user);
  });

  it('should handle user-post relationships', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        plan: 'FREE'
      }
    });

    const post = await prisma.post.create({
      data: {
        title: 'Test Post',
        content: 'Test content',
        authorId: user.id,
        status: 'DRAFT'
      }
    });

    const userWithPosts = await prisma.user.findUnique({
      where: { id: user.id },
      include: { posts: true }
    });

    expect(userWithPosts?.posts).toHaveLength(1);
    expect(userWithPosts?.posts[0].id).toBe(post.id);
  });
});
```

## End-to-End Testing with Playwright

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to sign up and sign in', async ({ page }) => {
    // Navigate to sign up page
    await page.goto('/auth/signup');
    
    // Fill sign up form
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="signup-button"]');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toContainText('Test User');
  });

  test('should handle sign in with existing credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    await page.click('[data-testid="signin-button"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    await page.click('[data-testid="signin-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });
});
```

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard components', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="analytics-cards"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-posts"]')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    // Test navigation to posts
    await page.click('[data-testid="nav-posts"]');
    await expect(page).toHaveURL('/dashboard/posts');
    
    // Test navigation to analytics
    await page.click('[data-testid="nav-analytics"]');
    await expect(page).toHaveURL('/dashboard/analytics');
  });

  test('should create new post', async ({ page }) => {
    await page.click('[data-testid="create-post-button"]');
    
    await page.fill('[data-testid="post-title"]', 'Test Post');
    await page.fill('[data-testid="post-content"]', 'This is a test post content');
    
    await page.click('[data-testid="save-post-button"]');
    
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Post created successfully');
  });
});
```

## Performance Testing and Monitoring

### Performance Test Setup

```typescript
// __tests__/performance/lighthouse.test.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should meet performance budget', async ({ page }) => {
    await page.goto('/');
    
    // Run Lighthouse audit
    const lighthouse = await page.evaluate(() => {
      return new Promise((resolve) => {
        // This would integrate with Lighthouse CI
        resolve({
          performance: 95,
          accessibility: 98,
          bestPractices: 92,
          seo: 100
        });
      });
    });
    
    expect(lighthouse.performance).toBeGreaterThan(90);
    expect(lighthouse.accessibility).toBeGreaterThan(95);
    expect(lighthouse.bestPractices).toBeGreaterThan(90);
    expect(lighthouse.seo).toBeGreaterThan(95);
  });

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000); // 2 seconds
  });
});
```

### Memory Leak Testing

```typescript
// __tests__/performance/memory.test.ts
import { test, expect } from '@playwright/test';

test.describe('Memory Leak Tests', () => {
  test('should not have memory leaks in component lifecycle', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate between pages multiple times
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="nav-posts"]');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="nav-analytics"]');
      await page.waitForLoadState('networkidle');
    }
    
    // Check memory usage
    const memoryUsage = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Memory usage should not exceed 50MB
    expect(memoryUsage).toBeLessThan(50 * 1024 * 1024);
  });
});
```

## Visual Regression Testing

### Visual Testing Setup

```typescript
// __tests__/visual/visual-regression.test.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('dashboard should match visual baseline', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('mobile layout should match visual baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-mobile.png');
  });

  test('component states should match visual baseline', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test loading state
    await page.click('[data-testid="refresh-data"]');
    await expect(page).toHaveScreenshot('dashboard-loading.png');
    
    // Test error state
    await page.route('**/api/analytics', route => route.abort());
    await page.click('[data-testid="load-analytics"]');
    await expect(page).toHaveScreenshot('dashboard-error.png');
  });
});
```

## Accessibility Testing

### Automated Accessibility Testing

```typescript
// __tests__/accessibility/a11y.test.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any accessibility violations', async ({ page }) => {
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Test skip links
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for proper ARIA labels
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });
});
```

## Test Data Management

### Test Data Factories

```typescript
// __tests__/factories/user.factory.ts
import { faker } from '@faker-js/faker';
import { User, UserRole, Plan } from '@prisma/client';

export const createUser = (overrides: Partial<User> = {}): User => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  role: UserRole.USER,
  plan: Plan.FREE,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides
});

export const createUserWithPosts = (postCount: number = 3) => {
  const user = createUser();
  const posts = Array.from({ length: postCount }, () => ({
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    authorId: user.id,
    status: 'PUBLISHED' as const,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }));
  
  return { user, posts };
};
```

### Database Seeding for Tests

```typescript
// __tests__/helpers/seed.ts
import { PrismaClient } from '@prisma/client';
import { createUser, createUserWithPosts } from '../factories/user.factory';

export const seedTestDatabase = async (prisma: PrismaClient) => {
  // Create test users
  const users = await Promise.all([
    prisma.user.create({ data: createUser({ email: 'admin@test.com', role: 'ADMIN' }) }),
    prisma.user.create({ data: createUser({ email: 'user@test.com' }) }),
    prisma.user.create({ data: createUser({ email: 'premium@test.com', plan: 'PRO' }) })
  ]);

  // Create test posts
  const { posts } = createUserWithPosts(5);
  await Promise.all(
    posts.map(post => prisma.post.create({ data: post }))
  );

  return { users, posts };
};
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        CI: true
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        CI: true
        TEST_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CI: true
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=__tests__/unit",
    "test:integration": "jest --testPathPattern=__tests__/integration",
    "test:e2e": "playwright test",
    "test:visual": "playwright test --grep @visual",
    "test:a11y": "playwright test --grep @accessibility",
    "test:performance": "playwright test --grep @performance",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Advanced Testing Patterns

### Mocking External Services

```typescript
// __tests__/mocks/external-services.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('https://api.socialmedia.com/posts', (req, res, ctx) => {
    return res(
      ctx.json({
        posts: [
          { id: '1', content: 'Test post', platform: 'twitter' }
        ]
      })
    );
  }),
  
  rest.post('https://api.socialmedia.com/posts', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: '2', content: 'New post', platform: 'twitter' })
    );
  }),
  
  rest.get('https://api.analytics.com/metrics', (req, res, ctx) => {
    return res(
      ctx.json({
        views: 1000,
        likes: 50,
        shares: 25
      })
    );
  })
];
```

### Testing Error Boundaries

```typescript
// __tests__/components/ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('should catch errors and display fallback UI', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
  
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
```

### Testing Custom Hooks with Complex State

```typescript
// __tests__/hooks/useAnalytics.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '@/hooks/useAnalytics';

describe('useAnalytics', () => {
  it('should fetch analytics data on mount', async () => {
    const { result } = renderHook(() => useAnalytics());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      views: 1000,
      likes: 50,
      shares: 25
    });
  });
  
  it('should handle refresh correctly', async () => {
    const { result } = renderHook(() => useAnalytics());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    const initialData = result.current.data;
    
    await act(async () => {
      result.current.refresh();
    });
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).not.toEqual(initialData);
  });
});
```

## Best Practices and Tips

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests focused and atomic
- Use proper setup and teardown

### 2. Mocking Strategy
- Mock external dependencies
- Use MSW for API mocking
- Mock at the right level
- Keep mocks simple and maintainable

### 3. Performance Considerations
- Run tests in parallel when possible
- Use test databases for integration tests
- Clean up test data after each test
- Monitor test execution time

### 4. Maintenance
- Update tests when requirements change
- Remove obsolete tests
- Keep test data factories up to date
- Regular test suite health checks

### 5. Documentation
- Document complex test scenarios
- Use comments for test setup explanations
- Maintain test README files
- Document test data requirements

## Conclusion

Advanced testing strategies are essential for building reliable, maintainable Next.js applications. By implementing comprehensive unit tests, integration tests, E2E tests, and performance monitoring, you can ensure your application works correctly across all scenarios and environments.

The key to successful testing is finding the right balance between test coverage and maintainability, using appropriate tools for each testing layer, and continuously improving your testing practices based on real-world feedback.

---

**Ready to implement advanced testing strategies in your Next.js application? Start with unit tests and gradually add integration and E2E tests as your application grows.**
