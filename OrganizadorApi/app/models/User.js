const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(value);
      },
      message: 'Correo inválido',
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(value);
      },
      message: 'La contraseña debe tener al menos 8 caracteres y un símbolo',
    },
  },
  perfil: {
    type: String,
    enum: ['ejec', 'auditor', 'admin'],
    required: true,
  },
  primerInicioSesion: {
    type: Boolean,
    default: true,
  },
  roles: {
    type: [String],
    enum: ['ejec', 'auditor', 'admin'],
    default: [],
  },
  tokenInvalidated: {
    type: Boolean,
    default: false,
  },
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
  console.log(password + ' ' + this.password);
  if (bcrypt.compare(password, this.password)) {
    return true;
  } else {
    return false;
  }
};

// Método para cambiar la contraseña
userSchema.methods.changePassword = async function (newPassword) {
  this.password = newPassword;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
