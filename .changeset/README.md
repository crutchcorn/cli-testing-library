# Changesets

Add a changeset for every pull request that changes the published package:

```sh
pnpm changeset
```

Choose `cli-testing-library`, select the appropriate semantic-version bump, and
write a short user-facing summary. Documentation, test-only, and internal
changes do not need a changeset.

Changes merged to `main` are collected into an automated version pull request.
Merging that pull request publishes the package to npm.
