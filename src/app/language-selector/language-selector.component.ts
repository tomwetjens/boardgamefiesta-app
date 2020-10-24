import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {by639_1} from 'iso-language-codes';

const SUPPORTED_LANGUAGES = ['en', 'nl', 'pt'];

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
