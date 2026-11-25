# Contributing

Thank you for helping. One browser is one file in `data/browsers/`, named after its slug, for example `data/browsers/arc-reborn.json`.

## The rules

1. **Facts only, from public sources.** Every value must be checkable on the browser's own website, repository, release notes or app store page. Put those links in `sources`.
2. **No scores, rankings or opinions.** Keep `notes` short and factual.
3. **One browser per pull request** where you can. It keeps review quick.
4. **Makers are welcome** to add or correct their own browser. Say so in the pull request.

## The fields

| Field | Required | What goes in it |
| --- | --- | --- |
| `name` | yes | The browser's name, as its maker writes it |
| `slug` | yes | Lower case, digits and hyphens. Matches the file name |
| `website` | no | Its home page, https, or `null` |
| `repository` | no | Its source code, https, or `null` |
| `engine` | yes | `chromium`, `webkit`, `gecko`, `mixed` (more than one) or `unknown` |
| `engine_detail` | no | Free text, for example `Chromium (Electron)` or `Chromium (CEF) + WebKit` |
| `platforms` | yes | Any of `macos`, `windows`, `linux`, `ios`, `android`, where it runs or its maker says it will. Say in `notes` if one isn't out yet. Can be empty |
| `licence` | no | An SPDX id such as `MIT`, `Proprietary`, or `null` if unknown |
| `open_source` | no | `true`, `false`, or `null` if unknown |
| `status` | yes | `active` (downloadable and updated in the last six months), `announced` (not downloadable yet), `paused`, `discontinued` or `unknown` |
| `maturity` | no | `stable`, `beta`, `alpha` or `pre-alpha`, as the maker labels it |
| `price` | no | For example `Free`, or `Free, Pro $5 a month` |
| `listed_in` | no | Other lists that include it |
| `sources` | yes | At least one https link that backs the values above |
| `checked` | no | The date you checked it, `YYYY-MM-DD` |
| `notes` | no | One or two factual sentences, or `null` |

## Before you open the pull request

```sh
node scripts/validate.mjs   # checks every file
node scripts/build.mjs      # rebuilds browsers.json, browsers.csv and the README table
```

Commit the rebuilt files with your change. If you can't run them, open the pull request anyway and a maintainer will.

## Leads

`data/leads.json` holds browsers seen on other lists that nobody has checked yet. To promote one, check it against its own pages, add its file, and remove it from the leads in the same pull request.
