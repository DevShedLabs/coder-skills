# RuboCop (Ruby)

## Detect

- Config: `.rubocop.yml` at repo root (may `inherit_from` other files, or `inherit_gem` a shared style gem like `rubocop-shopify`/`rubocop-rails`).
- Project is Ruby if `Gemfile` or `*.gemspec` exists.

Standard (`standardrb`) is a comparable zero-config alternative some projects use instead — if `.standard.yml` or a `standard` Gemfile entry exists, that project has opted out of RuboCop's configurability on purpose; don't introduce RuboCop alongside it.

## Detect the binary

Prefer the project-local Bundler install:

```bash
bundle exec rubocop --version
```

If missing, it's a project dependency issue — tell the user to add `gem 'rubocop', require: false` to the `Gemfile` and run `bundle install`, don't install a global gem as a workaround (same reasoning as eslint: version mismatches between a global gem and the project's configured cops cause confusing results).

If the project truly has no Bundler setup yet:

```bash
gem install rubocop
```

## Scaffold a config

No existing config: RuboCop runs with sane built-in defaults even with no `.rubocop.yml` — don't assume a config file must exist before the first run. If the user wants one to customize:

```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.3
```

`NewCops: enable` opts into newly-added cops automatically — without it, RuboCop prints a stderr warning listing every new cop added since the installed version, on every run (see Gotchas). Setting it explicitly (`enable` or `disable`) silences that noise either way.

## Run

```bash
bundle exec rubocop --format json <path...> > out.json 2> err.txt
```

Keep stderr redirected to its own file/stream — don't merge it into stdout (`2>&1`) before parsing, since the "new cops not configured" notice (see Gotchas) lands on stderr and will corrupt JSON parsing if merged in.

## Parse

```json
{
  "metadata": {"rubocop_version": "1.91.0"},
  "files": [{
    "path": "bad.rb",
    "offenses": [{
      "severity": "convention",
      "message": "...",
      "cop_name": "Layout/SpaceAfterComma",
      "corrected": false,
      "correctable": true,
      "location": {"start_line": 1, "start_column": 17, "line": 1, "column": 17}
    }]
  }],
  "summary": {"offense_count": 7, "target_file_count": 1, "inspected_file_count": 1}
}
```

- `severity` is a string, one of (ascending): `convention`, `warning`, `error`, `fatal` (a `refactor` level also exists for complexity cops). Most findings in a default config are `convention` — don't assume "convention" means low-priority-ignore; it's RuboCop's default bucket for style/naming/layout cops, not a signal of unimportance.
- `summary.offense_count` is the total to report; `files[].offenses` is per-file detail.
- `correctable: true` means `--autocorrect` can fix it; `corrected: true` (only meaningful when you ran with `--autocorrect`) means it actually was fixed in this run.

## Exit codes

- `0` — no offenses
- `1` — offenses found (normal, not a tool failure) — **this persists even after `--autocorrect`** if any remaining offense has `correctable: false`; don't treat exit 1 post-fix as "the fix failed," check `corrected`/`correctable` per offense instead.
- other — a real RuboCop or config error (e.g. malformed `.rubocop.yml`)

## Fix

```bash
bundle exec rubocop --autocorrect --format json <path...> > out.json 2> err.txt
```

`--autocorrect` (formerly `-a`) applies safe corrections only. `--autocorrect-all` (formerly `-A`) applies unsafe/riskier ones too — confirm with the user before using `-A`, since "unsafe" here means RuboCop itself flags the correction as capable of changing behavior, not just formatting.

## Gotchas

- **New-cops stderr warning**: when the installed RuboCop version has added cops since the project's config was last updated, every run prints a long stderr block listing each unconfigured new cop (as seen when testing this). This is not an error — it's advisory — but it will look alarming in raw output. Summarize it as "N new cops available, not yet configured" rather than pasting the whole block, and suggest `NewCops: enable` in `.rubocop.yml` to silence it going forward.
- `bundle exec` matters — running bare `rubocop` when a `Gemfile.lock` pins a specific version can silently run a different (globally installed) version with different cops/defaults than the project expects.
- Offense counts can *increase* after `--autocorrect` on a messy file: fixing one issue (e.g. adding a missing magic comment) shifts line numbers and can surface cops that only apply once the file is otherwise well-formed. Don't treat a higher post-fix count as the tool malfunctioning — re-read `corrected`/`correctable` per offense rather than comparing raw totals before/after.
