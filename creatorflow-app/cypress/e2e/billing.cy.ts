/// <reference types="cypress" />

describe('Billing and Subscription', () => {
  beforeEach(() => {
    cy.loginWithGitHub();
    cy.visit('/dashboard/billing');
  });

  it('should display all available plans', () => {
    cy.contains('Plans').click();
    cy.contains('Basic').should('be.visible');
    cy.contains('Pro').should('be.visible');
    cy.contains('Business Suite').should('be.visible');
  });

  it('should open Stripe portal when clicking Manage Subscription', () => {
    cy.contains('Overview').click();
    cy.contains('Manage Subscription').click();
    cy.url().should('include', 'stripe.com');
  });

  it('should start checkout when selecting a plan', () => {
    cy.contains('Plans').click();
    cy.contains('Get Pro').click();
    cy.url().should('include', 'stripe.com');
  });

  it('should show payment success and cancellation banners', () => {
    cy.visit('/dashboard/billing?success=true');
    cy.contains('Payment successful!').should('be.visible');
    cy.visit('/dashboard/billing?canceled=true');
    cy.contains('Payment canceled').should('be.visible');
  });

  it('should show error toast if checkout session fails', () => {
    cy.contains('Plans').click();
    cy.intercept('POST', '/api/billing/create-checkout-session', {
      statusCode: 500,
      body: { error: 'Failed to create checkout session' }
    }).as('createCheckoutSession');
    cy.contains('Get Pro').click();
    cy.wait('@createCheckoutSession');
    cy.contains('Failed to create checkout session').should('be.visible');
  });
}); 