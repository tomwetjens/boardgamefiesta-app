import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../model";

@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.scss']
})
export class TableSummaryComponent implements OnInit {

  @Input() table: Table;

  /**
   * if specified, generates a link to user activity
   */
  @Input() username?: string;

  constructor() { }

  ngOnInit(): void {
  }


}
