const Promise = require('bluebird');
const request = require('request');
const { retry } = require('async');
const hackerNewsApi = request.defaults({
    url: 'https://hn.algolia.com/api/v1/search_by_date?query=nodejs',
    method: 'GET',
    time: true,
    'content-type': 'application/x-www-form-urlencoded',
    encoding: 'binary'
  });

module.exports = {
  makeRequest: (options) => {
    return new Promise((resolve) => {
      retry(
        {
          retries: 5,
          interval: 2000,
        },
        hackerNewsApi.bind(this, options),
        (err, response, body) => {
          if (err) {
            throw err;
          }

          return resolve({ err, response, body });
        }
      );
    }).catch((err) => {
      console.log('Api::error ', err);
      throw err;
    });
  }
};
