var express = require('express');
var router = express.Router();
var db = require('../db');
var config = require('../config');


// Token verification middleware
router.post('/*', config.verification);
router.delete('/*', config.verification);
router.put('/*', config.verification);

// READ all units
router.get('/', async function(req, res) {
  try{
    var queRes = await db.query('SELECT u.unit_id,u.name,u.keywords,u.unit_type,u.equipment,u.psychic_powers,u.warlord_traits,u.power_rating,u.experience_points,u.crusade_points,u.other_abilities,u.battle_honors,u.battle_scars,u.relics,fa.name as faction,fa.description as faction_des,ro.name as role,ra.name as rank,fo.name as force,fo.force_id FROM units AS u LEFT JOIN factions AS fa ON (u.faction = fa.faction_id) LEFT JOIN roles AS ro ON (u.rank = ro.role_id) LEFT JOIN ranks AS ra ON (u.rank = ra.rank_id) LEFT JOIN forces AS fo ON (u.force = fo.force_id)');
    res.status(200).json(queRes.rows);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

// READ specific unit
router.get('/:id', async function(req, res) {
  try{
    var queRes = await db.query('SELECT u.unit_id,u.name,u.keywords,u.unit_type,u.equipment,u.psychic_powers,u.warlord_traits,u.power_rating,u.experience_points,u.crusade_points,u.other_abilities,u.battle_honors,u.battle_scars,u.relics,fa.name as faction,fa.description as faction_des,ro.name as role,ra.name as rank,fo.name as force,fo.force_id FROM units AS u LEFT JOIN factions AS fa ON (u.faction = fa.faction_id) LEFT JOIN roles AS ro ON (u.rank = ro.role_id) LEFT JOIN ranks AS ra ON (u.rank = ra.rank_id) LEFT JOIN forces AS fo ON (u.force = fo.force_id) WHERE u.unit_id=$1',
    [ req.params['id'] ]);
    res.status(200).json(queRes.rows[0]);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

// READ units of a force
router.get('/force/:id', async function(req, res) {
  try{
    var queRes = await db.query('SELECT u.unit_id,u.name,u.keywords,u.unit_type,u.equipment,u.psychic_powers,u.warlord_traits,u.power_rating,u.experience_points,u.crusade_points,u.other_abilities,u.battle_honors,u.battle_scars,u.relics,fa.name as faction,fa.description as faction_des,ro.name as role,ra.name as rank,fo.name as force,fo.force_id FROM units AS u LEFT JOIN factions AS fa ON (u.faction = fa.faction_id) LEFT JOIN roles AS ro ON (u.rank = ro.role_id) LEFT JOIN ranks AS ra ON (u.rank = ra.rank_id) LEFT JOIN forces AS fo ON (u.force = fo.force_id) WHERE u.force=$1',
    [ req.params['id'] ]);
    res.status(200).json(queRes.rows);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

// CREATE a new unit
// not all the columns are here because the idea is that a new unit won't have them
// the user can update these fields after creation if they want to
router.post('/create', async function(req, res) {
  try{
    //if(!req.body['name'] || !req.body['role'] || !req.body['faction'] || !req.body['keywords'] || !req.body['unit_type'] || !req.body['equipment'] || !req.body['psychic_powers'] || !req.body['warlord_traits'] || !req.body['power_rating'] || !req.body['crusade_points'] || !req.body['other_abilities'] || !req.body['rank'] || !req.body['battle_honors'] || !req.body['battle_scars'] || !req.body['relics'] || !req.body['force']){
    if(!req.body['name'] || !req.body['role'] || !req.body['faction'] || !req.body['keywords'] || !req.body['unit_type'] || !req.body['equipment'] || !req.body['power_rating'] || !req.body['other_abilities'] || !req.body['rank'] || !req.body['battle_honors'] || !req.body['battle_scars'] || !req.body['relics'] || !req.body['force']){
      res.sendStatus(400);
      return;
    }
    var queRes = await db.query('SELECT player_id FROM forces WHERE force_id=$1',
      [ req.body['force'] ]);
    if(queRes.rows[0]['player_id'] != req.token.id){
      res.sendStatus(405);
      return;
    }
    var inRes = await db.query('INSERT INTO units(name,role,faction,keywords,unit_type,equipment,psychic_powers,warlord_traits,power_rating,other_abilities,rank,battle_honors,battle_scars,relics,force) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING unit_id',
			[ req.body['name'],req.body['role'],req.body['faction'],req.body['keywords'],req.body['unit_type'],req.body['equipment'],req.body['psychic_powers'],req.body['warlord_traits'],req.body['power_rating'],req.body['other_abilities'],req.body['rank'],req.body['battle_honors'],req.body['battle_scars'],req.body['relics'],req.body['force'] ]);
    res.set({
      'location' : req.baseUrl+'/'+inRes.rows[0].unit_id,
    }).sendStatus(201);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

// UDPATE unit's various fields, not the force column. That would allow a player to add units to any force.
router.put('/update', async function(req, res) {
  try{
    if(!req.body['id']){
      res.sendStatus(400);
      return;
    }

    var queRes = await db.query('SELECT fo.player_id FROM units AS u LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE u.unit_id=$1',
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
    createQ('name');
    createQ('role');
    createQ('faction');
    createQ('keywords');
    createQ('unit_type');
    createQ('equipment');
    createQ('psychic_powers');
    createQ('warlord_traits');
    createQ('power_rating');
    createQ('crusade_points');
    createQ('experience_points');
    createQ('other_abilities');
    createQ('rank');
    createQ('battle_honors');
    createQ('battle_scars');
    createQ('relics');
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

// DELETE the unit
router.delete('/delete', async function(req, res){
  try{
    if(!req.body['id']){
      res.sendStatus(400);
      return;
    }

    var verRes = await db.query('SELECT fo.player_id FROM units AS u LEFT JOIN forces AS fo ON (u.force=fo.force_id) WHERE u.unit_id=$1',
      [ req.body['id'] ]);
    if(verRes.rows[0]['player_id'] != req.token['id']){
      res.sendStatus(401);
      return;
    }
    var queRes = await db.query('DELETE FROM units WHERE unit_id=$1',
      [ req.body['id'] ]);
    res.sendStatus(200);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

module.exports = router;
