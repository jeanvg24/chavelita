// admin.js
const adminPass = "admin123";
const loginBox = document.getElementById("login");
const panelBox = document.getElementById("panel");
let modoEdicion = false;
let productoEditandoId = null;

function login() {
  const pass = document.getElementById("password").value;
  if (pass === adminPass) {
    loginBox.style.display = "none";
    panelBox.style.display = "block";
    cargarProductos();
  } else {
    alert("Contraseña incorrecta");
  }
}

function cargarProductos() {
  fetch("/api/productos")
    .then(res => res.json())
    .then(productos => {
      const contenedor = document.getElementById("productos");
      contenedor.innerHTML = "";
      productos.forEach(p => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow";
        div.innerHTML = `
          <h3 class="font-bold">${p.nombre}</h3>
          <img src="${p.imagen}" class="w-full h-40 object-cover rounded mb-2">
          <p>${p.descripcion}</p>
          <p><strong>Precio:</strong> S/ ${p.precio}</p>
          <p><strong>Stock:</strong> ${p.stock}</p>
          <a href="${p.whatsapp}" class="text-green-600">WhatsApp</a><br>
          <button onclick="editarProducto(${p.id})" class="bg-yellow-500 text-white px-3 py-1 rounded mt-2">Editar</button>
          <button onclick="eliminarProducto(${p.id})" class="bg-red-500 text-white px-3 py-1 rounded ml-2 mt-2">Eliminar</button>
        `;
        contenedor.appendChild(div);
      });
    });
}

function eliminarProducto(id) {
  fetch(`/api/productos/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      cargarProductos();
    });
}

function editarProducto(id) {
  fetch("/api/productos")
    .then(res => res.json())
    .then(productos => {
      const p = productos.find(p => p.id === id);
      if (!p) return;
      const form = document.getElementById("form-producto");
      form.nombre.value = p.nombre;
      form.precio.value = p.precio;
      form.stock.value = p.stock;
      form.whatsapp.value = p.whatsapp;
      form.descripcion.value = p.descripcion;
      modoEdicion = true;
      productoEditandoId = id;
    });
}

document.getElementById("form-producto").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  if (modoEdicion && productoEditandoId) {
    fetch(`/api/productos/${productoEditandoId}`, {
      method: "PUT",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      form.reset();
      cargarProductos();
      modoEdicion = false;
      productoEditandoId = null;
    });
  } else {
    fetch("/api/productos", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      form.reset();
      cargarProductos();
    });
  }
});
