"use strict"
const conn = require('./conn.js');
/**
 * Function to set schema search path
 * @param {String} schema     The name of the schema
 * @param {String} callback   callback Function 
 */
module.exports.changePath = function (schemaName, callback) {
  conn.query('SET search_path TO ' + schemaName + ';', (err, res) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, 'Done');
    }
  });
};
