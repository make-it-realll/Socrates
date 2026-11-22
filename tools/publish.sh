#!/bin/sh
# 用法：sh tools/publish.sh CODE [CODE...] [thread:slug ...]
# 只发布这里点名的课/概念线：在一个干净的 git worktree（HEAD）里，放进这几页的当前文件和已 git add 的改动，
# 构建全部已发布的课，再把 docs 拷回来提交。别的 session 正在改的页面（工作区里没提交的改动）不会进网站。
set -e
cd "$(dirname "$0")/.."
ROOT=$(pwd)
codes=""; files="tools/published.txt docs"
for a in "$@"; do
  case "$a" in
    thread:*) s=${a#thread:}; files="$files content/threads/$s.md"; [ -f "src/figures/thread-$s.mjs" ] && files="$files src/figures/thread-$s.mjs" ;;
    *) grep -qx "$a" tools/published.txt || echo "$a" >> tools/published.txt
       l=$(echo "$a" | tr A-Z a-z); codes="$codes $a"; files="$files content/courses/$a.md"; [ -f "src/figures/$l.mjs" ] && files="$files src/figures/$l.mjs" ;;
  esac
done
WT=$(mktemp -d /tmp/publish-wt.XXXXXX)
git worktree add -q --detach "$WT" HEAD
# 已 git add 的改动（共享的 build/样式/目录等）和这次点名的文件，拷进 worktree
for f in $(git diff --cached --name-only) $files; do
  [ "$f" = docs ] && continue
  if [ -e "$f" ]; then mkdir -p "$WT/$(dirname "$f")"; cp "$f" "$WT/$f"; fi
done
( cd "$WT" && ONLY=$(paste -sd, tools/published.txt) NODE_PATH=/opt/npm-tools/node_modules node src/build.mjs > /tmp/publish-build.log 2>&1 ) || { cat /tmp/publish-build.log; git worktree remove --force "$WT"; exit 1; }
tail -1 /tmp/publish-build.log
rm -rf docs && cp -r "$WT/docs" docs
git worktree remove --force "$WT"
git add $files
git -c user.name="make-it-realll" -c user.email="225644236+make-it-realll@users.noreply.github.com" commit -q -m "Publish $*

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ChPbXWzbUZA9KUhf3j8xtF"
git push -q origin main
git subtree push --prefix docs origin gh-pages 2>&1 | tail -1
