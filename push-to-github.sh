#!/bin/bash
# ==============================================
# STEP 1: Create repo on GitHub (run this first)
# ==============================================

TOKEN="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"
USERNAME="qshaiya"
REPO="time-matrix-app"

echo "📦 Creating GitHub repository..."
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO\",\"description\":\"Eisenhower Matrix time management app built with React\",\"private\":true}"

echo ""
echo "⬆️  Pushing code..."
git remote add origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/$REPO.git"
git push -u origin main

echo ""
echo "✅ Done! Visit: https://github.com/$USERNAME/$REPO"
