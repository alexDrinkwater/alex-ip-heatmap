# Alex's IP Heatmap

## Demo

Please note demo is hosted on heroku free plan so can take a few seconds to start.

[Demo can be found here](http://ip-heatmap.herokuapp.com/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `yarn test` or `npm test` to execute the unit tests for the frontend and backend.

## Updating the Database with new data

Replace the zip file in ```server/db``` with the new file. Delete "ip.db" in the db directory. Upon next start the .db file will be regenerated
with the new data.
