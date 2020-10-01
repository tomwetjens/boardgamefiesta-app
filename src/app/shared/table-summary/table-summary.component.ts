import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../model";

@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.scss']
})
export class TableSummaryComponent implements OnInit {

  @Input() table: Table;

  constructor() { }

  ngOnInit(): void {
  }


}
