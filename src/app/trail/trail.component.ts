import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Action, ActionType, Trail} from '../model';

@Component({
  selector: 'app-trail',
  templateUrl: './trail.component.svg',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent implements OnInit, AfterViewInit {

  @Input() trail: Trail;
  @Input() actions: ActionType[];

  @Output() action = new EventEmitter<Action>();


  @ViewChild('locations')
  private locationsElement !: ElementRef<Element>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  selectLocation(name: string) {
    console.log('selectLocation:', name, this.getLocationElement(name));

    if (this.actions.includes('MOVE')) {
      // TODO Determine and send whole path
      this.action.emit({type: 'MOVE', steps: [name]});
    }
  }

  private getLocationElement(name: string) {
    return this.locationsElement.nativeElement.children.namedItem(name);
  }
}
