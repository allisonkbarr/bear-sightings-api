# Bear Sightings API

An API that allows users to submit bear sightings as they happen and to query the database for recent sightings with certain filters.

## Getting Started

### Prerequisites

This project is built with Express and SQLite3.
Install the dependencies by running `yarn` before starting the server.

### Running the server

Simply start the server from your terminal by calling `node index.js`. The server will run on port 3000 by default.
I suggest [Postman](https://www.getpostman.com/) for hitting the endpoints.

Report a Bear Sighting:
- POST http://localhost:3000/sighting
- JSON body params:
  - bear_type
  - zip_code
  - num_bears
  - notes (optional)

Query for a Specific Bear Sighting by ID:
- GET http://localhost:3000/sighting/:id

Search/View All Bear Sightings
- GET http://localhost:3000/sighting/search
- allowed query params:
  - bear_type
  - zip_code
  - start_date (format YYYY-MM-DD)
  - end_date (format YYYY-MM-DD)
  - sort (only allowed value is 'num_bears' - default sort is 'created_at')

## Running the tests

`yarn test`
