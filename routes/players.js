var express = require('express');
var router = express.Router();
var db = require('../db');
var crypt = require('../crypt');
var jwt = require('jsonwebtoken');
var config = require('../config');

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
router.get('/id/:id', function(req, res) {
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

// READ a token for the email/password combo (this is logging in)
router.get('/email/:email/password/:password', async function(req,res) {
    try{
        var result = await db.query('SELECT player_id,password FROM players WHERE email=$1',
            [req.params['email']]);
        var hash = result.rows[0].password;
        var id = result.rows[0].player_id;
        if(crypt.verify(hash, req.params['password'])){
            var token = await jwt.sign({
                email: req.params['email'],
                id: id,
                started: new Date().toString(),
            }, config.initTokenSecret, {
                expiresIn: config.initTokenExpires+'h',
            });
            res.status(200).json({
                token: token,
                expires: config.initTokenExpires,
            });
        }else{
            console.log(hash);
            console.log(result);
            res.sendStatus(401);
        }
    }catch(err){
        console.log(err);
        res.sendStatus(405);
    }
});

// CREATE a new player, email uniqueness is promised at the db level
router.post('/email/:email/password/:password/displayname/:displayname', async function(req, res) {
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
router.post('/', function(req, res) {
    res.sendStatus(405);
});

// UPDATE not allowed
router.put('/', function(req, res) {
    res.sendStatus(405);
});

// UPDATE user's email address
router.put('/token/:token/email/:email', async function(req, res) {
    try{
        var queRes = await db.query('UPDATE players SET email=$1 WHERE player_id=$2',
            [req.params['email'], req.token.id]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(204);
    }
});

// UPDATE user's display name
router.put('/token/:token/displayname/:displayname', async function(req, res) {
    try{
        var queRes = await db.query('UPDATE players SET display_name=$1 WHERE player_id=$2',
            [req.params['displayname'], req.token.id]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

// UPDATE user's password
router.put('/token/:token/password/:password', async function(req, res) {
    try{
        var hash = await crypt.hash(req.params['password']);
        var queRes = await db.query('UPDATE players SET password=$1 WHERE player_id=$2',
            [hash, req.token.id]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(204);
    }
});

// DELETE user's profile
router.delete('/token/:token/id/:id', async function(req, res) {
    try{
        var queRes = await db.query('DELETE FROM players WHERE player_id=$1',
            [req.params['id']]);
    }catch(err){
        console.log(err);
        res.sendStatus(204);
    }
});

module.exports = router;
