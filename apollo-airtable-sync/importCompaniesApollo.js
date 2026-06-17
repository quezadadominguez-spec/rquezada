require("dotenv").config();

const Airtable = require("airtable");
const fs = require("fs");
const csv = require("csv-parser");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

let creadas = 0;
let actualizadas = 0;
let errores = 0;

function mapIndustry(industry = "") {

  const value = industry.toLowerCase();

  if (value.includes("bank"))
    return "Banking";

  if (value.includes("financial"))
    return "FinancialServices";

  if (value.includes("insurance"))
    return "Insurance";

  if (value.includes("fintech"))
    return "Fintech";

  if (value.includes("software"))
    return "Software";

  if (
    value.includes("technology") ||
    value.includes("information technology")
  )
    return "Technology";

  if (value.includes("telecom"))
    return "Telecommunications";

  if (value.includes("health"))
    return "Healthcare";

  if (value.includes("retail"))
    return "Retail";

  return "Other";
}

function mapTechStack(tech = "") {

  const t = tech.toLowerCase();

  const stack = [];

  if (t.includes("react"))
    stack.push("React");

  if (t.includes("node"))
    stack.push("Node");

  if (t.includes("java"))
    stack.push("Java");

  if (t.includes("python"))
    stack.push("Python");

  if (t.includes("aws"))
    stack.push("AWS");

  if (t.includes("azure"))
    stack.push("Azure");

  if (t.includes("docker"))
    stack.push("Docker");

  if (t.includes("kubernetes"))
    stack.push("Kubernetes");

  if (t.includes("typescript"))
    stack.push("TypeScript");

  if (t.includes(".net"))
    stack.push(".NET");

  if (t.includes("php"))
    stack.push("PHP");

  return stack.length > 0
    ? stack
    : ["Other"];
}

async function buscarEmpresa(nombreEmpresa) {

  const records = await base("EMPRESA")
    .select({
      filterByFormula:
        `{EMPRESA}="${nombreEmpresa.replace(/"/g, '\\"')}"`
    })
    .firstPage();

  return records.length > 0
    ? records[0]
    : null;
}

async function procesarEmpresa(row) {

  const nombreEmpresa =
    (row["Company Name"] || "").trim();

  if (
    !nombreEmpresa ||
    nombreEmpresa === "."
  ) {
    return;
  }

  const industry =
    mapIndustry(row["Industry"]);

  const techStack =
    mapTechStack(row["Technologies"]);

  const fields = {

    EMPRESA: nombreEmpresa,

    DOMINIO:
      row["Website"] || "",

    INDUSTRIA:
      industry,

    EMPLEADOS:
      Number(row["# Employees"]) || null,

    PAIS:
      row["Company Country"] || "",

    CIUDAD:
      row["Company City"] || "",

    DESCRIPCION:
      row["Short Description"] || "",

    Website:
      row["Website"] || "",

    LinkedIn:
      row["Company Linkedin Url"] || "",

    NOTAS:
      row["Keywords"] || "",

    FUENTE:
      "Apollo",

    ESTADO:
      "Nuevo",

    ASIGNADO:
      "Reynaldo",

    FechaImportacion:
      new Date()
        .toISOString()
        .split("T")[0],

    TechStack:
      techStack
  };

  const existente =
    await buscarEmpresa(nombreEmpresa);

  if (existente) {

    await base("EMPRESA")
      .update(
        existente.id,
        fields
      );

    actualizadas++;

    console.log(
      `🔄 Actualizada: ${nombreEmpresa}`
    );

  } else {

    await base("EMPRESA")
      .create(fields);

    creadas++;

    console.log(
      `✅ Creada: ${nombreEmpresa}`
    );
  }
}

async function importar() {

  const archivo =
    process.argv[2];

  if (!archivo) {

    console.log(
      "Uso: node importCompaniesApollo.js archivo.csv"
    );

    process.exit(1);
  }

  const rows = [];

  fs.createReadStream(
    `./data/${archivo}`
  )
    .pipe(csv())
    .on("data",
      row => rows.push(row)
    )
    .on("end",
      async () => {

        console.log(
          `\nProcesando ${rows.length} empresas...\n`
        );

        for (const row of rows) {

          try {

            await procesarEmpresa(row);

          } catch (error) {

            errores++;

            console.error(
              `❌ ${row["Company Name"]}`,
              error.message
            );
          }
        }

        console.log("\n==========================");
        console.log("IMPORTACION FINALIZADA");
        console.log("==========================");
        console.log(
          "Empresas creadas:",
          creadas
        );
        console.log(
          "Empresas actualizadas:",
          actualizadas
        );
        console.log(
          "Errores:",
          errores
        );
        console.log("==========================\n");
      });
}

importar();