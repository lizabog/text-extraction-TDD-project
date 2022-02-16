const { expect, should } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const axios = require("axios");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.use(sinonChai);

const { ConvertHtmlToString } = require("../index");
const { exampleHtml, exampleObject } = require("./exampleHtml");


describe("data fetched successfully ", function () {console.log(exampleObject)
  let mockAxios;
  let convertExample;
  let axiosStub;
  before(function () {
    convertExample = new ConvertHtmlToString("http://example.com");
  });
  beforeEach(function () {
    axiosStub = sinon
      .stub(axios, "get")
      .withArgs("http://example.com")
      .resolves({
        status: 200,
        headers: { "content-type": "text/html; charset=UTF-8" },
        data: exampleHtml,
      });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should return response if status 200 and content type text/html", async function () {
    const result = await convertExample.getDocument();
    expect(result).to.include("html");
  });
});
describe("data fetched unsuccessfully", () => {
  let mockAxios;
  let axiosStub;
  let convertExample;
  beforeEach(function () {
    convertExample = new ConvertHtmlToString("http://example.com");
    axiosStub = sinon.stub(axios, "get");
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should throw typeError if content type not text/html ", async () => {
    axiosStub.withArgs("http://example.com").resolves({
      status: 200,
      headers: { "content-type": "application/json" },
    });

    return expect(convertExample.getDocument()).to.be.rejectedWith(
      TypeError,
      "not text/html"
    );
  });
  it("should throw an error “bad request” If status 400", async function () {
    axiosStub.resolves({ status: 400 });

    return expect(convertExample.getDocument()).to.be.rejectedWith(
      "bad request"
    );
  });
  it("should throw unauthorized If fails with 401", async function () {
    axiosStub.resolves({ status: 401 });

    return expect(convertExample.getDocument()).to.be.rejectedWith(
      "unauthorized"
    );
  });

  it("should  throw “forbidden” If fails with 403", async function () {
    axiosStub.resolves({ status: 403 });
    return expect(convertExample.getDocument()).to.be.rejectedWith("forbidden");
  });
  it("should  throw 'not found' If fails with 404", async function () {
    axiosStub.resolves({ status: 404 });
    return expect(convertExample.getDocument()).to.be.rejectedWith(
      "not found"
    );
  });
  it("should to throw server error if fails with 500s", async function () {
    axiosStub.resolves({ status: 501 });
    return expect(convertExample.getDocument()).to.be.rejectedWith(
      "server error"
    );
  });
});

describe("Convert the fetched response", () => {
  let getDocumentStub;
  let convertSpy;
  let convertExample;
  let axiosStub;

  beforeEach(() => {
    axiosStub = sinon.stub(axios, "get").resolves({
        status: 200,
        headers: { "content-type": "text/html; charset=UTF-8" },
        data: exampleHtml,
      });
    convertExample = new ConvertHtmlToString("http://example.com");

    getDocumentStub = sinon.stub(convertExample, "getDocument").returns(exampleHtml);
    convertSpy = sinon.spy(convertExample, "convert");
  });
  afterEach(() => {
    sinon.restore();
  });
  it("shouls call fetch once ", async () => {
    await convertExample.convertResponse();
    expect(getDocumentStub.calledOnce).to.be.true;
  });
  it("should call fetch before calling convert", async () => {
    await convertExample.convertResponse();
    expect(getDocumentStub.calledBefore(convertSpy)).to.be.true;
  });
  it("should throw if getDocument fails", async () => {
    getDocumentStub.rejects("failed");
    expect(convertExample.convertResponse()).to.throw;
  });
  it("should console log with object from coversion", async () => {
const consoleSpy=sinon.spy(console,"log")
    await convertExample.convertResponse();

    expect(consoleSpy.calledWith(exampleObject)).to.be.true;
  });
});

describe("test convert method", () => {
    let convertExample;
beforeEach(() => {
    convertExample = new ConvertHtmlToString("http://example.com");

});
  it("should throw typeError “this is not html” if received data that’s not html", () => {
   expect(()=>convertExample.convert({ hey: "there" })).throws(TypeError);
  });
it ("should return an object containing title and body", () => {
  const result = convertExample.convert(exampleHtml)
  expect (result).to.have.all.keys(["title","body"])
})
it("should have words from original title in .title", () => {
  const result = convertExample.convert(exampleHtml);
  expect(result.title).to.include("Example Domain");
});
it("should have the same charcount as original title in .title", () => {
  const result = convertExample.convert(exampleHtml);
  expect(result.title.length).to.be.equal(14);
});
it("should have words from original body in .body", () => {
  const result = convertExample.convert(exampleHtml);
  expect(result.body).to.include("literature without prior");
});
it("should have the same charcount as original body in .body", () => {
  const result = convertExample.convert(exampleHtml);
  expect(result.body.length).to.be.equal(171);
});
});
