#!/bin/bash

hugo mod tidy
hugo mod npm pack
npm install

hugo --gc --minify --cleanDestinationDir
cp static/_redirects public/_redirects
