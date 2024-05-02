/*import { useUserStore } from '../../src/stores/userStore'

describe('Goals and Challenges Page Load', () => {
  let userStore;

  beforeEach(() => {
    // Add console log to trace API calls
    cy.on('window:before:load', (win) => {
      cy.spy(win.console, 'log');
    });

    cy.window().then((win) => {
      win.sessionStorage.setItem('accessToken', 'validAccessToken');
      win.localStorage.setItem('refreshToken', 'validRefreshToken');
    });

    userStore = {
        user: {
            isConfigured: true
        },
        checkIfUserConfigured: cy.stub().resolves(),
      };

    cy.stub(window, useUserStore()).returns(userStore);

    // Mock the API responses that are called on component mount
    cy.intercept('GET', '/goals', {
      statusCode: 200,
      body: {
        content: [
          { id: 1, title: 'gaming', saved: 150, target: 1000, completion: 15 },
        ],
      },
    }).as('fetchGoals');
    // Mock the POST request for renewing the token if it's not implemented in the backend
    cy.intercept('POST', '/auth/renewToken', {
      statusCode: 200,
      body: {
        accessToken: 'newlyRenewedAccessToken'
      }
    }).as('renewToken');

    cy.intercept('GET', '/challenges', {
      statusCode: 200,
      body: {
        content: [
          { id: 1, title: 'Coffee Challenge', type:'coffee',perPurchase: 20, saved: 60, target: 100, completion: 60 },
        ],
      },
    }).as('fetchChallenges');

    cy.intercept('GET', '/profile/streak', {
      statusCode: 200,
      body: {
        content: [
          { streak: 1, startDate: "2026-04-29T12:10:38.308Z" },
        ],
      },
    }).as('fetchChallenges');
    // Visit the component that triggers these requests in `onMounted`
    cy.visit('/hjem');
  });

  it('loads and displays goals and challenges after onMounted', () => {
    // Wait for API calls made during `onMounted` to complete
    cy.wait(['@fetchGoals', '@fetchChallenges']);
    // Mock the POST request for renewing the token if it's not implemented in the backend
    cy.intercept('POST', '/auth/renewToken', {
      statusCode: 200,
      body: {
        accessToken: 'newlyRenewedAccessToken'
      }
    }).as('renewToken');

    // Check console logs for any errors or warnings that might indicate issues
    cy.window().then((win) => {
      expect(win.console.log).to.be.calledWithMatch(/Goals:/); // Adjust based on actual logging in your Vue app
    });

    // Assertions to verify the DOM is updated correctly
    cy.get('[data-cy=goal-title]').should('exist').and('contain', 'gaming');
    cy.get('[data-cy=challenge-title]').should('exist').and('contain', 'Coffee Challenge');
  });
  it('Should increment a challenges progress when the increment button is clicked', () => {
  cy.wait('@fetchChallenges');
    // Separate aliases for clarity
    cy.intercept('PUT', '/challenges/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: 'Coffee Challenge',
        type: 'coffee',
        perPurchase: 20,
        saved: 80,  // this is the updated amount
        target: 100,
        completion: 80,
      },
    }).as('incrementChallenge1');


    cy.intercept('PUT', '/goals/1', {
      statusCode: 200,
      body:  { id: 1, title: 'gaming', saved: 170, target: 1000, completion: 15 },
    }).as('incrementChallenge');

    // Mock the POST request for renewing the token if it's not implemented in the backend
    cy.intercept('POST', '/auth/renewToken', {
      statusCode: 200,
      body: {
        accessToken: 'newlyRenewedAccessToken'
      }
    }).as('renewToken');
    cy.get('[data-cy=increment-challenge1]').click();
    cy.wait('@incrementChallenge1'); // Wait for the specific challenge update intercept

    // Check if the progress bar reflects the right percentage
    cy.get('[data-cy=challenge-progress]')
    .invoke('attr', 'style')
    .should('contain', 'width: 80%');  // Directly check the style attribute for the width
  });
  it('Should navigate to the spare challenges page when adding a new challenge', () => {
    // Mock the routing to the spare challenges page
    cy.intercept('GET', '/spareutfordringer', {
      statusCode: 200,
      body: { content: 'Spare Challenges Page' }
    }).as('spareChallenges');

    // Trigger the route change
    cy.get('[data-cy=challenge-icon-1]').click();

    // Assert that navigation has occurred
    cy.url().should('include', '/spareutfordringer/rediger/1');
  });

});
*/