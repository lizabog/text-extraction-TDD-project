const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
class ConvertHtmlToString {
  constructor(url) {
    this.url = url;
  }
  async getDocument() {
    try {
      const response = await axios.get(this.url);
      if (response.status !== 200) {
        throw { status: response.status };
      }
      if (response.headers["content-type"] == "text/html; charset=UTF-8") {
        return response.data;
      } else {
        throw new TypeError("not text/html");
      }
    } catch (error) {
      if (error.status && error.status === 400) {
        throw "bad request";
      } else if (error.status && error.status === 401) {
        throw "unauthorized";
      } else if (error.status && error.status === 403) {
        throw "forbidden";
      } else if (error.status && error.status === 404) {
        throw "not found";
      } else if (error.status && 499 < error.status < 600) {
        try {
          const response = await axios(this.url);
          if (response.status !== 200) {
            throw { status: response.status };
          }
        } catch (error) {
          if (error.status && 499 < error.status < 600) {
            throw "server error";
          }
        }
      } else {
        throw error;
      }
    }
  }
  convert(htmlData) {
    if (!(typeof htmlData === "string" && htmlData.includes("<html>"))) {
      throw new TypeError ("this is not a valid html");
    }
     const dom = new JSDOM(htmlData);
     const title = dom.window.document.querySelector("h1").textContent;
     const pTags=dom.window.document.querySelectorAll("p")
     let body=""
    pTags.forEach(tag => {body=body+tag.textContent})
    return {title:title,body:body}
  }
  async convertResponse() {
    const htmlData = await this.getDocument();
   this.convert(htmlData);
  }
}

module.exports = { ConvertHtmlToString };
