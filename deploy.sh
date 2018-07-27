#!/bin/bash

echo "This deploy is to a machine dedicated needed with nginx and nodejs"

mkdir dist

npm install
npm run build-min

mv ./* /var/www/html/
