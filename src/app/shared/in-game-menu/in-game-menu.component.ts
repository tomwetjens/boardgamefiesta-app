import {Component, Input, OnInit} from '@angular/core';
import {Table} from '../model';
import {TableService} from "../../table.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-in-game-menu',
  templateUrl: './in-game-menu.component.html',
  styleUrls: ['./in-game-menu.component.scss']
})
export class InGameMenuComponent implements OnInit {

  @Input() table: Table;

  constructor(private tableService: TableService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  leave() {
    this.tableService.leave(this.table.id)
      .subscribe(() => this.router.navigateByUrl('/'));
  }
}
