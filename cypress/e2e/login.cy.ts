describe('Register and login', () => {
    beforeEach(() => {
        cy.visit('/login')
    })

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
        cy.get('input[name=username]').type('test')
        cy.get('input[name=password]').type('test')
        cy.contains('button', 'Logg inn').should('not.be.disabled')
    })

    it('visits the register page when clicked', () => {
        cy.contains('h3', 'Registrer deg').click()
        cy.contains('button', 'Registrer deg')
    })
})
