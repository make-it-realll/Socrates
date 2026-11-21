#!/bin/sh
# 用法：sh tools/publish.sh CODE [CODE...]
# 把这几门课加进 tools/published.txt，只构建已发布的课（正在写的草稿不进网站），提交并推到 main 和 gh-pages。
set -e
cd "$(dirname "$0")/.."
for c in "$@"; do grep -qx "$c" tools/published.txt || echo "$c" >> tools/published.txt; done
ONLY=$(paste -sd, tools/published.txt) NODE_PATH=/opt/npm-tools/node_modules node src/build.mjs > /tmp/publish-build.log 2>&1 || { cat /tmp/publish-build.log; exit 1; }; tail -1 /tmp/publish-build.log
files="tools/published.txt docs"
for c in "$@"; do l=$(echo "$c" | tr A-Z a-z); files="$files content/courses/$c.md src/figures/$l.mjs"; done
git add $files
git -c user.name="make-it-realll" -c user.email="225644236+make-it-realll@users.noreply.github.com" commit -q -m "Publish $*

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ChPbXWzbUZA9KUhf3j8xtF"
git push -q origin main
git subtree push --prefix docs origin gh-pages 2>&1 | tail -1
