// Citation
// Database/db-connector.js for the connection to mysql instance
// Adapted from Step 1 - Copied db-connector.js for importing mysql and creating pool and adjusted with teams values
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%201%20-%20Connecting%20to%20a%20MySQL%20Database
// Date: 05/16/2024

// Get an instance of mysql we can use in the app

var mysql = require('mysql')

// Create a connection pool
var pool = mysql.createPool({
    connectionLimit     : 10,
    host                : '',
    port                : ,
    user                : '',
    password            : '',
    database            : ''
})


// Export it for use in our application
module.exports.pool = pool;