# Exlint Action

GitHub Action for using [Exlint CLI][exlint-cli-repo-url] and [Exlint application][exlint-app-url]

## Usage

To integrate Exlint into your CI, you must have a token and a group configured.
Go to [app.exlint.io][exlint-app-url] and set your group, and then copy the group ID.
Get your token for CI usage in the [secret management][secret-management-url] page.
Use your group ID and token values as follows:

```yaml
- uses: Exlint/actions@v1.0.0
  with:
      # Your configured group ID - Required
      groupId: ''

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
