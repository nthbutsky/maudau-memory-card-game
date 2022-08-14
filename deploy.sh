#!/usr/bin/env sh
set -e
npm run build
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:nthbutsky/maudau-memory-card-game.git chief:gh-pages
cd-