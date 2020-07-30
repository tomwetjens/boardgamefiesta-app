import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface DeviceSettings {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService {

  _deviceSettings = new BehaviorSubject<DeviceSettings>({});

  constructor(@Inject('localStorage') private localStorage: Storage) {
    const item = localStorage.getItem('deviceSettings');
    this._deviceSettings.next(item ? JSON.parse(item) : {});
  }

  get deviceSettings(): Observable<DeviceSettings> {
    return this._deviceSettings.asObservable();
  }

  save() {
    this.localStorage.setItem('deviceSettings', JSON.stringify(this._deviceSettings.value));
  }
}
