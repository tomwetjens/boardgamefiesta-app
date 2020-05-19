import {Injectable} from '@angular/core';
import {Howl} from 'howler';
import {Observable, Subject} from 'rxjs';
import {flatMap} from 'rxjs/operators';

const ALERT = '/assets/games/gwt/sounds/alert.mp3';

const SOUNDS = [
  ALERT
];

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: { [key: string]: Howl } = {};

  private queue = new Subject<string>();

  constructor() {
    Howler.autoUnlock = true;

    this.preload(SOUNDS);

    this.queue
      .pipe(
        // TODO debounce?
        flatMap(name => new Observable(subscriber => {
          const sound = this.sounds[name];

          if (!sound) {
            subscriber.complete();
            return;
          }

          sound.once('end', () => subscriber.complete());
          sound.once('stop', () => subscriber.complete());
          sound.once('loaderror', () => subscriber.complete());
          sound.once('playerror', () => subscriber.complete());

          sound.play();
        }))
      ).subscribe();
  }

  preload(uris: string[]) {
    uris.forEach(uri => {
      this.sounds[uri] = new Howl({
        preload: true,
        src: [uri]
      });
    });
  }

  playSound(uri: string) {
    this.queue.next(uri);
  }

  alert() {
    this.playSound(ALERT);
  }
}
