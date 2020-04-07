import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {catchError} from 'rxjs/operators';
import {MessageService} from './message.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(private oAuthService: OAuthService, private messageService: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.apiBaseUrl) && this.oAuthService.hasValidIdToken()) {
      const token = this.oAuthService.getIdToken();
      const header = 'Bearer ' + token;

      const headers = req.headers.set('Authorization', header);

      req = req.clone({headers});
    }

    return next.handle(req).pipe(catchError(response => {
      if (response.status < 500) {
        // TODO Handle 4xx with code
        this.messageService.error('Error: ' + response.statusText);
      } else if (response.status === 502 || response.status === 503) {
        // TODO Handle 503 from backend
        // TODO Handle 502 from backend
        this.messageService.error('Server not available');
      } else {
        // TODO Handle 500 from backend
        this.messageService.error('Unexpected server error: ' + response.statusText);
      }
      return throwError(response);
    }));
  }




}
