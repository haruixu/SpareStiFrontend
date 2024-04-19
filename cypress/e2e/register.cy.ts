describe('Register and login', () => {
    beforeEach(() => {
        cy.visit('/login')
        cy.contains('h3', 'Registrer deg').click()
    })

    it('visits the register page when clicked', () => {
        cy.contains('button', 'Registrer deg')
    })

    it('disables the login button when no input', () => {
        cy.contains('button', 'Registrer deg').should('be.disabled')
    })

    it('disables the login button when only username is input', () => {
        cy.get('input[name=username]').type('test')
        cy.contains('button', 'Registrer deg').should('be.disabled')
    })

    it('disables the login button when only password is input', () => {
        cy.get('input[name=password]').type('test')
        cy.contains('button', 'Registrer deg').should('be.disabled')
    })

    it('enables the login button when both username and password is input', () => {
        cy.get('input[name=username]').type('test')
        cy.get('input[name=password]').type('test')
        cy.contains('button', 'Registrer deg').should('not.be.disabled')
    })
})
