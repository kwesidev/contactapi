#! /usr/bin/node
 //Contact API
 // @Author William Kwasidev
const express = require('express'),
  app = require('express')(),
  config = require('./config.json'),
  mongoClient = require('mongodb').MongoClient,
  bodyPasrser = require('body-parser'),
  PORT = 3000,
  va = require('validator'),
  util = require('./utils.js'),
  morgan = require('morgan');
var mgdb = null;
app.use(express.static(__dirname + '/public'));
// on CTRL close mongo instance
process.on('SIGINT', () => {
  console.log('Going off');
  mgdb.close();
  process.exit(0);
});
app.use(morgan('combined'));
mongoClient.connect(config.mongodb.url, function(err, db) {
  if (err) {
    db.close();
    throw err;

  }
  console.log('Connected to monogo instance');
  mgdb = db;
});
//parse application/www-form-urlencoded
app.use(bodyPasrser.urlencoded({
  extended: false
}));
//parse json
app.use(bodyPasrser.json());
app.get("/", (req, res) => {

  res.status(200).sendFile(__dirname + '/public/index.html');
});

app.post("/api/contact", (req, res) => {
  const email_ = req.body.email,
    fname_ = req.body.fname,
    mobile_ = req.body.mobile;

  var errors = "";
  if (!va.isEmail(email_))
    errors = errors.concat("Invalid Email <br>");
  if (fname_.length == 0)
    errors = errors.concat("First name cannot be empty <br>");

  if (!va.isMobilePhone(mobile_, 'en-ZA'))
    errors = errors.concat("Invalid Mobibe Number <br>");

  console.log(email_);
  console.log(fname_);
  console.log(mobile_);
  if (errors.length == 0) {
    mgdb.collection('contacts').insertOne({
      fullname: fname_,
      mobile: mobile_,
      email: email_
    }, (err, rs) => {
      if (err) {

        throw err;
      }
      console.log('Data captured');
      res.status(200).json({
        message: "Saved"
      });
    });

  } else {

    console.log("*Invalid Fields \n");
    console.log(errors);
    res.status(401).json({
      message: JSON.stringify(errors)
    });

  }



});
//get contacts list
app.get("/api/contact", (req, res) => {


  mgdb.collection('contacts').find({}).toArray((err, data) => {

   util.removeMongoKeys(data);


    res.status(200).json(data);

  });

});
//delete by mobilenumber
app.delete("/api/contact/:cell",(req,res)=>{
  var mob  = req.params.cell;
  console.log(mob);
   mgdb.collection('contacts').findOneAndDelete({mobile:mob},(err,r)=>{

          if (err){
            throw err;
          }
          if(r.lastErrorObject.n){
            res.status(200).json({message:"Deleted"});
          }
          else {
              res.status(200).json({message:"Failed to delete"});
          }
   });
});
//listen and serve requests
app.listen(PORT || process.env.PORT, () => {

  console.log("APP running on port %d", PORT || process.env.PORT);

});
