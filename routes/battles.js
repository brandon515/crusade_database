var express = require('express');
var router = express.Router();
var db = require('../db');
var config = require('../config');

// Token verification middleware
router.post('/*', config.verification);
router.delete('/*', config.verification);
router.put('/*', config.verification);

// READ all battles
router.get('/', async function(req, res) {
    try{
        var queRes = db.query('SELECT b.battle_id,b.d_psychic_powers,b.d_ranged,b.d_melee,b.agenda_1,b.agenda_2,b.agenda_3,b.victory,u.name as unit,f.name as force,u.unit_id,f.force_id FROM battles AS b LEFT JOIN units as u ON (b.unit=u.unit_id) LEFT JOIN forces as f ON (u.force=f.force_id)');
        res.status(200).send(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// READ a specific battle
router.get('/:id', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }
        var queRes = db.query('SELECT b.battle_id,b.d_psychic_powers,b.d_ranged,b.d_melee,b.agenda_1,b.agenda_2,b.agenda_3,b.victory,u.name as unit,f.name as force,u.unit_id,f.force_id FROM battles AS b LEFT JOIN units as u ON (b.unit=u.unit_id) LEFT JOIN forces as f ON (u.force=f.force_id) WHERE b.battle_id=$1',
        [ req.body['id'] ]);
        res.status(200).send(queRes.rows[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// READ all battles of a specific unit
router.get('/unit/:id', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }
        var queRes = db.query('SELECT b.battle_id,b.d_psychic_powers,b.d_ranged,b.d_melee,b.agenda_1,b.agenda_2,b.agenda_3,b.victory,u.name as unit,f.name as force,u.unit_id,f.force_id FROM battles AS b LEFT JOIN units as u ON (b.unit=u.unit_id) LEFT JOIN forces as f ON (u.force=f.force_id) WHERE b.unit=$1',
        [ req.body['id'] ]);
        res.status(200).send(queRes.rows[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// READ all battles of a specific force
router.get('/force/:id', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }
        var queRes = db.query('SELECT b.battle_id,b.d_psychic_powers,b.d_ranged,b.d_melee,b.agenda_1,b.agenda_2,b.agenda_3,b.victory,u.name as unit,f.name as force,u.unit_id,f.force_id FROM battles AS b LEFT JOIN units as u ON (b.unit=u.unit_id) LEFT JOIN forces as f ON (u.force=f.force_id) WHERE u.force=$1',
        [ req.body['id'] ]);
        res.status(200).send(queRes.rows[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// CREATE a new battle
router.post('/create', async function(req, res) {
    try{
        if(!req.body['id'] || !req.body['unit'] || !req.body['d_pstchic_powers'] || !req.body['d_ranged'] || !req.body['d_melee'] || !req.body['agenda_1'] || !req.body['agenda_2'] || !req.body['agenda_3'] || !req.body['victory']){
            res.sendStatus(400);
            return;
        }
        var queRes = db.query('INSERT INTO battles(unit,d_psychic_powers,d_ranged,d_melee,agenda_1,agenda_2,agenda_3,victory) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING battle_id',
            [ req.body['unit'],req.body['d_pstchic_powers'],req.body['d_ranged'],req.body['d_melee'],req.body['agenda_1'],req.body['agenda_2'],req.body['agenda_3'],req.body['victory'] ]);
        res.set({
            'location' : req.baseUrl+'/'+inRes.rows[0].unit_id,
        }).sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE columns in a battle
router.put('/update', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);// bad request
            return;
        }

        // getting the player id associated to this battle through the force attached to the unit that fought the battle
        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]); 
        // if these don't match that means someone is trying to change someone else's battle
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var query = 'UPDATE units SET ';
        var par = [];
        var parNum = 1;
        // constructs the COLUMN=VALUE, part of the UPDATE string
        var createQ = (name) => {
            if(req.body[name]){
                query=query+name+'=$'+parNum+',';
                par.push(req.body[name]);
                parNum=parNum+1;
            }
        }
        //unit,d_psychic_powers,d_ranged,d_melee,agenda_1,agenda_2,agenda_3,victory
        createQ('name');
        createQ('d_psychic_powers');
        createQ('d_ranged');
        createQ('d_melee');
        createQ('agenda_1');
        createQ('agenda_2');
        createQ('agenda_3');
        createQ('victory');
        if(par.length === 0){
            res.sendStatus(400);
            return;
        }
        query = query.slice(0,-1);
        query = query+" WHERE battle_id=$"+parNum;
        par.push(req.body['id']);
        var upRes = db.query(query,par);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/add/d_psychic_powers', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT d_psychic_powers FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['d_psychic_powers']);
        var new_tally = tally+1;
        var updateRes = await db.query('UPDATE battles SET d_psychic_powers=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/subtract/d_psychic_powers', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT d_psychic_powers FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['d_psychic_powers']);
        var new_tally = tally-1;
        var updateRes = await db.query('UPDATE battles SET d_psychic_powers=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/add/d_ranged', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT d_ranged FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['d_ranged']);
        var new_tally = tally+1;
        var updateRes = await db.query('UPDATE battles SET d_ranged=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/subtract/d_ranged', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT d_ranged FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['d_ranged']);
        var new_tally = tally-1;
        var updateRes = await db.query('UPDATE battles SET d_ranged=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/add/d_melee', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT d_melee FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['d_melee']);
        var new_tally = tally+1;
        var updateRes = await db.query('UPDATE battles SET d_melee=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/subtract/d_melee', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT d_melee FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['d_melee']);
        var new_tally = tally-1;
        var updateRes = await db.query('UPDATE battles SET d_melee=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/add/agenda_1', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT agenda_1 FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['agenda_1']);
        var new_tally = tally+1;
        var updateRes = await db.query('UPDATE battles SET agenda_1=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/subtract/agenda_1', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT agenda_1 FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['agenda_1']);
        var new_tally = tally-1;
        var updateRes = await db.query('UPDATE battles SET agenda_1=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/add/agenda_2', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT agenda_2 FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['agenda_2']);
        var new_tally = tally+1;
        var updateRes = await db.query('UPDATE battles SET agenda_2=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/subtract/agenda_2', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT agenda_2 FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['agenda_2']);
        var new_tally = tally-1;
        var updateRes = await db.query('UPDATE battles SET agenda_2=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/add/agenda_3', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT agenda_3 FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['agenda_3']);
        var new_tally = tally+1;
        var updateRes = await db.query('UPDATE battles SET agenda_3=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE adds 1 to battle's tally
router.put('/subtract/agenda_3', async function(req, res) {
    try{
        if(!req.body['id']){
            res.sendStatus(400);
            return;
        }

        var queRes = await db.query('SELECT fo.player_id FROM battles as b LEFT JOIN units AS u ON (b.unit=u.unit_id) LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE b.battle_id=$1',
            [ req.body['id'] ]);
        if(queRes.rows[0]['player_id'] != req.token['id']){
            res.sendStatus(405);
            return;
        }

        var queRes = await db.query('SELECT agenda_3 FROM battles WHERE battle_id=$1',
            [ req.body['id'] ]);
        var tally = parseInt(queRes.rows[0]['agenda_3']);
        var new_tally = tally-1;
        var updateRes = await db.query('UPDATE battles SET agenda_3=$1 WHERE battle_id=$2',
            [ new_tally, req.body['id'] ]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

module.exports = router;
