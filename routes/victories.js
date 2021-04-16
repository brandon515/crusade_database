var express = require('express');
var router = express.Router();
var db = require('../db');
var config = require('../config');

// Token verification middleware
router.post('/*', config.verification);
router.delete('/*', config.verification);
router.put('/*', config.verification);



module.exports = router;
