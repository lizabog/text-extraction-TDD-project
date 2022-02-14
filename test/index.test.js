const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
let getDocument;

describe("Fetch data from url", function () {
  describe("data fetched successfully", function () {
    let responseStub;
    before(function () {
      responseStub = sinon.stub(getDocument);
      responseStub.withArgs("http://example.com").returns({
        status: 200,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    });
    it("should have status 200", function () {
      expect(responseStub.status).to.equal(200);
    });
    it("should have header content-type: text/html", function () {
      expect(responseStub.headers).to.include({
        "content-type": "text/html; charset=UTF-8",
      });
    });
  });
  describe("data fetched unsuccessfully", function () {
    it("should throw TypeError if content type not text/html", function () {
      const responseStub = sinon.stub(getDocument);
      responseStub.withArgs("http://example.com").returns({
        status: 200,
        headers: { "content-type": "application/json" },
      });
      expect(responseStub).to.Throw(
        TypeError,
        "response is not type not text/html"
      );
    })
    it('should throw an error “has been redirected” f fails with 300s', function () {
        const responseStub = sinon.stub(getDocument);
      responseStub.withArgs("http://example.com").returns({
        status: 400})
       expect(responseStub).to.Throw("“bad request"); 
  });
  it("should throw unauthorized If fails with 401", function () {
        const responseStub = sinon.stub(getDocument);
        responseStub.withArgs("http://example.com").returns({
          status: 401,
        });
        expect(responseStub).to.Throw("Unauthorized");
  });
});
})