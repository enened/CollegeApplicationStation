const express = require("express");
const app = express();
var mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const cookieParser = require('cookie-parser');

// database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'college_application_station'
});

