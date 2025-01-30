#!/bin/bash

hugo mod tidy
hugo mod npm pack
#npm install
pnpm install
#
if [ -n "$CF_PAGES_URL" ]; then
  hugo --gc --minify --cleanDestinationDir -b "$CF_PAGES_URL"
else
  hugo --gc --minify --cleanDestinationDir
fi
cp static/_redirects public/_redirects
