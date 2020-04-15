import {Environment} from './environment.model';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://gwt-api.wetjens.com',
  wsBaseUrl: 'wss://gwt-api.wetjens.com',
  auth: {
    issuer: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_c5qwAzc0x',
    loginUrl: 'https://gwt.auth.eu-west-1.amazoncognito.com/oauth2/authorize',
    tokenEndpoint: 'https://gwt.auth.eu-west-1.amazoncognito.com/oauth2/token',
    clientId: '39334dh8ifidq5dpmnch2vnopr',
    responseType: 'code',
    scope: 'openid profile',
    oidc: true,
    redirectUri: window.location.origin,
    logoutUrl: 'https://gwt.auth.eu-west-1.amazoncognito.com/logout?client_id=39334dh8ifidq5dpmnch2vnopr&logout_uri=' + window.location.origin
  }
};
