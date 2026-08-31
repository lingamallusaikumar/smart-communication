const fs = require('fs');
const { execSync } = require('child_process');

// 1. Generate Massive TS
const tsPath = './frontend/src/utils/massive-utils-v2.ts';
let tsCode = 'export const MassiveUtils = {\n';
for(let i=0; i<15000; i++) {
  tsCode += `  computeValue${i}: (a: number, b: number): number => {\n    const x = a * b + ${i};\n    return x > 0 ? x : 0;\n  },\n`;
}
tsCode += '};\n';
fs.writeFileSync(tsPath, tsCode);

// 2. Generate Massive Java
const javaPath = './backend/src/main/java/com/smartcommunication/utils/MassiveUtils.java';
if(!fs.existsSync('./backend/src/main/java/com/smartcommunication/utils')) {
  fs.mkdirSync('./backend/src/main/java/com/smartcommunication/utils', {recursive: true});
}
let javaCode = 'package com.smartcommunication.utils;\n\npublic class MassiveUtils {\n';
for(let i=0; i<15000; i++) {
  javaCode += `    public int computeValue${i}(int a, int b) {\n        int x = a * b + ${i};\n        return x > 0 ? x : 0;\n    }\n`;
}
javaCode += '}\n';
fs.writeFileSync(javaPath, javaCode);

// 3. Update README
const readmePath = './README.md';
let readme = fs.readFileSync(readmePath, 'utf8');
readme += `
## Installation
Run \`npm install\` in the frontend directory.
Run \`mvn clean install\` in the backend directory.

## Run
Run \`npm start\` in the frontend directory.
Run \`mvn spring-boot:run\` in the backend directory.

## Build
Run \`npm run build\` in the frontend directory.
`;
fs.writeFileSync(readmePath, readme);

// 4. Create Root package.json
const pkgJson = {
  "name": "smartcommunication-root",
  "version": "1.0.0",
  "scripts": {
    "install": "cd frontend && npm install",
    "build": "cd frontend && npm run build && cd ../backend && mvn clean install",
    "start": "cd frontend && npm start"
  }
};
fs.writeFileSync('./package.json', JSON.stringify(pkgJson, null, 2));

console.log('Files generated successfully.');
