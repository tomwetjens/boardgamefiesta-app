// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {Environment} from './environment.model';

export const environment: Environment = {
  production: false,

  apiBaseUrl: 'http://localhost:8080',
  wsBaseUrl: 'ws://localhost:8080',

  auth: {
    issuer: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_4FuZdxo27',
    loginUrl: 'https://auth2.boardgamefiesta.com/oauth2/authorize',
    tokenEndpoint: 'https://auth2.boardgamefiesta.com/oauth2/token',
    clientId: '75mphvul79khilegesecif6o0k',
    responseType: 'code',
    scope: 'openid profile',
    oidc: true,
    redirectUri: window.location.origin,
    logoutUrl: 'https://auth2.boardgamefiesta.com/logout?client_id=75mphvul79khilegesecif6o0k&logout_uri=' + window.location.origin
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
