#! /usr/bin/node
 //Contact API
 // @Author William Kwasidev
const express = require('express'),
  app = require('express')(),
  config = require('./config.json'),
  contactService = require('./services.js');
  bodyPasrser = require('body-parser'),
  PORT = 3000,
  va = require('validator'),
  util = require('./utils.js'),
  jwt = require('jsonwebtoken'),
  morgan = require('morgan');
app.use(express.static(__dirname + '/public'));
// on CTRL close mongo instance
process.on('SIGINT', () => {
    console.log('Going off');
    process.exit(0);
});
app.use(morgan('combined'));

//parse application/www-form-urlencoded
app.use(bodyPasrser.urlencoded({
    extended: false
}));
//parse json
app.use(bodyPasrser.json());

//verfy jtokens
/*
app.post('/api/authenticate',function(req,res){
    username = req.body.username;
    password = req.body.password;
    if ( username === 'admina' && password === '1234') {
      	const token  = jwt.sign({data:'publicapi'},config.secret,{expiresIn: '1h'});
        return  res.status(200).json({'message':'expires in 1hour','token':token});
    }
    else
	return res.status(403).json({'message:':'Inavlid Credentials'});

});
//middleware to verify json webtoken
app.use(function(req,res,next){
         var decode_data;
         const access_token = req.headers['access-token'];
         console.log(access_token);
         jwt.verify(access_token,config.secret,(err,decoded)=>{
                      if (err){

                         res.status(403).json({'message':'Invalid Token'});
                      }
                      else {
                        next();
                        decode_data =  decoded;
                        //console.log(decode_data);
                      }

         });


});
*/
app.post("/api/contact", (req, res) => {
    
    let fname = req.body.first_name,
    lname = req.body.last_name,
    mobile = req.body.mobile_number,
    email = req.body.email_address;

    var errors = [];
    if (!va.isEmail(email))
        errors = errors.concat("Invalid Email");
    if (fname.length === 0)
        errors.push("First name cannot be empty ");

    if (!va.isMobilePhone(mobile, 'en-ZA'))
        errors.push("Invalid Mobibe Number");

    console.log(email);
    console.log(fname);
    console.log(mobile);
    if (errors.length === 0) {
        contactService.addContact(fname,lname,email,mobile,(err,result) => {
          
          if (err) {
              
              throw err;
          }
          res.status(200).json({message:"Contact Added Succesfully"});
      });

    } else {

    console.log("*Invalid Fields \n");
    console.log(errors);
    res.status(401).json({
      message: "Error",
      error: errors
    });

  }
});
//get contacts list
app.get("/api/contact", (req, res) => {

    contactService.getContacts((err,result) => {
        
        if(err) {
            
            throw err;
        }
        
        res.status(200).json(result);
        
    });
        
});

app.get('/api/contact/:uuid',(req,res) => {
    
    let uuid = req.params.uuid;
    contactService.getContact((uuid,err,result) => {
        
        if(err) {
            throw err;
        }
        
        res.status(200).json(result);
        
    });
    
});

//listen and serve requests
app.listen( process.env.PORT || PORT, () => {

    console.log("APP running on port %d", PORT || process.env.PORT);

});
