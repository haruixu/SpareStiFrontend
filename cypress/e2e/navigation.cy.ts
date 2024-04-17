// https://on.cypress.io/api

describe('Testing site navigation', () => {
  it('visits the home page', () => {
    cy.visit('/')
    cy.contains('nav', 'Hjem')
  })
})
