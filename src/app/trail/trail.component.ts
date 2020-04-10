import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Action, ActionType, Game, Hazard, PlayerColor, PossibleMove, State} from '../model';
import {GameService} from '../game.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeliveryCityComponent} from '../delivery-city/delivery-city.component';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked {

  @Input() game: Game;
  @Input() state: State;
  @Input() selectedAction: ActionType;

  selected: string;
  possibleMoves: PossibleMove[];

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

  @ViewChild('foresight00') private foresight00 !: ElementRef<Element>;
  @ViewChild('foresight01') private foresight01 !: ElementRef<Element>;
  @ViewChild('foresight02') private foresight02 !: ElementRef<Element>;
  @ViewChild('foresight10') private foresight10 !: ElementRef<Element>;
  @ViewChild('foresight11') private foresight11 !: ElementRef<Element>;
  @ViewChild('foresight12') private foresight12 !: ElementRef<Element>;

  @ViewChild('hazards') private hazardsElement !: ElementRef<Element>;

  constructor(private renderer: Renderer2, private gameService: GameService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.rancherElements = {
      BLUE: this.blueElement,
      RED: this.redElement,
      YELLOW: this.yellowElement,
      WHITE: this.whiteElement
    };
  }

  clickLocation(name: string) {
    this.selected = name;

    console.log('clickLocation: ',{name});

    if (this.state.actions.includes('MOVE')) {
      // TODO Determine and send whole path


      this.gameService.getPossibleMoves(this.game.id, name)
        .subscribe(possibleMoves => {
          if (possibleMoves.length === 0) {
            // TODO show error
            return;
          }

          possibleMoves.sort((a, b) => a.cost - b.cost);

          if (possibleMoves[0].cost === 0 || possibleMoves.length === 1) {
            this.possibleMoves = [];
            this.action.emit({type: 'MOVE', steps: possibleMoves[0].steps});
          } else {
            this.possibleMoves = possibleMoves;
          }
        });
    } else if (this.selectedAction === 'REMOVE_HAZARD') {
      this.action.emit({type: this.selectedAction, hazard: this.state.trail.locations[name].hazard});
    }
  }

  getLocationElement(name: string): Element | null {
    return this.locationsElement.nativeElement.children.namedItem(name) ||
      this.buildingLocationElements.nativeElement.children.namedItem(name) ||
      this.hazardLocationElements.nativeElement.children.namedItem(name) ||
      this.teepeeLocationElements.nativeElement.children.namedItem(name);
  }

  ngAfterContentChecked(): void {

  }

  ngAfterViewChecked(): void {
    this.syncPlayerLocations();

    this.showPossibleMoves();

    // TODO Refresh hazards after state changed
    for (const name of Object.keys(this.state.trail.locations)) {
      const location = this.state.trail.locations[name];

      const locationElement = this.getLocationElement(name);

      if (location.building) {
        const buildingElement = location.building === 'A' ? this.neutralBuildingA
          : location.building === 'B' ? this.neutralBuildingB
            : location.building === 'C' ? this.neutralBuildingC
              : location.building === 'D' ? this.neutralBuildingD
                : location.building === 'E' ? this.neutralBuildingE
                  : location.building === 'F' ? this.neutralBuildingF
                    : location.building === 'G' ? this.neutralBuildingG : null;

        const x = locationElement.getAttribute('x');
        const y = locationElement.getAttribute('y');

        buildingElement.nativeElement.setAttribute('transform', 'translate(' + x + ',' + y + ')');
      } else if (location.hazard) {
        // TODO Differentiate to points and hand color
        const id = location.hazard.type.toLowerCase();

        const g = this.renderer.createElement('g', 'http://www.w3.org/2000/svg');
        const x = locationElement.getAttribute('x');
        const y = locationElement.getAttribute('y');
        this.renderer.setAttribute(g, 'transform', 'translate(' + x + ',' + y + ')');
        this.renderer.appendChild(this.hazardsElement.nativeElement, g);

        this.renderer.setProperty(g, 'innerHTML', '<use xlink:href="#' + id + '"/>');
        this.renderer.listen(g, 'click', () => this.clickHazard(location.hazard));
      } else if (location.teepee) {
        const id = location.teepee === 'GREEN' ? 'teepeeGreen' : 'teepeeBlue';

        const g = this.renderer.createElement('g', 'http://www.w3.org/2000/svg');
        const x = locationElement.getAttribute('x');
        const y = locationElement.getAttribute('y');
        this.renderer.setAttribute(g, 'transform', 'translate(' + x + ',' + y + ')');
        this.renderer.appendChild(this.hazardsElement.nativeElement, g);

        this.renderer.setProperty(g, 'innerHTML', '<use xlink:href="#' + id + '"/>');
      }
    }

    const foresightElements = [
      [this.foresight00, this.foresight01, this.foresight02],
      [this.foresight10, this.foresight11, this.foresight12]
    ];

    for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        const tile = this.state.foresights.choices[columnIndex][rowIndex];

        const foresightElement = foresightElements[rowIndex][columnIndex];
        if (tile) {
          let id;
          if (tile.type === 'HAZARD') {
            // TODO Differentiate to points and hand color
            id = tile.hazard.type.toLowerCase();
          } else {
            id = tile.type === 'TEEPEE' ? (tile.teepee === 'GREEN' ? 'teepeeGreen' : 'teepeeBlue')
              : tile.worker.toLowerCase();
          }
          this.renderer.setProperty(foresightElement.nativeElement, 'innerHTML', '<use xlink:href="#' + id + '"/>');
        } else {
          this.renderer.setProperty(foresightElement.nativeElement, 'innerHTML', '');
        }
      }
    }
  }

  private syncPlayerLocations() {
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

  selectedForesights: number[] = [];

  get canSelectCity(): boolean {
    return this.state.actions.includes('DELIVER_TO_CITY');
  }

  get canChooseForesights(): boolean {
    return this.state.actions.includes('CHOOSE_FORESIGHTS');
  }

  get canSelectLocation(): boolean {
    return this.state.actions.includes('MOVE');
  }

  get canSelectHazard(): boolean {
    return ['REMOVE_HAZARD', 'REMOVE_HAZARD_FOR_FREE'].includes(this.selectedAction);
  }

  clickForesight(rowIndex: number, colIndex: number) {
    console.log('clickForesight', {rowIndex, colIndex});

    if (this.state.actions.includes('CHOOSE_FORESIGHTS')) {
      this.selectedForesights[colIndex] = rowIndex;

      if (this.selectedForesights.length === 3) {
        this.action.emit({type: 'CHOOSE_FORESIGHTS', choices: this.selectedForesights});
      }
    }
  }

  clickCity(city: string) {
    if (this.state.actions.includes('DELIVER_TO_CITY')) {
      const ngbModalRef = this.ngbModal.open(DeliveryCityComponent);
      ngbModalRef.componentInstance.city = city;
      ngbModalRef.componentInstance.playerState = this.state.player;

      fromPromise(ngbModalRef.result)
        .subscribe(({certificates, unlock}) => this.action.emit({type: 'DELIVER_TO_CITY', city, certificates, unlock}));
    }
  }

  clickHazard(hazard: Hazard) {
    if (this.selectedAction === 'REMOVE_HAZARD' || this.selectedAction === 'REMOVE_HAZARD_FOR_FREE') {
      this.action.emit({type: this.selectedAction, hazard});
    }
  }
}
