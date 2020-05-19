import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Teepee} from '../model';

@Component({
  selector: 'app-teepee',
  templateUrl: './teepee.component.html',
  styleUrls: ['./teepee.component.scss']
})
export class TeepeeComponent implements OnInit {

  @Input() teepee: Teepee;

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostBinding('class')
  get className(): string {
    return this.teepee.toString();
  }
}
