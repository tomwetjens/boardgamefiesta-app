import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";

function isPortrait() {
  return screen.availHeight > screen.availWidth;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {
  }

  handleError(error: any): void {
    const httpClient = this.injector.get(HttpClient);

    if (httpClient) {
      let message;
      let stack;
      if (error instanceof HttpErrorResponse) {
        return;
      } else if (error instanceof TypeError) {
        message = error.name + ' ' + error.message;
        stack = error.stack;
      } else if (error instanceof Error) {
        message = error.name + ' ' + error.message;
        stack = error.stack;
      } else {
        message = error.toString();
      }

      const body = {
        message,
        stack,
        url: window.location.href,
        screen: (window.screen.width * window.devicePixelRatio) + 'x' + (window.screen.height * window.devicePixelRatio),
        orientation: isPortrait() ? 'portrait' : 'landscape',
        timestamp: new Date().toISOString()
      };

      httpClient.post(environment.apiBaseUrl + '/errors', body).subscribe();
    }

    throw error;
  }

}
