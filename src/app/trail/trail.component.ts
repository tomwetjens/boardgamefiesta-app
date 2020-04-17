import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {Action, ActionType, Building, City, Game, Hazard, Location, PlayerColor, PossibleDelivery, PossibleMove, Space, State} from '../model';
import {GameService} from '../game.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeliveryCityComponent} from '../delivery-city/delivery-city.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {ToastrService} from '../toastr.service';
import {PlayerBuildingsComponent} from '../player-buildings/player-buildings.component';

const SELECT_SPACE_ACTIONS = [
  'MOVE_ENGINE_1_FORWARD',
  'MOVE_ENGINE_1_BACKWARDS_TO_GAIN_3_DOLLARS',
  'MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD',
  'MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS',
  'MOVE_ENGINE_2_OR_3_FORWARD',
  'MOVE_ENGINE_AT_LEAST_1_BACKWARDS_AND_GAIN_3_DOLLARS',
  'MOVE_ENGINE_AT_MOST_2_FORWARD',
  'MOVE_ENGINE_AT_MOST_3_FORWARD',
  'MOVE_ENGINE_AT_MOST_4_FORWARD',
  'MOVE_ENGINE_AT_MOST_5_FORWARD',
  'MOVE_ENGINE_FORWARD',
  'MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS'
];

@Component({
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked, OnChanges {

  @Input() game: Game;
  @Input() state: State;
  @Input() selectedAction: ActionType;

  window = window;

  selected: string;
  possibleMoves: PossibleMove[];
  possibleDeliveries: PossibleDelivery[];

  @Output() action = new EventEmitter<Action>();

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

  @ViewChild('possiblemoves')
  private possibleMovesElement !: ElementRef<Element>;

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

  hazards: { x: string, y: string, hazard: Hazard }[];
  foresights: any[][];
  selectedForesights: number[] = [null, null, null];

  spaces: {
    space: { number?: number; turnout?: number };
    x: number;
    y: number;
    width: number;
    height: number;
    transform?: string;
  }[];

  engines: { [playerColor in PlayerColor]: { x: string; y: string; } };

  stations: {}[];
  playerBuildings: { building: Building; x: string; y: string }[];

  constructor(private renderer: Renderer2,
              private gameService: GameService,
              private ngbModal: NgbModal,
              private toastrService: ToastrService) {
    this.spaces = Array(19).fill(0)
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
        x: 761,
        y: 64,
        width: 20,
        height: 30.9,
        transform: 'rotate(-45 761 64)'
      })
      .concat(Array(19).fill(0)
        .map((_, index) => ({
          space: {number: 20 + index, turnout: null},
          x: 777,
          y: 82 + (index * 30.9),
          width: 20,
          height: 30.9,
          transform: ''
        })))
      .concat(Array(4).fill(0)
        .map((_, index) => ({
          space: {number: null, turnout: 5 + index},
          x: 759,
          y: 126 + index * 124,
          width: 18,
          height: 36,
          transform: ''
        })))
      .concat({
        space: {number: 39, turnout: null},
        x: 731,
        y: 666,
        width: 46,
        height: 30.9,
        transform: ''
      });
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
    }
  }

  private actionSelected() {
    if (this.selectedAction === 'DELIVER_TO_CITY') {
      this.gameService.getPossibleDeliveries(this.game.id)
        .subscribe(possibleDeliveries => this.possibleDeliveries = possibleDeliveries);
    }
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
    switch (this.selectedAction) {
      case ActionType.MOVE:
        if (this.state.trail.playerLocations[this.state.player.player.color]) {
          this.gameService.getPossibleMoves(this.game.id, name)
            .subscribe(possibleMoves => {
              if (possibleMoves.length === 0) {
                console.error('no possible moves');
                this.toastrService.error('Cannot move to selected location');
                return;
              }

              possibleMoves.sort((a, b) => a.cost - b.cost);

              if (possibleMoves[0].cost === 0 || possibleMoves.length === 1) {
                this.possibleMoves = [];
                this.action.emit({type: ActionType.MOVE, steps: possibleMoves[0].steps});
              } else {
                this.possibleMoves = possibleMoves;
              }
            });
        } else {
          // First move, can go anywhere
          this.action.emit({type: ActionType.MOVE, steps: [name]});
        }
        break;

      case ActionType.REMOVE_HAZARD:
      case ActionType.REMOVE_HAZARD_FOR_FREE:
        this.action.emit({type: this.selectedAction, hazard: this.state.trail.locations[name].hazard});
        break;

      case ActionType.TRADE_WITH_INDIANS:
        this.action.emit({type: this.selectedAction, reward: this.state.trail.locations[name].reward});
        break;

      case ActionType.PLACE_BUILDING:
      case ActionType.PLACE_CHEAP_BUILDING:
        const ngbModalRef = this.ngbModal.open(PlayerBuildingsComponent);
        ngbModalRef.componentInstance.playerState = this.state.player;
        fromPromise(ngbModalRef.result).subscribe(building => {
          this.action.emit({type: this.selectedAction, location: name, building});
        });
        break;
    }
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

  ngAfterViewChecked(): void {
    // const foresightElements = [
    //   [this.foresight00, this.foresight01, this.foresight02],
    //   [this.foresight10, this.foresight11, this.foresight12]
    // ];
    //
    // for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
    //   for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
    //     const tile = this.state.foresights.choices[columnIndex][rowIndex];
    //
    //     const foresightElement = foresightElements[rowIndex][columnIndex];
    //     if (tile) {
    //       let id;
    //       if (tile.type === 'HAZARD') {
    //         // TODO Differentiate to points and hand color
    //         id = tile.hazard.type.toLowerCase() + (tile.hazard.hands === 'GREEN' ? 'Green' : 'Black');
    //         this.renderer.setProperty(foresightElement.nativeElement, 'innerHTML', '<use xlink:href="#' + id + '"/>');
    //       } else {
    //         id = tile.type === 'TEEPEE' ? (tile.teepee === 'GREEN' ? 'teepeeGreen' : 'teepeeBlue')
    //           : tile.worker.toLowerCase();
    //         this.renderer.setProperty(foresightElement.nativeElement, 'innerHTML', '<use xlink:href="#' + id + '"/>');
    //       }
    //     } else {
    //       this.renderer.setProperty(foresightElement.nativeElement, 'innerHTML', '');
    //     }
    //   }
    // }
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

        const x = parseInt(locationElement.getAttribute('x'), 10) + index * 4; // offset each one so they all stay visible
        const y = locationElement.getAttribute('y');

        element.nativeElement.setAttribute('x', x);
        element.nativeElement.setAttribute('y', y);
      } else {
        element.nativeElement.setAttribute('style', 'display:none');
      }
    }
  }

  private showPossibleMoves() {
    while (this.possibleMovesElement.nativeElement.firstChild != null) {
      this.renderer.removeChild(this.possibleMovesElement.nativeElement, this.possibleMovesElement.nativeElement.firstChild);
    }

    if (this.possibleMoves) {
      const colors = ['green', 'purple', 'brown', 'orange'];

      let colorIndex = 0;
      for (const possibleMove of this.possibleMoves) {

        const cur = this.state.trail.playerLocations[this.state.player.player.color];

        let prev = cur;
        let prevLocationElement = this.getLocationElement(prev);

        for (const step of possibleMove.steps) {
          const locationElement = this.getLocationElement(step);

          if (!locationElement) {
            console.warn('Step in possible move not found in SVG: ' + step);
          }

          const rect = this.renderer.createElement('rect', 'http://www.w3.org/2000/svg');
          this.renderer.setAttribute(rect, 'x', locationElement.getAttribute('x'));
          this.renderer.setAttribute(rect, 'y', locationElement.getAttribute('y'));
          this.renderer.setAttribute(rect, 'width', '3');
          this.renderer.setAttribute(rect, 'height', '3');
          this.renderer.setAttribute(rect, 'fill', colors[colorIndex]);

          const line = this.renderer.createElement('line', 'http://www.w3.org/2000/svg');
          this.renderer.setAttribute(line, 'x1', prevLocationElement.getAttribute('x'));
          this.renderer.setAttribute(line, 'y1', prevLocationElement.getAttribute('y'));
          this.renderer.setAttribute(line, 'x2', locationElement.getAttribute('x'));
          this.renderer.setAttribute(line, 'y2', locationElement.getAttribute('y'));
          this.renderer.setAttribute(line, 'stroke-width', '3');
          this.renderer.setAttribute(line, 'stroke', colors[colorIndex]);

          this.renderer.appendChild(this.possibleMovesElement.nativeElement, line);

          prev = step;
          prevLocationElement = locationElement;
        }

        colorIndex++;
      }
    }
  }

  canSelectCity(city: string): boolean {
    return this.state.actions.includes(ActionType.DELIVER_TO_CITY) &&
      this.possibleDeliveries && this.possibleDeliveries.some(pd => pd.city === city as City);
  }

  get canChooseForesights(): boolean {
    return this.selectedAction === 'CHOOSE_FORESIGHTS';
  }

  get canSelectHazard(): boolean {
    return ['MOVE', 'REMOVE_HAZARD', 'REMOVE_HAZARD_FOR_FREE'].includes(this.selectedAction);
  }

  get canSelectTeepee(): boolean {
    return ['MOVE', 'TRADE_WITH_INDIANS'].includes(this.selectedAction);
  }

  selectForesight(rowIndex: number, columnIndex: number) {
    console.log('selectForesight: ', rowIndex, columnIndex);

    if (this.selectedAction === ActionType.CHOOSE_FORESIGHTS) {
      if (this.selectedForesights[columnIndex] === rowIndex) {
        this.selectedForesights[columnIndex] = null;
      } else {
        this.selectedForesights[columnIndex] = rowIndex;
      }

      console.log('selectedForesights: ', this.selectedForesights);

      if (this.selectedForesights[0] !== null && this.selectedForesights[1] !== null && this.selectedForesights[2] !== null) {
        this.action.emit({type: ActionType.CHOOSE_FORESIGHTS, choices: this.selectedForesights});
        this.selectedForesights = [null, null, null];
      }
    }
  }

  selectCity(city: string) {
    if (this.selectedAction === ActionType.DELIVER_TO_CITY && this.possibleDeliveries) {
      const possibleDelivery = this.possibleDeliveries.find(pd => pd.city === city as City);

      if (possibleDelivery) {
        if (this.state.player.certificates <= possibleDelivery.certificates) {
          this.action.emit({type: ActionType.DELIVER_TO_CITY, city, certificates: possibleDelivery.certificates});
        } else {
          const ngbModalRef = this.ngbModal.open(DeliveryCityComponent);

          ngbModalRef.componentInstance.possibleDelivery = possibleDelivery;
          ngbModalRef.componentInstance.playerState = this.state.player;

          fromPromise(ngbModalRef.result)
            .subscribe(({certificates}) => this.action.emit({type: ActionType.DELIVER_TO_CITY, city, certificates}));
        }
      }
    }
  }

  canSelectLocation(name: string) {
    const location = this.state.trail.locations[name];
    return location && ((this.selectedAction === ActionType.MOVE && this.canMoveTo(location)) ||
      ([ActionType.PLACE_CHEAP_BUILDING,
        ActionType.PLACE_BUILDING].includes(this.selectedAction) && this.canPlaceBuilding(location)));
  }

  private canMoveTo(location: Location): boolean {
    if (location.name === 'KANSAS_CITY') {
      return true;
    }
    return !!location.building || !!location.hazard || !!location.teepee;
  }

  private canPlaceBuilding(location: Location): boolean {
    return location.type === 'BUILDING' && !location.building;
  }

  selectTeepee(reward: number) {
    if (this.selectedAction === 'TRADE_WITH_INDIANS') {
      this.action.emit({type: this.selectedAction, reward});
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
        const hazard = this.state.trail.locations[name].hazard;

        return {
          x: locationElement.getAttribute('x'),
          y: locationElement.getAttribute('y'),
          hazard
        };
      });
  }

  selectHazard(hazard: Hazard) {
    if (this.selectedAction === 'REMOVE_HAZARD' || this.selectedAction === 'REMOVE_HAZARD_FOR_FREE') {
      this.action.emit({type: this.selectedAction, hazard});
    }
  }

  private updateForesights() {
    this.foresights = this.state.foresights.choices
      .map(column => column.map(tile => tile.worker || tile.teepee || tile.hazard.type + '_' + tile.hazard.hands));
  }

  selectStation(index: number) {
    console.log('selectStation: ', index);
    // TODO
  }

  canSelectStation(index: number) {
    return ['DOWNGRADE_STATION'].includes(this.selectedAction);
  }

  selectSpace(space: Space) {
    console.log('selectSpace: ', space);

    if (SELECT_SPACE_ACTIONS.includes(this.selectedAction)) {
      this.action.emit({type: this.selectedAction, to: space});
    }
  }

  canSelectSpace(space: Space) {
    return SELECT_SPACE_ACTIONS.includes(this.selectedAction);
  }

  getPlayersAt(space: Space): string[] {
    return Object.keys(PlayerColor).filter(color => this.isPlayerAt(color as PlayerColor, space));
  }

  private isPlayerAt(color: PlayerColor, space: Space): boolean {
    return this.state.railroadTrack.players[color] && (this.state.railroadTrack.players[color].number === space.number || this.state.railroadTrack.players[color].turnout === space.turnout);
  }

  canSelectWorker(worker: Worker): boolean {
    return [ActionType.HIRE_WORKER, ActionType.HIRE_SECOND_WORKER, ActionType.HIRE_CHEAP_WORKER].includes(this.selectedAction);
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

    console.log('playerBuildings:', this.playerBuildings);
  }
}
