# Python

- Follow **PEP 8** (line length 88, Black default).
- All functions must have **type annotations**. Check with `mypy --strict`. *(py.1 — error)*
- Use **parameterized queries** (`%s` placeholders). Never f-string SQL. *(py.2 — error)*
- Use `yaml.safe_load`. Never bare `yaml.load()`. *(py.3 — error)*
- **Never `pickle.load()` from untrusted sources.** *(py.4 — error)*
- No `os.system()` or `shell=True`. Use `subprocess.run` with list args. *(py.5 — prefer)*
- Use **dataclasses / Pydantic / TypedDict** for structured data. No bare dicts.
- Use `with` for all resource management.
- Use Pydantic models at API boundaries for validation.
- Use `venv` / `uv` / `poetry` with a pinned lock file.
- Test with `pytest` + `pytest-cov`, targeting ≥ 90% coverage.
