const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const tsConfig = require('./tsconfig.json');
  const files = require('glob').sync('src/**/*.ts');
  
  console.log(`📦 Compiling ${files.length} TypeScript files...`);
  
  try {
    execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'inherit' });
    console.log('✅ TypeScript compilation successful');
  } catch (error) {
    console.error('❌ TypeScript compilation failed');
    process.exit(1);
  }
}

main();
