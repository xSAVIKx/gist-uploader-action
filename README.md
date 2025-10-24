# Gist Uploader Action

Upload a file from your repository to an existing GitHub Gist. This action updates the contents of a
file in a gist (and optionally its description) and returns the gist URL.

- Typical use cases: publish generated artifacts (configs, code samples, docs snippets) directly to
  a gist on every push or release.
- Requires a Personal Access Token (classic) with the `gist` scope.

## Example usage

1) Create a repository secret that holds your token, e.g. `GIST_TOKEN`.
    - Create a Personal Access Token (classic) with scope: `gist`
      at https://github.com/settings/tokens
    - Add it as a secret in your repository: Settings → Secrets and variables → Actions → New
      repository secret

2) Add a workflow (e.g. `.github/workflows/update-gist.yml`):

```yaml
name: Update Gist

on:
  push:
    branches: [ main ]

jobs:
  update-gist:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Update gist from file
        id: gist
        uses: xSAVIKx/gist-uploader-action@v0.1.3   # pin to a released version
        with:
          token: ${{ secrets.GIST_TOKEN }}
          gist_id: 0123456789abcdef0123456789abcdef  # ID of the target gist
          file_path: path/to/file.txt                # path in your repo to upload
          # Optional inputs:
          # gist_description: "New description for the gist"
          # gist_file_name: "file-name-in-gist.txt" # defaults to the basename of file_path

      - name: Print gist URL
        run: |
          echo "Gist URL: ${{ steps.gist.outputs.url }}"
```

Notes:

- Required inputs: `token` (PAT with `gist` scope), `gist_id`, `file_path`.
- Optional inputs: `gist_description`, `gist_file_name` (defaults to the basename of `file_path`).
- Output: `url` — the URL of the updated gist.

## How to develop

This section is for contributors to the action.

### Required tools and how to install them

- Bun (recommended) — for dependency management and building
    - macOS: `brew install oven-sh/bun/bun` or `curl -fsSL https://bun.sh/install | bash`
    - Linux: `curl -fsSL https://bun.sh/install | bash`
    - Windows: `winget install Oven-sh.Bun`
- Git
- (Optional) Node.js 20+ — the action runtime on GitHub is Node 24, but you typically don’t need
  Node locally if you use Bun

### Install dependencies, build, and run

- Install deps:
    - `bun install`

- Lint/format/check (Biomé is included in devDependencies):
    - Format: `bun run format`
    - Lint: `bun run lint`
    - Check: `bun run check`

- Build the action (outputs to `dist/`):
    - `bun build src/index.ts --outdir dist --target node`

- Run locally (advanced): the action reads inputs from environment variables prefixed with `INPUT_`.
    - Unix-like shells:
      ```bash
      export INPUT_TOKEN=ghp_xxx
      export INPUT_GIST_ID=0123456789abcdef0123456789abcdef
      export INPUT_FILE_PATH=path/to/file.txt
      # Optional:
      # export INPUT_GIST_DESCRIPTION="My gist"
      # export INPUT_GIST_FILE_NAME="snippet.txt"
      bun run src/index.ts
      ```
    - Windows PowerShell:
      ```powershell
      $env:INPUT_TOKEN = "ghp_xxx"
      $env:INPUT_GIST_ID = "0123456789abcdef0123456789abcdef"
      $env:INPUT_FILE_PATH = "path/to/file.txt"
      # Optional:
      # $env:INPUT_GIST_DESCRIPTION = "My gist"
      # $env:INPUT_GIST_FILE_NAME = "snippet.txt"
      bun run src/index.ts
      ```

That’s it — commit your changes and open a PR. The compiled entrypoint for the marketplace action is
`dist/index.js` as referenced in `action.yml`. Ensure `dist/` is updated in your PR when changing
source files.
