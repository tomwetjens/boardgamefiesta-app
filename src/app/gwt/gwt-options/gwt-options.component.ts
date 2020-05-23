import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OptionsComponent} from '../../shared/api';
import {Options, Table} from '../../shared/model';

@Component({
  selector: 'app-gwt-options',
  templateUrl: './gwt-options.component.html',
  styleUrls: ['./gwt-options.component.scss']
})
export class GwtOptionsComponent implements OnInit, OptionsComponent {

  @Input() table: Table;

  @Output() changeOptions = new EventEmitter<Options>();

  constructor() {
  }

  ngOnInit(): void {
    if (this.table.options.beginner === undefined) {
      this.table.options.beginner = false;
    }
  }

}
