require("dotenv").config();
const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

async function test() {
  try {

    const record = await base("EMPRESA").create({
      EMPRESA: "TEST APOLLO"
    });

    console.log(record.id);

  } catch (error) {
    console.log(error);
  }
}

test();