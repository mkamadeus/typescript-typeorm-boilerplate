import { createConnection, Connection } from "typeorm";

import chai from "chai";
import chaiHttp from "chai-http";
import User from "../src/entities/User";
import { access } from "fs";

chai.should();
chai.use(chaiHttp);

describe("Login testing", () => {
  let dbConnection: Connection;
  let accessToken: string;

  before(() => {
    return createConnection(process.env.NODE_ENV!)
      .then((connection) => {
        dbConnection = connection;
        return connection.createQueryBuilder().delete().from(User).execute();
      })
      .catch((err) => {
        console.log(err);
      });
    // done();
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

  describe("Login using invalid credentials with the new user", () => {
    it("Login should fail", (done) => {
      chai
        .request("http://localhost:3000")
        .post("/auth/login")
        .type("json")
        .send({ email: "john@doe.com", password: "invalidpassword" })
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(400);
          done();
        });
    });
  });

  describe("Login using valid credentials with the new user", () => {
    it("Login should fail", (done) => {
      chai
        .request("http://localhost:3000")
        .post("/auth/login")
        .type("json")
        .send({ email: "john@doe.com", password: "password" })
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          accessToken = res.body.accessToken;
          done();
        });
    });
  });

  describe("Get login status using access token", () => {
    it("User should be logged in", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/auth/status")
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.success.should.be.eql(true);
          res.body.user.email.should.be.eql("john@doe.com");

          done();
        });
    });
  });

  after(() => {
    dbConnection.close();
  });
});
