const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
class ConvertHtmlToString {
  constructor(url) {
    this.url = url;
    this.retry = this.retry.bind(this);
  }
  async getDocument() {
    try {
      let response = await axios.get(this.url);

      if ((await response.status) !== 200) {
        throw { status: response.status };
      }

      if (
        (await response.headers["content-type"]) == "text/html; charset=UTF-8"
      ) {
        return response.data || retryResponse.data;
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
        const retried = await new Promise((resolve) =>
          setTimeout(resolve(this.retry()), 150)
        );
        const retryResult = await retried;
        if (retryResult.status && retryResult.status === 200)
          return retryResult;
        throw "server error";
      } else {
        throw error;
      }
    }
  }
  convert(htmlData) {
    if (!(typeof htmlData === "string" && htmlData.includes("<html>"))) {
      throw new TypeError("this is not a valid html");
    }
    const dom = new JSDOM(htmlData);
    const title = dom.window.document.querySelector("h1").textContent;
    const pTags = dom.window.document.querySelectorAll("p");
    let body = "";
    pTags.forEach((tag) => {
      body = body + tag.textContent;
    });
    return { title: title, body: body };
  }
  async convertResponse() {
    const htmlData = await this.getDocument();
    const convertedText = this.convert(htmlData);
    console.log(convertedText);
  }
  retry = async () => {
    const retried = await axios.get(this.url);
    return retried;
  };
}

module.exports = { ConvertHtmlToString };
