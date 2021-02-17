import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() rating: number;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  get locale() {
    return this.translateService.currentLang;
  }

}
