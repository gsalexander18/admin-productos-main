// cypress/e2e/reto.cy.js
describe("Seguridad de la sesion", () => {
it("Un login fallido NO debe dar acceso al recargar", () => {
cy.visit("/", { onBeforeLoad(win) { win.localStorage.clear() } })
// Se intenta entrar con una contrasena incorrecta
cy.get("#usuario").type("admin")
cy.get("#clave").type("clave-incorrecta")
cy.get("#btn-login").click()
// Se recarga la pagina (como si el atacante volviera a entrar)
cy.reload()
// El panel de administracion NO deberia verse: el login fallo
cy.get("#admin").should("not.be.visible")
})
})