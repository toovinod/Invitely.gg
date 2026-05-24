// Enforces Conventional Commits on every git commit message.
// Hooked up via .husky/commit-msg.
//
// Allowed types match the table in CONTRIBUTING.md:
//   feat | fix | docs | refactor | chore | perf | test | build | ci | revert
//
// Examples:
//   feat: add scalable invitation batching
//   fix(calendar): handle DST boundaries in agenda view
//   docs: update environment variable reference
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "refactor",
        "chore",
        "perf",
        "test",
        "build",
        "ci",
        "revert",
        "style",
      ],
    ],
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    // Body / footer line length — disabled. Most modern OSS projects skip
    // these because natural English bullets and URLs trip the default 100
    // limit constantly. Editors handle wrapping for display.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};

export default config;
