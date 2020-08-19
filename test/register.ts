import User from "../src/entities/User";

import chai from "chai";
import chaiHttp from "chai-http";
// const app = import("../src/app");

chai.should();
chai.use(chaiHttp);

// describe("Clean user table", () => {
// });

// before(async (done) => {
//   await initializeServer();
//   await User.delete({});
//   done();
// });

describe("/GET user table", () => {
  it("The user table should be empty", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/auth/user")
      .end((err, res) => {
        if (err) done(err);

        res.should.have.status(200);
        console.log(res.body.data);

        res.body.data.length.should.be.eql(0);
        done();
      });
  });
});
