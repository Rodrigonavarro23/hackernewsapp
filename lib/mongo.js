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
      collection.find({}).sort({ "timestamp": -1 }).limit(limit).toArray((err, docs) => {
        if (err) {
          return reject(err);
        }

        resolve(docs);
      });
    });
  };

  this.find = (record) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('posts');
      collection.find(record).toArray((err, docs) => {
        if (err) {
          throw err;
        }

        resolve(docs);
      });
    });
  };

  this.findIfExists = (record) => {
    return this.find(record).then((docs) => {
      if (docs.length === 0) {
        throw new Error('Not exists');
      }

      return docs;
    });
  };

  this.insert = (record) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('posts');
      collection.insertOne(record, function (err, record) {
        if (err) {
          throw err;
        }

        resolve(record);
      });
    });
  };

  this.delete = (_id) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('posts');
      collection.findOneAndDelete({ _id }, (err, record) => {
        if (err) {
          throw err;
        }

        resolve(record);
      });
    });
  };

  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log(`MongoDB::Connected to ${url}`);
    this.db = db;
    if (Config.isDevelopment) {
      this.db.collection('posts').drop();
    }
  });
};

module.exports = new MongoDB();
