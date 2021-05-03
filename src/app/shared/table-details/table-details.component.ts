import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../model";

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.scss']
})
export class TableDetailsComponent implements OnInit {

  @Input() table: Table;

  constructor() { }

  ngOnInit(): void {
  }

}
