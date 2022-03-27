# BoardGameFiesta.com App

## Run locally
```
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```
Then navigate to http://localhost:4200

## Deploy to AWS
Assumes you ran `npm run build -- --prod`:
```
cd aws
./deploy.sh prod
```
Navigate to https://boardgamefiesta.com

Or to deploy to a different environment, e.g. dev:
```
npm run build -- --configuration development
cd aws
./deploy.sh dev
```
Navigate to https://dev.boardgamefiesta.com

## License
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007
