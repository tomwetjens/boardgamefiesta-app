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

## License
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007
