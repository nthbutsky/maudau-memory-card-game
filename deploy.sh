#!/usr/bin/env sh
# abort on errors
set -e
# build
npm run build
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
git add -A
git commit -m 'deploy'
git subtree push --prefix dist origin gh-pages
