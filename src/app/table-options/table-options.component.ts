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
import {Options, Table} from '../shared/model';
import {GAME, GameProvider, OptionsComponent} from '../shared/api';

@Component({
  selector: 'app-table-options',
  templateUrl: './table-options.component.html',
  styleUrls: ['./table-options.component.scss']
})
export class TableOptionsComponent implements OnInit, OnChanges, AfterViewInit {

  private componentRef: ComponentRef<OptionsComponent>;

  @Input() table: Table;

  @Output() changeOptions = new EventEmitter<Options>();

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver,
              @Inject(GAME) private providers: GameProvider[]) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.componentRef) {
      const optionsComponent = this.componentRef.instance;

      optionsComponent.table = this.table;

      if ('ngOnChanges' in optionsComponent) {
        (optionsComponent as OnChanges).ngOnChanges.apply(optionsComponent, [changes]);
      }
    }
  }

  ngAfterViewInit(): void {
    const provider = this.providers.find(gameProvider => gameProvider.id === this.table.game);

    if (provider.optionsComponent) {
      setTimeout(() => {
        const factory = this.resolver.resolveComponentFactory(provider.optionsComponent);
        this.componentRef = this.container.createComponent(factory);

        this.componentRef.instance.changeOptions.subscribe(this.changeOptions);

        this.componentRef.instance.table = this.table;
      }, 0);
    }
  }

}
