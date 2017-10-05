const { appController } = require('./app/controller');

module.exports = function(app) {
  app.get('/', appController);
}
