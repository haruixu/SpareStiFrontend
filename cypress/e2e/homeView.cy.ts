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

    // Mock the API responses that are called on component mount
    cy.intercept('GET', '/goals', {
      statusCode: 200,
      body: {
        content: [
          { id: 1, title: 'gaming', saved: 150, target: 1000, completion: 15 },
        ],
      },
    }).as('fetchGoals');

    cy.intercept('GET', '/config', {
      statusCode: 200,
      body: {
        "role": "USER",
        "challengeConfig": {
          "experience": "VERY_HIGH",
          "motivation": "VERY_HIGH",
          "challengeTypeConfigs": [
            {
              "type": "string",
              "generalAmount": 0,
              "specificAmount": 0
            }
          ]
        }
      }
    }).as('fetchConfig');

    cy.intercept('GET', '/challenges/generate', {
      statusCode: 200,
      body: {
        "role": "USER",
        "challengeConfig": {
          "experience": "VERY_HIGH",
          "motivation": "VERY_HIGH",
          "challengeTypeConfigs": [
            {
              "type": "string",
              "generalAmount": 0,
              "specificAmount": 0
            }
          ]
        }
      }
    }).as('fetchConfig');

    cy.intercept('GET', '/challenges/picture?id=1', {
      statusCode: 200,
      body: {
        "role": "USER",
        "challengeConfig": {
          "experience": "VERY_HIGH",
          "motivation": "VERY_HIGH",
          "challengeTypeConfigs": [
            {
              "type": "string",
              "generalAmount": 0,
              "specificAmount": 0
            }
          ]
        }
      }
    }).as('fetchConfig');

    cy.intercept('GET', '/profile', {
      statusCode: 200,
      body: {

      },
    }).as('fetchProfile');
    cy.intercept('GET', '/profile/picture', {
      statusCode: 200,
      body: {

      },
    }).as('fetchProfile');

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





    // Assertions to verify the DOM is updated correctly
    //cy.get('[data-cy=goal-title]').should('exist').and('contain', 'gaming');
    cy.get('[data-cy=challenge-title]').should('exist').and('contain', 'Coffee Challenge');
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
    cy.intercept('GET', '/challenges/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: 'Coffee Challenge',
        type: 'coffee',
        perPurchase: 20,
        saved: 60,
        target: 100,
        completion: 60,
      },
    }).as('fetchChallenge');

    cy.intercept('GET', '/challenges/active?page=0&size=5', {
      statusCode: 200,
      body: {

      },
    }).as('fetchChallenge');
    cy.intercept('GET', '/challenges/completed?page=undefined&size=5', {
      statusCode: 200,
      body: {

      },
    }).as('fetchChallenge');
    cy.intercept('GET', '/challenges/1', {
      statusCode: 200,
      body: {

      },
    }).as('fetchChallenge');
  });
  it('should navigate to profile', () => {
    // Simulate the click on the router-link

    cy.get('[data-cy=hamburger-menu]').click();
    cy.get('[data-cy=profile-link]').click();

    // Optionally, you can check if the URL has changed to '/profil'
    cy.url().should('include', '/profil');

  });

});