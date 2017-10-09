const Mongo = require('../lib/mongo');

module.exports = function(app) {
  app.get('/', (req, res) => {
    Mongo.findAll().then((result) => {
      const post = result.map((i) => i);
      res.render('index', { posts })
    });
  });
}
