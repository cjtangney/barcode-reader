# Voucher Redemption

Application will keep track of all voucher codes and will allow the user to determine if a given voucher has been redeemed. If a given voucher is valid and has not yet been redeemed, the application will automatically update the backend to keep track of the voucher submission.

## Pre-requisites

This application is built using the MERN stack and as such requires that the following technologies are installed:

* Node.js
* MongoDB

## Assumptions

Prior to installing the application, ensure that you have the most recent versions of Node.js and MongoDB installed on your machine. Some additional assumptions:

* At the moment, the application proxy is configured to `http://localhost:3001/`. Ensure that this port number matches the `API_PORT` variable in your `server.js` file.
* MongoDB instance should be configured to the default port of `27017`.
* Currently, the MongoDB route is pointed at the `barcode-reader` collection. Ensure that the `dbRoute` variable in the `server.js` file contains the correct route to your collection.
    * At the moment, creation of new collections is not supported.
* Application is currently being served over `localhost:3000`.

## Installation

After preparing your environment...

* Clone the repo into your working directory.
* cd into the `server` directory.
* Run `npm install` from the server directory.
* Run `npm start` from the server directory. This will initialize connection to the backend.
* cd into the `root`.
* Run `npm install` from the root directory.
* Run `npm start` from the root directory.