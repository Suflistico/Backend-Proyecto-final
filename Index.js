const express = require('express');
const bodyParser = require('body-parser');
const {Pool} = require('pg');
const cors = require("cors");

const app = express();
const port = 3000;
const pool = new Pool ({
  user: 'postgres', 
  host: 'localhost',
  database: 'dolceval',
  password: '123456'
});

app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.get('/usuario', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM usuario');
    const usuarios = result.rows;
    client.release();

    res.json({ success: true, usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios', error);
    res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
  }
});

app.post("/usuario", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await pool.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Si el usuario ya existe, enviar un error
      return res.status(400).json({ success: false, error: 'El usuario ya está registrado' });
    }

    // Si el usuario no existe, proceder con el registro
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO usuario (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );
    const user = result.rows[0];
    client.release();

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error al registrar usuario', error);
    res.status(500).json({ success: false, error: 'Error al registrar usuario' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM usuario WHERE email = $1 AND password = $2',
      [email, password]
    );
    const user = result.rows[0];
    client.release();

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión', error);
    res.status(500).json({ success: false, error: 'Error al iniciar sesión' });
  }
});