import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {catchError} from 'rxjs/operators';
import {ToastrService} from './toastr.service';
import {ErrorCode, ErrorResponse} from './model';
import {Router} from '@angular/router';
import {UserService} from "./user.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router,
              private oAuthService: OAuthService,
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
      if (response.status === 401) {
        // Unauthorized, must login
        this.oAuthService.initLoginFlow();
      } else if (response.status >= 400 && response.status < 500 && response.error) {
          const error = response.error as ErrorResponse;
          if (error.errorCode === ErrorCode.IN_GAME_ERROR) {
            this.toastrService.error(error.gameId + '.errors.' + error.reasonCode);
          } else {
            this.toastrService.error('errors.' + error.errorCode);
          }
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
