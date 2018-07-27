#!/bin/bash

echo "This deploy is to a machine dedicated needed with nginx and nodejs"

rm -fr /var/www/html/*

cd tmp
mkdir dist

npm install

mv ./* /var/www/html/
