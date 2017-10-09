const Promise = require('bluebird');
const Config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { user, pass, host } = Config.db;
const auth = user !== null ? `${user}:${pass}@` : '';
const authMechanism = auth !== '' ? '?authMechanism=DEFAULT' : '';
const url = `mongodb://${auth}localhost:27017/rd${authMechanism}`;

const MongoDB = function() {
  this.findAll = (limit = 100) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('posts');
      collection.find({}).limit(limit).toArray((err, docs) => {
        if (err) {
          return reject(err);
        }

        resolve(docs);
      })
    });
  }
  this.insert = () => {};
  this.update = () => {};
  this.delete = () => {};

  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log(`MongoDB::Connected to ${url}`);
    this.db = db;
  });
};

module.exports = new MongoDB();
