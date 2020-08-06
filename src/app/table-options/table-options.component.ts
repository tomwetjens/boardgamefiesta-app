import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Options, Table} from '../shared/model';
import {GAME_PROVIDERS, OptionsComponent} from '../shared/api';

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

  constructor(private resolver: ComponentFactoryResolver) {
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
    const provider = GAME_PROVIDERS[this.table.game];

    if (provider && provider.optionsComponent) {
      setTimeout(() => {
        const factory = this.resolver.resolveComponentFactory(provider.optionsComponent);
        this.componentRef = this.container.createComponent(factory);

        this.componentRef.instance.changeOptions.subscribe(this.changeOptions);

        this.componentRef.instance.table = this.table;
      }, 0);
    }
  }

}
