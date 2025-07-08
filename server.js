const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'public', 'productos.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Asegurar carpeta de uploads
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Leer productos
app.get('/api/productos', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error leyendo productos' });
    res.json(JSON.parse(data));
  });
});

// Agregar producto
app.post('/api/productos', upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenExtra1', maxCount: 1 },
  { name: 'imagenExtra2', maxCount: 1 },
  { name: 'imagenExtra3', maxCount: 1 },
  { name: 'imagenExtra4', maxCount: 1 },
  { name: 'imagenExtra5', maxCount: 1 }
]), (req, res) => {
  const imagen = req.files['imagen']?.[0];
  const imagenesExtras = [];

  for (let i = 1; i <= 5; i++) {
    const extra = req.files[`imagenExtra${i}`]?.[0];
    if (extra) {
      imagenesExtras.push('/uploads/' + extra.filename);
    }
  }

  const nuevoProducto = {
    id: Date.now(),
    nombre: req.body.nombre,
    precio: parseFloat(req.body.precio),
    stock: parseInt(req.body.stock),
    whatsapp: req.body.whatsapp,
    descripcion: req.body.descripcion,
    imagen: imagen ? '/uploads/' + imagen.filename : '',
    imagenesExtras
  };

  const productos = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  productos.push(nuevoProducto);
  fs.writeFileSync(DATA_PATH, JSON.stringify(productos, null, 2));
  res.status(201).json({ mensaje: 'Producto guardado correctamente' });
});

// Editar producto
app.put('/api/productos/:id', upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenExtra1', maxCount: 1 },
  { name: 'imagenExtra2', maxCount: 1 },
  { name: 'imagenExtra3', maxCount: 1 },
  { name: 'imagenExtra4', maxCount: 1 },
  { name: 'imagenExtra5', maxCount: 1 }
]), (req, res) => {
  const id = parseInt(req.params.id);
  const productos = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  const imagen = req.files['imagen']?.[0];
  const imagenesExtras = [];

  for (let i = 1; i <= 5; i++) {
    const extra = req.files[`imagenExtra${i}`]?.[0];
    if (extra) {
      imagenesExtras.push('/uploads/' + extra.filename);
    }
  }

  const actual = productos[index];
  productos[index] = {
    ...actual,
    nombre: req.body.nombre,
    precio: parseFloat(req.body.precio),
    stock: parseInt(req.body.stock),
    whatsapp: req.body.whatsapp,
    descripcion: req.body.descripcion,
    imagen: imagen ? '/uploads/' + imagen.filename : actual.imagen,
    imagenesExtras: imagenesExtras.length > 0 ? imagenesExtras : actual.imagenesExtras
  };

  fs.writeFileSync(DATA_PATH, JSON.stringify(productos, null, 2));
  res.json({ mensaje: 'Producto actualizado correctamente' });
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let productos = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  productos = productos.filter(p => p.id !== id);
  fs.writeFileSync(DATA_PATH, JSON.stringify(productos, null, 2));
  res.json({ mensaje: 'Producto eliminado correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
