const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const axios = require("axios");
let getDocument;
let convertDocument;
let convert;

describe("Fetch data from url", async function () {
  describe("data fetched successfully",async function () {
    let responseStub;
    beforeEach(function () {
      responseStub = sinon.stub(axios, "get");
      responseStub.withArgs("http://example.com").resolves({
        status: 200,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
      afterEach(() => {
        sinon.restore();
      });
    });
    it("should have status 200", async function () {
      const result = await getDocument("http://example.com");

      expect(result.status).to.equal(200);
    });
    it("should have header content-type: text/html", async function () {
      const result = await getDocument("http://example.com");
      expect(result).to.include({
        "content-type": "text/html; charset=UTF-8",
      });
    });
  });
  describe("data fetched unsuccessfully", function () {
    let responseStub;
    beforeEach(() => {
      responseStub = sinon.stub(axios, "get");
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should throw TypeError if content type not text/html", async function () {
      responseStub.withArgs("http://example.com").resolves({
        status: 200,
        headers: { "content-type": "application/json" },
      });
      const result = await getDocument("http://example.com");
      expect(result).to.Throw(TypeError, "response is not type not text/html");
    });
    it("should throw an error “bad request” If fails with 400 ", async function () {
      responseStub.withArgs("http://example.com").resolves({
        status: 400,
      });
      const result = await getDocument("http://example.com");
      expect(result).to.Throw("“bad request");
    });
    it("should throw unauthorized If fails with 401",async function () {
      responseStub.withArgs("http://example.com").resolves({
        status: 401,
      });
      const result = await getDocument("http://example.com");
      expect(result).to.Throw("Unauthorized");
    });
    it("it should  throw “forbidden” If fails with 403", function () {
      responseStub.withArgs("http://example.com").resolves({
        status: 403,
      });
      const result = await getDocument("http://example.com");
      expect(result).to.Throw("forbidden");
    });
    it.skip("it should retry once if still unsuccessful should throw “timeout” If fails with 408", function () {
      responseStub.withArgs("http://example.com").resolves({
        status: 408,
      });
    });

    it("should to throw server error if fails with 500s", function () {
      const responseStub = sinon.stub(getDocument);
      responseStub.withArgs("http://example.com").resolves({
        status: 501,
      });
      const result = await getDocument("http://example.com");
      expect(result).to.Throw("server error");
    });
  });
});

describe("Convert the fetched response", () => {
  let getDocumentSpy;
  let convertStub;
  beforeEach(() => {
    getDocumentSpy = sinon.spy(getDocument);
    convertStub = sinon.stub(convert);
  });
  afterEach(() => {
    sinon.restore();
  });
  it("shouls call fetch once with Url", () => {
    convertDocument();
    expect(getDocumentSpy.withArgs("http://example.com").calledOnce).to.be.true;
  });
  it("it should call convert after calling getDocument", () => {
    convertDocument();
    expect(getDocumentSpy.calledBefore(convertStub)).to.be.true;
  });
  it("should throw error “this is not html” received from conversion if called with unexpected", () => {
    convertStub.throws("this is not html");
    const result = convertDocument();
    expect(result).to.throw("this is not html");
  });
  it("It should console.log obj received from conversion", () => {
      const response = { title: "test", body: " test test test test" };
    convertStub.returns(response);
    const consoleSpy = sinon.spy(console, "log");
    convertDocument()
    expect(consoleSpy.calledWith(response)).to.be.true
  });
});
describe('Conversion from text to an object', () => { 
    let convertStub
    beforeEach(() => {
        convertStub= sinon.stub(convert)
    });
    afterEach(() => {
        sinon.restore()
    });
    it('it should throw typeError “this is not html” if received data that’s not html', () => {
        const notHtmldata= {
        status: 200,
        headers: { "content-type": "application/json" }}
        convert(notHtmldata)
        expect(convertStub.threw("TypeError")).to.be.true
    });
    

 })