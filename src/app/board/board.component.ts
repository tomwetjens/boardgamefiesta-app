import {Component, Input, OnInit} from '@angular/core';
import {State} from '../model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() state: State;

  constructor() { }

  ngOnInit(): void {
  }

}
