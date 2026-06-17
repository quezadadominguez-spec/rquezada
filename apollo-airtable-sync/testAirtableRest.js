require("dotenv").config();
const axios = require("axios");

async function test() {
  try {

    const response = await axios.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/EMPRESA`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
        }
      }
    );

    console.log("Conexión OK");
    console.log(response.data);

  } catch (err) {

    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
  }
}

test();