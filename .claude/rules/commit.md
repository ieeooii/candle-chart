## Commit convention

This repository enforces its commit convention with commitlint.

- Read the rules before committing: `npx commitlint --print-config json`
- Validate a message before using it: `printf '%s' "<message>" | npx commitlint`
  (exit 0 = valid)
- If the commit-msg hook rejects a commit, fix the rules named in brackets
  (e.g. `[subject-case]`) and retry. Never use `git commit --no-verify`.