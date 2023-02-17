# Exlint Action

GitHub Action for using [Exlint CLI][exlint-cli-repo-url] and [Exlint application][exlint-app-url]

## Usage

To integrate Exlint into your CI, you must have a token and a compliance configured.
Go to [app.exlint.io][exlint-app-url] and set your compliance, and then copy the compliance ID.
Get your token for CI usage in the [secret management][secret-management-url] page.
Use your compliance ID and token values as follows:

```yaml
- uses: Exlint/actions@v1.0.1
  with:
      # Your configured compliance ID - Required
      complianceId: ''

      # Your token for CI - Required
      token: ''
```

## License

This project is released under the [MIT License][license-url].

<!-- Links: -->

[exlint-cli-repo-url]: https://github.com/Exlint/cli#readme
[exlint-app-url]: https://app.exlint.io
[secret-management-url]: https://app.exlint.io/account-settings/secret-management
[license-url]: https://github.com/Exlint/actions/blob/main/LICENSE
