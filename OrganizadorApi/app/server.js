const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const  connectDatabase = require('./config/database');
const dotenv     = require('dotenv');
const logger = require('./middlewares/logger');
var env = require('node-env-file'); // .env file
env('./' + '.env');

dotenv.config();

const app = express();
app.use(logger);
// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

if(connectDatabase.connectDatabase())
{
// connectDatabase.connectDatabase();
  console.log('connectDatabase');
  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
}
else{console.log('no conecct'); }
// Start server


