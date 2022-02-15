const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");

const { exampleHtml } = require("./exampleHtml");
const { getDocument } = require("../getDocument");
chai.use(chaiAsPromised);

describe("data fetched successfully ", function () {
  let mockAxios;
  beforeEach(function () {
    mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet("http://example.com")
      .reply(200, exampleHtml, { "content-type": "text/html; charset=UTF-8" });
  });
  afterEach(() => {
    mockAxios.restore();
  });
  it("should return response if status 200 and content type text/html", async function () {
    const result = await getDocument("http://example.com");
    expect(result).to.include("html");
  });
});
describe("data fetched unsuccessfully", () => {
  let mockAxios;
  beforeEach(function () {
    mockAxios = new MockAdapter(axios);
  });
  afterEach(() => {
    mockAxios.restore();
  });
  it("should throw typeError if content type not text/html ", async () => {
    mockAxios
      .onGet("http://example.com")
      .reply(
        200,
        { exampleHtml: "no" },
        { "content-type": "application/json; charset=UTF-8" }
      );

    return expect(getDocument("http://example.com")).to.be.rejectedWith(
      TypeError,
      "not text/html"
    );
  });
  it("should throw an error “bad request” If status 400", async function () {
    mockAxios.onGet("http://example.com").reply(400);
    return expect(getDocument("http://example.com")).to.be.rejectedWith(
      "bad request"
    );
  });
   it("it should throw unauthorized If fails with 401", async function () {
     mockAxios.onGet("http://example.com").reply(401);
     return expect(getDocument("http://example.com")).to.be.rejectedWith(
       "unauthorized"
     );
   });
});
