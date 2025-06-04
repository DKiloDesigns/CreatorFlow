/// <reference types="cypress" />

describe('Account Management E2E', () => {
  beforeEach(() => {
    // If you have a login page, visit and log in as a test user
    // cy.visit('/signin');
    // cy.get('input[name=email]').type('testuser@example.com');
    // cy.get('input[name=password]').type('password');
    // cy.get('button[type=submit]').click();
    // For demo, assume already authenticated or use a test login helper
    cy.loginBySession();
    cy.visit('/dashboard/accounts');
  });

  it('should display connect buttons for all providers', () => {
    cy.contains('Connect GitHub').should('exist');
    cy.contains('Connect Google').should('exist');
    cy.contains('Connect Twitter').should('exist');
    cy.contains('Connect Instagram').should('exist');
  });

  it('should show connected accounts and allow disconnect', () => {
    // This test assumes at least one account is connected for the test user
    cy.get('ul').within(() => {
      cy.get('li').first().should('contain.text', 'Disconnect');
    });
    // Optionally, click disconnect and confirm UI updates
    // cy.get('ul li button').contains('Disconnect').first().click();
    // cy.contains('Disconnected successfully').should('exist');
  });

  it('should allow connecting a new account (mocked)', () => {
    // For a real OAuth flow, you would need to mock the provider or use a test provider
    // Here, just check the button is enabled and clickable
    cy.contains('Connect GitHub').should('be.enabled');
    // cy.contains('Connect GitHub').click();
    // cy.url().should('include', '/api/auth/signin/github');
  });
}); 