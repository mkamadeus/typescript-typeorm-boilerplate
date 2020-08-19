import { getConnection, createConnection } from "typeorm";

import chai from "chai";
import chaiHttp from "chai-http";
import User from "../src/entities/User";

chai.should();
chai.use(chaiHttp);

describe("Registration testing", () => {
  before(() => {
    return createConnection(process.env.NODE_ENV!)
      .then((connection) => {
        return connection.createQueryBuilder().delete().from(User).execute();
      })
      .catch((err) => {
        console.log(err);
      });
    // done();
  });

  describe("Get all users", () => {
    it("The user table should be empty", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/auth/user")
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.data.length.should.be.eql(0);

          done();
        });
    });
  });

  describe("Register a new user", () => {
    it("The user table should have one user", (done) => {
      chai
        .request("http://localhost:3000")
        .post("/auth/register")
        .type("json")
        .send({
          email: "john@doe.com",
          name: "John Doe",
          password: "password",
        })
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.userData.email.should.be.eql("john@doe.com");
          res.body.userData.name.should.be.eql("John Doe");

          done();
        });
    });
  });

  describe("Get all users", () => {
    it("The user table should have one user", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/auth/user")
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.data.length.should.be.eql(1);

          done();
        });
    });
  });

  describe("Register a new ", () => {
    it("Registration should fail", (done) => {
      chai
        .request("http://localhost:3000")
        .post("/auth/register")
        .type("json")
        .send({
          email: "john@doe.com",
          name: "John Doe",
          password: "password",
        })
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(400);

          done();
        });
    });
  });
});
