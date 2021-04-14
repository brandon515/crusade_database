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
        var queRes = await db.query('SELECT fo.force_id,fo.name,fo.battle_tally,fo.battles_won,fo.requisition_points,fo.supply_limit,fo.supply_used,fo.faction_id,fa.name as faction,fo.player_id as owner_id,pl.display_name as owner,su.name as supply_type FROM forces as fo LEFT JOIN factions AS fa ON (fo.faction_id = fa.faction_id) LEFT JOIN players AS pl ON (fo.player_id = pl.player_id) LEFT JOIN supply_types AS su ON (fo.supply_type = su.type_id)');
        res.status(200).json(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

//READ all forces for a certain player
router.get('/player/:id', async function(req, res) {
    try{
        var queRes = await db.query('SELECT fo.force_id,fo.name,fo.battle_tally,fo.battles_won,fo.requisition_points,fo.supply_limit,fo.supply_used,fo.faction_id,fa.name as faction,fo.player_id as owner_id,pl.display_name as owner,su.name as supply_type FROM forces as fo LEFT JOIN factions AS fa ON (fo.faction_id = fa.faction_id) LEFT JOIN players AS pl ON (fo.player_id = pl.player_id) LEFT JOIN supply_types AS su ON (fo.supply_type = su.type_id) WHERE fo.player_id=$1',
            [ req.params['id'] ]);
        res.status(200).json(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

//READ specific force
router.get('/:id', async function(req, res) {
    try{
        var queRes = await db.query('SELECT fo.force_id,fo.name,fo.battle_tally,fo.battles_won,fo.requisition_points,fo.supply_limit,fo.supply_used,fo.faction_id,fa.name as faction,fo.player_id as owner_id,pl.display_name as owner,su.name as supply_type FROM forces as fo LEFT JOIN factions AS fa ON (fo.faction_id = fa.faction_id) LEFT JOIN players AS pl ON (fo.player_id = pl.player_id) LEFT JOIN supply_types AS su ON (fo.supply_type = su.type_id) WHERE fo.force_id=$1',
            [ req.params['id'] ]);
        res.status(200).json(queRes.rows[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE various fields in forces
router.put('/update/name', async function(req, res) {
    try{
        if(!req.body['name'] || !req.body['id']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('UPDATE forces SET name=$1 WHERE force_id=$2 AND player_id=$3',
            [ req.body['name'], req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds to supply limit
router.put('/add/supply_used', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT supply_used,supply_limit FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var used = parseInt(queRes.rows[0]['supply_used']);
        var limit = parseInt(queRes.rows[0]['supply_limit']);
        var amount = parseInt(req.body['amount']);
        var new_used = used+amount;
        if(new_used > limit){
            res.sendStatus(405);
            return;
        }
        var updateRes = await db.query('UPDATE forces SET supply_used=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_used, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE subtract to supply limit
router.put('/subtract/supply_used', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT supply_used FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var used = parseInt(queRes.rows[0]['supply_used']);
        var amount = parseInt(req.body['amount']);
        var new_used = used-amount;
        if(new_used < 0){
            new_used = 0;
        }
        var updateRes = await db.query('UPDATE forces SET supply_used=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_used, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds to supply limit
router.put('/add/supply_limit', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT supply_limit FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var limit = parseInt(queRes.rows[0]['supply_limit']);
        var amount = parseInt(req.body['amount']);
        var new_limit = limit+amount;
        var updateRes = await db.query('UPDATE forces SET supply_limit=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_limit, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE subtract to supply limit
router.put('/subtract/supply_limit', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT supply_limit FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var limit = parseInt(queRes.rows[0]['supply_limit']);
        var amount = parseInt(req.body['amount']);
        var new_limit = limit-amount;
        if(new_limit < 0){
            new_limit = 0;
        }
        var updateRes = await db.query('UPDATE forces SET supply_limit=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_used, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds to requisition points
router.put('/add/requisition_points', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT requisition_points FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var limit = parseInt(queRes.rows[0]['requisition_points']);
        var amount = parseInt(req.body['amount']);
        var new_limit = limit+amount;
        if(new_limit > 5){
            res.sendStatus(405);
            return;
        }
        var updateRes = await db.query('UPDATE forces SET requisition_points=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_limit, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE substracts from requisition points
router.put('/subtract/requisition_points', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT requisition_points FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var limit = parseInt(queRes.rows[0]['requisition_points']);
        var amount = parseInt(req.body['amount']);
        var new_limit = limit-amount;
        if(new_limit < 0){
            new_limit = 0;
        }
        var updateRes = await db.query('UPDATE forces SET requisition_points=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_limit, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds to battle tally
router.put('/add/battle_tally', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT battle_tally FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var limit = parseInt(queRes.rows[0]['battle_tally']);
        var amount = parseInt(req.body['amount']);
        var new_limit = limit+amount;
        var updateRes = await db.query('UPDATE forces SET battle_tally=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_limit, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE subtracts from battle tally
router.put('/subtract/battle_tally', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT battle_tally FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var limit = parseInt(queRes.rows[0]['battle_tally']);
        var amount = parseInt(req.body['amount']);
        var new_limit = limit-amount;
        if(new_limit < 0){
            new_limit = 0;
        }
        var updateRes = await db.query('UPDATE forces SET battle_tally=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_limit, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds to battles won
router.put('/add/battles_won', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT battle_tally,battles_won FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var limit = parseInt(queRes.rows[0]['battle_tally']);
        var victories = parseInt(queRes.rows[0]['battles_won']);
        var amount = parseInt(req.body['amount']);
        var new_limit = victories+amount;
        if(new_limit > limit){
            res.sendStatus(405);
            return;
        }
        var updateRes = await db.query('UPDATE forces SET battles_won=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_limit, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE subtracts from battles won
router.put('/subtract/battles_won', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['amount']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('SELECT battles_won FROM forces WHERE force_id=$1',
            [ req.body['id'] ]);
        var victories = parseInt(queRes.rows[0]['battles_won']);
        var amount = parseInt(req.body['amount']);
        var new_limit = victories+amount;
        if(new_limit < 0){
            new_limit = 0;
        }
        var updateRes = await db.query('UPDATE forces SET battles_won=$1 WHERE force_id=$2 AND player_id=$3',
            [ new_limit, req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// DELETE a force
router.delete('/delete', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }
        var queRes = await db.query('DELETE FROM forces WHERE force_id=$1 AND player_id=$2',
            [ req.body['id'], req.token['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

module.exports = router;
