const jwt = require('../config/jwt');
const User = require('../models/User');

function VerifyAuthorizeMiddelware(requiredRoles) {
  try {
    console.log('requiredRoles 1')
    return async function (req, res, next) {
      const token = req.headers.authorization;
      console.log('requiredRoles 2')
      if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token de autorización' });
      }

      try {
        // Verificar y decodificar el token
        const decoded = await jwt.verifyToken(token, process.env.JWT_SECRET);
        const { perfil, id } = decoded;
        console.log(decoded)
        // Obtener el usuario de la base de datos
        const user = await User.findById(id);
        console.log('-------------------------------')
        console.log(user.tokenInvalidated)
        if (!user) {
          console.log('err')
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log(user.tokenInvalidated)
        // Verificar si el token está invalidado
        if (user.tokenInvalidated) {
          console.log('err')
          return res.status(403).json({ message: 'Token inválido' });
        }
        console.log('validado .')
        // Verificar si el perfil del usuario tiene los roles requeridos
        const hasRequiredRole = requiredRoles.includes(perfil);

        if (hasRequiredRole) {
          // Usuario autorizado, almacenar el usuario en la solicitud y pasar al siguiente middleware o controlador
          req.user = user;
          next();
        } else {
          return res.status(403).json({ message: 'Acceso denegado' });
        }
      } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Token inválido' });
      }
    };
  } catch (error) {
    console.error('Error en VerifyAuthorizeMiddleware:', error);
    return res.status(500).json({ message: 'Error en el middleware de autorización' });
  }
    };


  module.exports = VerifyAuthorizeMiddelware;