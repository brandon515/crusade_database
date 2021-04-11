var express = require('express');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');
var config = require('../config');

// Token verification middleware
router.post('/*', function(req, res, next) {
    jwt.verify(req.body['token'], config.initTokenSecret, function(err, decoded) {
        if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            req.token = decoded;
            next();
        }
    });
});

// CREATE a new force (name, player_id) combos need to be unique
router.post('/create',
    async function(req, res) {
        try{
            var factionRes = await db.query('SELECT name FROM factions WHERE faction_id=$1',
                [req.body['faction_id']]);
            var supplyRes = await db.query('SELECT name FROM supply_types WHERE type_id=$1',
                [req.body['supply_type']]);
            var supply_limit = 0;
            if(req.body['supply_type'] === '1'){//points
                supply_limit = 50 * 20; //each power level is equal to 20 points
            }else if(req.body['supply_type'] === '2'){ //power level
                supply_limit = 50; //starting power level is 50 per the rule book
            }
            var insertRes = await db.query('INSERT INTO forces(name,supply_limit,fluff,faction_id,player_id,supply_type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING force_id',
                [ req.body['name'], supply_limit, req.body['fluff'], req.body['faction_id'], req.token.id, req.body['supply_type'] ]); 
            res.set({
                'Content-Type': 'json',
                'location' : req.baseUrl+'/'+insertRes.rows[0].force_id,
            }).sendStatus(201);
        }catch(err){
            console.log(err);
            res.sendStatus(404);
        }
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
