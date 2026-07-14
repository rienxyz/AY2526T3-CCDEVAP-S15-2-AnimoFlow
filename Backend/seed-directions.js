const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = "mongodb://admin:password@localhost:27017/?authSource=admin";
const PHOTOS_DIR = path.join(__dirname, "Directions");

const CODE_ORDER = ["LS", "Y", "SJ", "H", "V", "SM", "G", "STRC", "A", "ER"];

const buildingNames = {
  LS: "St. La Salle Hall",
  Y: "Don Enrique Yuchengco Hall",
  SJ: "St. Joseph Hall",
  H: "Henry Sy Sr Hall",
  V: "Velasco Hall",
  SM: "St. Miguel Hall",
  G: "Gokongwei Hall",
  STRC: "Science & Technology Research Center",
  A: "Br. Andrew Gonzalez Hall",
  ER: "Enrique Razon Sports Center",
};

const GATES = [
  "Gate 1 (South)",
  "Gate 2 (North)",
  "Gate 3 (Velasco)",
  "Gate 4A (Gokongwei)",
  "Gate 5A (Andrew)",
  "Gate 6 (Razon)",
  "Gate 7 (STRC)",
  "Gate 8 (Agno)",
];

function gateSlug(gate) {
  return gate.match(/Gate\s*\S+/i)[0].toLowerCase().replace(/\s+/g, "");
}

function generatePlaceholderSvgDataUri(gate, code, buildingName) {
  const bg = "#e8f3ef";
  const fg = "#006837";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
  <rect width="640" height="420" fill="${bg}"/>
  <rect x="20" y="20" width="600" height="380" fill="none" stroke="${fg}" stroke-width="3" stroke-dasharray="10,8"/>
  <text x="320" y="190" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="${fg}" text-anchor="middle">${code}</text>
  <text x="320" y="225" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="${fg}" text-anchor="middle">${buildingName}</text>
  <text x="320" y="255" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="${fg}" text-anchor="middle">Photo placeholder — walking from ${gate}</text>
</svg>`;
  const base64 = Buffer.from(svg, "utf8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

function loadImageDataUri(gate, code, buildingName) {
  const slug = gateSlug(gate);
  const extToType = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  if (fs.existsSync(PHOTOS_DIR)) {
    for (const ext of Object.keys(extToType)) {
      const filePath = path.join(PHOTOS_DIR, `${slug}-${code.toLowerCase()}${ext}`);
      if (fs.existsSync(filePath)) {
        const base64 = fs.readFileSync(filePath).toString("base64");
        return `data:${extToType[ext]};base64,${base64}`;
      }
    }
  }

  return generatePlaceholderSvgDataUri(gate, code, buildingName);
}

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB");

  const directionsCollection = client.db("Main").collection("directions");
  await directionsCollection.createIndex({ building: 1, gate: 1 }, { unique: true });

  let count = 0;
  for (const gate of GATES) {
    for (const building of CODE_ORDER) {
      const image = loadImageDataUri(gate, building, buildingNames[building]);

      await directionsCollection.updateOne(
        { building, gate },
        { $set: { building, gate, image } },
        { upsert: true }
      );
      count++;
    }
  }

  console.log(`Seeded ${count} direction documents into Main.directions`);
  await client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
