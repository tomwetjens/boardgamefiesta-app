'use strict';

const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locale/en.json'));
const pt = JSON.parse(fs.readFileSync('src/locale/it.json'));

console.log(JSON.stringify(diff(en, pt)));

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
