const conn = require('./conn.js');
//authenticate 
module.exports.authenticate = function(username,password,cb) {
    
    conn.query('SELECT uu_id FROM users  WHERE lower(username) = $1 AND lower(password) = lower($2)',[username,password],(err,res) => {
        
        if(err){
            cb(err,null);
        }
        
        else if(res.rows.length == 0){
            cb('Invalid Credentials',null);
        }
        else
            cb(null,res.rows[0].uu_id);
    });
     
};
//get contacts
module.exports.getContacts = function(key,cb){
    
    conn.query('SELECT uu_id,first_name,last_name,email_address,mobile FROM contacts WHERE user_id=$1',[key],(err,res) => {
        
        if(err){
            
            cb(err,null);
        }
        else {

            cb(null,res.rows);
        }        
    });
};
//gets a specific contact based on id
module.exports.getContact = function (key,uuid,cb) {
    
    let sql = 'SELECT first_name,last_name,email_address,mobile FROM contacts WHERE uu_id=$2 AND user_id = $1';
    conn.query(sql,[key,uuid],(err,res) => {
        
        if(err){
            
            cb(err,null);
        }
        else {

            cb(null,res.rows);
        }
    });
};
//Insert a contact 
module.exports.addContact = function(key,firstName,lastName,emailAddress,mobileNumber,cb){
    
    let sql = 'INSERT INTO contacts(first_name,last_name,email_address,mobile,user_id) VALUES($2,$3,$4,$5,$1)';
    //In Transaction mode
    conn.query("BEGIN",(errTr) =>{
        if(errTr){
            
            cb(errTr,null);
        }
        else {
            conn.query(sql
            ,[key,firstName,lastName,emailAddress,mobileNumber],(err,res) => {
            
            if(err){
                
                cb(err,null);
            }
    
                
            });
        
            conn.query("COMMIT",(errTr) =>{
            
                if(errTr){
                
                    cb(errTr,null);
                }

            });

            cb();

        }
        
    });
    
    
};
//update a particular contact
module.exports.updateContact = function(key,uuid,firstName,lastName,emailAddress,mobileNumber,cb) {
    
    let sql = 'UPDATE contacts SET first_name=$3,last_name=$4,email_address=$5,mobile_number=$6 WHERE uu_id = $2 AND user_id = $1';
    //Update in Transaction mode
    con.query("BEGIN",(errTr) => {
        
        if(errT) {
            
            cb(errT,null);
            
        }
        else {
            conn.query(sql,[firstName,lastName,emailAddress,mobileNumber,uuid],(err,res) => {
            
            if(err){
                
                cb(err,null);
            }
                
            
            });
            conn.query("COMMIT",(errTr) => {
            
                if (errTr){
                
                    cb(errTr,null);
                }
            
            });
            cb();
        }
    });
    
};

