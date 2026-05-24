# Contributing to Invitely.gg

Thanks for your interest in contributing. We value **clarity, correctness, and simplicity** over cleverness.

---

## Development Philosophy

- Server-first architecture
- Explicit data flow
- Minimal abstractions
- Type safety across all boundaries
- Predictable performance over premature optimization

Changes that violate these principles will likely be rejected.

---

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- PostgreSQL
- Git

---

## Workflow

1. **Fork** the repository and clone your fork.

2. **Create a feature branch:**

```bash
git checkout -b feat/your-feature-name
```

3. **Install dependencies:**

```bash
pnpm install
```

4. **Set up your environment** — copy `.env.example` to `.env` and fill in the values.

5. **Make your changes**, keeping commits focused and atomic.

6. **Commit using [Conventional Commits](https://www.conventionalcommits.org):**

```bash
git commit -m "feat: add scalable invitation batching"
git commit -m "fix: resolve duplicate send on retry"
git commit -m "docs: update environment variable reference"
```

7. **Push your branch:**

```bash
git push origin feat/your-feature-name
```

8. **Open a Pull Request** against `main` with a clear description of what changed and why.

---

## Code Style

- TypeScript strict mode — no `any`
- Prefer server components; use `"use client"` only when necessary
- Co-locate types with the code that uses them
- Name things clearly; avoid abbreviations

---

## Commit Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change with no behavior change |
| `chore` | Tooling, config, dependencies |
| `perf` | Performance improvement |

---

## Questions?

Open a [Discussion](https://github.com/Vinodbiradar09/Invitely.gg/discussions) before opening a PR for large changes it saves everyone time.
