module.exports = {
    select_table: `SELECT name FROM sqlite_master WHERE type='table' and name='ip';`,
    create_ip_table: `
        CREATE TABLE ip (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            network TEXT,
            geoname_id INTEGER,
            registered_country_geoname_id INTEGER,
            latitude REAL,
            longitude REAL);`,
    insert_ip: 'INSERT INTO ip (network, geoname_id, registered_country_geoname_id, latitude, longitude) VALUES (@network, @geoname_id, @registered_country_geoname_id, @latitude, @longitude);',
    select_ip_lat_long: `SELECT * FROM ip WHERE latitude >= ? AND latitude <= ? AND longitude >= ? AND longitude <= ?`,
    select_usa: `select * from ip where ip.latitude >= 24.9493 AND ip.latitude <= 49.5904 AND ip.longitude >= -125 AND ip.longitude <= -66.9326;`,
};
