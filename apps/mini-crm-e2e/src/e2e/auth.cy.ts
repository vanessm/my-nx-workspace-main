/**
 * E2E tests for authentication flow
 */

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-in');
  });

  it('should display the sign-in page', () => {
    cy.contains('Connexion').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should navigate to sign-up page', () => {
    cy.contains('Créer un compte').click();
    cy.url().should('include', '/auth/sign-up');
    cy.contains('Inscription').should('be.visible');
  });

  it('should show validation errors on empty form submission', () => {
    cy.get('button[type="submit"]').click();
    // Form should not submit and show validation errors
    cy.url().should('include', '/auth/sign-in');
  });

  it('should allow user to sign in with valid credentials', () => {
    // First, create a user via sign-up to ensure we have valid credentials
    const uniqueEmail = `signin-${Date.now()}@example.com`;
    const password = 'password123';

    // Create user via sign-up
    cy.visit('/auth/sign-up');
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').last().type(password);
    cy.get('button[type="submit"]').click();

    // Wait for redirect to orders page after sign-up
    cy.url().should('include', '/orders', { timeout: 10000 });

    // Clear session/localStorage to simulate logout
    cy.clearLocalStorage();
    cy.clearCookies();

    // Now visit sign-in page
    cy.visit('/auth/sign-in');

    // Test sign-in with the newly created user
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Should redirect to orders page after successful login
    cy.url().should('include', '/orders', { timeout: 10000 });
  });

  it('should allow user to sign up', () => {
    cy.visit('/auth/sign-up');

    // Generate a unique email to avoid conflicts with existing users
    const uniqueEmail = `test-${Date.now()}@example.com`;

    // Fill in the sign-up form
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').first().type('password123');
    cy.get('input[type="password"]').last().type('password123');
    cy.get('button[type="submit"]').click();

    // Should redirect to orders page after successful registration
    cy.url().should('include', '/orders', { timeout: 10000 });
  });
});
