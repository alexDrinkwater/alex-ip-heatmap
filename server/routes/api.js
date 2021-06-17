const express = require('express');
const db = require('../db/db-service');

const router = express.Router();

router.get('/ip4', function(req, res, next) {
    let results = db.getIpsWithLatLong(req.query.minLat, req.query.minLong, req.query.maxLat, req.query.maxLong);
    res.json(results);
});

module.exports = router;