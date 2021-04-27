var express = require('express');
var router = express.Router();
var db = require('../db');
var crypt = require('../crypt');
var jwt = require('jsonwebtoken');
var config = require('../config');


// Refreshing the token, same verification but only for the get request
router.get('/refresh', config.verification);

// Token verification middleware
router.put('/*', config.verification);
router.delete('/*', config.verification);

// READ a new token if the last token hasn't expired yet
router.get('/refresh', async function(req, res) {
  try{
    var token = await jwt.sign({
      id: res.token['id'],
    }, config.initTokenSecret, {
      expiresIn: config.initTokenExpires+'h',
    });
    res.status(200).json({
      token: token,
      expires: config.initTokenExpires,
    });
  }catch(err){
    console.log(err);
    res.sendStatus(405);
  }
})

// READ all players
router.get('/', async function(req, res) {
  try{
    var queRes = awaitdb.query('SELECT player_id,display_name,email FROM players;')
    res.status(200).json(queRes.rows)
  }catch(err){
      console.log(err);
      res.sendStatus(404);
  }
});

// READ a specific player
router.get('/:id', async function(req, res) {
  try{
    var queRes = await db.query('SELECT player_id,display_name,email FROM players WHERE player_id=$1',
      [req.params.id])
    res.status(200).json(queRes.rows[0]);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

// READ a token for the email/password combo (this is logging in)
router.get('/token/email/:email/password/:password', async function(req,res) {
  try{
    var result = await db.query('SELECT player_id,password FROM players WHERE email=$1',
      [req.params['email']]);
    var hash = result.rows[0].password;
    var id = result.rows[0].player_id;
    if(crypt.verify(hash, req.params['password'])){
      var token = await jwt.sign({
        id: id,
      }, config.initTokenSecret, {
        expiresIn: config.initTokenExpires*24+'h',
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
    if(!req.body['display_name'] || !req.body['password'] || !req.body['email']){
      res.sendStatus(400);
      return;
    }
    var hash = await crypt.hash(req.body['password'])
    var queRes = await db.query('INSERT INTO players(display_name,email,password) VALUES ($1, $2, $3) RETURNING player_id', 
      [req.body['display_name'], req.body['email'], hash]);
    res.set({
      'Content-Type': 'json',
      'location' : req.baseUrl+'/'+queRes.rows[0].player_id,
    }).sendStatus(201);
  }catch(err){
    if(err.code === '23505'){
      console.log(err);
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
    if(req.body['password']){
      query=query+name+'=$'+parNum+',';
      var hash = await crypt.hash(req.body['password']);
      par.push(hash);
      parNum=parNum+1;
    }
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
    res.sendStatus(200);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

module.exports = router;
