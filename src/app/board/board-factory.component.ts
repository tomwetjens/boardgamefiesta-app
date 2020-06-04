import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Table} from '../shared/model';
import {BoardComponent, GAME, GameProvider} from '../shared/api';

@Component({
  selector: 'app-board-factory',
  templateUrl: './board-factory.component.html',
  styleUrls: ['./board-factory.component.scss']
})
export class BoardFactoryComponent implements OnInit, OnChanges, AfterViewInit, BoardComponent {

  private componentRef: ComponentRef<BoardComponent>;

  @Input() table: Table;
  @Input() state: any;

  @Output() perform = new EventEmitter<any>();
  @Output() skip = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver,
              @Inject(GAME) private providers: GameProvider[]) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.componentRef) {
      const boardComponent = this.componentRef.instance;

      boardComponent.table = this.table;
      boardComponent.state = this.state;

      if ('ngOnChanges' in boardComponent) {
        (boardComponent as OnChanges).ngOnChanges.apply(boardComponent, [changes]);
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const provider = this.providers.find(gameProvider => gameProvider.id === this.table.game);

      if (!provider) {
        throw new Error('Provider not found: ' + this.table.game);
      }

      const factory = this.resolver.resolveComponentFactory(provider.boardComponent);
      this.componentRef = this.container.createComponent(factory);

      this.componentRef.instance.perform.subscribe(this.perform);
      this.componentRef.instance.skip.subscribe(this.skip);
      this.componentRef.instance.endTurn.subscribe(this.endTurn);

      this.componentRef.instance.table = this.table;
      this.componentRef.instance.state = this.state;
    }, 0);
  }

  get canSkip(): boolean {
    return this.componentRef.instance.canSkip;
  }

}
