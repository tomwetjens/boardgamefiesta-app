/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
