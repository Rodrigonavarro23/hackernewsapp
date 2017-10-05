const express = require('express');
const helmet = require('helmet');
const { appHandler } = require('./app/handlers');
const views = require('./app/views');
const app = express();
const port = process.env.PORT || 3000;

views(app);

app.get('/', appHandler.index);

app.listen(port, () => {
  console.log(`App starting on port: ${port}`);
});