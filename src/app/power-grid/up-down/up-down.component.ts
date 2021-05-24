import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'power-grid-up-down',
  templateUrl: './up-down.component.html',
  styleUrls: ['./up-down.component.scss']
})
export class UpDownComponent implements OnInit {

  @Input() value: number;
  @Input() step = 1;
  @Input() min = 0;
  @Input() max = Number.MAX_VALUE;

  @Output() valueChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  up() {
    this.value = Math.min(this.max, this.value + this.step);
    this.valueChange.emit(this.value);
  }

  down() {
    this.value = Math.max(this.min, this.value - this.step);
    this.valueChange.emit(this.value);
  }
}
