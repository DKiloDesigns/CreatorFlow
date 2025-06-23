/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in using a test session
       * @example cy.loginBySession()
       */
      loginBySession(): Chainable<void>;
    }
  }
}

// Implementation of custom commands
Cypress.Commands.add('loginBySession', () => {
  // Use cy.session to cache login state between tests
  cy.session('test-user', () => {
    // Programmatic login for NextAuth (credentials provider or test endpoint)
    // Example: POST to /api/auth/callback/credentials with test credentials
    // Replace with real test credentials or UI automation as needed
    cy.request({
      method: 'POST',
      url: '/api/auth/callback/credentials',
      form: true,
      body: {
        username: 'testuser@example.com',
        password: 'testpassword',
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(302); // Should redirect on success
    });
  });
});

export {};