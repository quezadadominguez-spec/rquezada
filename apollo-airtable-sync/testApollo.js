require("dotenv").config();
const axios = require("axios");

async function test() {
  try {
    const response = await axios.post(
      "https://api.apollo.io/api/v1/mixed_people/search",
      {
        page: 1,
        per_page: 5
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.APOLLO_API_KEY
        }
      }
    );

    console.log(JSON.stringify(response.data, null, 2));

  } catch (err) {
    console.log(
      err.response?.status,
      err.response?.data || err.message
    );
  }
}

test();