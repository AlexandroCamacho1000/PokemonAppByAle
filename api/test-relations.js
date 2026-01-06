console.log('=== PRUEBA DE RELACIONES POKEMON-TYPE ===\n');


const fs = require('fs');
const path = require('path');

console.log('📂 Directorio actual:', __dirname);
console.log('📍 Working directory:', process.cwd());
console.log('\n📁 Contenido de la carpeta:');

const files = fs.readdirSync('.');
files.forEach(file => {
  const stats = fs.statSync(file);
  console.log(`${stats.isDirectory() ? '📁' : '📄'} ${file}`);
});

console.log('\n🔍 Buscando db.js...');


const possiblePaths = [
  '.',              
  '..',             
  '../..',          
  './src',          
  './models',       
  './config',       
  '../src',         
  '../models',      
];

let dbFound = false;

for (const relPath of possiblePaths) {
  const dbPath = path.join(relPath, 'db.js');
  const exists = fs.existsSync(dbPath);
  
  console.log(`${exists ? '✅' : '❌'} ${dbPath}`);
  
  if (exists && !dbFound) {
    try {
      const db = require(dbPath);
      console.log(`\n🎉 ¡db.js encontrado en: ${path.resolve(dbPath)}`);
      console.log('📦 Exporta:', Object.keys(db));
      dbFound = true;
    } catch (error) {
      console.log(`⚠️  Error cargando ${dbPath}:`, error.message);
    }
  }
}

if (!dbFound) {
  console.log('\n❌ db.js no encontrado');
  console.log('\n💡 SOLUCIÓN:');
  console.log('1. Asegúrate que db.js existe en el proyecto');
  console.log('2. Ejecuta: dir /s db.js (Windows) para encontrarlo');
  console.log('3. O usa: find . -name "db.js" (Linux/Mac)');
}

console.log('\n=== FIN DE LA PRUEBA ===');