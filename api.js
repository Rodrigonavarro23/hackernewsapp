const Promise = require('bluebird');
const request = require('request');
const { retry } = require('async');
const Config = require('./config');
const hackerNewsApi = request.defaults({
    url: Config.api,
    method: 'GET',
    time: true,
    encoding: null
  });

// request to api handler
module.exports = {
  /**
   * @method makeRequest make an api request
   * @param {Object} with custom options
   * @return {Promise} with request response
   */
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
