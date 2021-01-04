const fs = require('fs');
const color = require('ansi-colors');

const files = fs.readdirSync('./lol');

console.assert(files.length === 3, color.bgRed(`Expected 3 files, saw ${files.length}`));
console.log(color.green('✓ Success!'));
