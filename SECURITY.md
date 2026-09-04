# Security Policy

## Scope

The Quality Engineering Academy is a static educational application. It does not require user accounts, a backend service, or collection of personal data for its core operation.

## Reporting a vulnerability

If you identify a security issue in the application, dependency configuration, build pipeline, or published artifacts, please report it privately to the repository maintainer before opening a public issue.

Include, when possible:

- affected file or URL;
- reproduction steps;
- impact assessment;
- suggested mitigation.

Do not include credentials, personal data, or other secrets in an issue or pull request.

## Dependency and release hygiene

Release artifacts should be generated from a clean checkout using the build and audit scripts in `tools/` (see CONTRIBUTING.md), run locally before tagging a release.
