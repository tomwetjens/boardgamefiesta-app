import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table, TablePlayer} from "../../shared/model";
import {ActionName, Animal, DominantSpecies, ElementType} from "../model";

@Component({
  selector: 'ds-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() player: TablePlayer;
  @Input() table: Table;
  @Input() state: DominantSpecies;
  @Input() animal: Animal;

  @Output() selectElement = new EventEmitter<ElementType>();

  constructor() {
  }

  ngOnInit(): void {
  }

  get canSelectElement(): boolean {
    return this.animal.type === this.state.currentAnimal
      && this.state.actions.includes(ActionName.RemoveElement);
  }

}
