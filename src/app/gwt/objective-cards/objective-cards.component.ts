import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, ObjectiveCard, ObjectiveCards} from '../model';
import {MessageDialogComponent} from "../../shared/message-dialog/message-dialog.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

const ACTIONS = [ActionType.TAKE_OBJECTIVE_CARD, ActionType.ADD_1_OBJECTIVE_CARD_TO_HAND];

@Component({
  selector: 'app-objective-cards',
  templateUrl: './objective-cards.component.html',
  styleUrls: ['./objective-cards.component.scss']
})
export class ObjectiveCardsComponent implements OnInit, OnChanges {

  @Input() objectiveCards: ObjectiveCards;

  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.objectiveCards) {
      const current = changes.objectiveCards.currentValue as ObjectiveCard[];
      const previous = changes.objectiveCards.previousValue as ObjectiveCard[];

      // TODO
    }
  }

  canSelectCard(card: ObjectiveCard) {
    return ACTIONS.includes(this.selectedAction);
  }

  selectCard(card: ObjectiveCard) {
    if (this.canSelectCard(card)) {
      this.confirmCannotUndo().subscribe(() =>
        this.action.emit({type: this.selectedAction, objectiveCard: card}));
    }
  }

  private confirmCannotUndo() {
    const ngbModalRef = this.ngbModal.open(MessageDialogComponent);

    const messageDialogComponent = ngbModalRef.componentInstance as MessageDialogComponent;
    messageDialogComponent.type = 'confirm';
    messageDialogComponent.messageKey = 'gwt.confirmCannotUndo';
    messageDialogComponent.confirmKey = 'confirm';
    messageDialogComponent.cancelKey = 'cancel';

    return fromPromise(ngbModalRef.result);
  }

  get canSelectDrawStack(): boolean {
    return ACTIONS.includes(this.selectedAction);
  }

  clickDrawStack() {
    if (this.canSelectDrawStack) {
      this.confirmCannotUndo().subscribe(() =>
        this.action.emit({type: this.selectedAction}));
    }
  }
}
