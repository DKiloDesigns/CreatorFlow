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
  cy.request('POST', '/api/test-login');
});

export {};