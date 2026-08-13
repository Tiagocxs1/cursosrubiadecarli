import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const FOLDER = 'rubialms';

cloudinary.config({
  cloud_name: 'dhfek3urm',
  api_key: '275461658762582',
  api_secret: 'EK9SJyrox9NeNLBcUecfRF9Y6Eg',
});

// Imagens do site a fazer upload
const IMAGES = [
  'drarubiadecarli.jpg',
  'Logo-dra-rubia-de-carli.png',
  'rubia2.jpg',
  'Gabriela Rigo.jpg',
  'Juliana Valadao.jpg',
  'imgi_1_fernanda.jpg',
  'imgi_2_kayane.jpg',
  'imgi_3_monique.jpg',
  'imgi_6_clinic.jpg',
  'imgi_7_rubia2.jpg',
  'imgi_8_anatomy1.png',
  'imgi_9_module2.jpg',
  'imgi_10_modulo3.jpg',
  'imgi_11_maria.jpg',
  'imgi_12_camilha_mohr.jpg',
  'imgi_13_gabriela.jpg',
  'imgi_14_camila.jpg',
  'protocolo Fullface capa2.png',
  'Curso Tricologia Essencial.png',
  'Protocolo FullFace Módulo 1 Toxina Botulínica Global.png',
  'Protocolo Fullface Modulo 2.png',
  'Protocolo Fullface Módulo 3 Bioestimuladores de Colágeno.png',
  'Protocolo Fullface Módulo 4 Técnica Fullips London Face.png',
  'Protocolo Fullface Modulo 5.png',
  'Tricologia Essencial Módulo 1 Anatomia Capilar.png',
  'Tricologia Essencial Módulo 2 Tricoses.png',
  'Tricologia Essencial Módulo 3 Alopecia.png',
];

// public_id limpo: sem acentos, espaços viram _, lowercase
function toPublicId(filename) {
  const name = path.parse(filename).name;
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
}

async function upload(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Não encontrado: ${filename}`);
    return null;
  }

  const public_id = toPublicId(filename);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: FOLDER,
      public_id,
      overwrite: true,
      resource_type: 'image',
    });
    console.log(`✅ ${filename}\n   → ${result.secure_url}`);
    return { filename, public_id: `${FOLDER}/${public_id}`, url: result.secure_url };
  } catch (err) {
    console.error(`❌ Erro em ${filename}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`\n🚀 Fazendo upload para Cloudinary (pasta: ${FOLDER})\n`);
  const results = [];

  for (const img of IMAGES) {
    const res = await upload(img);
    if (res) results.push(res);
  }

  console.log('\n📋 Mapa de URLs (copie para atualizar o código):\n');
  for (const r of results) {
    console.log(`"/${r.filename.replace(/ /g, ' ')}" → "${r.url}"`);
  }

  // Salva o mapa em JSON para referência
  fs.writeFileSync(
    path.join(__dirname, 'cloudinary-urls.json'),
    JSON.stringify(results, null, 2),
  );
  console.log('\n✅ Mapa salvo em scripts/cloudinary-urls.json');
}

main();
