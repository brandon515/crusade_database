var express = require('express');
var router = express.Router();
var db = require('../db');
var crypt = require('../crypt');
var jwt = require('jsonwebtoken');
var config = require('../config');


// Token verification middleware
router.put('/*', config.verification);
router.delete('/*', config.verification);


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

// READ a token for the email/password combo (this is logging in)
router.get('/token/email/:email/password/:password', async function(req,res) {
    console.log("here");
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
router.post('/create', async function(req, res) {
    try{
        var hash = await crypt.hash(req.body['password'])
        var queRes = await db.query('INSERT INTO players(display_name,email,password) VALUES ($1, $2, $3) RETURNING player_id', 
            [req.body['displayname'], req.body['email'], hash]);
        res.set({
            'Content-Type': 'json',
            'location' : req.baseUrl+'/'+queRes.rows[0].player_id,
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

// UPDATE user's email address
router.put('/update', async function(req, res) {
    try{
        var query = 'UPDATE units SET ';
        var par = [];
        var parNum = 1;
        var createQ = (name) => {
            if(req.body[name]){
                query=query+name+'=$'+parNum+',';
                par.push(req.body[name]);
                parNum=parNum+1;
            }
        }
        createQ('display_name');
        createQ('email');
        createQ('password');
        if(par.length === 0){
            res.sendStatus(400);
            return;
        }
        query = query.slice(0,-1);
        query = query+" WHERE player_id=$"+parNum;
        par.push(req.token['id']);
        var upRes = db.query(query,par);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(204);
    }
});

// DELETE user's profile
router.delete('/delete', async function(req, res) {
    try{
        var queRes = await db.query('DELETE FROM players WHERE player_id=$1',
            [req.token.id]);
    }catch(err){
        console.log(err);
        res.sendStatus(204);
    }
});

module.exports = router;
