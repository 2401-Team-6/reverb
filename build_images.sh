#!/bin/bash

echo "Building PSQL Docker Image"
cd db
docker build . -t team6/database

echo "Building Functions Docker Image"
cd ../sample
npm install && npm run build
docker build . -t team6/functions

echo "Building Workers Docker Image"
cd ../workers
npm install && npm run build
docker build . -t team6/workers

echo "Building Ingress Docker Image"
cd ../ingress
npm install && npm run build
docker build . -t team6/ingress