describe('Goals and Challenges Page Load', () => {
  beforeEach(() => {
    // Add console log to trace API calls
    cy.on('window:before:load', (win) => {
      cy.spy(win.console, 'log');
    });

    // Mock the API responses that are called on component mount
    cy.intercept('GET', '/users/me/goals', {
      statusCode: 200,
      body: {
        content: [
          { id: 1, title: 'gaming', saved: 150, target: 1000, completion: 15 },
        ],
      },
    }).as('fetchGoals');

    cy.intercept('GET', '/users/me/challenges', {
      statusCode: 200,
      body: {
        content: [
          { id: 1, title: 'Coffee Challenge', type:'coffee',perPurchase: 20, saved: 60, target: 100, completion: 60 },
        ],
      },
    }).as('fetchChallenges');

    // Visit the component that triggers these requests in `onMounted`
    cy.visit('/hjem');
  });

  it('loads and displays goals and challenges after onMounted', () => {
    // Wait for API calls made during `onMounted` to complete
    cy.wait(['@fetchGoals', '@fetchChallenges']);

    // Check console logs for any errors or warnings that might indicate issues
    cy.window().then((win) => {
      expect(win.console.log).to.be.calledWithMatch(/Goals:/); // Adjust based on actual logging in your Vue app
    });

    // Assertions to verify the DOM is updated correctly
    cy.get('[data-cy=goal-title]').should('exist').and('contain', 'gaming');
    cy.get('[data-cy=challenge-title]').should('exist').and('contain', 'Coffee Challenge');
  });
});
