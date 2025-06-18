// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      loginBySession(): Chainable<void>
      loginWithGitHub(): Chainable<void>
    }
  }
}

// Custom command for logging in using session
Cypress.Commands.add('loginBySession', () => {
  cy.session('user', () => {
    // This assumes you're already logged in via the browser
    // The session will be preserved between tests
  })
})

Cypress.Commands.add('loginWithGitHub', () => {
  cy.session('github-login', () => {
    cy.visit('/api/auth/signin/github');
    // Wait until the browser is actually on GitHub before running cy.origin
    cy.window().then((win) => {
      return new Cypress.Promise((resolve) => {
        const check = () => {
          if (win.location.hostname.includes('github.com')) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    });
    cy.origin('https://github.com', { args: {
      username: Cypress.env('github_username'),
      password: Cypress.env('github_password')
    } }, ({ username, password }) => {
      cy.url().should('include', 'github.com/login');
      cy.get('input[name="login"]').type(username, { log: false });
      cy.get('input[name="password"]').type(password, { log: false });
      cy.get('input[type="submit"]').click();
      cy.get('button[name="authorize"]').then($btn => {
        if ($btn.length) {
          cy.wrap($btn).click({ force: true });
        }
      });
    });
    cy.url().should('include', 'localhost:3001');
  });
});

// Import commands.js using ES2015 syntax:
import './commands'