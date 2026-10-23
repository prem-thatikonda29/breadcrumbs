/**
 * TC-CY-03: Negative tests — invalid sign-in attempts should show errors, not redirect.
 */
describe("TC-CY-03: Sign-In Negative Cases", () => {
  beforeEach(() => {
    cy.visit("/sign-in");
  });

  it("shows an error when signing in with a non-existent email", () => {
    cy.get("input[type='email']").type("nobody@fake.com");
    cy.get("input[type='password']").type("somepassword123");
    cy.get("button[type='submit']").click();

    // Error message should appear and user should NOT be redirected
    cy.get("p.text-red-500").should("be.visible");
    cy.url().should("include", "/sign-in");
  });

  it("shows an error when signing in with a wrong password", () => {
    cy.get("input[type='email']").type("373premthatikonda@gmail.com");
    cy.get("input[type='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();

    // Error message should appear and user should NOT be redirected
    cy.get("p.text-red-500").should("be.visible");
    cy.url().should("include", "/sign-in");
  });
});
