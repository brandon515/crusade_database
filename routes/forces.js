var express = require('express');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');

// Token verification middleware
router.put('/token/:token/*', function(req, res, next) {
    jwt.verify(req.params['token'], config.initTokenSecret, function(err, decoded) {
        if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            req.token = decoded;
            next();
        }
    });
});

// READ all forces force_id, player_id, faction_id
router.get('/', async function(req, res) {
    try{
        var queRes = await db.query('SELECT force_id,name,player_id,faction_id FROM ranks');
        res.status(200).json(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

//READ specific force
router.get('/id/:id', async function(req, res) {
    try{
        var queRes = await db.query('SELECT * FROM ranks WHERE rank_id=$1',
            [ req.params['id'] ]);
        res.status(200).json(queRes.rows[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

module.exports = router;
