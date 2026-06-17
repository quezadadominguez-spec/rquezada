require("dotenv").config();
const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

async function test() {

  const empresas = await base("EMPRESA")
    .select({ maxRecords: 20 })
    .firstPage();

  empresas.forEach(r => {
    console.log("ID:", r.id);
    console.log(r.fields);
    console.log("----------------");
  });

}

test();