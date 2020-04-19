import {Injectable} from '@angular/core';
import {Howl} from 'howler';
import {Observable, Subject} from 'rxjs';
import {flatMap} from 'rxjs/operators';

const SOUNDS = [
  'alert',
  'cow',
  'cowboy',
  'building',
  'coins',
  'flood',
  'train',
  'move',
  'card',
  'engineer',
  'craftsman',
  'indians',
  'certificate',
  'auction',
  'disc',
  'rockfall',
  'drought'
];

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  sounds = SOUNDS.reduce((map, key) => Object.assign(map, {
    [key]: new Howl({
      preload: true,
      src: ['/assets/sounds/' + key + '.mp3']
    })
  }), {});

  private queue = new Subject<string>();

  constructor() {
    Howler.autoUnlock = true;

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

  playSound(name: string) {
    this.queue.next(name);
  }
}
