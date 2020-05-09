#! /usr/bin/node
//Contact API
// @Author William Kwasidev
"use strict"
const express = require('express'),
  app = require('express')(),
  config = require('./config.json'),
  contactService = require('./services.js'),
  schema = require('./schema.js'),
  bodyPasrser = require('body-parser'),
  cors = require('cors'),
  PORT = 3000,
  validator = require('validator'),
  jwt = require('jsonwebtoken'),
  morgan = require('morgan');
// A String to hold the tenant id 
var tenantId = null;
app.use(express.static(__dirname + '/public'));
// Exit process
process.on('SIGINT', () => {
  console.log('Going off');
  process.exit(0);
});

// Enable cors
app.use(cors());

app.use(morgan('combined'));
// Parse application/www-form-urlencoded
app.use(
  bodyPasrser.urlencoded({
    extended: false,
  })
);
// Parse json
app.use(bodyPasrser.json());

// Verfy jtokens
app.post('/api/authenticate', function (req, res) {

  let username = req.body.username;
  let password = req.body.password;

  contactService.authenticate(username, password, (err, result) => {
    if (err) {
      return res.status(403).json({ 'message:': 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: result }, config.secret, {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'expires in 1hour', token: token });
  });
});
// Middleware to verify json webtoken
app.use(function (req, res, next) {

  const access_token = req.headers['access-token'];
  console.log(access_token);
  jwt.verify(access_token, config.secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Invalid Token' });
    } else {
      // Sets the tenant id
      tenantId = decoded.id;
      next();
    }
  });

});

// Set schema search path
app.use((req, res, next) => {
  // Set tenant id

  console.log('tenant_id ' + tenantId);
  // Set schema path
  schema.changePath(tenantId, (err, mes) => {
    // If error occured abort the mission
    if (err) {
      console.log(error);
      throw new Error(err);
    }
  });
  next();
});


app.post('/api/contact', (req, res) => {
  // capture details
  let fname = req.body.first_name,
    lname = req.body.last_name,
    mobile = req.body.mobile_number,
    email = req.body.email_address;

  let errors = [];

  if (!validator.isEmail(email)) errors = errors.concat('Invalid Email');
  if (fname.length === 0) errors.push('First name cannot be empty ');
  if (!validator.isMobilePhone(mobile, 'en-ZA')) errors.push('Invalid Mobibe Number');
  // Log the requests
  console.log(email);
  console.log(fname);
  console.log(mobile);

  if (errors.length === 0) {
    contactService.addContact(
      fname,
      lname,
      email,
      mobile,
      (err, result) => {
        if (err) {
          console.log(err);
          throw Error(err);
        } else {
          res.status(200).json({ message: 'Contact Added Succesfully' });
        }
      }
    );
  } else {
    // Log erros
    console.log('*Invalid Fields \n');
    console.log(errors);
    res.status(400).json({
      message: 'Error',
      error: errors,
    });
  }
});
// Get contacts list
app.get('/api/contact', (req, res) => {
  console.log('hey');
  contactService.getContacts((err, result) => {
    if (err) {
        throw new Error(err);
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/api/contact/:uuid', (req, res) => {

  let id = req.params.uuid.trim();
  contactService.getContact(id, (err, result) => {
    // if error throw error
    if (err) {
      console.log(err);
      throw new Error(err);
    } else {
      res.status(200).json(result);
    }
  });
});
// Catch errros
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(400).send('Bad Request');
});
// Listen and serve requests
app.listen(process.env.PORT || PORT, () => {
  console.log('APP running on port %d', PORT || process.env.PORT);
});
