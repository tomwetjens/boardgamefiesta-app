/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
