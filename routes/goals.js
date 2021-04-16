var express = require('express');
var router = express.Router();
var db = require('../db');
var config = require('../config');

// Token verification middleware
router.post('/*', config.verification);
router.delete('/*', config.verification);
router.put('/*', config.verification);

// READ all goals
router.get('/', async function(req, res) {
    try{
        var queRes = await db.query('SELECT * FROM goals');
        res.status(200).send(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// READ specific goal
router.get('/:id', async function(req, res) {
    try{
        var queRes = await db.query('SELECT * FROM goals WHERE goal_id=$1',
            [ req.params['id'] ]);
        res.status(200).send(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// READ specific goals for a force
router.get('/force/:id', async function(req, res) {
    try{
        var queRes = await db.query('SELECT * FROM goals WHERE force=$1',
            [ req.params['id'] ]);
        res.status(200).send(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// CREATE a new goal
router.post('/create', async function(req, res) {
    try{
        if(!req.body['force'] || !req.body['title'] || !req.body['text']){
            res.sendStatus(400);
            return;
        }
        var verRes = await db.query('SELECT player_id FROM forces WHERE force_id=$1',
            [ req.body['force'] ]);
        if(req.token['id'] != verRes.rows[0]['player_id']){
            res.sendStatus(401);
            return;
        }
        var queRes = await db.query('INSERT INTO goals(title,text,force) VALUES ($1,$2,$3) RETURNING goal_id',
            [ req.body['title'],req.body['text'],req.body['force'] ]);
        res.set({
            'location' : req.baseUrl+'/'+insertRes.rows[0].force_id,
        }).sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

module.exports = router;
