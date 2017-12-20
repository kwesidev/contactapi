const {Client} = require('pg');
const conn = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'contactbook',
    port : 5432
});
conn.connect();
module.exports = conn;