let app = require("../app");
const supertest = require("supertest");

test("GET ip4 and verify properties", async () => {
  await supertest(app)
    .get("/api/ip4")
    .query({minLat: 40, maxLat: 42, minLong: -102, maxLong: -100})
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(171);
      expect(response.body[0].latitude).toBeDefined()
      expect(response.body[0].longitude).toBeDefined()
    });
});
