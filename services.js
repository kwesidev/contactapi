"use strict";
const conn = require('./conn.js');
/**
 * Authentiates user and get the schema name
 * 
 * @param {Function} cb   A Callback function
 */
module.exports.authenticate = function (username, password, cb) {

  let sql = 
      'SELECT '+
        'tenants.schema_name '+
      'FROM '+
        'users '+
      'LEFT JOIN '+
        'tenants ON users.tenant_id = tenants.id '+
      'WHERE '+
        'LOWER(username) = LOWER($1) AND LOWER(password) = LOWER($2) LIMIT 1 ; ';
 
  conn.query(
    sql,
   [username, password],
    (err, res) => {
      if (err) {
        cb(err, null);
      } else if (res.rows.length == 0) {
        cb('Invalid Credentials', null);
      } else cb(null, res.rows[0].schema_name);
    }
  );
};
/**
 * Gets a list of contacts
 * 
 * @param {String} cb A Callback function
 */
module.exports.getContacts = function (cb) {
  conn.query(
    'SELECT id,first_name,last_name,email_address,mobile_number FROM contacts ',
    (err, res) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, res.rows);
      }
      
    }
  );
};

/**
 * Gets a specific contact based on id
 * 
 * @param {String} id
 * @param {Function} cb A Callback function
 */
module.exports.getContact = function (id, cb) {

  let sql =
    'SELECT first_name,last_name,email_address,mobile_number FROM contacts WHERE id = $1';
  conn.query(sql, [id], (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, res.rows);
    }
  });

};
/**
 * Inserts a new contact
 * 
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} email_address
 * @param {String} mobileNumber
 * @param {Function} cab A Callback function
 */
module.exports.addContact = function (
  firstName,
  lastName,
  emailAddress,
  mobileNumber,
  cb
) {

  let sql =
    'INSERT INTO contacts(first_name, last_name, email_address, mobile_number) VALUES($1, $2, $3, $4)';
      conn.query(
        sql,
        [firstName, lastName, emailAddress, mobileNumber],
        (err, res) => {
          if (err) {
            cb(err, null);
          }
          else {
            cb();
          }
        }
      );

};
/**
 * Updates a specific contact
 * 
 * @param {String} id
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} emailAddress
 * @param {String} mobileNumber 
 * @param {Funtion} cb A Callback function
**/
module.exports.updateContact = function (
  id,
  firstName,
  lastName,
  emailAddress,
  mobileNumber,
  cb
) {

  let sql =
    'UPDATE contacts SET first_name= $2, last_name= $3, email_address= $4, mobile_number= $5 WHERE id = $1';
      conn.query(
        sql,
        [id, firstName, lastName, emailAddress, mobileNumber],
        (err, res) => {
          if (err) {
            cb(err, null);
          }
          else {
            cb();
          }
        }
      );

};
