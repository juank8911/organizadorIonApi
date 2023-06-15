const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passwordGenerate = require('../config/passwordGenerate');
const { generateToken } = require('../config/jwt');

const UserController = {
  async register(req, res) {
    console.log(req.body);
    try {
      // Validar los datos de la solicitud
        if(req.body){
           var user = new User(req.body)
           console.log(user);
        }
        else{
            req.status(300).send({ok:false,msj:'la '})
        }
      // Crear una clave temporal y enviarla por correo
        var password = await passwordGenerate();
        console.log(password);
      // Crear un nuevo usuario en la base de datos
      //enviar por correo la nueva contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
        console.log(password);
      user.password=hashedPassword;
      console.log(user);
      user.primerInicioSesion = true;

      if(await user.save())
      {
              // Generar el token
      const token = generateToken({
        username: user.username,
        perfil: user.perfil,
      });
      // Enviar la respuesta con el token y los datos del usuario
      res.status(200).json({usuario: user,password:password ,ok:true });
      }


    } catch (error) {
      console.error('Error al registrar un usuario:', error);
      res.status(500).json({ error: 'Error al registrar un usuario', ok: false, msj: error});
    }
  },


  async login(req, res) {
      try {
    // Validar los datos de la solicitud

    // Buscar el usuario en la base de datos
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta', ok: false });
    }
    // Generar el token
    const token = generateToken({
      username: user.username,
      perfil: user.perfil,
      id: user.id,
      password: user.password
    });

    // Actualizar el token en el usuario
    // user.token = token;
    user.tokenInvalidated = false;
    await user.save();

    if (user.primerInicioSesion == true) {
      res.status(300).send({ msj: 'Debe cambiar su contraseña para continuar', ok: true, token });
    } else {

      // Enviar la respuesta con el token y los datos del usuario
      res.status(200).json({ token, usuario: user, ok: true });
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', ok: false });
  }
  },

  async logout(req, res) {
    try {
      const userId = req.user.id;

      // Revocar el token del usuario estableciendo tokenInvalidated a true
      await User.findByIdAndUpdate(userId, { tokenInvalidated: true });

      res.json({ message: 'Logout exitoso' });
    } catch (error) {
      console.error('Error al realizar logout:', error);
      res.status(500).json({ error: 'Error al realizar logout' });
    }
  },

  async changePassword(req, res) {
    const { newPassword } = req.body;
    var token = req.headers.authorization;
    console.log(req.headers.authorization)
    // Verificar si el encabezado de autorización existe
    if (!token) {
      return res.status(401).json({ message: 'Se requiere el encabezado de autorización' });
    }
  
    try {
      // Verificar y descodificar el token
      const decodedToken = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); 
        console.log(decodedToken);
      // Obtener el ID y la contraseña anterior del usuario desde el token decodificado
      const userId = decodedToken.id;
      const currentPassword = decodedToken.password;
  
      // Obtener el usuario de la base de datos
      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar que la contraseña anterior sea correcta
      const isMatch = await user.comparePassword(currentPassword);
        console.log(isMatch);
      if (!isMatch) {
        return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
      }
  
      // Validar la nueva contraseña
      console.log(newPassword);
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y combinar letras y números' });
      }
  
      // Llamar al método changePassword para cambiar la contraseña
      await user.changePassword(await bcrypt.hash(newPassword,10));
  
      // Actualizar el campo primerInicioSesion a false
      user.primerInicioSesion = false;
      await user.save();

            // Generar el token
             token = generateToken({
              username: user.username,
              perfil: user.perfil,
              id: user.id,
              password: user.password
              });

      res.json({ message: 'Contraseña cambiada exitosamente', token });

    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar la contraseña', error: error.message });
    }
  }

};

module.exports = UserController;
