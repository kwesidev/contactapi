const {Pool} = require('pg'),
config = require('./config');
conn = new Pool({
    host: config.postgres.host,
    user: config.postgres.user,
    password: config.postgres.password,
    database: config.postgres.dbname,
    port : config.postgres.port
});
//conn.connect();
module.exports = conn;