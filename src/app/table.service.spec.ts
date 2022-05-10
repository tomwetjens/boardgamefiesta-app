import {TableService} from './table.service';
import {AuthService} from './auth.service';
import {BrowserService} from './browser.service';
import {EventService} from './event.service';
import {DeviceSettingsService} from './shared/device-settings.service';
import {from} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from "../environments/environment";


describe('TableService', () => {
  const httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
  const authService = jasmine.createSpyObj<AuthService>('AuthService', [], {token: from(['aToken'])});
  const browserService = jasmine.createSpyObj<BrowserService>('BrowserService', [], {active: from([true])});
  const eventService = jasmine.createSpyObj<EventService>('EventService', [], {events$: from([])});
  const deviceSettingsService = jasmine.createSpyObj('DeviceSettingsService', ['get']);

  let tableService: TableService;

  beforeEach(() => {
    httpClient.get.calls.reset();

    tableService = new TableService(httpClient, authService, browserService, eventService, deviceSettingsService);
  });

  describe('table$ and load', () => {
    it('initially should have no table', () => {
      const subscriber = jasmine.createSpy('subscriber');
      tableService.table$.subscribe(subscriber);

      expect(subscriber).not.toHaveBeenCalled();
      expect(httpClient.get).not.toHaveBeenCalled();
    });

    it('should get table', () => {
      const table = {id: 'aId'};
      httpClient.get.and.returnValue(from([table]));

      const subscriber = jasmine.createSpy('subscriber');
      tableService.table$.subscribe(subscriber);

      tableService.load('aId');

      expect(httpClient.get).toHaveBeenCalledOnceWith(environment.apiBaseUrl + '/tables/aId');
      expect(subscriber).toHaveBeenCalledWith(table);
    });

    it('should get table when switching to new id', () => {
      const table = {id: 'aId'};
      httpClient.get.and.returnValue(from([table]));

      const subscriber = jasmine.createSpy('subscriber');
      tableService.table$.subscribe(subscriber);

      tableService.load('aId');
      tableService.load('anotherId');

      expect(httpClient.get).toHaveBeenCalledTimes(2);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiBaseUrl + '/tables/aId');
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiBaseUrl + '/tables/anotherId');
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should not get table again if resubscribed (and no other triggers)', () => {
      const table = {id: 'aId'};
      httpClient.get.and.returnValue(from([table]));

      tableService.load('aId');

      const subscriber1 = jasmine.createSpy('subscriber1');
      tableService.table$.subscribe(subscriber1);
      const subscriber2 = jasmine.createSpy('subscriber2');
      tableService.table$.subscribe(subscriber2);

      expect(httpClient.get).toHaveBeenCalledOnceWith(environment.apiBaseUrl + '/tables/aId');
      expect(subscriber1).toHaveBeenCalledOnceWith(table);
      expect(subscriber2).toHaveBeenCalledOnceWith(table);
    });

    it('should get table again if refresh is triggered', () => {
      const table = {id: 'aId'};
      httpClient.get.and.returnValue(from([table]));

      const subscriber = jasmine.createSpy('subscriber');
      tableService.table$.subscribe(subscriber);

      tableService.load('aId');
      tableService.refresh();

      expect(httpClient.get).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    xit('should get table again if event is received', () => {
      const table = {id: 'aId'};
      httpClient.get.and.returnValue(from([table]));

      const subscriber = jasmine.createSpy('subscriber');
      tableService.table$.subscribe(subscriber);

      tableService.load('aId');
      // TODO How to simulate inbound message on WebSocket?

      expect(httpClient.get).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    xit('should get table again if reconnected', () => {
      const table = {id: 'aId'};
      httpClient.get.and.returnValue(from([table]));

      const subscriber = jasmine.createSpy('subscriber');
      tableService.table$.subscribe(subscriber);

      tableService.load('aId');
      // TODO How to simulate WebSocket reconnect?

      expect(httpClient.get).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should get table once if multiple triggers happen simultaneously', () => {
      const table = {id: 'aId'};
      httpClient.get.and.returnValue(from([table]));

      const subscriber = jasmine.createSpy('subscriber');
      tableService.table$.subscribe(subscriber);

      tableService.load('aId');
      tableService.refresh();
      tableService.refresh();
      tableService.refresh();

      expect(httpClient.get).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });
})
;
