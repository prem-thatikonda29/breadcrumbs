/**
 * TC-CY-01: Sign-in page renders the correct heading and Google OAuth button.
 */
describe("TC-CY-01: Sign-In Page UI", () => {
  beforeEach(() => {
    cy.visit("/sign-in");
  });

  it("displays 'Breadcrumbs' as the main heading", () => {
    cy.get("h1").should("be.visible").and("have.text", "Breadcrumbs");
  });

  it("shows a visible, enabled Google sign-in button", () => {
    cy.contains("button", "Sign in with Google")
      .should("be.visible")
      .and("not.be.disabled");
  });
});
