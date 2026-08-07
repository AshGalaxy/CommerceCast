# Agent Rules and Guidelines

## Development & Best Practices
- **Frontend & Framework Constraints**: Pay extremely close attention to Next.js App Router rules. 
  - Never mix Server Component configs (e.g. `export const dynamic = 'force-dynamic'`) with Client Components (`'use client'`). Doing so breaks Fast Refresh.
  - Be highly vigilant about unescaped quotes (e.g. `It's` instead of `"It's"`) inside TSX files, as this can cause parsing errors and crash the Turbopack / PostCSS loaders.
  - **Smooth Scrolling**: Never apply `scroll-behavior: smooth` or `@apply scroll-smooth` on the `<html>` element via CSS. Next.js App Router detects this and emits a browser warning because it conflicts with the router's own scroll restoration. Instead, always add `data-scroll-behavior="smooth"` to the `<html>` element in `layout.tsx`.
  - Never repeat mistakes related to dependencies, frameworks, Next.js, or frontend rendering environments.

## Git & Version Control
- **Commit Granularity**: Make a commit (and push) after each distinct type of change or logical feature. Do not stack too many changes together in a single commit.After any type of change in the code, the commit should be made to the repository. 
- **Commit Messages**: Write concise, descriptive, and proper commit messages that clearly explain the *why* and *what* of the change (e.g., `feat: redesign sticky features component for better scroll tracking`).
