#!/bin/bash

echo "This deploy is to a machine dedicated needed with nginx and nodejs"

rm -fr /var/www/html/*

cd tmp
#mkdir dist
mkdir build

npm install
npm run build

mv ./build/* /var/www/html/