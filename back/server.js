const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = process.env.MONGODB_URI || 'mongodb://localhost:27017/alunideas';
const port = process.env.PORT || 8081


let userRouters = require('./routers/userRouters.js');
let policyRouters = require('./routers/policyRouters.js');

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,X-Client');
    res.header('Content-Type', 'application/json');
    next();
};

mongoose.connect(config);

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', userRouters);
app.use('/policy', policyRouters);

app.listen(port);
