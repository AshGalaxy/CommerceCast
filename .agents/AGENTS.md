# Agent Rules and Guidelines

## Development & Best Practices
- **Frontend & Framework Constraints**: Pay extremely close attention to Next.js App Router rules. 
  - Never mix Server Component configs (e.g. `export const dynamic = 'force-dynamic'`) with Client Components (`'use client'`). Doing so breaks Fast Refresh.
  - Be highly vigilant about unescaped quotes (e.g. `It's` instead of `"It's"`) inside TSX files, as this can cause parsing errors and crash the Turbopack / PostCSS loaders.
  - Never repeat mistakes related to dependencies, frameworks, Next.js, or frontend rendering environments.

## Git & Version Control
- **Commit Granularity**: Make a commit (and push) after each distinct type of change or logical feature. Do not stack too many changes together in a single commit.
- **Commit Messages**: Write concise, descriptive, and proper commit messages that clearly explain the *why* and *what* of the change (e.g., `feat: redesign sticky features component for better scroll tracking`).
