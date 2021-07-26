'use strict';

const fs = require('fs');

const base = JSON.parse(fs.readFileSync(process.argv[2]));
const translation = JSON.parse(fs.readFileSync(process.argv[3]));

console.log(JSON.stringify(diff(base, translation)));

function diff(src, dst) {
  const result = {};
  for (let key in src) {
    if (dst[key] === undefined) {
      result[key] = src[key];
    } else if (typeof src[key] === 'object') {
      const d = diff(src[key], dst[key]);
      if (d) {
        result[key] = d;
      }
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}
