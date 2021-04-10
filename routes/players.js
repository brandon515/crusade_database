var express = require('express');
var router = express.Router();
const db = require('../db');
const crypt = require('../crypt');

// READ all players
router.get('/', function(req, res) {
    db.query('SELECT player_id,display_name,email FROM players;')
        .then(result => res.status(200).json(result.rows))
        .catch(err => {
            console.log(err);
            res.sendStatus(404);
        });
});

// READ a specific player
router.get('/:id', function(req, res) {
    db.query('SELECT display_name,email FROM players WHERE player_id=$1',
        [req.params.id])
    .then(result => {
        if(result.rowCount === 0){
            res.sendStatus(404);
        }else{
            res.status(200).json(result.rows[0])
        }
    }).catch(err => {
        console.log(err);
        res.sendStatus(404);
    });
});

// CREATE a new player, email uniqueness is promised at the db level
router.post('/:email/:password/:displayname', async function(req, res) {
    try{
        var hash = await crypt.hash(req.params['password'])
        var queRes = await db.query('INSERT INTO players(display_name,email,password) VALUES ($1, $2, $3)', 
            [req.params['displayname'], req.params['email'], hash]);
        var que = await db.query('SELECT (player_id) FROM players WHERE email=$1',
            [req.params['email']]);
        res.set({
            'Content-Type': 'json',
            'location' : req.baseUrl+'/'+que.rows[0].player_id,
        }).sendStatus(201);
    }catch(err){
        if(err.code === '23505'){
            res.sendStatus(409);
        }else{
            console.log(err)
            res.sendStatus(404);
        }
    };
});

// CREATE not allowed
router.post('/' function(req, res) {
    res.sendStatus(405);
});

// UPDATE not allowed
router.put('/', function(req, res) {
    res.sendStatus(405);
});

module.exports = router;
