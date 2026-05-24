/**
 * TC-CY-02: Unauthenticated access to a protected route redirects to /sign-in.
 *
 * The Next.js middleware (proxy.ts) intercepts the request server-side
 * and returns a redirect before any page content is sent.
 */
describe("TC-CY-02: Protected Route Redirect", () => {
  it("redirects /app to /sign-in when not authenticated", () => {
    // failOnStatusCode: false lets Cypress follow the redirect rather than
    // treating the 302 as a test failure.
    cy.visit("/app", { failOnStatusCode: false });

    cy.url().should("include", "/sign-in");
  });

  it("sign-in page is shown after the redirect", () => {
    cy.visit("/app", { failOnStatusCode: false });

    // Confirm the landing page is actually the sign-in UI, not a blank page
    cy.get("h1").should("have.text", "Breadcrumbs");
    cy.contains("button", "Sign in with Google").should("be.visible");
  });
});
