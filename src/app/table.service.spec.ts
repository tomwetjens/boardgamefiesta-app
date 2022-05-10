import {TableService} from './table.service';
import {AuthService} from './auth.service';
import {BrowserService} from './browser.service';
import {EventService} from './event.service';
import {DeviceSettingsService} from './shared/device-settings.service';
import {from} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from "../environments/environment";
import {LogEntry, LogEntryType} from "./shared/model";


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

  describe('table$', () => {
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

  describe('log$', () => {

    it('initially should have no logs', () => {
      const subscriber = jasmine.createSpy('subscriber');
      tableService.log$.subscribe(subscriber);

      expect(subscriber).not.toHaveBeenCalled();
      expect(httpClient.get).not.toHaveBeenCalled();
    });

    const logEntry1 = {
      timestamp: '2022-05-10T14:32:00.000Z',
      type: LogEntryType.CREATE,
      user: {id: 'aUserId', username: 'aUser'},
      parameters: []
    };
    const logEntry2 = {
      timestamp: '2022-05-10T14:32:20.000Z',
      type: LogEntryType.START,
      user: {id: 'aUserId', username: 'aUser'},
      parameters: []
    };

    it('should get initial logs for table', () => {
      const logEntries: LogEntry[] = [logEntry1, logEntry2];
      httpClient.get.and.returnValue(from([logEntries]));

      const subscriber = jasmine.createSpy('subscriber');
      tableService.log$.subscribe(subscriber);

      tableService.load('aId');

      expect(httpClient.get).toHaveBeenCalledOnceWith(environment.apiBaseUrl + '/tables/aId/log', {
        params: {
          since: '1970-01-01T00:00:00.000Z',
          limit: '30'
        }
      });

      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber.calls.allArgs()).toEqual([[logEntry1], [logEntry2]]);
    });

    it('should fetch most recent logs when switching to new table', () => {
      const logEntries: LogEntry[] = [logEntry1, logEntry2];
      httpClient.get.and.returnValue(from([logEntries]));

      tableService.load('aId');

      const subscriber1 = jasmine.createSpy('subscriber1');
      tableService.log$.subscribe(subscriber1);

      expect(httpClient.get).toHaveBeenCalledWith(environment.apiBaseUrl + '/tables/aId/log', {
        params: {
          since: '1970-01-01T00:00:00.000Z',
          limit: '30'
        }
      });

      expect(subscriber1).toHaveBeenCalledTimes(2);
      expect(subscriber1.calls.allArgs()).toEqual([[logEntry1], [logEntry2]]);

      tableService.load('anotherId');

      expect(httpClient.get).toHaveBeenCalledWith(environment.apiBaseUrl + '/tables/anotherId/log', {
        params: {
          since: '1970-01-01T00:00:00.000Z',
          limit: '30'
        }
      });

      expect(subscriber1).toHaveBeenCalledTimes(4);
      expect(subscriber1.calls.allArgs()).toEqual([[logEntry1], [logEntry2], [logEntry1], [logEntry2]]);

      const subscriber2 = jasmine.createSpy('subscriber2');
      tableService.log$.subscribe(subscriber2);

      expect(subscriber2).toHaveBeenCalledTimes(2);
      expect(subscriber2.calls.allArgs()).toEqual([[logEntry1], [logEntry2]]);
    });

    it('should not fetch logs again if resubscribed (and no other triggers)', () => {
      const logEntries: LogEntry[] = [logEntry1, logEntry2];
      httpClient.get.and.returnValue(from([logEntries]));

      const subscriber1 = jasmine.createSpy('subscriber');
      tableService.log$.subscribe(subscriber1);

      tableService.load('aId');

      expect(httpClient.get).toHaveBeenCalledOnceWith(environment.apiBaseUrl + '/tables/aId/log', {
        params: {
          since: '1970-01-01T00:00:00.000Z',
          limit: '30'
        }
      });

      expect(subscriber1).toHaveBeenCalledTimes(2);
      expect(subscriber1.calls.allArgs()).toEqual([[logEntry1], [logEntry2]]);

      subscriber1.calls.reset();
      httpClient.get.calls.reset();

      const subscriber2 = jasmine.createSpy('subscriber');
      tableService.log$.subscribe(subscriber2);

      expect(subscriber2).toHaveBeenCalledTimes(2);
      expect(subscriber2.calls.allArgs()).toEqual([[logEntry1], [logEntry2]]);
      expect(httpClient.get).not.toHaveBeenCalled();
      expect(subscriber1).not.toHaveBeenCalled();
    });

    it('should get logs again if refresh is triggered', () => {
      // TODO
    });

    it('should fetch logs since last fetch if event is received', () => {
      // TODO
    });

    xit('should fetch logs since last fetch again if reconnected', () => {
      // TODO
    });

    it('should fetch logs once if multiple triggers happen simultaneously', () => {
      // TODO
    });
  });
});
