require("dotenv").config();

const Airtable = require("airtable");
const fs = require("fs");
const csv = require("csv-parser");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

const empresasCache = {};
const contactosCache = {};

let empresasCreadas = 0;
let contactosCreados = 0;
let duplicados = 0;

/* =====================================================
   HELPERS
===================================================== */

function mapIndustria(industry = "") {

  const i = industry.toLowerCase();

  if (i.includes("bank")) return "Banking";

  if (i.includes("financial"))
    return "FinancialServices";

  if (i.includes("insurance"))
    return "Insurance";

  if (i.includes("fintech"))
    return "Fintech";

  if (
    i.includes("software") ||
    i.includes("computer software")
  ) {
    return "Software";
  }

  if (
    i.includes("technology") ||
    i.includes("information technology")
  ) {
    return "Technology";
  }

  if (i.includes("telecommunications")) {
    return "Telecommunications";
  }

  return "Other";
}

function mapTechStack(tech = "") {

  const t = tech.toLowerCase();

  const result = [];

  if (t.includes("aws")) result.push("AWS");
  if (t.includes("azure")) result.push("Azure");
  if (t.includes("docker")) result.push("Docker");
  if (t.includes("kubernetes")) result.push("Kubernetes");
  if (t.includes("node")) result.push("Node");
  if (t.includes("react")) result.push("React");
  if (t.includes("java")) result.push("Java");
  if (t.includes("python")) result.push("Python");
  if (t.includes(".net")) result.push(".NET");
  if (t.includes("php")) result.push("PHP");

  return result.length
    ? result
    : ["Other"];
}

function mapSenales(keywords = "") {

  const k = keywords.toLowerCase();

  const result = [];

  if (
    k.includes("quality assurance") ||
    k.includes("software testing") ||
    k.includes("test automation")
  ) {
    result.push("Hiring QA");
  }

  if (
    k.includes("growth") ||
    k.includes("scalability")
  ) {
    result.push("Growth");
  }

  if (
    k.includes("devops") ||
    k.includes("cloud") ||
    k.includes("digital transformation")
  ) {
    result.push("Tech Modernization");
  }

  return result;
}

function tieneQA(keywords = "") {

  const k = keywords.toLowerCase();

  return (
    k.includes("quality assurance") ||
    k.includes("qa") ||
    k.includes("testing") ||
    k.includes("test automation")
  );
}

function tieneDevOps(keywords = "") {

  const k = keywords.toLowerCase();

  return (
    k.includes("devops") ||
    k.includes("docker") ||
    k.includes("kubernetes") ||
    k.includes("cloud")
  );
}

/* =====================================================
   EMPRESAS
===================================================== */

async function buscarOCrearEmpresa(row) {

  const nombreEmpresa =
    (row["Company Name"] || "").trim();

  if (!nombreEmpresa) return null;

  if (empresasCache[nombreEmpresa]) {
    return empresasCache[nombreEmpresa];
  }

  const existentes = await base("EMPRESA")
    .select({
      filterByFormula:
        `{EMPRESA}="${nombreEmpresa.replace(/"/g, '\\"')}"`
    })
    .firstPage();

  if (existentes.length > 0) {

    empresasCache[nombreEmpresa] =
      existentes[0].id;

    return existentes[0].id;
  }

  const techStack =
    mapTechStack(
      row["Technologies"] || ""
    );

  const senales =
    mapSenales(
      row["Keywords"] || ""
    );

  const descripcion = `
Empresa: ${row["Company Name"] || ""}

Industria: ${row["Industry"] || ""}

Empleados: ${row["# Employees"] || ""}

Ciudad: ${row["Company City"] || ""}

Tecnologías:
${row["Technologies"] || ""}

Keywords:
${row["Keywords"] || ""}
`;

  const empresa =
    await base("EMPRESA").create({

      EMPRESA: nombreEmpresa,

      DOMINIO:
        row["Website"] || "",

      INDUSTRIA:
        mapIndustria(
          row["Industry"] || ""
        ),

      EMPLEADOS:
        Number(row["# Employees"]) || null,

      PAIS:
        row["Company Country"] || "",

      CIUDAD:
        row["Company City"] || "",

      SENALES:
        senales,

      TechStack:
        techStack,

      DESCRIPCION:
        descripcion,

      Website:
        row["Website"] || "",

      LinkedIn:
        row["Company Linkedin Url"] || "",

      FUENTE:
        "Apollo",

      ESTADO:
        "Nuevo",

      ASIGNADO:
        "Reynaldo",

      TieneQA:
        tieneQA(
          row["Keywords"] || ""
        ),

      TieneDevOps:
        tieneDevOps(
          row["Keywords"] || ""
        ),

      FechaImportacion:
        new Date()
          .toISOString()
          .split("T")[0]

    });

  empresasCache[nombreEmpresa] =
    empresa.id;

  empresasCreadas++;

  console.log(
    `✅ Empresa creada: ${nombreEmpresa}`
  );

  return empresa.id;
}

/* =====================================================
   CONTACTOS
===================================================== */

async function existeContacto(email) {

  if (!email) return false;

  if (contactosCache[email]) {
    return true;
  }

  const encontrados =
    await base("CONTACTOS")
      .select({
        filterByFormula:
          `{Email}="${email.replace(/"/g, '\\"')}"`
      })
      .firstPage();

  if (encontrados.length > 0) {

    contactosCache[email] = true;

    return true;
  }

  return false;
}

async function crearContacto(
  row,
  empresaId
) {

  const email =
    (row["Email"] || "").trim();

  if (!email) {

    console.log(
      "SIN EMAIL:",
      row["First Name"],
      row["Last Name"],
      row["Company Name"]
    );

    return;
  }

  if (await existeContacto(email)) {

    duplicados++;

    console.log(
      `⚠️ Duplicado: ${email}`
    );

    return;
  }

  const nombre =
    `${row["First Name"] || ""} ${row["Last Name"] || ""}`
      .trim();

  const seniority =
    row["Seniority"] || "Other";

  const esDecisor =
    ["Manager", "Director", "VP", "C-Level"]
      .includes(seniority);

  await base("CONTACTOS").create({

    NombreCompleto:
      nombre,

    Cargo:
      row["Title"] || "",

    Email:
      email,

    LinkedIn:
      row["Person Linkedin Url"] || "",

    Telefono:
      row["Corporate Phone"] ||
      row["Work Direct Phone"] ||
      "",

    Empresa:
      empresaId ? [empresaId] : [],

    Seniority:
      seniority,

    EsDecisorQA:
      esDecisor,

    EstadoOutreach:
      "No Contactado",

    Notas:
      "Importado desde Apollo",

    Fuente:
      ["Apollo"],

    FechaImportacion:
      new Date()
        .toISOString()
        .split("T")[0]

  });

  contactosCache[email] = true;

  contactosCreados++;

  console.log(
    `👤 Contacto creado: ${nombre}`
  );
}

/* =====================================================
   IMPORTACION
===================================================== */

async function importar() {

  const rows = [];

//   fs.createReadStream(
//     "./data/RD-QAEngManagers.csv"
//   )
const archivo = process.argv[2];

if (!archivo) {
  console.log(
    "Uso: node importApolloCsv.js archivo.csv"
  );
  process.exit(1);
}

fs.createReadStream(`./data/${archivo}`)
    .pipe(csv())
    .on("data", row => rows.push(row))
    .on("end", async () => {

      console.log(
        `\nProcesando ${rows.length} registros...\n`
      );

      for (const row of rows) {

        try {

          const empresaId =
            await buscarOCrearEmpresa(row);

          await crearContacto(
            row,
            empresaId
          );

        } catch (error) {

          console.error(
            `❌ Error en ${row["Company Name"]}:`,
            error.message
          );
        }
      }

      console.log("\n========================");
      console.log("IMPORTACION FINALIZADA");
      console.log("========================");
      console.log("Empresas creadas:", empresasCreadas);
      console.log("Contactos creados:", contactosCreados);
      console.log("Duplicados:", duplicados);
      console.log("========================");
      console.log("Filas CSV:", rows.length);
      console.log(
        "No procesados:",
        rows.length -
        contactosCreados -
        duplicados
      );
      console.log("========================\n");

    });
}

importar();