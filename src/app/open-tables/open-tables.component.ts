import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../shared/model";
import {TableService} from "../table.service";

@Component({
  selector: 'app-open-tables',
  templateUrl: './open-tables.component.html',
  styleUrls: ['./open-tables.component.scss']
})
export class OpenTablesComponent implements OnInit {

  @Input() gameId: string;

  tables: Table[] = [];
  loading = false;
  hasMore = false;

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.tableService.findOpen(this.gameId).subscribe(response => {
      Array.prototype.push.apply(this.tables, response);
      this.loading = false;
      this.hasMore = response.length == 20;
    }, err => this.loading = false);
  }

  showMore() {
    const last = this.tables[this.tables.length - 1];

    this.loading = true;
    this.tableService.findOpen(this.gameId, last.created, last.id)
      .subscribe(response => {
        Array.prototype.push.apply(this.tables, response);
        this.loading = false;
        this.hasMore = response.length == 20;
      }, err => this.loading = false);
  }
}
