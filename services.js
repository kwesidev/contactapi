const conn = require('./conn.js');

module.exports.getContacts = function(cb){
    
    conn.query('SELECT * FROM contacts',(err,res) => {
        
        if(err){
            cb(err,null);
        }
        cb(null,res.rows);

    });
};

module.exports.getContact = function (uuid,cb) {
    
    conn.query('SELECT first_name,last_name,email_address,mobile FROM contacts WHERE uid_id=$1',[uuid],(err,res) => {
        if(err){
            
            cb(err,null);
        }
        
        cb(null,res.rows);
    });
}

module.exports.addContact = function(firstName,lastName,emailAddress,mobileNumber,cb){
    
    conn.query('INSERT INTO contacts(first_name,last_name,email_address,mobile) VALUES($1,$2,$3,$4)'
    ,[firstName,lastName,emailAddress,mobileNumber],(err,res) => {
        
        if(err){
            cb(err,null);
        }
        cb(err,res);
        
    });
    
}
module.exports.updateContact = function(uuid,firstName,lastName,emailAddress,mobileNumber,cb) {
    
    let sql = "UPDATE contacts SET first_name=$1," +
                "last_name=$2,email_address=$3,mobile_number=$4 WHERE uid_id = $5";
    conn.query(sql,[firstName,lastName,emailAddress,mobileNumber,uuid],(err,res) => {
        if(err){
            
            cb(err,null);
        }
        cb(err,res);
    });
}

