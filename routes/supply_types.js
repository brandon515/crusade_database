var express = require('express');
var router = express.Router();
const db = require('../db');

// READ all supply types
router.get('/', async function(req, res) {
    try{
        var queRes = await db.query('SELECT * FROM supply_types');
        res.status(200).json(queRes.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

//READ specific supply type
router.get('/id/:id', async function(req, res) {
    try{
        var queRes = await db.query('SELECT name FROM supply_types WHERE type_id=$1',
            [ req.params['id'] ]);
        res.status(200).json(queRes.rows[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }
});

module.exports = router;
