#!/bin/bash
set -e

# Initial commit
git add .
git reset src/lib src/components src/app/api .env.local
# .env.local shouldn't be tracked anyway, but let's be sure
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "chore: Initial setup and architecture"

# GitHub repo creation
# Ensure your gh is authenticated with appropriate scopes
gh repo create cognify-v2 --private --source=. --remote=origin --push

# PR 1
git checkout -b feat/core-llm
git add src/lib/llm src/lib/schema
git commit -m "feat: core llm abstraction and schemas" || true
git push -u origin HEAD
gh pr create --title "feat: Core LLM & Schema" --body "Contains the LLM provider interface and schemas."

# PR 2
git checkout main
git checkout -b feat/agents-orchestrator
git add src/lib/agents src/lib/pipeline
git commit -m "feat: AI Agents and orchestrator" || true
git push -u origin HEAD
gh pr create --title "feat: Agents and Orchestrator" --body "Contains Intent, UX, and Renderer agents along with the pipeline."

# PR 3
git checkout main
git checkout -b feat/api-routes
git add src/lib/auth src/lib/rate-limit src/app/api
git commit -m "feat: API Routes and server config" || true
git push -u origin HEAD
gh pr create --title "feat: Server API Routes" --body "Contains Auth config, rate limiter, and backend Next.js API endpoints."

# PR 4
git checkout main
git checkout -b feat/ui-blocks-layouts
git add src/components/blocks/layout src/components/blocks/content
git commit -m "feat: Layout and Content components" || true
git push -u origin HEAD
gh pr create --title "feat: UI Block Components (Part 1)" --body "First batch of layout and content blocks created using React and Tailwind."

# Let's switch back to main to continue development or we can check out the last branch
# We will stay on main and bring all files back, so the user can see everything locally.
# Actually, the user wants "decompose all this work into smaller pull requests for me review",
# so the PRs are the main thing.
git checkout main
# Wait! We need to bring the changes to main locally so the code works?
# Or maybe not: we can leave the last branch checked out or checkout main. We will merge them via GitHub UX later.
# To keep local state intact, let's create a branch 'dev' that has everything.
git checkout -b dev
git merge feat/core-llm --no-edit || true
git merge feat/agents-orchestrator --no-edit || true
git merge feat/api-routes --no-edit || true
git merge feat/ui-blocks-layouts --no-edit || true

