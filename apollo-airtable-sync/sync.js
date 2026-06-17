require("dotenv").config();
const axios = require("axios");
const Airtable = require("airtable");

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

async function getApolloPeople() {
  try {

    const response = await axios.post(
      "https://api.apollo.io/api/v1/mixed_people/search",
      {
        page: 1,
        per_page: 25
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.APOLLO_API_KEY
        }
      }
    );

    return response.data.people || [];

  } catch (error) {

    console.log(error.response?.data || error.message);
    return [];
  }
}

async function createCompany(person) {

  const companyName =
    person.organization?.name || "Sin Empresa";

  const records =
    await airtable(process.env.EMPRESAS_TABLE)
      .select({
        filterByFormula:
          `{EMPRESA}="${companyName}"`
      })
      .firstPage();

  if (records.length > 0) {
    return records[0].id;
  }

  const company =
    await airtable(process.env.EMPRESAS_TABLE)
      .create({
        EMPRESA: companyName,
        DOMINIO:
          person.organization?.website_url || "",
        INDUSTRIA:
          person.organization?.industry || "",
        EMPLEADOS:
          person.organization?.estimated_num_employees || 0,
        PAIS:
          person.organization?.country || "",
        LinkedIn:
          person.organization?.LinkedIn_url || "",
        Website:
          person.organization?.website_url || "",
        FUENTE: "Apollo",
        ESTADO: "Nuevo"
      });

  return company.id;
}

async function createContact(person, companyId) {

  const email = person.email || "";

  const existing =
    await airtable(process.env.CONTACTOS_TABLE)
      .select({
        filterByFormula:
          `{Email}="${email}"`
      })
      .firstPage();

  if (existing.length > 0) {
    console.log(
      `Ya existe: ${person.name}`
    );
    return;
  }

  await airtable(process.env.CONTACTOS_TABLE)
    .create({
      NombreCompleto:
        person.name || "",
      Cargo:
        person.title || "",
      Email:
        email,
      LinkedIn:
        person.LinkedIn_url || "",
      Telefono:
        person.phone_numbers?.[0]?.raw_number || "",
      Empresa:
        [companyId],
      Seniority:
        person.seniority || "",
      EstadoOutreach:
        "Nuevo",
      Notas:
        "Importado desde Apollo"
    });

  console.log(
    `Contacto creado: ${person.name}`
  );
}

async function sync() {

  const people =
    await getApolloPeople();

  console.log(
    `Encontrados ${people.length} contactos`
  );

  for (const person of people) {

    const companyId =
      await createCompany(person);

    await createContact(
      person,
      companyId
    );
  }

  console.log("Sincronización finalizada");
}

sync();