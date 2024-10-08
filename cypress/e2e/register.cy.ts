describe('Register', () => {
    beforeEach(() => {
        cy.visit('/registrer')
        cy.contains('h3', 'Registrer deg').click()
    })

    function fullInput() {
        cy.get('input[name="firstName"]').type('firstName')
        cy.get('input[name="lastName"]').type('lastName')
        cy.get('input[name="email"]').type('email@test.work')
        cy.get('input[name="username"]').type('username')
        cy.get('input[name="password"]').type('Password123!')
        cy.get('input[name="confirm"]').type('Password123!')
    }

    it('visits the register page when clicked', () => {
        cy.contains('button[name="submit"]', 'Registrer deg')
    })

    it('disables the login button when no input', () => {
        cy.get('button[name="submit"]').should('be.disabled')
    })

    it('enable the login button when all inputs are filled and l', () => {
        fullInput()

        cy.get('button[name="submit"]').should('not.be.disabled')
    })

    it('pushes the user to the root page on successful register', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/register', {
            body: {
                accessToken: 'fakeToken',
                refreshToken: 'fakeToken'
            }
        }).as('register')

        fullInput()

        cy.get('button[name="submit"]').click()

        cy.wait('@register')
        cy.url().should('include', '/')
    })
})
