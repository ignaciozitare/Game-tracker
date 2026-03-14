import fs from 'node:fs';

const files = ['src/App.jsx', 'GameTracker.jsx'];
let failed = false;

for (const file of files) {
  const txt = fs.readFileSync(file, 'utf8');
  if (txt.includes('<<<<<<<') || txt.includes('=======') || txt.includes('>>>>>>>')) {
    console.error(`Conflict markers found in ${file}`);
    failed = true;
  }
}

const app = fs.readFileSync('src/App.jsx', 'utf8');
const tracker = fs.readFileSync('GameTracker.jsx', 'utf8');
if (app !== tracker) {
  console.error('GameTracker.jsx and src/App.jsx are out of sync. Run: npm run sync:gametracker');
  failed = true;
}

if (failed) process.exit(1);
console.log('QA merge check passed: no conflict markers and mirrored files are in sync.');
