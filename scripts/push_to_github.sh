#!/usr/bin/env bash
# Helper script to push Urbano Nursery to GitHub
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/push_to_github.sh <github-repo-url>"
  echo "Example: ./scripts/push_to_github.sh https://github.com/yourusername/urbano-nursery.git"
  exit 1
fi

REPO_URL="$1"

echo "==> Configuring remote origin: $REPO_URL"
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git branch -M main

echo "==> Pushing to $REPO_URL (branch: main)..."
git push -u origin main

echo "==> Successfully pushed to GitHub!"
