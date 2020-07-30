import { TestBed } from '@angular/core/testing';

import { DeviceSettingsService } from './device-settings.service';

describe('DeviceSettingsService', () => {
  let service: DeviceSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
