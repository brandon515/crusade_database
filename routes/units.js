var express = require('express');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');
var config = require('../config');

var verification = function(req, res, next) {
    jwt.verify(req.body['token'], config.initTokenSecret, function(err, decoded) {
            if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            req.token = decoded;
            next();
        }
    });
};

// Token verification middleware
router.post('/*', verification);
router.delete('/*', verification);
router.put('/*', verification);

router.get('/', function(req, res) {
});

module.exports = router;
