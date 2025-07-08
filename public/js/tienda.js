// tienda.js

fetch("/api/productos")
  .then((res) => res.json())
  .then((productos) => {
    const contenedor = document.getElementById("lista-productos");
    productos.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow hover:shadow-xl transition relative";

      const mensaje = encodeURIComponent(`Hola estoy interesado(a) en el producto ${p.nombre} que está S/ ${p.precio}. Quisiera saber cómo podría separarlo.`);
      const linkWhatsApp = `https://wa.me/51902612351?text=${mensaje}`;

      div.innerHTML = `
        <img src="${p.imagen}" onclick="abrirGaleria(${i})" class="w-full h-48 object-cover rounded mb-3 cursor-pointer">
        <h3 class="text-xl font-semibold mb-1">${p.nombre}</h3>
        <p class="text-sm text-slate-600 mb-2">${p.descripcion}</p>
        <p class="text-sm text-gray-600">Stock: ${p.stock} unidades</p>
        <p class="text-lg font-bold text-orange-600">S/ ${p.precio}</p>
        <a href="${linkWhatsApp}" target="_blank" class="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
          <i class="fab fa-whatsapp"></i> Consultar por WhatsApp
        </a>
      `;

      contenedor.appendChild(div);
    });

    window.productosChavelita = productos; // para galería
  });

// --- Galería modal ---
const modal = document.createElement("div");
modal.id = "galeriaModal";
modal.className = "fixed inset-0 bg-black bg-opacity-80 hidden z-50 flex items-center justify-center flex-col";
modal.innerHTML = `
  <button onclick="cerrarGaleria()" class="absolute top-4 right-6 text-white text-3xl">&times;</button>
  <img id="galeriaImagen" class="max-h-[80vh] rounded shadow-xl transition-all duration-300">
  <div class="mt-4 flex gap-4">
    <button onclick="anteriorImagen()" class="text-white text-2xl bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded shadow">⭠</button>
    <button onclick="siguienteImagen()" class="text-white text-2xl bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded shadow">⭢</button>
  </div>
`;
document.body.appendChild(modal);

let galeriaIndex = 0;
let imagenIndex = 0;

function abrirGaleria(i) {
  galeriaIndex = i;
  imagenIndex = 0;
  mostrarImagen();
  modal.classList.remove("hidden");
}

function mostrarImagen() {
  const producto = window.productosChavelita[galeriaIndex];
  const imagenes = [producto.imagen, ...(producto.imagenesExtras || [])];
  const img = document.getElementById("galeriaImagen");
  img.src = imagenes[imagenIndex] || producto.imagen;
}

function cerrarGaleria() {
  modal.classList.add("hidden");
}

function siguienteImagen() {
  const producto = window.productosChavelita[galeriaIndex];
  const total = 1 + (producto.imagenesExtras?.length || 0);
  imagenIndex = (imagenIndex + 1) % total;
  mostrarImagen();
}

function anteriorImagen() {
  const producto = window.productosChavelita[galeriaIndex];
  const total = 1 + (producto.imagenesExtras?.length || 0);
  imagenIndex = (imagenIndex - 1 + total) % total;
  mostrarImagen();
}
