# Problem Report: Cypress GitHub OAuth Authentication Fails with Timeout

**Date:** 2025-06-16
**Category:** Authentication / E2E Testing
**Title/Issue:** Cypress GitHub OAuth UI Authentication Fails with Timeout

---

## Summary
Cypress E2E tests for authenticated flows using GitHub OAuth are failing. The failure occurs during the session setup in a custom `loginWithGitHub` command, which attempts to wait for navigation to the GitHub domain before running cross-origin commands. The test times out and is skipped.

---

## Symptoms
- Cypress test fails with:
  ```
  CypressError
  cy.then() timed out after waiting 4000ms.
  Your callback function returned a promise that never resolved.
  ```
- The error occurs in the `cy.window().then(...)` block, which is intended to poll for navigation to `github.com`.
- The test output shows:
  ```
  This error occurred while creating the session. Because the session setup failed, we failed the test.
  Because this error occurred during a before each hook we are skipping the remaining tests in the current suite: Billing and Subscription
  ```
- The callback function in question:
  ```js
  function (win) {
    return new Cypress.Promise(function (resolve) {
      var check = function () {
        if (win.location.hostname.includes('github.com')) {
          resolve();
        }
        else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
  ```

---

## Root Cause Analysis
- The code attempts to wait for the browser to navigate to `github.com` by polling `win.location.hostname`.
- However, Cypress's `cy.window()` always references the AUT (Application Under Test) window, which is your app (`localhost:3001`), **not** the third-party OAuth window.
- As a result, `win.location.hostname` never changes to `github.com`, so the promise never resolves, and Cypress times out.
- This is a known limitation: Cypress cannot directly access or poll the window object of a third-party domain due to browser security restrictions.

---

## Why This Approach Fails
- Cypress's cross-origin support (`cy.origin`) is designed for running commands on a different domain, but it cannot "wait" for navigation to a third-party domain by polling the window object.
- The redirect to GitHub happens in the browser, but Cypress's command chain does not "follow" the navigation in a way that allows you to poll for it.

---

## Impact
- All tests that require GitHub authentication via UI automation are blocked.
- The session setup fails, and the entire suite is skipped.

---

## Recommendations
1. **Use Programmatic Authentication (Recommended for NextAuth):**
   - Instead of automating the UI login, use a programmatic login approach:
     - Call your app's authentication API directly to obtain a session token or cookie.
     - Set the session cookie in Cypress before visiting protected pages.
   - This is the most reliable and fastest way to authenticate in E2E tests.

2. **If UI Automation is Required:**
   - Consider using a stub or mock for the OAuth provider in your test environment.
   - Alternatively, use a test-only endpoint in your app that logs in a test user without going through the OAuth flow.

3. **Cypress Limitations:**
   - Cypress is not well-suited for full third-party OAuth UI flows due to browser security and cross-origin restrictions.
   - See [Cypress docs on authentication](https://docs.cypress.io/guides/end-to-end-testing/authentication) for best practices.

---

## References
- [Cypress Authentication Strategies](https://docs.cypress.io/guides/end-to-end-testing/authentication)
- [Cypress GitHub Issue: OAuth and Cross-Origin](https://github.com/cypress-io/cypress/issues/25524)
- [Cypress cy.origin Documentation](https://docs.cypress.io/api/commands/origin)

---

## Summary Table

| Symptom         | Cause                                      | Solution/Workaround                |
|-----------------|--------------------------------------------|------------------------------------|
| cy.then timeout | Cypress cannot poll window on github.com    | Use programmatic login or stub OAuth| 