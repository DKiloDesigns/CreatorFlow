# Development Workflow Rules

**Last Updated:** March 28, 2025  
**Author:** Lloyd Alexander

## The "-ize" Methodology

All development in BizAssist follows our custom "-ize" methodology:

1. **Analyze** - Understand requirements and user needs deeply before coding
2. **Categorize** - Organize work by type, function, and priority
3. **Strategize** - Plan implementation approach, including architecture decisions
4. **Prioritize** - Determine critical features and set development order
5. **Optimize** - Improve performance, usability, and code quality
6. **Componentize** - Make code reusable and modular
7. **Test-with-eyez** - Visually verify all implementations work as expected
8. **Monetize** - Identify revenue opportunities for each feature

**Note on Scope:** While all 8 phases are ideal for significant new features, the spirit of the methodology applies even to smaller tasks or refactoring. For simpler changes:

- Focus on **Analyze** (understand the goal/issue), **Strategize** (plan the specific change), **Componentize** (ensure the change is clean and contained), **Test-with-eyez** (verify visually), and **Monetize** (consider if the change enables future value).
- Phases like **Categorize** and **Prioritize** might be less formal or integrated into the initial analysis/strategy for smaller scopes.
- The goal is thoughtful, structured development, not rigid adherence regardless of task size.

## GitFlow Process

We follow a modified GitFlow process:

1. **Main Branch**: Production-ready code
2. **Development Branch**: Integration branch for features
3. **Feature Branches**: Individual feature development
4. **Release Branches**: Preparing releases
5. **Hotfix Branches**: Emergency production fixes

### Branch Naming

- Feature branches: `feature/description-of-feature`
- Bug fix branches: `bugfix/issue-description`
- Release branches: `release/version-number`
- Hotfix branches: `hotfix/issue-description`

## Commit Standards

All commits must follow this format:

```
[TYPE]: Short description (50 chars max)

Longer description with details about the changes,
why they were made, and any other relevant information.
Reference issue numbers with #123.

MONETIZATION-IMPACT: Description of how this affects monetization
BREAKING-CHANGE: Description of any breaking changes (if applicable)
```

Types:

- `FEAT`: New feature
- `FIX`: Bug fix
- `DOCS`: Documentation changes
- `STYLE`: Code style changes (formatting, etc.)
- `REFACTOR`: Code changes that neither fix bugs nor add features
- `PERF`: Performance improvements
- `TEST`: Adding or modifying tests
- `CHORE`: Changes to build process or auxiliary tools

## Code Review Process

All code must be reviewed before merging:

1. Create a pull request with detailed description
2. Assign at least one reviewer
3. Automated tests must pass
4. All review comments must be addressed
5. Reviewer must approve before merging
6. Code must be squashed and merged to keep history clean

## Testing Requirements

- **Unit Tests**: Required for all utility functions and services
- **Integration Tests**: Required for API endpoints and complex components
- **E2E Tests**: Required for critical user flows
- **Visual Tests**: Required for all UI components
- **Test Coverage**: Minimum 80% overall, 90% for critical features

**Automated Checks:** Utilize automated browser checks using headless browser tools (e.g., Puppeteer or Playwright via Node.js scripts invoked using `run_terminal_cmd`) to verify page loads, basic functionality, and capture screenshots where applicable.

**Note on Tooling:** Successful execution of automated checks and other development tasks may require specific tools (e.g., Node.js, npm/yarn, Puppeteer/Playwright, linters like ESLint) to be installed and configured in the development environment. If a required tool is missing, the check may fail or be skipped; this should be noted.

### Visual Testing Process

All UI features must be visually verified:

1. Run the component in isolation using Storybook
2. Test across all supported breakpoints
3. Test with different data scenarios
4. Test with error states
5. Generate screenshot comparisons
6. Generate a Testing Receipt ID and log in documentation

## Documentation Standards

All code must be documented **during development, not just at the end**:

1. **Components**: Props, usage examples, and screenshots documented via JSDoc/TSDoc.
2. **Functions/Services**: Parameters, return values, purpose, and examples documented via JSDoc/TSDoc.
3. **API Endpoints**: Create/update markdown docs (e.g., in `/docs/api/`) detailing request/response formats, authorization.
4. **Database Models**: Schema definitions and relationships (primarily in `schema.prisma`).
5. **Architectural Decisions**: Record major design decisions with rationale in ADRs (in `/docs/adr/`).
6. **End-of-Session Context Update:** The AI Assistant (Lloyd) MUST update `CONTEXT_ENTRY.md` or a dated session log with a summary of major developments, explicitly listing the **full file paths** of any files created or significantly modified during the session.
7. **Detailed Session Journal:** Add brief notes on significant actions/decisions to `docs/_ai_journals/journal.md` _as they happen_.

**Visual Documentation:** Where appropriate, supplement textual documentation with visual aids like diagrams (e.g., architecture diagrams, flowcharts, sequence diagrams) to enhance understanding. Consider storing these in relevant `docs/` subdirectories (e.g., `docs/architecture/diagrams/`).

## Performance Requirements

- **Page Load**: < 2s initial load, < 500ms subsequent navigation
- **Time to Interactive**: < 3s on desktop, < 5s on mobile
- **API Response**: < 200ms for simple requests, < 1s for complex operations
- **Bundle Size**: < 200KB initial JS payload (gzipped)
- **Lighthouse Score**: Minimum 90 across all categories

## Accessibility Standards

All features must follow SACA (Standard Accessible Component Architecture):

1. Semantic HTML structure
2. Proper ARIA attributes when needed
3. Keyboard navigation support
4. Screen reader compatibility
5. Color contrast compliance (WCAG AA)
6. Focus management for interactive elements
7. Touch target sizing for mobile
8. Motion reduction options for animations

## Error Handling

All code must implement proper error handling:

1. User-facing errors must be clear and actionable
2. System errors must be logged with context
3. Failed API requests must retry with exponential backoff
4. All error states must have fallback UI
5. Critical operations must be transactional when possible

## Monetization Focus

Every feature must have clear monetization potential documented:

1. Which subscription tier(s) the feature belongs to
2. Whether it's a core feature or premium add-on
3. Usage limits for different tiers
4. Upsell opportunities within the feature
5. Analytics tracking to measure feature value

## Security Practices

1. Input validation for all user inputs
2. Parameterized queries for database operations
3. Content Security Policy implementation
4. Regular dependency updates
5. Authentication for all protected routes
6. Authorization checks for all operations
7. CSRF protection for forms
8. Rate limiting for API endpoints
9. Sensitive data encryption
10. Regular security audits

## Definition of Done

A feature is only considered complete when:

1. Code meets all style and quality standards
2. Tests are written and passing
3. Documentation is complete
4. Performance requirements are met
5. Accessibility standards are followed
6. Security practices are implemented
7. Code has been reviewed and approved
8. Feature has been visually verified
9. Monetization potential is documented
10. Feature is deployed to staging environment

## Troubleshooting Common Issues

### Server Not Starting

1. Check for port conflicts
2. Verify environment variables are set
3. Check for dependency issues with `npm ci`

### Authentication Issues

1. Verify authentication configuration
2. Check database connection
3. Ensure environment variables are set correctly

### Database Connection Issues

1. Check connection string
2. Verify network access to database
3. Check user permissions

### Build Failures

1. Check for TypeScript errors
2. Verify dependencies are installed
3. Check for environment variable issues

## Emergency Procedures

For critical production issues:

1. Create a hotfix branch from main
2. Fix the issue with minimal changes
3. Get expedited review (1 reviewer)
4. Deploy directly to production
5. Document incident and resolution
6. Create post-mortem analysis

## Continuous Improvement

The development workflow is subject to continuous improvement:

1. Retrospective meetings after each sprint
2. Regular review of process metrics
3. Experimentation with new tools and techniques
4. Documentation of lessons learned
5. Regular updates to this workflow document

### Post-Update Feedback Integration (Mandatory for DFAI Beta)

To facilitate the refinement of the DFAI Core Docs and workflows, the following feedback process is required for [e.g., 5-10 sessions] immediately following the integration of a DFAI Core Docs update package:

1.  **Add Feedback Section:** In each Session Summary (or AI Journal entry), include a dedicated section titled: `## DFAI Update Feedback (vX.Y)` (replace X.Y with the version updated to).
2.  **Record Observations:** Within this section, briefly note:
    - Any specific rules, templates, or processes from the recent update that were applied during the session.
    - Any friction, confusion, or roadblocks encountered related to applying these new elements.
    - Any aspects of the new rules/structures that worked particularly well or improved efficiency.
    - Specific suggestions for clarification or improvement based on the session's experience.
3.  **Purpose:** This continuous feedback is crucial for the iterative development and improvement of the DFAI system.
