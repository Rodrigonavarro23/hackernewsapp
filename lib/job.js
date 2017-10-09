const crypto = require('crypto');
const schedule = require('node-schedule');
const Mongo = require('../lib/mongo');
const Api = require('../api');

// job scheduler
const Job = function () {
  /**
   * @method apiRequest make a request to HackerNews api and save each new record
   */
  this.apiRequest = () => {
    Api.makeRequest().then(({ err, response, body }) => {
      if (err) {
        console.log('API::error', err);
        return;
      }

      const posts = JSON.parse(body);
      const filteredHits = posts.hits.filter((hit) => hit.story_title !== null || hit.title !== null);
      const hits = filteredHits.map((hit) => {
        const record = {
          timestamp: hit.created_at_i,
          created_at: hit.created_at,
          title: hit.story_title !== null ? hit.story_title : hit.title,
          author: hit.author,
          url: hit.story_url !== null ? hit.story_url : hit.url,
          deleted: false,
        };
        const hash = crypto.createHash('md5').update(JSON.stringify(record)).digest("hex");
        return { _id: hash, ...record };
      });
      hits.map((hit) => {
        Mongo.findIfExists({ ...hit })
          .catch((err) => {
            console.log('errr not found');
            Mongo.insert(hit).tap((r) => console.log('Job::Insert record ', r.ops));
          });
      });
    });
  };

  /**
   * @method init initialization method
   */
  this.init = () => {
    console.log('Job::initializing api request');
    this.apiRequest();
    // schedule run once per hour
    schedule.scheduleJob('0 * * * *', () => {
      console.log('Job::schedule Api request');
      this.apiRequest();
    });
  }
}

module.exports = new Job();
