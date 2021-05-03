import {Component, Input, OnInit} from '@angular/core';
import {TableService} from "../table.service";
import {Table} from "../shared/model";
import {fadeInOnEnterAnimation} from "angular-animations";

@Component({
  animations: [
    fadeInOnEnterAnimation()
  ],
  selector: 'app-started-tables',
  templateUrl: './started-tables.component.html',
  styleUrls: ['./started-tables.component.scss']
})
export class StartedTablesComponent implements OnInit {

  @Input() gameId: string;

  tables: Table[] = [];
  loading = false;
  hasMore = false;

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.tableService.findStarted(this.gameId).subscribe(response => {
      Array.prototype.push.apply(this.tables, response);
      this.hasMore = response.length == 20;
    }, err => this.loading = false);
  }

  showMore() {
    const last = this.tables[this.tables.length - 1];

    this.loading = true;
    this.tableService.findStarted(this.gameId, last.started, last.id)
      .subscribe(response => {
        Array.prototype.push.apply(this.tables, response);
        this.loading = false;
        this.hasMore = response.length == 20;
      }, err => this.loading = false);
  }
}
