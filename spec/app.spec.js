process.env.NODE_ENV = "test";
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;

const app = require("../app");
const connection = require("../db/connection");

chai.use(require("sams-chai-sorted"));

describe("/api", () => {
  // beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    it("GET 200, returns array of all the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(3);
          expect(topics[0]).to.contain.keys("slug", "description");
        });
    });
  });
  describe("/users", () => {
    it("GET 200, returns a user object requested from client", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user.username).to.equal("butter_bridge");
          expect(user).to.contain.keys("username", "avatar_url", "name");
        });
    });
  });
});
