import {Injectable} from '@angular/core';
import {Howl, Howler} from 'howler';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {concatMap, filter, map} from 'rxjs/operators';
import {DeviceSettingsService} from "./shared/device-settings.service";

export const ALERT = '/assets/sounds/alert.mp3';
export const DICE = '/assets/sounds/dice.mp3';

const SOUNDS = [
  ALERT,
  DICE
];

const preloaded: { [key: string]: Howl } = {};

export enum ChannelType {
  ALERTS = 'ALERTS',
  EFFECTS = 'EFFECTS',
  VOICE_OVER = 'VOICE_OVER',
  MUSIC = 'MUSIC'
}

export class Channel {
  muted$: BehaviorSubject<boolean>;
  queue = new Subject<QueuedSound>();
  playing?: PlayingSound;

  constructor(muted: boolean) {
    this.muted$ = new BehaviorSubject<boolean>(muted);

    this.queue
      .pipe(
        concatMap(qs => this.play(qs.uri))
      ).subscribe();
  }

  get muted(): boolean {
    return this.muted$.value;
  }

  play(uri: string): Observable<void> {
    return new Observable(subscriber => {
      const sound = preloaded[uri];

      if (!sound) {
        subscriber.error(new Error('Sound not loaded: ' + uri));
        return;
      }

      sound.once('end', () => {
        this.playing = null;
        subscriber.complete();
      });
      sound.once('stop', () => {
        subscriber.complete();
        this.playing = null;
      });
      sound.once('loaderror', msg => {
        subscriber.error(new Error('loaderror: ' + msg));
        this.playing = null;
      });
      sound.once('playerror', msg => {
        subscriber.error(new Error('playerror: ' + msg));
        this.playing = null;
      });

      this.playing = {sound, subscription: subscriber};

      sound.mute(this.muted);
      sound.play();

      return () => sound.stop();
    });
  }

  mute() {
    this.muted$.next(true);

    if (this.playing) {
      this.playing.sound.mute(true);
    }
  }

  unmute() {
    this.muted$.next(false);

    if (this.playing) {
      this.playing.sound.mute(false);
    }
  }
}

interface QueuedSound {
  uri: string;
}

interface PlayingSound {
  sound: Howl;
  subscription: Subscription;
}

interface DeviceSettingsAudioChannel {
  muted?: boolean;
}

interface DeviceSettingsAudio {
  muted?: boolean;
  channels?: { [key in ChannelType]?: DeviceSettingsAudioChannel };
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  channels: { [key in ChannelType]?: Channel } = {};

  constructor(private deviceSettingsService: DeviceSettingsService) {
    Howler.autoUnlock = true;

    this.preload(SOUNDS);

    this.channels[ChannelType.ALERTS] = new Channel(false);
    this.channels[ChannelType.EFFECTS] = new Channel(false);
    this.channels[ChannelType.VOICE_OVER] = new Channel(false);
    this.channels[ChannelType.MUSIC] = new Channel(false);

    deviceSettingsService.deviceSettings
      .pipe(
        filter(deviceSettings => !!deviceSettings),
        map(deviceSettings => (deviceSettings['audio'] = deviceSettings['audio'] || {}) as DeviceSettingsAudio))
      .subscribe(deviceSettings => {
        deviceSettings.channels = deviceSettings.channels || {};

        for (const channelType of Object.keys(this.channels)) {
          const channel = this.channels[channelType];

          deviceSettings.channels[channelType] = deviceSettings.channels[channelType] || {};

          if (deviceSettings.channels[channelType].muted) {
            channel.mute();
          }

          channel.muted$.subscribe(muted => {
            deviceSettings.channels[channelType].muted = muted;
            this.deviceSettingsService.save();
          });
        }
      });
  }

  preload(uris: string[]) {
    uris.forEach(uri => {
      preloaded[uri] = new Howl({
        preload: true,
        src: [uri]
      });
    });
  }

  alert() {
    this.playAlert(ALERT);
  }

  playAlert(uri: string) {
    this.channels[ChannelType.ALERTS].play(uri).subscribe();
  }

  playMusic(uri: string): Observable<void> {
    if (this.channels[ChannelType.MUSIC].playing) {
      this.stopMusic();
    }

    this.channels[ChannelType.MUSIC].play(uri).subscribe();

    return new Observable(() => {
      return () => this.stopMusic();
    });
  }

  playEffect(uri: string) {
    this.channels[ChannelType.EFFECTS].queue.next({uri});
  }

  playVoiceOver(uri: string) {
    this.channels[ChannelType.VOICE_OVER].queue.next({uri});
  }

  get isPlayingMusic(): boolean {
    return !!this.channels[ChannelType.MUSIC].playing && !this.channels[ChannelType.MUSIC].playing.subscription.closed;
  }

  private stopMusic() {
    this.channels[ChannelType.MUSIC].playing.subscription.unsubscribe();
    this.channels[ChannelType.MUSIC].playing = null;
  }

  mute() {
    for (const channelType in this.channels) {
      this.channels[channelType].mute();


    }
  }

  unmute() {
    for (const channelType in this.channels) {
      this.channels[channelType].unmute();
    }
  }

  get muted(): boolean {
    return !Object.keys(this.channels).some(channelType => !this.channels[channelType].muted);
  }

}
