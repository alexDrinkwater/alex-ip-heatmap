let app = require("../app");
const protodef = require('../proto/proto').init();
const supertest = require("supertest");

test("GET ip4 and verify properties", async () => {
  await supertest(app)
    .get("/api/ip4")
    .query({minLat: 40, maxLat: 42, minLong: -102, maxLong: -100})
    .expect(200)
    .then((response) => {
      // Check type and length
      let decodedResponse = protodef.ips.decode(response.body).ip;
      expect(Array.isArray(decodedResponse)).toBeTruthy();
      expect(decodedResponse.length).toEqual(38);
      expect(decodedResponse[0].latitude).toBeDefined()
      expect(decodedResponse[0].longitude).toBeDefined()
      expect(decodedResponse[0].weight).toBeDefined()
    });
});

test("GET ip4 all and asser response time", async () => {
  var start = new Date();
  await supertest(app)
    .get("/api/ip4")
    .query({minLat: -90, maxLat: 90, minLong: -180, maxLong: 180})
    .expect(200)
    .then((response) => {
      // Check type and length
      let decodedResponse = protodef.ips.decode(response.body).ip;
      expect(Array.isArray(decodedResponse)).toBeTruthy();
      expect(decodedResponse.length).toEqual(110862);
      const responseTime = new Date() - start;

      // Note this time also includes the time for supertest to start the serer.
      expect(responseTime).toBeLessThan(100)
      console.log('Request took:', responseTime, 'ms');
    });
});
