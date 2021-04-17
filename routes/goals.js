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
    res.status(200).send(queRes.rows[0]);
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

// UPDATE various field with the goal
router.put('/update', async function(req, res) {
  try{
    if(!req.body['id']){
      res.sendStatus(400);
      return;
    }

    var queRes = await db.query('SELECT fo.player_id FROM goals as g LEFT JOIN forces AS fo ON (g.force=fo.force_id) WHERE g.goal_id=$1',
      [ req.body['id'] ]);
    if(queRes.rows[0]['player_id'] != req.token['id']){
      res.sendStatus(405);
      return;
    }

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
    createQ('text');
    createQ('title');
    if(par.length === 0){
      res.sendStatus(400);
      return;
    }
    query = query.slice(0,-1);
    query = query+" WHERE unit_id=$"+parNum;
    par.push(req.body['id']);
    var upRes = db.query(query,par);
    res.sendStatus(200);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

// DELETE delete this goal
router.delete('/delete', async function(req, res) {
  try{
    if(!req.body['id']){
      res.sendStatus(400);
      return;
    }

    var queRes = await db.query('SELECT fo.player_id FROM goals as g LEFT JOIN forces AS fo ON (g.force=fo.force_id) WHERE g.goal_id=$1',
      [ req.body['id'] ]);
    if(queRes.rows[0]['player_id'] != req.token['id']){
      res.sendStatus(405);
      return;
    }

    var queRes = await db.query('DELETE FROM goals WHERE goal_id=$1',
      [ req.body['id'] ]);
    res.sendStatus(200);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

module.exports = router;
