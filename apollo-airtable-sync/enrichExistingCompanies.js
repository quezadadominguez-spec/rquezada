require("dotenv").config();

const Airtable = require("airtable");
const fs = require("fs");
const csv = require("csv-parser");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

function mapIndustria(industry = "") {

  const i = industry.toLowerCase();

  if (i.includes("bank")) return "Banking";
  if (i.includes("financial")) return "FinancialServices";
  if (i.includes("insurance")) return "Insurance";
  if (i.includes("fintech")) return "Fintech";

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

  return result.length ? result : ["Other"];
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

async function actualizarEmpresa(row) {

  const empresaNombre =
    (row["Company Name"] || "").trim();

  if (!empresaNombre) return;

  const encontrados =
    await base("EMPRESA")
      .select({
        filterByFormula:
          `{EMPRESA}="${empresaNombre.replace(/"/g, '\\"')}"`
      })
      .firstPage();

  if (!encontrados.length) {

    console.log(
      `❌ Empresa no encontrada: ${empresaNombre}`
    );

    return;
  }

  const empresa = encontrados[0];

  const descripcion = `
Industria: ${row["Industry"] || ""}

Empleados: ${row["# Employees"] || ""}

Ciudad: ${row["Company City"] || ""}

Tecnologías:
${row["Technologies"] || ""}

Keywords:
${row["Keywords"] || ""}
`;

  await base("EMPRESA").update(
    empresa.id,
    {
      INDUSTRIA:
        mapIndustria(row["Industry"]),

      SENALES:
        mapSenales(row["Keywords"]),

      TechStack:
        mapTechStack(row["Technologies"]),

      DESCRIPCION:
        descripcion,

      UltimaActualizacion:
        new Date()
          .toISOString()
          .split("T")[0]
    }
  );

  console.log(
    `✅ Actualizada: ${empresaNombre}`
  );
}

async function ejecutar() {

  const rows = [];

  fs.createReadStream(
    "./data/RD-QAEngManagers.csv"
  )
    .pipe(csv())
    .on("data", row => rows.push(row))
    .on("end", async () => {

      console.log(
        `Procesando ${rows.length} filas`
      );

      for (const row of rows) {

        try {

          await actualizarEmpresa(row);

        } catch (error) {

          console.log(
            "ERROR:",
            row["Company Name"],
            error.message
          );
        }
      }

      console.log(
        "\n=== ACTUALIZACION FINALIZADA ==="
      );

    });
}

ejecutar();