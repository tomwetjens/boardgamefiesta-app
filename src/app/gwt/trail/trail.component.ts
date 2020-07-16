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
import {Action, ActionType, Building, City, HazardType, Location, PossibleMove, Space, State, Worker} from '..//model';
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
  INDIANS,
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
  WELCOME_TO_KANSAS_CITY,
  WICHITA
} from '../sounds';

const SELECT_SPACE_ACTIONS = [
  ActionType.MOVE_ENGINE_1_FORWARD,
  ActionType.MOVE_ENGINE_1_BACKWARDS_TO_GAIN_3_DOLLARS,
  ActionType.MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD,
  ActionType.MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS,
  ActionType.MOVE_ENGINE_2_OR_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_LEAST_1_BACKWARDS_AND_GAIN_3_DOLLARS,
  ActionType.MOVE_ENGINE_AT_MOST_2_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_4_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS,
  ActionType.PAY_1_DOLLAR_AND_MOVE_ENGINE_1_BACKWARDS_TO_GAIN_1_CERTIFICATE,
  ActionType.PAY_1_DOLLAR_TO_MOVE_ENGINE_1_FORWARD,
  ActionType.PAY_2_DOLLARS_AND_MOVE_ENGINE_2_BACKWARDS_TO_GAIN_2_CERTIFICATES,
  ActionType.PAY_2_DOLLARS_TO_MOVE_ENGINE_2_FORWARD,
  ActionType.EXTRAORDINARY_DELIVERY
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
  ActionType.PLACE_BUILDING];

const HAZARD_ACTIONS = [
  ActionType.REMOVE_HAZARD,
  ActionType.REMOVE_HAZARD_FOR_FREE,
  ActionType.REMOVE_HAZARD_FOR_5_DOLLARS
];

const WORKER_ACTIONS = [
  ActionType.HIRE_WORKER,
  ActionType.HIRE_WORKER_PLUS_2,
  ActionType.HIRE_WORKER_MINUS_1,
  ActionType.HIRE_WORKER_MINUS_2
];

const TEEPEE_ACTIONS = [ActionType.TRADE_WITH_INDIANS];

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
    space: {number: index, turnout: null},
    x: 164 + index * 31.7,
    y: 54,
    width: 31.7,
    height: 19,
    transform: ''
  }))
  .concat(Array(5).fill(0)
    .map((_, index) => ({
      space: {number: null, turnout: index},
      x: 303 + index * 95,
      y: 73,
      width: 36,
      height: 18,
      transform: ''
    })))
  .concat({
    space: {number: 19, turnout: null},
    x: 776,
    y: 52,
    width: 30.9,
    height: 20,
    transform: 'rotate(45 0 0)'
  })
  .concat(Array(19).fill(0)
    .map((_, index) => ({
      space: {number: 20 + index, turnout: null},
      x: 777,
      y: 112.9 + (index * 30.9),
      width: 30.9,
      height: 20,
      transform: 'rotate(-90 0 0)'
    })))
  .concat(Array(4).fill(0)
    .map((_, index) => ({
      space: {number: null, turnout: 5 + index},
      x: 759,
      y: 162 + index * 124,
      width: 36,
      height: 18,
      transform: 'rotate(-90 0 0)'
    })))
  .concat({
    space: {number: 39, turnout: null},
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

const COLORS = ['orange', 'purple', 'cyan', 'salmon', 'green', 'silver'];

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
  @ViewChild('hazardLocations') private hazardLocationElements !: ElementRef<Element>;
  @ViewChild('teepeeLocations') private teepeeLocationElements !: ElementRef<Element>;

  @ViewChild('red')
  private redElement !: ElementRef<Element>;
  @ViewChild('blue')
  private blueElement !: ElementRef<Element>;
  @ViewChild('yellow')
  private yellowElement !: ElementRef<Element>;
  @ViewChild('white')
  private whiteElement !: ElementRef<Element>;

  private rancherElements: { [playerColor in PlayerColor]: ElementRef };

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
  selectedForesights: number[] = [null, null, null];
  spaces = SPACES;
  playerBuildings: PlayerBuildingElement[];
  possibleMoveElements: PossibleMoveElement[];

  private selectedSpace: Space;

  constructor(private renderer: Renderer2,
              private ngbModal: NgbModal,
              private toastrService: ToastrService,
              private audioService: AudioService) {
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

          if (currentSpace
            && (currentSpace.number !== previousSpace.number
              || currentSpace.turnout !== previousSpace.turnout)) {
            this.audioService.playSound(TRAIN);
          }
        }

        for (let i = 0; i < current.railroadTrack.stations.length; i++) {
          const currentStation = current.railroadTrack.stations[i];
          const previousStation = previous.railroadTrack.stations[i];

          if (currentStation.players.length > previousStation.players.length) {
            this.audioService.playSound(STATION);
          }
        }

        for (const city of Object.keys(City)) {
          const currentCity = current.railroadTrack.cities[city];
          const previousCity = previous.railroadTrack.cities[city];

          if (currentCity.length !== previousCity.length) {
            switch (city) {
              case City.KANSAS_CITY:
                this.audioService.playSound(KANSAS_CITY);
                break;
              case City.TOPEKA:
                this.audioService.playSound(TOPEKA);
                break;
              case City.WICHITA:
                this.audioService.playSound(WICHITA);
                break;
              case City.COLORADO_SPRINGS:
                this.audioService.playSound(COLORADO_SPRINGS);
                break;
              case City.SANTA_FE:
                this.audioService.playSound(SANTA_FE);
                break;
              case City.SAN_DIEGO:
                this.audioService.playSound(SAN_DIEGO);
                break;
              case City.EL_PASO:
                this.audioService.playSound(EL_PASO);
                break;
              case City.SACRAMENTO:
                this.audioService.playSound(SACRAMENTO);
                break;
              case City.SAN_FRANCISCO:
                this.audioService.playSound(SAN_FRANCISCO);
                break;
            }
          }
        }

        for (const name of Object.keys(current.trail.locations)) {
          const currentLocation = current.trail.locations[name];
          const previousLocation = previous.trail.locations[name];

          if (currentLocation.building && previousLocation.building) {
            if (currentLocation.building.name !== previousLocation.building.name) {
              // upgrade
              this.audioService.playSound(BUILDING);
            }
          } else if (currentLocation.building !== previousLocation.building) {
            // build
            this.audioService.playSound(BUILDING);
          }

          if (previousLocation.hazard && !currentLocation.hazard) {
            this.audioService.playSound(previousLocation.hazard.type === HazardType.DROUGHT ? DROUGHT
              : previousLocation.hazard.type === HazardType.FLOOD ? FLOOD : ROCKFALL);
          }

          if (previousLocation.teepee && !currentLocation.teepee) {
            this.audioService.playSound(INDIANS);
          }
        }

        for (const color of Object.keys(PlayerColor)) {
          const currentLocation = current.trail.playerLocations[color];
          const previousLocation = previous.trail.playerLocations[color];

          if (currentLocation !== previousLocation) {
            if (currentLocation === 'KANSAS_CITY') {
              this.audioService.playSound(WELCOME_TO_KANSAS_CITY);
            } else if (currentLocation !== 'START') {
              this.audioService.playSound(MOVE);

              if (color === this.state.player.player.color) {
                // current user, play sound of building (if any)
                const building = current.trail.locations[currentLocation].building;
                if (building) {
                  switch (building.name) {
                    case 'A':
                      this.audioService.playSound(BUILDING_A);
                      break;
                    case 'B':
                      this.audioService.playSound(BUILDING_B);
                      break;
                    case 'C':
                      this.audioService.playSound(BUILDING_C);
                      break;
                    case 'D':
                      this.audioService.playSound(BUILDING_D);
                      break;
                    case 'E':
                      this.audioService.playSound(BUILDING_E);
                      break;
                    case 'F':
                      this.audioService.playSound(BUILDING_F);
                      break;
                    case 'G':
                      this.audioService.playSound(BUILDING_G);
                      break;
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

            if (JSON.stringify(currentTile) !== JSON.stringify(previousTile)) {
              const choice = previousTile;

              if (choice.worker) {
                this.audioService.playSound(choice.worker === Worker.COWBOY ? COWBOY
                  : choice.worker === Worker.CRAFTSMAN ? CRAFTSMAN : ENGINEER);
              } else if (choice.hazard) {
                this.audioService.playSound(choice.hazard.type === HazardType.DROUGHT ? DROUGHT
                  : choice.hazard.type === HazardType.FLOOD ? FLOOD : ROCKFALL);
              } else if (choice.teepee) {
                this.audioService.playSound(INDIANS);
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
      WHITE: this.whiteElement
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
      this.hazardLocationElements.nativeElement.children.namedItem(name) ||
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

        const index = playersByLocation[playerLocation].indexOf(color as PlayerColor);

        element.nativeElement.setAttribute('style', 'display:block');

        const x = parseInt(locationElement.getAttribute('x'), 10) + index * 12; // offset each one so they all stay visible
        const y = locationElement.getAttribute('y');

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

  canSelectCity(city: string): boolean {
    switch (this.selectedAction) {
      case ActionType.DELIVER_TO_CITY:
        return this.state.possibleDeliveries && this.state.possibleDeliveries.some(pd => pd.city === city as City);
      case ActionType.EXTRAORDINARY_DELIVERY:
        return !!this.selectedSpace;
      default:
        return false;
    }
  }

  get canChooseForesights(): boolean {
    return this.selectedAction === ActionType.CHOOSE_FORESIGHTS;
  }

  get canSelectHazard(): boolean {
    return HAZARD_ACTIONS.includes(this.selectedAction);
  }

  get canSelectTeepee(): boolean {
    return TEEPEE_ACTIONS.includes(this.selectedAction);
  }

  selectForesight(rowIndex: number, columnIndex: number) {
    if (this.selectedAction === ActionType.CHOOSE_FORESIGHTS) {
      if (this.selectedForesights[columnIndex] === rowIndex) {
        this.selectedForesights[columnIndex] = null;
      } else {
        this.selectedForesights[columnIndex] = rowIndex;
      }

      if (this.selectedForesights[0] !== null && this.selectedForesights[1] !== null && this.selectedForesights[2] !== null) {
        this.perform.emit({type: ActionType.CHOOSE_FORESIGHTS, choices: this.selectedForesights});
        this.selectedForesights = [null, null, null];
      }
    }
  }

  selectCity(city: string) {
    switch (this.selectedAction) {
      case ActionType.DELIVER_TO_CITY:
        if (this.state.possibleDeliveries) {
          const possibleDelivery = this.state.possibleDeliveries.find(pd => pd.city === city as City);

          if (possibleDelivery) {
            if (this.state.player.certificates <= possibleDelivery.certificates) {
              this.perform.emit({type: ActionType.DELIVER_TO_CITY, city, certificates: possibleDelivery.certificates});
            } else {
              const ngbModalRef = this.ngbModal.open(DeliveryCityComponent);

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

      case ActionType.EXTRAORDINARY_DELIVERY:
        if (this.selectedSpace) {
          this.perform.emit({type: ActionType.EXTRAORDINARY_DELIVERY, city, to: this.selectedSpace});
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

  selectTeepee(reward: number) {
    if (this.selectedAction === ActionType.TRADE_WITH_INDIANS) {
      this.perform.emit({type: this.selectedAction, reward});
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
        if (tile.worker) {
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
    switch (this.selectedAction) {
      case ActionType.EXTRAORDINARY_DELIVERY:
        // Remember space, because player has to select city next
        this.selectedSpace = space;
        break;

      default:
        this.perform.emit({type: this.selectedAction, to: space});
    }
  }

  canSelectSpace(space: Space) {
    return SELECT_SPACE_ACTIONS.includes(this.selectedAction)
      && this.state.possibleSpaces
      && this.state.possibleSpaces[this.selectedAction]
      && this.state.possibleSpaces[this.selectedAction].some(possibleSpace => {
        if ('turnout' in possibleSpace) {
          return possibleSpace.turnout === space.turnout;
        } else {
          return possibleSpace.number === space.number;
        }
      });
  }

  isSpaceSelected(space: Space): boolean {
    return this.selectedSpace === space;
  }

  getPlayersAt(space: Space): string[] {
    return Object.keys(PlayerColor).filter(color => this.isPlayerAt(color as PlayerColor, space));
  }

  private isPlayerAt(color: PlayerColor, space: Space): boolean {
    return this.state.railroadTrack.players[color] && (this.state.railroadTrack.players[color].number === space.number
      || this.state.railroadTrack.players[color].turnout === space.turnout);
  }

  canSelectWorker(rowIndex: number): boolean {
    if (!WORKER_ACTIONS.includes(this.selectedAction)
      || rowIndex >= this.state.jobMarket.currentRowIndex) {
      return false;
    }

    let cost = this.state.jobMarket.rows[rowIndex].cost;

    switch (this.selectedAction) {
      case ActionType.HIRE_WORKER_MINUS_1:
        cost += 1;
        break;
      case ActionType.HIRE_WORKER_MINUS_2:
        cost += 2;
        break;
      case ActionType.HIRE_WORKER_PLUS_2:
        cost -= 2;
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

}
