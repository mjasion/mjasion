#!/bin/bash

hugo version
hugo mod tidy
hugo mod npm pack
#npm install
pnpm install
#
if [ -n "$CF_PAGES_URL" ]; then
  hugo --gc --minify -b "$CF_PAGES_URL"
else
  hugo --gc --minify
fi
cp static/_redirects public/_redirects
