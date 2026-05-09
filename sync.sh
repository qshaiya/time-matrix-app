#!/bin/bash

# ============================================
# time-matrix sync script
# Usage: bash sync.sh "your commit message"
# ============================================

set -e

# ── Config ──────────────────────────────────
GITHUB_USER="qshaiya"
GITHUB_TOKEN="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"
REPO="time-matrix-app"
BRANCH="main"
REMOTE_URL="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO}.git"

# ── Colors ──────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✔ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✘ $1${NC}"; exit 1; }

# ── Commit message ───────────────────────────
COMMIT_MSG="${1:-update: $(date '+%Y-%m-%d %H:%M')}"

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       time-matrix  sync tool         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ── Step 1: Find project root ────────────────
log "Locating project..."

# If run from anywhere, find the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
ok "Project root: $SCRIPT_DIR"

# ── Step 2: Check git ────────────────────────
log "Checking git setup..."

if [ ! -d ".git" ]; then
  warn "No git repo found, initializing..."
  git init
  git branch -m "$BRANCH"
fi

# Set identity
git config user.email "${GITHUB_USER}@github.com"
git config user.name  "$GITHUB_USER"

# Set remote (update if exists)
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi
ok "Git configured"

# ── Step 3: Sync with remote ─────────────────
log "Syncing with GitHub..."

# Fetch remote silently
git fetch origin "$BRANCH" 2>/dev/null || true

# Check if remote branch exists
if git ls-remote --exit-code origin "$BRANCH" &>/dev/null; then
  # Pull remote changes (rebase to avoid merge commits)
  git rebase "origin/$BRANCH" 2>/dev/null || {
    warn "Rebase conflict detected, using local version..."
    git rebase --abort 2>/dev/null || true
  }
fi
ok "Synced with remote"

# ── Step 4: Stage & commit ───────────────────
log "Staging changes..."

git add -A

# Check if there's anything to commit
if git diff --cached --quiet; then
  warn "No changes to commit"
else
  git commit -m "$COMMIT_MSG"
  ok "Committed: \"$COMMIT_MSG\""
fi

# ── Step 5: Push ─────────────────────────────
log "Pushing to GitHub..."

git push --set-upstream origin "$BRANCH"
ok "Pushed to https://github.com/${GITHUB_USER}/${REPO}"

# ── Done ─────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           All done! 🎉               ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  Repo: ${BLUE}https://github.com/${GITHUB_USER}/${REPO}${NC}"
echo ""
