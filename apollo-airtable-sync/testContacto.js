require("dotenv").config();
const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

async function test() {

  try {

    const empresas = await base("EMPRESA")
      .select({ maxRecords: 1 })
      .firstPage();

    if (!empresas.length) {
      console.log("No hay empresas.");
      return;
    }

    const empresaId = empresas[0].id;

    const contacto = await base("CONTACTOS").create({
      NombreCompleto: "Prueba Apollo",
      Cargo: "QA Manager",
      Email: `test${Date.now()}@demo.com`,
      Empresa: [empresaId],
      Seniority: "Manager",
      EstadoOutreach: "No Contactado",
      Notas: "Prueba de integración"
    });

    console.log("Contacto creado:");
    console.log(contacto.id);

  } catch (err) {

    console.error(err);
  }
}

test();