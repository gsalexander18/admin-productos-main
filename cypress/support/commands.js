        Cypress.Commands.add("sesionDemo", () => {
        cy.session("admin-demo", () => {
        cy.visit("/")
        cy.get("#usuario").type("admin")
        cy.get("#clave").type("1234")
        cy.get("#btn-login").click()
        cy.get("#admin").should("be.visible") // confirma el login
        })
        })