const express = require('express');
const db = require('../db/db-service');
const protodef = require('../proto/proto').init();
require('../db/db-service')
  .init()
  .then(initCache)

const router = express.Router();

const globalMaxLat = 90;
const globalMinLat = -globalMaxLat;
const globalMaxLong = 180;
const globalMinLong = -globalMaxLong;

let cachedMessage;

router.get('/ip4', function(req, res, next) {
  let minLat = req.query.minLat;
  let minLong = req.query.minLong;
  let maxLat = req.query.maxLat;
  let maxLong = req.query.maxLong;

  let response;
  if (!cachedMessage || minLat != globalMinLat || maxLat != globalMaxLat || minLong != globalMinLong || maxLong != globalMaxLong) {
    console.log('getting results');
    results = db.getIpsWithLatLong(minLat, minLong, maxLat, maxLong);
    response = protodef.ips.encode({ip: results}).finish();
  } else {
    response = cachedMessage;
  }
  res.send(response);
});

function initCache() {
  // Cache global results
  const results = db.getIpsWithLatLong(globalMinLat, globalMinLong, globalMaxLat, globalMaxLong);
  cachedMessage = protodef.ips.encode({ip: results}).finish();
  console.log("Global results cached")
}

module.exports = router;
