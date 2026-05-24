const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://breadcrumbs-rose.vercel.app",
    // Give Vercel's cold-start some extra headroom
    pageLoadTimeout: 15000,
    defaultCommandTimeout: 8000,
    specPattern: "cypress/e2e/**/*.cy.js",
  },
});
