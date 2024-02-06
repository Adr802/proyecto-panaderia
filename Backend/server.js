const express = require('express');
const { Pool } = require('pg');
const cors = require('cors')
const app = express();
const port = 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'proyecto',
  password: 'root',
  port: 5432,
});
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Ruta de ejemplo para obtener datos desde PostgreSQL
app.get('/productos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM producto');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de ejemplo para servir archivos HTML
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
