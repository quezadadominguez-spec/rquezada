require("dotenv").config();

console.log("Apollo:", process.env.APOLLO_API_KEY);
console.log("Airtable:", process.env.AIRTABLE_TOKEN);
console.log("Base:", process.env.AIRTABLE_BASE_ID);