const moment = require('moment');
const Mongo = require('../lib/mongo');

module.exports = function(app) {
  app.get('/', (req, res) => {
    Mongo.findAll().then((result) => {
      const posts = result.map((i) => {
        console.log(moment(i.created_at).calendar(null, {
          lastDay : '[Yesterday]',
          sameDay : 'HH:mm a',
          lastWeek: 'MMM DD',
          sameElse : 'MMM DD'
        }));
        return i
      });
      res.render('index', { posts });
    });
  });
}
