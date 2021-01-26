import {Injectable} from '@angular/core';
import {combineLatest, fromEvent, Observable} from "rxjs";
import {distinctUntilChanged, map, shareReplay, startWith} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  private isVisible$ = fromEvent(document, 'visibilitychange')
    .pipe(
      map(x => document.visibilityState),
      startWith(document.visibilityState),
      map(visibilityState => visibilityState === 'visible'),
      distinctUntilChanged(),
      shareReplay(1)
    );

  constructor() {
  }

  get active(): Observable<boolean> {
    return this.isVisible$;
  }
}
