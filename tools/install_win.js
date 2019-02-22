let pdf_sync = require('../package.json');
let path =require('path');
const { exec ,spawn,execFileSync,execSync} = require('child_process');
console.log(pdf_sync.version);
// import { version } from '../package.json';
// console.log(version);
console.log(__dirname)
let install_path = path.join(__dirname,'"../build/app/pdf-sync Setup ' + pdf_sync.version + '.exe"');
exec(install_path);
// const bat = spawn('"../build/app/pdf-sync Setup ' + pdf_sync.version + '.exe"', { shell: true });
// execSync('"build/app/pdf-sync Setup ' + pdf_sync.version + '.exe"');
