const jwt = require('../config/jwt');
const User = require('../models/User');



function authMiddleware(req, res, next) {
  console.log('auth middleware')
    // Obtener el token del encabezado de la solicitud
    const token = req.headers.authorization;

    // Verificar si el encabezado de autorización existe
    if (!token) {
      
      return res.status(401).json({ message: 'No se proporcionó un token de autorización' });
    }
  
    // Verificar y decodificar el token
    jwt.verifyToken(token, process.env.JWT_SECRET)
      .then(decoded => {
        // Obtener el nombre de usuario, perfil e ID del token decodificado
        const { username, perfil, id } = decoded;
  
        // Verificar si el usuario existe en la base de datos
        User.findById(id)
          .then(user => {
            if (!user) {
              return res.status(401).json({ error: 'Usuario no autorizado' });
            }
  
            // Verificar si el token está invalidado
            if (user.tokenInvalidated) {
              return res.status(401).json({ error: 'Token inválido' });
            }
  
            // Agregar los datos del usuario al objeto de solicitud
            req.user = user;
  
            // Continuar con la siguiente función de middleware
            next();
          })
          .catch(error => {
            console.error('Error al buscar el usuario:', error);
            return res.status(401).json({ error: 'Usuario no autorizado' });
          });
      })
      .catch(error => {
        console.log(error);
        return res.status(401).json({ error: 'Token inválido' });
      });
};
module.exports = authMiddleware;
