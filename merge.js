'use strict';

const fs = require('fs');

const a = JSON.parse(fs.readFileSync(process.argv[2]));
const b = JSON.parse(fs.readFileSync(process.argv[3]));

console.log(JSON.stringify(merge(a,b)));

function merge(a, b) {
  const result = Object.assign({}, a);
  for (let key in b) {
    if (typeof result[key] === 'object') {
      result[key] = merge(result[key], b[key]);
    } else {
      result[key] = b[key];
    }
  }
  return result;
}
