const axios = require("axios");

async function getDocument(URL) {
  try {
    const response = await axios(URL);
 
    if (response.headers["content-type"] == "text/html; charset=UTF-8") {
      return response.data;
    } else {
      throw new TypeError("not text/html");
    }
    

  } catch (error) {
      if (error.response && error.response.status === 400) {
        throw "bad request";
      } else if (error.response && error.response.status === 401) {
        throw "unauthorized";
      } else {
        throw error;
      }
    }
}
module.exports = { getDocument };
