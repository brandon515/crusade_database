const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
    user: config.pguser,
    host: config.pghost,
    database: config.pgdatabase,
    password: config.pgpassword,
    port: config.pgport,
});

module.exports = {
    query: (text, params) => {
        return pool.query(text, params);
    },
};
