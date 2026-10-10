describe("Admin de Productos", () => {

  beforeEach(() => {
    // Empezar siempre desde cero: se limpia el almacenamiento antes de
    // cargar la pagina, asi se cargan los 4 productos del CSV (semilla).
    cy.visit("/", { onBeforeLoad(win) { win.localStorage.clear() } })
  })

  function entrar() {
    cy.get("#usuario").type("admin")
    cy.get("#clave").type("1234")
    cy.get("#btn-login").click()
  }

  it("Login correcto muestra el panel", () => {
    entrar()
    cy.get("#admin").should("be.visible")
    cy.get(".fila-producto").should("have.length", 4)   // los 4 del CSV
  })

  it("Login incorrecto muestra error", () => {
    cy.get("#usuario").type("admin")
    cy.get("#clave").type("malo")
    cy.get("#btn-login").click()
    cy.get("#login-msg").should("contain", "incorrect")
  })

  it("Agregar un producto lo anade a la tabla", () => {
    entrar()
    cy.get("#nombre").type("Webcam")
    cy.get("#precio").type("250")
    cy.get("#stock").type("8")
    cy.get("#btn-guardar").click()
    cy.get(".fila-producto").should("have.length", 5)
    cy.get(".col-nombre").should("contain", "Webcam")
  })

  it("Validacion: no deja agregar con precio 0", () => {
    entrar()
    cy.get("#nombre").type("Invalido")
    cy.get("#precio").type("0")
    cy.get("#stock").type("5")
    cy.get("#btn-guardar").click()
    cy.get("#form-msg").should("contain", "precio")
    cy.get(".fila-producto").should("have.length", 4)   // no se agrego
  })

  it("Eliminar un producto lo quita de la tabla", () => {
    entrar()
    cy.get(".fila-producto").first().find(".btn-eliminar").click()
    cy.get(".fila-producto").should("have.length", 3)
  })

  it("Editar un producto actualiza su nombre", () => {
    entrar()
    cy.get(".fila-producto").first().find(".btn-editar").click()
    cy.get("#nombre").clear().type("Teclado Pro")
    cy.get("#btn-guardar").click()
    cy.get(".col-nombre").should("contain", "Teclado Pro")
  })

  it("Un producto agotado se muestra como Agotado", () => {
    entrar()
    cy.get(".agotado").should("contain", "Agotado")     // Audifonos (stock 0)
  })

})
