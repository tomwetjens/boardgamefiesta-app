import {Environment} from './environment.model';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://api.boardgamefiesta.com',
  wsBaseUrl: 'wss://api.boardgamefiesta.com',
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
