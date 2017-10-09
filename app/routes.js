const moment = require('moment');
const Mongo = require('../lib/mongo');
const format = {
  lastDay : '[Yesterday]',
  sameDay : 'HH:mm a',
  lastWeek: 'MMM DD',
  sameElse : 'MMM DD'
};

module.exports = function(app) {
  app.get('/', (req, res) => {
    Mongo.findAll().then((result) => {
      const posts = result.map((i) => ({
        created: moment(i.created_at).calendar(null, format),
        ...i,
      }));
      res.render('index', { posts });
    });
  });
}
