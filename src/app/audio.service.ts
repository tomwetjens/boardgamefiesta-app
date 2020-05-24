import {Injectable} from '@angular/core';
import {Howl} from 'howler';
import {Observable, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, flatMap} from 'rxjs/operators';

const ALERT = '/assets/sounds/alert.mp3';

const SOUNDS = [
  ALERT
];

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: { [key: string]: Howl } = {};

  private queue = new Subject<string>();
  private backgroundMusic: Subscription;

  constructor() {
    Howler.autoUnlock = true;

    this.preload(SOUNDS);

    this.queue
      .pipe(
        // TODO debounce?
        distinctUntilChanged(),
        flatMap(name => this.play(name))
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

  playMusic(uri: string): Observable<void> {
    if (this.backgroundMusic) {
      this.stopMusic();
    }

    this.backgroundMusic = this.play(uri).subscribe();

    return new Observable(() => {
      return () => this.stopMusic();
    });
  }

  private stopMusic() {
    this.backgroundMusic.unsubscribe();
    this.backgroundMusic = null;
  }

  private play(uri: string) {
    return new Observable(subscriber => {
      const sound = this.sounds[uri];

      if (!sound) {
        subscriber.error('not_loaded');
        return;
      }

      sound.once('end', () => subscriber.complete());
      sound.once('stop', () => subscriber.complete());
      sound.once('loaderror', () => subscriber.error('loaderror'));
      sound.once('playerror', () => subscriber.error('playerror'));

      sound.play();

      return () => sound.stop();
    });
  }
}
