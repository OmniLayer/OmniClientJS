#!/bin/bash
set -x
mkdir -p build
rm -rf build/jsdoc
jsdoc --readme JSDocIndex.md --package package.json -d ./build/jsdoc lib/OmniClient.js

