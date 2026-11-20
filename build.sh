#!/bin/bash
# Gera o site em docs/ (publicado pelo GitHub Pages) e a prévia em dist/index.html. Uso: ./build.sh
set -e
cd "$(dirname "$0")"
[ -e node_modules ] || ln -s ${NPM_TOOLS:-/opt/npm-tools/node_modules} node_modules
node build.mjs
