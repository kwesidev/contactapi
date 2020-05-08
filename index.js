#! /usr/bin/node
//Contact API
// @Author William Kwasidev

const express = require('express'),
  app = require('express')(),
  config = require('./config.json'),
  contactService = require('./services.js'),
  schema = require('./schema.js');

(bodyPasrser = require('body-parser')),
  (cors = require('cors')),
  (PORT = 3000),
  (va = require('validator')),
  (util = require('./utils.js')),
  (jwt = require('jsonwebtoken')),
  (morgan = require('morgan'));
  
var userId = null;
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
// Set schema search path
app.use((req, res, next) => {
  // Set tenant id
  var tenantId = req.headers['tenant_id'];

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

// Verfy jtokens

app.post('/api/authenticate', function (req, res) {
  username = req.body.username;
  password = req.body.password;

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
      next();
      userId = decoded.id;
    }
  });
});

app.post('/api/contact', (req, res) => {
  // capture details
  let fname = req.body.first_name,
    lname = req.body.last_name,
    mobile = req.body.mobile_number,
    email = req.body.email_address;

  var errors = [];

  if (!va.isEmail(email)) errors = errors.concat('Invalid Email');
  if (fname.length === 0) errors.push('First name cannot be empty ');
  if (!va.isMobilePhone(mobile, 'en-ZA')) errors.push('Invalid Mobibe Number');
  // Log the requests
  console.log(email);
  console.log(fname);
  console.log(mobile);
  
  if (errors.length === 0) {
    contactService.addContact(
      userId,
      fname,
      lname,
      email,
      mobile,
      (err, result) => {
        if (err) {
          res.status(400);
        } else {
          res.status(200).json({ message: 'Contact Added Succesfully' });
        }
      }
    );
  } else {
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
  contactService.getContacts(userId, (err, result) => {
    if (err) {
      res.status(400);
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/api/contact/:uuid', (req, res) => {
  let uuid = req.params.uuid.trim();
  console.log(uuid);
  contactService.getContact((userId, uuid, err, result) => {
    if (err) {
      res.status(400);
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
