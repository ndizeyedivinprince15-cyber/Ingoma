const fs = require('fs');
const path = require('path');

// Chemins racine
const apiModulesDir = path.join(__dirname, 'apps/api/src/modules');
const sharedTypesDir = path.join(__dirname, 'packages/shared/src/types');
const sharedIndexFile = path.join(sharedTypesDir, 'index.ts');
const appModuleFile = path.join(__dirname, 'apps/api/src/app.module.ts');

// Modules à supprimer
const oldModules = ['aids', 'eligibility', 'dossiers', 'auth'];

// 1️⃣ Supprimer les dossiers dans apps/api/src/modules
oldModules.forEach(mod => {
  const modPath = path.join(apiModulesDir, mod);
  if (fs.existsSync(modPath)) {
    fs.rmSync(modPath, { recursive: true, force: true });
    console.log(`✅ Supprimé ${modPath}`);
  }
});

// 2️⃣ Supprimer les fichiers types correspondants dans shared
oldModules.forEach(mod => {
  const typeFile = path.join(sharedTypesDir, mod + '.ts');
  if (fs.existsSync(typeFile)) {
    fs.rmSync(typeFile, { force: true });
    console.log(`✅ Supprimé ${typeFile}`);
  }
});

// 3️⃣ Nettoyer index.ts dans shared/types
if (fs.existsSync(sharedIndexFile)) {
  let indexContent = fs.readFileSync(sharedIndexFile, 'utf8');
  oldModules.forEach(mod => {
    const regex = new RegExp(`export .* from ['"]\\.\\/${mod}['"];?\\n?`, 'g');
    indexContent = indexContent.replace(regex, '');
  });
  fs.writeFileSync(sharedIndexFile, indexContent, 'utf8');
  console.log(`✅ index.ts nettoyé`);
}

// 4️⃣ Nettoyer app.module.ts
if (fs.existsSync(appModuleFile)) {
  let appModuleContent = fs.readFileSync(appModuleFile, 'utf8');
  oldModules.forEach(mod => {
    // Supprimer import
    const importRegex = new RegExp(`import .*${mod}.*from ['"].*${mod}.*['"];?\\n?`, 'g');
    appModuleContent = appModuleContent.replace(importRegex, '');
    // Supprimer référence dans imports: []
    const importsRegex = new RegExp(`${mod}Module,?`, 'g');
    appModuleContent = appModuleContent.replace(importsRegex, '');
  });
  fs.writeFileSync(appModuleFile, appModuleContent, 'utf8');
  console.log(`✅ app.module.ts nettoyé`);
}

console.log('🎯 Nettoyage terminé. Tu peux maintenant rebuild.');