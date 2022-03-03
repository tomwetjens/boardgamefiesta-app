import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  Action,
  ActionName,
  ActionType,
  AnimalType,
  DominantSpecies,
  ElementType,
  SPECIATION_ELEMENT_TYPES
} from "../model";
import {Table} from "../../shared/model";

@Component({
  selector: 'ds-action-display',
  templateUrl: './action-display.component.html',
  styleUrls: ['./action-display.component.scss']
})
export class ActionDisplayComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() state: DominantSpecies;

  @Input() selectedAction: ActionName;
  @Input() selectedElementTypes: ElementType[];

  @Output() perform = new EventEmitter<Action>();
  @Output() selectElementType = new EventEmitter<ElementType>();

  executionOrder: ActionType[] = [ActionType.INITIATIVE, ActionType.ADAPTATION, ActionType.REGRESSION, ActionType.ABUNDANCE,
    ActionType.WASTELAND, ActionType.DEPLETION, ActionType.GLACIATION, ActionType.SPECIATION,
    ActionType.WANDERLUST, ActionType.MIGRATION, ActionType.COMPETITION, ActionType.DOMINATION];

  speciation = SPECIATION_ELEMENT_TYPES;

  elements: { [actionType in ActionType]?: ElementType[] };

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      this.elements = this.state ? {
        [ActionType.ADAPTATION]: this.getElementsForDisplay(ActionType.ADAPTATION, 4),
        [ActionType.REGRESSION]: this.getElementsForDisplay(ActionType.REGRESSION, 4),
        [ActionType.ABUNDANCE]: this.getElementsForDisplay(ActionType.ABUNDANCE, 4),
        [ActionType.WASTELAND]: this.getElementsForDisplay(ActionType.WASTELAND, 4),
        [ActionType.DEPLETION]: this.getElementsForDisplay(ActionType.DEPLETION, 4),
        [ActionType.WANDERLUST]: this.getElementsForDisplay(ActionType.WANDERLUST, 4)
      } : {};
    }
  }

  placeActionPawn(actionType: string, index: number) {
    this.perform.emit({
      [ActionName.PlaceActionPawn]: {
        actionType,
        index
      }
    });
  }

  canSelectElement(actionType: ActionType, index: number): boolean {
    switch (this.selectedAction) {
      case ActionName.Adaptation:
        return actionType == ActionType.ADAPTATION;
      case ActionName.Regression:
        return actionType == ActionType.REGRESSION && this.canSelectRegressionElement(index);
      case ActionName.Abundance:
        return actionType == ActionType.ABUNDANCE;
      case ActionName.Wasteland:
        return actionType == ActionType.WASTELAND;
      case ActionName.Depletion:
        return actionType == ActionType.DEPLETION;
      case ActionName.Wanderlust:
        return actionType == ActionType.WANDERLUST;
      default:
        return false;
    }
  }

  private canSelectRegressionElement(index: number) {
    const elementType = this.state.actionDisplay.elements[ActionType.REGRESSION][index];

    return (
        // Element type not yet selected
        !this.isElementTypeSelected(elementType)
        // Less element types selected than APs placed
        && this.selectedElementTypes.length < this.getNumberOfActionPawns(ActionType.REGRESSION)
      )
      // Or already selected, can select to toggle it
      || this.isElementSelected(ActionType.REGRESSION, index);
  }

  private isElementTypeSelected(elementType: ElementType) {
    return this.selectedElementTypes.includes(elementType);
  }

  private getNumberOfActionPawns(actionType: ActionType, animalType: AnimalType = this.state.currentAnimal) {
    return this.state.actionDisplay.actionPawns[actionType]
      .filter(ap => ap === animalType).length;
  }

  isElementSelected(actionType: ActionType, index: number): boolean {
    if (actionType !== ActionType.REGRESSION || this.selectedAction !== ActionName.Regression) {
      return false;
    }

    const elementType = this.state.actionDisplay.elements[actionType][index];

    const totalSelected = this.selectedElementTypes.filter(e => e === elementType).length;

    if (totalSelected === 0) {
      return false;
    }

    const before = this.state.actionDisplay.elements[actionType]
      .filter((e, i) => e === elementType && i < index)
      .length;

    return before < totalSelected;
  }

  canSelectActionSpace(actionType: ActionType, index: number): boolean {
    return this.selectedAction === ActionName.PlaceActionPawn;
  }

  private getElementsForDisplay(actionType: ActionType, len: number): ElementType[] {
    const source = this.state.actionDisplay.elements[actionType] || [];
    return [...source].concat(new Array(len).fill(null)).slice(0, len) as ElementType[];
  }

  selectElement(actionType: ActionType, index: number) {
    if (!this.canSelectElement(actionType, index)) {
      return;
    }
    this.selectElementType.emit(this.state.actionDisplay.elements[actionType][index]);
  }
}
