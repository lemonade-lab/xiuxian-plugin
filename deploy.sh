#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 获取传递的变量
variable="1.0.0"

if [ "$1" ]; then
    variable=$1
fi

## delete
rm -rf dist/index.js
rm -rf dist/package.json
rm -rf dist/README.md
rm -rf dist/config
rm -rf dist/resources
rm -rf dist/guoba.support.js

npm run format

## post
npm run build
cp -rf README.md dist/README.md
cp -rf package.json dist/package.json
cp -rf config dist/config
cp -rf resources dist/resources
cp -rf guoba.support.js dist/guoba.support.js

#--------------
# 推送
#--------------
cd ./dist
git init
git add -A
git commit -m $variable
git push -f git@gitee.com:ningmengchongshui/xiuxian-plugin.git master:build
cd ..  