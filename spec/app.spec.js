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

  describe("/api ERROR", () => {
    it("STATUS:405", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error 405, method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });

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

  describe("/topics INVALID METHODS", () => {
    it("STATUS:405", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error 405, method not allowed");
          });
      });
      return Promise.all(methodPromises);
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
    it("GET 404 for invalid username - status 400 and error message", () => {
      return request(app)
        .get("/api/users/not-a-valid-username")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid username");
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
        .send({ inc_votes: 8 }) 
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(108);
          expect(body.article.author).to.equal("butter_bridge");
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
      it("PATCH 200, body sent does not include nescessary content", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(100);
            expect(body.article.author).to.equal("butter_bridge");
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
          expect(body.comment.body).to.equal("hey ho");
          expect(body.comment.author).to.equal("butter_bridge");
        });
    });
    it("GET 200, responds with an array of comments for given article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.contain.keys(
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
          expect(body.comments).to.be.an("array");
          expect(body.comments).to.be.descendingBy("created_at");
        });
    });
    it("GET 200, responds with an array of comments for given article id that accepts query sort_by comment id in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0].comment_id).to.equal(18);
          expect(body.comments[1].comment_id).to.equal(13);
        });
    });
    it("GET 200, responds with an array of comments for given article id that accepts query sort_by votes in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0].comment_id).to.equal(4);
          expect(body.comments[1].comment_id).to.equal(13);
          expect(body.comments[0].votes).to.equal(-100);
        });
    });
  });
  describe("/articles/:article_id/comments - ERRORS", () => {
    it("POST 404, invalid username when attempting to post", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "notValidUsername", body: "hey ho" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("404 Not found");
        });
    });

    it("POST 404, POST contains a valid article ID that does not exist", () => {
      return request(app)
        .post("/api/articles/10000/comments")
        .send({ username: "icellusedkars", body: "insert me" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("404 Not found");
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
    it("GET 404, responds with 404", () => {
      return request(app)
        .get("/api/articles/8888/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("Not found artical doesn't exist");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET 200, responds with an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.contain.keys(
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
          expect(body.articles[0].article_id).to.equal(1);
          expect(body.articles[1].votes).to.equal(0);
        });
    });
    it("GET 200, responds with an array of article objects in sorted by article", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(12);
          expect(body.articles[1].title).to.equal("Am I a cat?");
        });
    });
    it("GET 200, responds with an array of article objects sorted by order defaulted to descending", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy("article_id");
          expect(body.articles[0].article_id).to.equal(12);
          expect(body.articles[1].title).to.equal("Am I a cat?");
        });
    });
    it("GET 200, responds with an array of article objects sorted by ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.ascendingBy("article_id");
          expect(body.articles[0].article_id).to.equal(1);
          expect(body.articles[1].topic).to.equal("mitch");
        });
    });
    it("GET 200, responds with an array of article objects containing the author being queried", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body }) => {
          for (let i = 0; i < body.articles.length; i++) {
            expect(body.articles.length).to.equal(3);
            expect(body.articles[i].author).to.equal("butter_bridge");
          }
        });
    });
    it("GET 200, responds with an array of article objects containing the author being queried", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(1);
          expect(body.articles[0].topic).to.equal("cats");
          expect(body.articles[0].author).to.equal("rogersop");
        });
    });
  });
  describe("/api/articles ERRORS", () => {
    it("STATUS:405 INVALID METHODS", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Error 405, method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });

    it("GET 400, sort_by a column that doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=not-a-valid-column")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });
    it("GET 404, author that is not in the database", () => {
      return request(app)
        .get("/api/articles?author=not-a-valid-author")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("Not found author doesn't exist");
        });
    });
    it("GET 404, topic that is not in the database", () => {
      return request(app)
        .get("/api/articles?topic=not-a-valid-topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("Not found topic doesn't exist");
        });
    });

    it("GET 404, author that is not in the database", () => {
      return request(app)
        .get("/api/articles?author=not-a-valid-author")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("Not found author doesn't exist");
        });
    });
    it("GET 200, empty array when articles for a author that does exist, but has no articles is requested", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        });
    });
    it("GET 200, empty array when articles for a topic that does exist, but has no articles is requested", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        });
    });
  });
  describe("/api/comments/:comments_id", () => {
    it("PATCH 200, successfully increments current comments votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(17);
          expect(body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });
    it("PATCH 200, successfully decrements current comments votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -1 }) 
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(15);
        });
    });
    it("DELETE 204, successfully deletes comment and no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
  });
  describe("/api/comments/:comments_id ERRORS", () => {
    it("PATCH 200, body sent does not include nescessary content", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(16);
          expect(body.comment.comment_id).to.equal(1);
          expect(body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });
    it("PATCH 400, body sent does not include valid value", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "not-a-valid-value" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });
    it("PATCH 400, body sent includes other properties", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1, name: "Mitch" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });

    it("PATCH 404, body sent includes invalid comment_id", () => {
      return request(app)
        .patch("/api/comments/1000")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("404 Not found");
        });
    });

    it("DELETE 400, comments id is wrong type of input", () => {
      return request(app)
        .patch("/api/comments/not-a-valid-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });
    it("DELETE 404, correct syntax but comment doesn't exist", () => {
      return request(app)
        .delete("/api/comments/88888")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
  });
});
