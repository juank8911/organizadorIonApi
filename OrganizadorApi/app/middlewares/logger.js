const fs = require('fs');

function logRequest(req, res, next) {
  const { method, url, body, query, params, headers } = req;
  const timestamp = new Date().toISOString();

  const log = `[${timestamp}] ${method} ${url}\n`;
  const logDetails = {
    method,
    url,
    body,
    query,
    params,
    headers,
  };

  // Escribe el registro en un archivo
  fs.appendFile('api.log', log, (err) => {
    if (err) {
      console.error('Error al escribir el registro:', err);
    }
  });

  // Puedes imprimir los detalles del registro en la consola si deseas
  console.log(logDetails);

  next();
}

module.exports = logRequest;
