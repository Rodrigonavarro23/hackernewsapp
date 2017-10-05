const express = require('express');
const helmet = require('helmet');
const views = require('./app/views');
const routes = require('./app/routes');
const { port } = require('./config');
const app = express();

views(app);
routes(app);

app.listen(port, () => {
  console.log(`App starting on port: ${port}`);
});
