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

import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  Action,
  ActionType,
  Building,
  City,
  CityStrip,
  HazardType,
  Location,
  ORIGINAL_CITY_STRIP,
  PossibleMove,
  RTTN_CITY_STRIP,
  SECOND_EDITION_CITY_STRIP,
  Space,
  State,
  TURNOUTS,
  Worker
} from '../model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeliveryCityComponent} from '../delivery-city/delivery-city.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {ToastrService} from '../../toastr.service';
import {PlayerBuildingsComponent} from '../player-buildings/player-buildings.component';
import {AudioService} from '../../audio.service';
import {PlayerColor, Table} from '../../shared/model';
import {
  BUILDING,
  BUILDING_A,
  BUILDING_B,
  BUILDING_C,
  BUILDING_D,
  BUILDING_E,
  BUILDING_F,
  BUILDING_G,
  COLORADO_SPRINGS,
  COWBOY,
  CRAFTSMAN,
  DROUGHT,
  EL_PASO,
  ENGINEER,
  FLOOD,
  KANSAS_CITY,
  MOVE,
  ROCKFALL,
  SACRAMENTO,
  SAN_DIEGO,
  SAN_FRANCISCO,
  SANTA_FE,
  STATION,
  TOPEKA,
  TRAIN,
  TRIBES,
  WELCOME_TO_KANSAS_CITY,
  WICHITA
} from '../sounds';
import {MessageDialogComponent} from "../../shared/message-dialog/message-dialog.component";

const SELECT_SPACE_ACTIONS = [
  ActionType.MOVE_ENGINE_1_FORWARD,
  ActionType.MOVE_ENGINE_2_FORWARD,
  ActionType.MOVE_ENGINE_1_BACKWARDS_TO_GAIN_3_DOLLARS,
  ActionType.MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD,
  ActionType.MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD_AND_GAIN_1_DOLLAR,
  ActionType.MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS,
  ActionType.MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS_AND_GAIN_2_DOLLARS,
  ActionType.MOVE_ENGINE_2_OR_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_LEAST_1_BACKWARDS_AND_GAIN_3_DOLLARS,
  ActionType.MOVE_ENGINE_AT_MOST_2_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_4_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS,
  ActionType.MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_HAZARDS,
  ActionType.PAY_1_DOLLAR_AND_MOVE_ENGINE_1_BACKWARDS_TO_GAIN_1_CERTIFICATE,
  ActionType.PAY_1_DOLLAR_TO_MOVE_ENGINE_1_FORWARD,
  ActionType.PAY_2_DOLLARS_AND_MOVE_ENGINE_2_BACKWARDS_TO_GAIN_2_CERTIFICATES,
  ActionType.PAY_2_DOLLARS_TO_MOVE_ENGINE_2_FORWARD,
  ActionType.EXTRAORDINARY_DELIVERY
];

const TOWN_ACTIONS = [
  ActionType.PLACE_BRANCHLET
];

const MOVE_ACTIONS = [
  ActionType.MOVE,
  ActionType.MOVE_1_FORWARD,
  ActionType.MOVE_2_FORWARD,
  ActionType.MOVE_3_FORWARD,
  ActionType.MOVE_3_FORWARD_WITHOUT_FEES,
  ActionType.MOVE_4_FORWARD,
  ActionType.MOVE_5_FORWARD
];

const BUILD_ACTIONS = [
  ActionType.PLACE_CHEAP_BUILDING,
  ActionType.PLACE_BUILDING,
  ActionType.PLACE_BUILDING_FOR_FREE
];

const HAZARD_ACTIONS = [
  ActionType.REMOVE_HAZARD,
  ActionType.REMOVE_HAZARD_FOR_FREE,
  ActionType.REMOVE_HAZARD_FOR_2_DOLLARS,
  ActionType.REMOVE_HAZARD_FOR_5_DOLLARS
];

const WORKER_ACTIONS = [
  ActionType.HIRE_WORKER,
  ActionType.HIRE_WORKER_PLUS_2,
  ActionType.HIRE_WORKER_MINUS_1,
  ActionType.HIRE_WORKER_MINUS_2
];

const TEEPEE_ACTIONS = [ActionType.TRADE_WITH_TRIBES];

interface SpaceElement {
  space: Space;
  x: number;
  y: number;
  width: number;
  height: number;
  transform?: string;
}

const SPACES: SpaceElement[] = Array(19).fill(0)
  .map((_, index) => ({
    space: '' + index,
    x: 164 + index * 31.7,
    y: 54,
    width: 31.7,
    height: 19,
    transform: ''
  }))
  .concat(Array(5).fill(0)
    .map((_, index) => ({
      space: TURNOUTS[index] + '.5',
      x: 303 + index * 95,
      y: 73,
      width: 36,
      height: 18,
      transform: ''
    })))
  .concat({
    space: '19',
    x: 776,
    y: 52,
    width: 30.9,
    height: 20,
    transform: 'rotate(45 0 0)'
  })
  .concat(Array(19).fill(0)
    .map((_, index) => ({
      space: (20 + index) + '',
      x: 777,
      y: 112.9 + (index * 30.9),
      width: 30.9,
      height: 20,
      transform: 'rotate(-90 0 0)'
    })))
  .concat(Array(4).fill(0)
    .map((_, index) => ({
      space: TURNOUTS[5 + index] + '.5',
      x: 759,
      y: 162 + index * 124,
      width: 36,
      height: 18,
      transform: 'rotate(-90 0 0)'
    })))
  .concat({
    space: '39',
    x: 733,
    y: 678,
    width: 46,
    height: 20,
    transform: ''
  });

interface PlayerBuildingElement {
  building: Building;
  x: string;
  y: string;
}

interface HazardElement {
  x: string;
  y: string;
  location: Location;
}

const COLORS = ['orange', 'purple', 'cyan', 'salmon', 'green', 'silver', 'gold', 'navy', 'teal', 'brown'];

interface PossibleMoveLine {
  x1: any;
  y1: any;
  x2: any;
  y2: any;
}

interface PossibleMoveElement {
  possibleMove: PossibleMove;
  color: string;
  lines: PossibleMoveLine[];
}

interface ForesightItem {
  href: string;
  points?: number;
}

const TOWNS = {
  '40': {x: 58, y: 33.5},
  '41': {x: 454.5, y: 62},
  '42': {x: 51, y: 144},
  '43': {x: 1.5, y: 144.5},
  '44': {x: 9, y: 1.5},
  '45': {x: 299, y: 142},
  '46': {x: 240, y: 141},
  '47': {x: 304.5, y: 93},
  'MEM': {x: 121.5, y: 95},
  'SFO': {x: 171, y: 2},
  'DEN': {x: 317.5, y: 1.5},
  'MIL': {x: 396, y: 3},
  '48': {x: 237.5, y: 64.5},
  '49': {x: 234.5, y: 3},
  '50': {x: 450, y: 3},
  'GBY': {x: 525, y: 3},
  '51': {x: 579, y: 49},
  '52': {x: 520, y: 91},
  '53': {x: 616, y: 3},
  'MIN': {x: 678, y: 3},
  'TOR': {x: 603.5, y: 99},
  '54': {x: 647, y: 99},
  '55': {x: 727.5, y: 3},
  '56': {x: 477, y: 142},
  '57': {x: 420.5, y: 142},
  'MON': {x: 751.5, y: 49},
  '58': {x: 676, y: 147.5},
  '59': {x: 726.5, y: 147.5},
};

const MEDIUM_TOWN_TILES = {
  '43': {x: 3, y: 114},
  '46': {x: 240, y: 107},
  '52': {x: 521, y: 126},
  '55': {x: 763.5, y: 3},
  '57': {x: 387.5, y: 142},
  '59': {x: 762, y: 149}
};

@Component({
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent implements OnInit, AfterViewInit, AfterContentChecked, OnChanges {

  @Input() table: Table;
  @Input() state: State;
  @Input() selectedAction: ActionType;

  @Output() perform = new EventEmitter<Action>();

  @ViewChild('locations') private locationsElement !: ElementRef<Element>;
  @ViewChild('buildingLocations') private buildingLocationElements !: ElementRef<Element>;
  @ViewChild('teepeeLocations') private teepeeLocationElements !: ElementRef<Element>;

  @ViewChild('red')
  private redElement !: ElementRef<Element>;
  @ViewChild('blue')
  private blueElement !: ElementRef<Element>;
  @ViewChild('yellow')
  private yellowElement !: ElementRef<Element>;
  @ViewChild('white')
  private whiteElement !: ElementRef<Element>;
  @ViewChild('green')
  private greenElement !: ElementRef<Element>;

  private rancherElements: { [playerColor in PlayerColor]?: ElementRef };

  @ViewChild('A') private neutralBuildingA !: ElementRef<Element>;
  @ViewChild('B') private neutralBuildingB !: ElementRef<Element>;
  @ViewChild('C') private neutralBuildingC !: ElementRef<Element>;
  @ViewChild('D') private neutralBuildingD !: ElementRef<Element>;
  @ViewChild('E') private neutralBuildingE !: ElementRef<Element>;
  @ViewChild('F') private neutralBuildingF !: ElementRef<Element>;
  @ViewChild('G') private neutralBuildingG !: ElementRef<Element>;

  private neutralBuildingElements: { [name: string]: ElementRef };

  @ViewChild('foresight00') private foresight00 !: ElementRef<Element>;
  @ViewChild('foresight01') private foresight01 !: ElementRef<Element>;
  @ViewChild('foresight02') private foresight02 !: ElementRef<Element>;
  @ViewChild('foresight10') private foresight10 !: ElementRef<Element>;
  @ViewChild('foresight11') private foresight11 !: ElementRef<Element>;
  @ViewChild('foresight12') private foresight12 !: ElementRef<Element>;

  @ViewChild('hazards') private hazardsElement !: ElementRef<Element>;

  private possibleMoves: PossibleMove[];

  hazards: HazardElement[];
  foresights: ForesightItem[][];
  selectedForesights: number[] = [null, null, null]; // deprecated, can be removed
  spaces = SPACES;
  towns = TOWNS;
  mediumTownTiles = MEDIUM_TOWN_TILES;
  playerBuildings: PlayerBuildingElement[];
  possibleMoveElements: PossibleMoveElement[];

  private selectedSpace: Space;

  constructor(private renderer: Renderer2,
              private ngbModal: NgbModal,
              private toastrService: ToastrService,
              private audioService: AudioService) {
  }

  get cityStrip(): CityStrip {
    return this.state?.railsToTheNorth ? RTTN_CITY_STRIP
      : this.table?.game === 'gwt2' ? SECOND_EDITION_CITY_STRIP
        : ORIGINAL_CITY_STRIP;
  }

  ngOnInit(): void {
    this.actionSelected();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedAction) {
      this.actionSelected();
    }

    if (changes.state) {
      this.positionNeutralBuildings();
      this.updateHazards();
      this.updateForesights();
      this.updatePlayerBuildings();
      this.positionRanchers();

      const current = changes.state.currentValue as State;
      const previous = changes.state.previousValue as State;

      if (current && previous) {
        for (const color of Object.keys(PlayerColor)) {
          const currentSpace = current.railroadTrack.players[color] as Space;
          const previousSpace = previous.railroadTrack.players[color] as Space;

          if (currentSpace && previousSpace && currentSpace !== previousSpace) {
            this.audioService.playEffect(TRAIN);
          }
        }

        for (let i = 0; i < current.railroadTrack.stations.length; i++) {
          const currentStation = current.railroadTrack.stations[i];
          const previousStation = previous.railroadTrack.stations[i];

          if (currentStation.players.length > previousStation.players.length) {
            this.audioService.playEffect(STATION);
          }
        }

        for (const city of Object.keys(City)) {
          const currentCity = current.railroadTrack.cities[city];
          const previousCity = previous.railroadTrack.cities[city];

          if (currentCity && (!previousCity || currentCity.length !== previousCity.length)) {
            switch (city) {
              case City.KANSAS_CITY:
                this.audioService.playVoiceOver(KANSAS_CITY);
                break;
              case City.TOPEKA:
                this.audioService.playVoiceOver(TOPEKA);
                break;
              case City.WICHITA:
                this.audioService.playVoiceOver(WICHITA);
                break;
              case City.COLORADO_SPRINGS:
                this.audioService.playVoiceOver(COLORADO_SPRINGS);
                break;
              case City.SANTA_FE:
                this.audioService.playVoiceOver(SANTA_FE);
                break;
              case City.SAN_DIEGO:
                this.audioService.playVoiceOver(SAN_DIEGO);
                break;
              case City.EL_PASO:
                this.audioService.playVoiceOver(EL_PASO);
                break;
              case City.SACRAMENTO:
                this.audioService.playVoiceOver(SACRAMENTO);
                break;
              case City.SAN_FRANCISCO:
                this.audioService.playVoiceOver(SAN_FRANCISCO);
                break;
            }
          }
        }

        if (current.trail && current.trail.locations && previous.trail && previous.trail.locations) {
          for (const name of Object.keys(current.trail.locations)) {
            const currentLocation = current.trail.locations[name];
            const previousLocation = previous.trail.locations[name];

            if (currentLocation && currentLocation.building && previousLocation && previousLocation.building) {
              if (currentLocation.building.name !== previousLocation.building.name) {
                // upgrade
                this.audioService.playEffect(BUILDING);
              }
            } else if (currentLocation.building !== previousLocation.building) {
              // build
              this.audioService.playEffect(BUILDING);
            }

            if (previousLocation && previousLocation.hazard && currentLocation && !currentLocation.hazard) {
              this.audioService.playEffect(previousLocation.hazard.type === HazardType.DROUGHT ? DROUGHT
                : previousLocation.hazard.type === HazardType.FLOOD ? FLOOD : ROCKFALL);
            }

            if (previousLocation && previousLocation.teepee && currentLocation && !currentLocation.teepee) {
              this.audioService.playEffect(TRIBES);
            }
          }

          for (const color of Object.keys(PlayerColor)) {
            const currentLocation = current.trail.playerLocations[color];
            const previousLocation = previous.trail.playerLocations[color];

            if (currentLocation !== previousLocation) {
              if (currentLocation === 'KANSAS_CITY') {
                this.audioService.playVoiceOver(WELCOME_TO_KANSAS_CITY);
              } else if (currentLocation !== 'START') {
                this.audioService.playEffect(MOVE);

                if (this.state && this.state.player && this.state.player.player.color === color) {
                  // current user, play sound of building (if any)
                  const location = current.trail.locations[currentLocation];
                  const building = !!location ? location.building : null;
                  if (building) {
                    switch (building.name) {
                      case 'A':
                        this.audioService.playVoiceOver(BUILDING_A);
                        break;
                      case 'B':
                        this.audioService.playVoiceOver(BUILDING_B);
                        break;
                      case 'C':
                        this.audioService.playVoiceOver(BUILDING_C);
                        break;
                      case 'D':
                        this.audioService.playVoiceOver(BUILDING_D);
                        break;
                      case 'E':
                        this.audioService.playVoiceOver(BUILDING_E);
                        break;
                      case 'F':
                        this.audioService.playVoiceOver(BUILDING_F);
                        break;
                      case 'G':
                        this.audioService.playVoiceOver(BUILDING_G);
                        break;
                    }
                  }
                }
              }
            }
          }
        }

        for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
          for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
            const currentTile = current.foresights.choices[columnIndex][rowIndex];
            const previousTile = previous.foresights.choices[columnIndex][rowIndex];

            if (previousTile && !currentTile) {
              const choice = previousTile;

              if (choice.worker) {
                this.audioService.playVoiceOver(choice.worker === Worker.COWBOY ? COWBOY
                  : choice.worker === Worker.CRAFTSMAN ? CRAFTSMAN : ENGINEER);
              } else if (choice.hazard) {
                this.audioService.playVoiceOver(choice.hazard.type === HazardType.DROUGHT ? DROUGHT
                  : choice.hazard.type === HazardType.FLOOD ? FLOOD : ROCKFALL);
              } else if (choice.teepee) {
                this.audioService.playVoiceOver(TRIBES);
              }
            }
          }
        }
      }
    }
  }

  private actionSelected() {
    this.selectedSpace = null;
  }

  ngAfterViewInit(): void {
    this.rancherElements = {
      BLUE: this.blueElement,
      RED: this.redElement,
      YELLOW: this.yellowElement,
      WHITE: this.whiteElement,
      GREEN: this.greenElement
    };

    this.neutralBuildingElements = {
      A: this.neutralBuildingA,
      B: this.neutralBuildingB,
      C: this.neutralBuildingC,
      D: this.neutralBuildingD,
      E: this.neutralBuildingE,
      F: this.neutralBuildingF,
      G: this.neutralBuildingG
    };

    this.positionNeutralBuildings();
    this.positionRanchers();
  }

  selectLocation(name: string) {
    if (MOVE_ACTIONS.includes(this.selectedAction)) {
      if (this.state.trail.playerLocations[this.state.player.player.color]) {
        const moves = this.state.possibleMoves
          .filter(possibleMove => possibleMove.to === name);

        if (this.state.possibleMoves.length === 0) {
          this.toastrService.error('Cannot move to selected location');
          return;
        }

        if (moves.length === 1) {
          this.performMove(moves[0].steps);
        } else {
          this.possibleMoves = moves;
          this.updatePossibleMoves();
        }
      } else {
        // First move, can go anywhere
        this.performMove([name]);
      }
    } else if (BUILD_ACTIONS.includes(this.selectedAction)) {
      const ngbModalRef = this.ngbModal.open(PlayerBuildingsComponent);
      const componentInstance = ngbModalRef.componentInstance as PlayerBuildingsComponent;
      componentInstance.table = this.table;
      componentInstance.playerState = this.state.player;
      fromPromise(ngbModalRef.result).subscribe(building => {
        this.perform.emit({type: this.selectedAction, location: name, building});
      });
    } else if (HAZARD_ACTIONS.includes(this.selectedAction)) {
      this.perform.emit({type: this.selectedAction, location: name});
    } else if (ActionType.USE_ADJACENT_BUILDING === this.selectedAction) {
      this.perform.emit({type: ActionType.USE_ADJACENT_BUILDING, location: name});
    }
  }

  private performMove(steps: string[]) {
    this.possibleMoves = [];
    this.updatePossibleMoves();

    this.perform.emit({type: this.selectedAction, steps});
  }

  getLocationElement(name: string): Element | null {
    return this.locationsElement.nativeElement.children.namedItem(name) ||
      this.buildingLocationElements.nativeElement.children.namedItem(name) ||
      this.teepeeLocationElements.nativeElement.children.namedItem(name);
  }

  ngAfterContentChecked(): void {
    this.updateHazards();
    this.updatePlayerBuildings();
  }

  private positionRanchers() {
    if (!this.rancherElements) {
      return;
    }

    const playersByLocation: { [key: string]: PlayerColor[] } = {};
    for (const color of Object.keys(this.state.trail.playerLocations)) {
      const location = this.state.trail.playerLocations[color];
      const players = playersByLocation[location] || [];
      players.push(color as PlayerColor);
      playersByLocation[location] = players;
    }

    for (const color of Object.keys(this.rancherElements)) {
      const element: ElementRef = this.rancherElements[color];

      const playerLocation = this.state.trail.playerLocations[color];

      if (playerLocation) {
        const locationElement = this.getLocationElement(playerLocation);

        const locationX = locationElement.getAttribute('x');
        const locationY = locationElement.getAttribute('y');

        const index = playersByLocation[playerLocation].indexOf(color as PlayerColor);

        element.nativeElement.setAttribute('style', 'display:block');

        const x = parseInt(locationX, 10) + index * 12; // offset each one so they all stay visible
        const y = locationY;

        element.nativeElement.setAttribute('x', x);
        element.nativeElement.setAttribute('y', y);
      } else {
        element.nativeElement.setAttribute('style', 'display:none');
      }
    }
  }

  private updatePossibleMoves() {
    if (!this.possibleMoves) {
      this.possibleMoveElements = null;
    }

    let colorIndex = 0;

    this.possibleMoveElements = this.possibleMoves.map(possibleMove => {
      let prev = this.state.trail.playerLocations[this.state.player.player.color];
      let prevLocationElement = this.getLocationElement(prev);

      const lines = possibleMove.route.map((step, index) => {
        const locationElement = this.getLocationElement(step);

        if (!locationElement) {
          console.warn('Step in possible move not found in SVG: ' + step);
          return;
        }

        const spacingFrom = index > 0 ? colorIndex * 4 : 0;
        const spacingTo = index < possibleMove.route.length - 1 ? colorIndex * 4 : 0;
        const line = {
          x1: parseFloat(prevLocationElement.getAttribute('x')) + 12 + spacingFrom,
          y1: parseFloat(prevLocationElement.getAttribute('y')) + 12 + spacingFrom,
          x2: parseFloat(locationElement.getAttribute('x')) + 12 + spacingTo,
          y2: parseFloat(locationElement.getAttribute('y')) + 12 + spacingTo
        };

        prev = step;
        prevLocationElement = locationElement;

        return line;
      });

      return {
        possibleMove,
        color: COLORS[colorIndex++],
        lines
      };
    });
  }

  canSelectCity(city: City|string): boolean {
    switch (this.selectedAction) {
      case ActionType.DELIVER_TO_CITY:
        return this.state.possibleDeliveries && this.state.possibleDeliveries.some(pd => pd.city === city as City);
      default:
        return false;
    }
  }

  get canChooseForesights(): boolean { // deprecated, can be removed
    return this.selectedAction === ActionType.CHOOSE_FORESIGHT_1
      || this.selectedAction === ActionType.CHOOSE_FORESIGHT_2
      || this.selectedAction === ActionType.CHOOSE_FORESIGHT_3;
  }

  canSelectForesight(columnIndex: number, rowIndex: number): boolean {
    return (this.selectedAction === ActionType.CHOOSE_FORESIGHT_1 && columnIndex === 0)
      || (this.selectedAction === ActionType.CHOOSE_FORESIGHT_2 && columnIndex === 1)
      || (this.selectedAction === ActionType.CHOOSE_FORESIGHT_3 && columnIndex === 2);
  }

  get canSelectHazard(): boolean {
    return HAZARD_ACTIONS.includes(this.selectedAction);
  }

  get canSelectTeepee(): boolean {
    return TEEPEE_ACTIONS.includes(this.selectedAction);
  }

  selectForesight(rowIndex: number, columnIndex: number) {
    if (!this.canSelectForesight(columnIndex, rowIndex)) {
      return;
    }

    if (this.state.foresights.choices[columnIndex][rowIndex].worker && this.nextWorkerFillsUpCattleMarket()) {
      this.confirmCannotUndo().subscribe(() =>
        this.perform.emit({type: this.selectedAction, choice: rowIndex}));
    } else {
      this.perform.emit({type: this.selectedAction, choice: rowIndex});
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

  private nextWorkerFillsUpCattleMarket() {
    return [5, 8].includes(this.state.jobMarket.currentRowIndex)
      && this.state.jobMarket.rows[this.state.jobMarket.currentRowIndex].workers.length === this.state.jobMarket.rowLimit - 1;
  }

  selectCity(city: City|string) {
    switch (this.selectedAction) {
      case ActionType.DELIVER_TO_CITY:
        if (this.state.possibleDeliveries) {
          const possibleDelivery = this.state.possibleDeliveries.find(pd => pd.city === city as City);

          if (possibleDelivery) {
            if (this.state.player.certificates <= possibleDelivery.certificates
              || this.state.trail.playerLocations[this.state.player.player.color] !== 'KANSAS_CITY' /* Extraordinary delivery */) {
              this.perform.emit({type: ActionType.DELIVER_TO_CITY, city, certificates: possibleDelivery.certificates});
            } else {
              const ngbModalRef = this.ngbModal.open(DeliveryCityComponent);

              ngbModalRef.componentInstance.gameId = this.table.game;
              ngbModalRef.componentInstance.possibleDelivery = possibleDelivery;
              ngbModalRef.componentInstance.playerState = this.state.player;

              fromPromise(ngbModalRef.result)
                .subscribe(certificates => this.perform.emit({
                  type: ActionType.DELIVER_TO_CITY,
                  city,
                  certificates
                }));
            }
          }
        }
        break;
    }
  }

  canSelectLocation(name: string) {
    const location = this.state.trail.locations[name];

    if (!location) {
      console.error('Location not found:', name);
    }

    return location && (
      (MOVE_ACTIONS.includes(this.selectedAction) && this.canMoveTo(location))
      || (BUILD_ACTIONS.includes(this.selectedAction) && this.canPlaceBuilding(location))
      || (HAZARD_ACTIONS.includes(this.selectedAction) && !!location.hazard)
      || (this.selectedAction === ActionType.USE_ADJACENT_BUILDING && !!location.building) // TODO Only allow selecting adjacent buildings
    );
  }

  private canMoveTo(location: Location): boolean {
    return this.state.possibleMoves && this.state.possibleMoves.some(pm => pm.to === location.name);
  }

  private canPlaceBuilding(location: Location): boolean {
    return location.type === 'BUILDING'
      && (!location.building
        || (location.building.player
          && location.building.player.color === this.state.currentPlayer.color));
  }

  selectTeepee(location: string) {
    if (this.selectedAction === ActionType.TRADE_WITH_TRIBES) {
      this.perform.emit({type: this.selectedAction, location});
    }
  }

  private positionNeutralBuildings() {
    if (!this.neutralBuildingElements) {
      return;
    }

    for (const name of Object.keys(this.state.trail.locations)) {
      const location = this.state.trail.locations[name];

      const locationElement = this.getLocationElement(name);

      if (location.building && this.neutralBuildingElements[location.building.name]) {
        const buildingElement = this.neutralBuildingElements[location.building.name];

        const x = locationElement.getAttribute('x');
        const y = locationElement.getAttribute('y');

        buildingElement.nativeElement.setAttribute('transform', 'translate(' + x + ',' + y + ')');
      }
    }
  }

  private updateHazards() {
    if (!this.locationsElement) {
      return;
    }

    this.hazards = Object.keys(this.state.trail.locations)
      .filter(name => this.state.trail.locations[name].hazard)
      .map(name => {
        const locationElement = this.getLocationElement(name);

        return {
          x: locationElement.getAttribute('x'),
          y: locationElement.getAttribute('y'),
          location: this.state.trail.locations[name]
        };
      });
  }

  selectHazard(location: Location) {
    if (!this.canSelectHazard) {
      return;
    }
    this.perform.emit({type: this.selectedAction, location: location.name});
  }

  private updateForesights() {
    this.foresights = this.state.foresights.choices
      .map(column => column.map(tile => {
        if (!tile) {
          return null;
        } else if (tile.worker) {
          return {href: tile.worker};
        } else if (tile.teepee) {
          return {href: tile.teepee};
        } else {
          return {
            href: tile.hazard.type + '_' + tile.hazard.hands,
            points: tile.hazard.points
          };
        }
      }));
  }

  selectStation(index: number) {
    if (!this.canSelectStation(index)) {
      return;
    }
    this.perform.emit({type: this.selectedAction, station: index});
  }

  canSelectStation(index: number) {
    switch (this.selectedAction) {
      case ActionType.UPGRADE_ANY_STATION_BEHIND_ENGINE:
        return !this.state.railroadTrack.stations[index].players.includes(this.state.player.player.color);
      case ActionType.DOWNGRADE_STATION:
        return this.state.railroadTrack.stations[index].players.includes(this.state.player.player.color);
      default:
        return false;
    }
  }

  selectSpace(space: Space) {
    if (!this.canSelectSpace(space)) {
      return;
    }
    this.perform.emit({type: this.selectedAction, to: space});
  }

  canSelectSpace(space: Space) {
    return SELECT_SPACE_ACTIONS.includes(this.selectedAction)
      && this.state.possibleSpaces
      && this.state.possibleSpaces[this.selectedAction]
      && this.state.possibleSpaces[this.selectedAction].includes(space);
  }

  isSpaceSelected(space: Space): boolean {
    return this.selectedSpace === space;
  }

  getPlayersAt(space: Space): string[] {
    return Object.keys(PlayerColor).filter(color => this.isPlayerAt(color as PlayerColor, space));
  }

  private isPlayerAt(color: PlayerColor, space: Space): boolean {
    return this.state.railroadTrack.players[color] === space;
  }

  canSelectWorker(rowIndex: number): boolean {
    if (!WORKER_ACTIONS.includes(this.selectedAction)
      || rowIndex >= this.state.jobMarket.currentRowIndex) {
      return false;
    }

    let cost = this.state.jobMarket.rows[rowIndex].cost;

    switch (this.selectedAction) {
      case ActionType.HIRE_WORKER_MINUS_1:
        cost -= 1;
        break;
      case ActionType.HIRE_WORKER_MINUS_2:
        cost -= 2;
        break;
      case ActionType.HIRE_WORKER_PLUS_2:
        cost += 2;
        break;
    }

    return cost <= this.state.player.balance;
  }

  isForesightSelected(columnIndex: number, rowIndex: number): boolean {
    return this.selectedForesights[columnIndex] === rowIndex;
  }

  private updatePlayerBuildings() {
    if (!this.locationsElement) {
      return;
    }

    this.playerBuildings = Object.keys(this.state.trail.locations)
      .filter(name => this.state.trail.locations[name].building)
      .filter(name => this.state.trail.locations[name].building.player)
      .map(name => {
        const locationElement = this.getLocationElement(name);
        const building = this.state.trail.locations[name].building;

        return {
          x: locationElement.getAttribute('x'),
          y: locationElement.getAttribute('y'),
          building
        };
      });

  }

  selectWorker(rowIndex: number, worker: Worker) {
    switch (this.selectedAction) {
      case ActionType.HIRE_WORKER:
      case ActionType.HIRE_WORKER_PLUS_2:
      case ActionType.HIRE_WORKER_MINUS_1:
      case ActionType.HIRE_WORKER_MINUS_2:
        this.perform.emit({type: this.selectedAction, worker, row: rowIndex});
        break;
    }
  }

  selectPossibleMove(possibleMove: PossibleMove) {
    this.performMove(possibleMove.steps);
  }

  get Math() {
    return Math;
  }

  selectTown(name: string) {
    if (!this.canSelectTown(name)) {
      return;
    }
    this.perform.emit({type: this.selectedAction, town: name});
  }

  canSelectTown(name: string) {
    return TOWN_ACTIONS.includes(this.selectedAction)
      && this.state.possibleTowns
      && this.state.possibleTowns[this.selectedAction].includes(name);
  }
}
