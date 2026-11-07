describe("Nuevas pruebas de administracion de productos", () => {
  beforeEach(() => {
    cy.visit("/", { onBeforeLoad(win) { win.localStorage.clear() } })
  })

  function iniciarSesion() {
    cy.get("#usuario").type("admin")
    cy.get("#clave").type("1234")
    cy.get("#btn-login").click()
  }

  it("inicia sesion y muestra el panel de administracion", () => {
    iniciarSesion()
    cy.get("#admin").should("be.visible")
  })

  it("agrega un producto y lo muestra en la tabla", () => {
    iniciarSesion()
    cy.get("#nombre").type("Producto de prueba nuevo")
    cy.get("#precio").type("250")
    cy.get("#stock").type("8")
    cy.get("#btn-guardar").click()
    cy.get(".fila-producto").should("have.length", 6)
    cy.get(".col-nombre").should("contain", "Producto de prueba nuevo")
  })

  it("rechaza un producto con precio 0", () => {
    iniciarSesion()
    cy.get("#nombre").type("Producto con precio invalido")
    cy.get("#precio").type("0")
    cy.get("#stock").type("5")
    cy.get("#btn-guardar").click()
    cy.get("#form-msg").should("contain", "precio")
    cy.get(".fila-producto").should("have.length", 4)
  })
})
