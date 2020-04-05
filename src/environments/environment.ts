// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {AuthConfig, OAuthModuleConfig} from 'angular-oauth2-oidc';

export const environment: Environment = {
  production: false,
  auth: {
    issuer: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_s6Ypfd935',
    loginUrl: 'https://gwt-test.auth.eu-west-1.amazoncognito.com/oauth2/authorize',
    tokenEndpoint: 'https://gwt-test.auth.eu-west-1.amazoncognito.com/oauth2/token',
    clientId: '376e8rt8oopbqs5k5h2mnvl0nl',
    responseType: 'code',
    scope: 'openid profile',
    oidc: true,
    redirectUri: window.location.origin,

    showDebugInformation: true
  }
};

export interface Environment {
  production: boolean;
  auth: AuthConfig;
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
