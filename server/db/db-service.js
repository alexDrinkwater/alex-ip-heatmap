const csv = require('csv-parser');
const fs = require('fs');
const unzipper = require('unzipper');
const Database = require('better-sqlite3');
const dbService = new Database('server/ip.db');

const sql = require('./db-sql');

let service = {
  init: init,
  getIpsWithLatLong: getIpsWithLatLong
}

function init() {
  if (!dbService.prepare(sql.select_table).get()) {
    console.log('WARNING: database appears empty, initializing it.');
    dbService.exec(sql.create_ip_table);
    console.log("database exists now, if it didn't already.");

    const insert = dbService.prepare(sql.insert_ip);
    const insertMany = dbService.transaction((ips) => {
      for (const ip of ips) {
        insert.run(ip);
      }
    });

    const results = [];

    fs.createReadStream('server/db/GeoLite2-City-Blocks-IPv4.zip')
      .pipe(unzipper.Extract({path: 'server/db'}))
      .on('close', () => {
        fs.createReadStream('server/db/GeoLite2-City-Blocks-IPv4.csv')
          .pipe(csv())
          .on('data', (data) => {
            results.push(data)
          })
          .on('end', () => {
            insertMany(results);
            console.log('Finished initializing Database')
          });
      })
  }
}

function getIpsWithLatLong(minLat, minLong, maxLat, maxLong) {
  return dbService.prepare(sql.select_ip_lat_long).all(minLat, maxLat, minLong, maxLong);
}

module.exports = service;
