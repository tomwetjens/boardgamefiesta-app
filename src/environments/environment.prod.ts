import {Environment} from './environment.model';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://api.tomsboardgames.com',
  wsBaseUrl: 'wss://api.tomsboardgames.com',
  auth: {
    issuer: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_c5qwAzc0x',
    loginUrl: 'https://auth.tomsboardgames.com/oauth2/authorize',
    tokenEndpoint: 'https://auth.tomsboardgames.com/oauth2/token',
    clientId: '39334dh8ifidq5dpmnch2vnopr',
    responseType: 'code',
    scope: 'openid profile',
    oidc: true,
    redirectUri: window.location.origin,
    logoutUrl: 'https://auth.tomsboardgames.com/logout?client_id=39334dh8ifidq5dpmnch2vnopr&logout_uri=' + window.location.origin
  }
};
