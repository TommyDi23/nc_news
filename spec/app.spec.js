process.env.NODE_ENV = "test";
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
const app = require("../app");
const connection = require("../db/connection");

chai.use(require("sams-chai-sorted"));

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    it("GET 200, responds with an array of all the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(3);
          expect(topics[0]).to.contain.keys("slug", "description");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET 200, responds with a user object requested from client", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user.username).to.equal("butter_bridge");
          expect(user).to.contain.keys("username", "avatar_url", "name");
        });
    });
  });
  describe("/users ERRORS", () => {
    it("GET 400 for invalid username - status 400 and error message", () => {
      return request(app)
        .get("/api/users/not-a-valid-username")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET 200, responds with an article object of the article Id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(100);
          expect(article.topic).to.equal("mitch");
          expect(article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("PATCH 200, takes an update object and responds with updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 8 }) // use increments in models
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).to.equal(108);
          expect(body.author).to.equal("butter_bridge");
        });
    });
    describe("/articles ERRORS", () => {
      it("GET 400 for invalid article_id - status 400 and error message", () => {
        return request(app)
          .get("/api/articles/not-a-valid-article_id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("GET 404, article does not exist", () => {
        return request(app)
          .get("/api/articles/99999999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("404 Not found");
          });
      });
      it("PATCH 400, body sent does not include nescessary content", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("PATCH 400, body sent does not include valid value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "not-a-valid-value" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("PATCH 400, body sent includes other properties", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, name: "Mitch" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("POST 201, adds a comment to an article, responds with the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "hey ho" })
        .expect(201)
        .then(({ body }) => {
          expect(body.body).to.equal("hey ho");
          expect(body.author).to.equal("butter_bridge");
        });
    });
    it("GET 200, responds with an array of comments for given article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0]).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });
    it("GET 200, responds with an array of comments for given article id that accepts query sort_by,defaulted to created_at", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body).to.be.descendingBy("created_at");
        });
    });
    it("GET 200, responds with an array of comments for given article id that accepts query sort_by comment id in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0].comment_id).to.equal(18);
          expect(body[1].comment_id).to.equal(13);
        });
    });
    it("GET 200, responds with an array of comments for given article id that accepts query sort_by votes in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0].comment_id).to.equal(4);
          expect(body[1].comment_id).to.equal(13);
          expect(body[0].votes).to.equal(-100);
        });
    });
  });
  describe("/articles/:article_id/comments - ERRORS", () => {
    it("POST 400, invalid username when attempting to post", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "notValidUsername", body: "hey ho" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });
    it("GET 400, responds with 400 and err message sort by query is not a valid column", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=not-a-valid-column")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });
    it("GET 400, responds with 400 and err message article_id is not a valid input", () => {
      return request(app)
        .get(
          "/api/articles/not-a-valid-input/comments?sort_by=not-a-valid-column"
        )
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });
    it("GET 404, responds with 404 and err message when article_id does not exist", () => {
      return request(app)
        .get("/api/articles/8888/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("404 Not found");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET 200, responds with an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          );
        });
    });
    it("GET 200, responds with an array of article objects in descending order defaulted to date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body[0].article_id).to.equal(12);
          expect(body[1].votes).to.equal(0);
        });
    });
    it("GET 200, responds with an array of article objects in sorted by comment count", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          expect(body[0].article_id).to.equal(11);
          expect(body[1].title).to.equal("Z");
        });
    });
  });
});
