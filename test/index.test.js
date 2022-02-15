const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const axios = require("axios");

const exampleHtml = require("./exampleHtml");
const {getDocument} = require("../getDocument");

describe("Fetch data from url", async function () {
  describe("data fetched successfully ", async function () {
    let responseStub;
    beforeEach(function () {
      responseStub = sinon.stub(axios, "get");
      responseStub.withArgs("http://example.com").resolves({
        status: 200,
        headers: { "content-type": "text/html; charset=UTF-8" },
        data:exampleHtml
      });
      afterEach(() => {
        sinon.restore();
      });
    });
    it("should return response if status 200 and content type text/html", async function () {
      const result = await getDocument("http://example.com");
     expect(result).to.include("html");
    });
    
    
  });
})
