var express = require('express');
var router = express.Router();
const db = require('../db');

// READ all ranks
router.get('/', async function(req, res) {
  try{
    var queRes = await db.query('SELECT * FROM ranks');
    res.status(200).json(queRes.rows);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

//READ specific rank
router.get('/id/:id', async function(req, res) {
  try{
    var queRes = await db.query('SELECT name FROM ranks WHERE rank_id=$1',
      [ req.params['id'] ]);
    res.status(200).json(queRes.rows[0]);
  }catch(err){
    console.log(err);
    res.sendStatus(404);
  }
});

module.exports = router;
