let mysql = require('mysql');
let config = require('./mysqlConfig');
/* 数据库设置 */
let connection = mysql.createConnection(config);
connection.connect();
module.exports = connection;