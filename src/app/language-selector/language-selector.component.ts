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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {by639_1} from 'iso-language-codes';

const SUPPORTED_LANGUAGES = ['en', 'it',  'nl', 'pt'];

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  @Input() value?: string;

  @Output() changeLanguage = new EventEmitter<string>();

  languages = by639_1;
  codes = SUPPORTED_LANGUAGES
    .sort((a, b) =>
      by639_1[a].nativeName.localeCompare(by639_1[b].nativeName));

  constructor() {
  }

  ngOnInit(): void {
  }

}
