const jwt = require('jsonwebtoken');

const secretKey = 'tu_secreto'; 

function generarToken(usuario) {
  return jwt.sign(usuario, secretKey, { expiresIn: '1h' });
}

function verificarToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

module.exports = { generarToken, verificarToken };
