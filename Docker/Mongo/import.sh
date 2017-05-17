#!/usr/bin/env bash

# mongoimport --port 27017 --db boeken --collection boeks --file ./books.json --jsonArray
mongoimport --port 27017 --db boeken --collection auteurs --file ./auteurs.json --jsonArray
