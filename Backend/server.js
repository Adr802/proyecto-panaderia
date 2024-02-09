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



app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.post('/guardarPedido', async (req, res) => {
  const { lista, idRepartidor } = req.body;

  try {
      await pool.query('INSERT INTO entrega (id_repartidor, productos, estado) VALUES ($1, $2, $3)', [idRepartidor, lista, 'Por entregar']);

      res.json({ mensaje: 'Pedido guardado exitosamente' });
  } catch (error) {
      console.error('Error al guardar pedido en la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/productos', async (req, res) => {
  try {
    let query = 'SELECT * FROM producto';
    const categoria = req.query.categoria;
    
    // Si se proporciona un parámetro de categoría en la solicitud, filtrar por esa categoría
    if (categoria) {
      query += ` WHERE categoria = '${categoria}'`;
    }

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
app.get('/pedidos', async (req, res) => {
  try {
    // Realizar una consulta anidada para obtener los datos del pedido, incluyendo el nombre del repartidor y el estado
    const query = `
      select productos, nombre, estado 
      from entrega, repartidor
      where repartidor.id_repartidor = entrega.id_repartidor
    `;
    const { rows } = await pool.query(query);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los datos de los pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}); 