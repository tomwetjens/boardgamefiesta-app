import {Component, OnInit} from '@angular/core';
import {Action, CattleMarket, CattleType, PlayerColor} from '../model';
import {EndedDialogComponent} from '../ended-dialog/ended-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

const CATTLE_MARKET: CattleMarket = {
  drawStackSize: 14,
  cards: [
    {type: CattleType.BROWN_SWISS, points: 2, breedingValue: 3},
    {type: CattleType.HOLSTEIN, points: 2, breedingValue: 3},
    {type: CattleType.AYRSHIRE, points: 3, breedingValue: 3},
    {type: CattleType.WEST_HIGHLAND, points: 4, breedingValue: 4},
    {type: CattleType.WEST_HIGHLAND, points: 4, breedingValue: 4},
    {type: CattleType.WEST_HIGHLAND, points: 4, breedingValue: 4},
    {type: CattleType.TEXAS_LONGHORN, points: 5, breedingValue: 5},
    {type: CattleType.TEXAS_LONGHORN, points: 6, breedingValue: 5},
    {type: CattleType.TEXAS_LONGHORN, points: 7, breedingValue: 5}
  ]
};

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  cattleMarket = CATTLE_MARKET;
  selectedAction: string;
  action: Action;

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  openEndedDialog() {
    const ngbModalRef = this.ngbModal.open(EndedDialogComponent, {backdrop: true, size: 'lg'});
    const componentInstance = ngbModalRef.componentInstance as EndedDialogComponent;
    componentInstance.state = {
      player: {
        player: {
          name: 'A',
          color: PlayerColor.YELLOW
        },
        score: {
          total: 90,
          categories: {
            DOLLARS: 0,
            CATTLE_CARDS: 3,
            OBJECTIVE_CARDS: 11,
            STATION_MASTERS: 31,
            WORKERS: 33,
            HAZARDS: 9,
            EXTRA_STEP_POINTS: 3,
            JOB_MARKET_TOKEN: 2,
            BUILDINGS: 13,
            CITIES: -9,
            STATIONS: 20
          }
        },
        winner: true
      },
      otherPlayers: [
        {
          player: {
            name: 'B',
            color: PlayerColor.WHITE
          },
          score: {
            total: 48,
            categories: {
              DOLLARS: 0,
              CATTLE_CARDS: 3,
              OBJECTIVE_CARDS: 3,
              STATION_MASTERS: 0,
              WORKERS: 12,
              HAZARDS: 12,
              EXTRA_STEP_POINTS: 3,
              JOB_MARKET_TOKEN: 0,
              BUILDINGS: 7,
              CITIES: 0,
              STATIONS: 0
            }
          },
          winner: false
        },
        {
          player: {
            name: 'C',
            color: PlayerColor.RED,
          },
          score: {
            total: 46,
            categories: {
              DOLLARS: 0,
              CATTLE_CARDS: 3,
              OBJECTIVE_CARDS: 3,
              STATION_MASTERS: 0,
              WORKERS: 12,
              HAZARDS: 12,
              EXTRA_STEP_POINTS: 3,
              JOB_MARKET_TOKEN: 0,
              BUILDINGS: 7,
              CITIES: 0,
              STATIONS: 0
            }
          },
          winner: false
        },
        {
          player: {
            name: 'D',
            color: PlayerColor.BLUE
          },
          score: {
            total: 41,
            categories: {
              DOLLARS: 0,
              CATTLE_CARDS: 3,
              OBJECTIVE_CARDS: 11,
              STATION_MASTERS: 31,
              WORKERS: 33,
              HAZARDS: 9,
              EXTRA_STEP_POINTS: 3,
              JOB_MARKET_TOKEN: 2,
              BUILDINGS: 13,
              CITIES: -9,
              STATIONS: 20
            }
          },
          winner: false
        }
      ]
    } as any;
  }
}
