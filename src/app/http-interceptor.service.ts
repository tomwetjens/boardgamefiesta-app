import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {catchError} from 'rxjs/operators';
import {ToastrService} from './toastr.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private oAuthService: OAuthService,
              private toastrService: ToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.apiBaseUrl) && this.oAuthService.hasValidIdToken()) {
      const token = this.oAuthService.getIdToken();
      const header = 'Bearer ' + token;

      const headers = req.headers.set('Authorization', header);

      req = req.clone({headers});
    }

    return next.handle(req).pipe(catchError(response => {
      if (response.status >= 400 && response.status < 500) {
        // TODO Handle 4xx with code
        const message = response.error.errorCode || response.statusText;
        this.toastrService.error(message);
      } else if (response.status === 502 || response.status === 503) {
        // TODO Handle 503 from backend
        // TODO Handle 502 from backend
        this.toastrService.error('Server not available');
      } else if (response.status >= 500) {
        // TODO Handle 500 from backend
        this.toastrService.error('Unexpected server error: ' + response.statusText);
      } else {
        console.error('Error connecting to server: ' + response.message);
        this.toastrService.error('UNKNOWN_ERROR');
      }
      return throwError(response);
    }));
  }

}
