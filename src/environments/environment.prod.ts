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
