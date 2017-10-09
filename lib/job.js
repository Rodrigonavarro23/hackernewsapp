const crypto = require('crypto');
const schedule = require('node-schedule');
const Mongo = require('../lib/mongo');
const Api = require('../api');

const Job = function () {
  this.apiRequest = () => {
    Api.makeRequest().then(({ err, response, body }) => {
      if (err) {
        console.log('API::error', err);
        return;
      }

      const posts = JSON.parse(body);
      const hits = posts.hits.filter((hit) => hit.story_title !== null || hit.title !== null);
      const filteredHits = hits.map((hit) => {
        const record = {
          timestamp: hit.created_at_i,
          created_at: hit.created_at,
          title: hit.story_title !== null ? hit.story_title : hit.title,
          author: hit.author,
          url: hit.story_url !== null ? hit.story_url : hit.url,
        };
        const hash = crypto.createHash('md5').update(JSON.stringify(record)).digest("hex");
        return { _id: hash, ...record };
      });
      filteredHits.map((hit) => {
        Mongo.findIfExists({ ...hit })
          .catch((err) => {
            console.log('errr not found');
            Mongo.insert(hit).tap((r) => console.log('Job::Insert record ', r.ops));
          });
      });
    });
  };

  this.init = () => {
    console.log('Job::initializing api request');
    this.apiRequest();
    schedule.scheduleJob('0 * * * *', () => {
      console.log('Job::schedule Api request');
      this.apiRequest();
    });
  }
}

module.exports = new Job();
