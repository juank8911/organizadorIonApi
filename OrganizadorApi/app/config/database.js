const mongoose = require('mongoose');

// Conexión a la base de datos de MongoDB
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/db_organizador', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a la base de datos ' + process.env.MONGODB_URI);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

module.exports = { connectDatabase };
