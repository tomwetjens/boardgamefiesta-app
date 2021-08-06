/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
