const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const { getDocument } = require("../api/getDocument");


describe('Fetch data from url', function ()  {
    describe("data fetched successfully", function () {
        let responseStub
        before(function () {
             responseStub = sinon.stub(getDocument);
            responseStub
              .withArgs("http://example.com")
              .returns({
                status: 200,
                headers: { "content-type": "text/html; charset=UTF-8" },
              });
        });
        it("should have status 200", function() {    
            expect(responseStub.status).to.equal(200);});
    });
        it("should have header content-type: text/html", function() {
        expect(responseStub.headers).to.include({
          "content-type": "text/html; charset=UTF-8",
        });
        })
});