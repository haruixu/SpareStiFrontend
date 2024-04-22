describe('Login', () => {
    beforeEach(() => {
        cy.visit('/login')
    })

    function fullInput() {
        cy.get('input[name=username]').type('test')
        cy.get('input[name=password]').type('test')
    }

    it('visits the login page as default', () => {
        cy.contains('button', 'Logg inn')
    })

    it('disables the login button when no input', () => {
        cy.contains('button', 'Logg inn').should('be.disabled')
    })

    it('disables the login button when only username is input', () => {
        cy.get('input[name=username]').type('test')
        cy.contains('button', 'Logg inn').should('be.disabled')
    })

    it('disables the login button when only password is input', () => {
        cy.get('input[name=password]').type('test')
        cy.contains('button', 'Logg inn').should('be.disabled')
    })

    it('enables the login button when both username and password is input', () => {
        fullInput()
        cy.contains('button', 'Logg inn').should('not.be.disabled')
    })

    it('pushes the the user to root page on successful login', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/login', {
            body: {
                accessToken: 'fakeToken',
                refreshToken: 'fakeToken'
            }
        }).as('login')

        fullInput()

        cy.get('button[name=submit]').click()

        cy.wait('@login')

        cy.url().should('include', '/')
    })
})
