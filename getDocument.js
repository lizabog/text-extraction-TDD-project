const axios = require("axios")

async function getDocument(URL)
{
    const response = await axios(URL)
    return await response.data

}
module.exports={getDocument}