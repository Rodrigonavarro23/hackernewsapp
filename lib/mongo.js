const Promise = require('bluebird');
const Config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { user, pass, host } = Config.db;
const auth = user !== null ? `${user}:${pass}@` : '';
const authMechanism = auth !== '' ? '?authMechanism=DEFAULT' : '';
const collectionName = 'posts';
const url = Config.db.uri !== null ? Config.db.uri : `mongodb://${auth}localhost:27017/rd${authMechanism}`;
/**
 * Mongo db handler
 */
const MongoDB = function() {
  /**
   * @method findAll returns posts records from db, sorting by timestamp
   * @param {Number} limit = 100 indicates the maximum total records to return
   * @return {Promise} with list of posts
   */
  this.findAll = (limit = 100) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection(collectionName);
      collection.find({ $where: "this.deleted == false" }).sort({ "timestamp": -1 }).limit(limit).toArray((err, docs) => {
        if (err) {
          return reject(err);
        }

        resolve(docs);
      });
    });
  };

  /**
   * @method find returns an specified record
   * @param {Object} record to find
   * @return {Promise} with the object found
   */
  this.find = (record) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection(collectionName);
      collection.find(record).toArray((err, docs) => {
        if (err) {
          throw err;
        }

        resolve(docs);
      });
    });
  };

  /**
   * @method findIfExists returns an specified record but only if exists
   * @param {Object} record to find
   * @return {Promise} with the object found
   */
  this.findIfExists = (record) => {
    return this.find(record).then((docs) => {
      if (docs.length === 0) {
        throw new Error('Not exists');
      }

      return docs;
    });
  };

  /**
   * @method insert insert a new record on db
   * @param {Object} record to find
   * @return {Promise} with the object found
   */
  this.insert = (record) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection(collectionName);
      collection.insertOne(record, function (err, record) {
        if (err) {
          throw err;
        }

        resolve(record);
      });
    });
  };

  /**
   * @method delete delete an specified record
   * @param {String} record to find and delete
   * @return {Promise} with the object deleted
   */
  this.delete = (_id) => {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection(collectionName);
      collection.findOneAndUpdate({ _id }, { $set: { deleted: true } }, { upsert: true }, (err, record) => {
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
      this.db.collection(collectionName).drop();
    }
  });
};

module.exports = new MongoDB();
