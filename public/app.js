let productos = [];
let editandoId = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-login").addEventListener("click", login);
  document.getElementById("btn-logout").addEventListener("click", logout);
  document.getElementById("btn-guardar").addEventListener("click", guardarProducto);
  cargarProductos();
});

/* ---------- LOGIN ---------- */
function login() {
  const u = document.getElementById("usuario").value.trim();
  const c = document.getElementById("clave").value.trim();
  const msg = document.getElementById("login-msg");

  if (u === "admin" && c === "1234") {           // login de demostracion
    document.getElementById("login").classList.add("oculto");
    document.getElementById("admin").classList.remove("oculto");
    msg.textContent = "";
    render();
  } else {
    msg.textContent = "Usuario o contrasena incorrectos.";
  }
}
function logout() {
  document.getElementById("admin").classList.add("oculto");
  document.getElementById("login").classList.remove("oculto");
  document.getElementById("usuario").value = "";
  document.getElementById("clave").value = "";
}

/* ---------- DATOS (CSV semilla + localStorage) ---------- */
function cargarProductos() {
  const guardados = localStorage.getItem("productos");
  if (guardados) { productos = JSON.parse(guardados); render(); return; }
  fetch("productos.csv")
    .then((r) => r.text())
    .then((texto) => { productos = parseCSV(texto); guardar(); render(); })
    .catch(() => { productos = []; render(); });
}
function parseCSV(texto) {
  const lineas = texto.trim().split("\n");
  return lineas.slice(1).map((linea, i) => {
    const col = linea.split(",");
    return { id: i + 1, nombre: col[0], precio: Number(col[1]), stock: Number(col[2]) };
  });
}
function guardar() { localStorage.setItem("productos", JSON.stringify(productos)); }

/* ---------- CRUD + VALIDACIONES ---------- */
function guardarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = Number(document.getElementById("precio").value);
  const stock  = Number(document.getElementById("stock").value);
  const msg = document.getElementById("form-msg");
  if (nombre === "") { msg.textContent = "El nombre es obligatorio."; return; }
  if (isNaN(precio) || precio <= 0) { msg.textContent = "El precio debe ser un numero mayor que 0."; return; }
  if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) { msg.textContent = "El stock debe ser un entero de 0 o mas."; return; }
  msg.textContent = "";
  if (editandoId === null) {
    productos.push({ id: Date.now(), nombre, precio, stock });
  } else {
    const p = productos.find((x) => x.id === editandoId);
    p.nombre = nombre; p.precio = precio; p.stock = stock;
    editandoId = null;
    document.getElementById("btn-guardar").textContent = "Agregar producto";
  }
  guardar(); limpiarForm(); render();
}
function editar(id) {
  const p = productos.find((x) => x.id === id);
  document.getElementById("nombre").value = p.nombre;
  document.getElementById("precio").value = p.precio;
  document.getElementById("stock").value  = p.stock;
  editandoId = id;
  document.getElementById("btn-guardar").textContent = "Actualizar producto";
}
function eliminar(id) { productos = productos.filter((x) => x.id !== id); guardar(); render(); }
function limpiarForm() {
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value  = "";
}

/* ---------- RENDER ---------- */
function render() {
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";
  productos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.className = "fila-producto";
    const agotado = p.stock === 0;
    tr.innerHTML =
      '<td class="col-nombre">' + p.nombre + "</td>" +
      "<td>Q" + p.precio + "</td>" +
      "<td>" + (agotado ? '<span class="agotado">Agotado</span>' : p.stock) + "</td>" +
      '<td><button class="btn-editar">Editar</button> ' +
      '<button class="btn-eliminar">Eliminar</button></td>';
    tr.querySelector(".btn-editar").addEventListener("click", () => editar(p.id));
    tr.querySelector(".btn-eliminar").addEventListener("click", () => eliminar(p.id));
    tbody.appendChild(tr);
  });
  document.getElementById("contador-productos").textContent = productos.length;
}
