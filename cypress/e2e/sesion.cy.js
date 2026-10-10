    describe("Sesion en cache", () => {
    beforeEach(() => {
    cy.sesionDemo() // 1a vez inicia sesion; luego restaura de cache
    cy.visit("/") // con la sesion restaurada, entra directo
    })
    it("Entra sin volver a autenticarse", () => {
    cy.get("#admin").should("be.visible")
    })
    it("Reutiliza la sesion en otra prueba", () => {
    cy.get(".fila-producto").should("have.length", 4)
    })
    })