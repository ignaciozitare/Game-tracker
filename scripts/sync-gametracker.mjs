import fs from 'node:fs';

const app = fs.readFileSync('src/App.jsx', 'utf8');
fs.writeFileSync('GameTracker.jsx', app);
console.log('GameTracker.jsx synchronized from src/App.jsx');
