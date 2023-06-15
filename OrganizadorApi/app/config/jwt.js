const jwt = require('jsonwebtoken');

// Generar un token JWT
function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

// Verificar un token JWT
async function verifyToken(token) {
  try {
    const decoded = await jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log('sssssssssssssssssssssssssssssssssssssssssss');
    return decoded;
  } catch (error) {
    throw ('Token inválido');
  }
}

module.exports = { generateToken, verifyToken };
