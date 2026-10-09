# CSVX reference: formulas, values, styles, printing

Load with `read_skill_file` (skill `csvx`). Everything here was checked against the engine.

## Formula grammar (CSVX Core 1.0)

- A formula is text starting with `=`. Operators by precedence: unary `-`/`+`, postfix `%`, `* /`, `+ -`, then comparisons `= != < <= > >=` (**use `=`, `<`, `<=`, `>`, `>=` only — `!=` currently fails to parse**; swap `IF` branches instead).
- Functions (case-insensitive): `SUM(range, …)`, `COUNT(range, …)`, `IF(test, then, else)`, `ROUND(number, digits)`, `ABS(number)`. `IF` evaluates only the chosen branch. `ROUND` rounds half away from zero (`ROUND(2.5,0)` = 3, `ROUND(-2.5,0)` = -3).
- References: `B2`, `$B$2`, `$B2`, `B$2`; ranges `B2:B10`; other sheets `Sales!B2`, `'Q 1'!B2:B10` (single quotes, doubled to escape). No whole-column/row ranges in formulas.
- Literals: numbers (`2`, `1.5`), strings in double quotes (`"yes"`), `TRUE` / `FALSE`.
- Comparison results are booleans that behave as 1/0 in arithmetic.
- Names that aren't a function, `TRUE`/`FALSE` or a cell are workbook *named ranges*; an undeclared name is `#NAME`. The tools can't create named ranges.

### Error values

| Shown | Cause |
|---|---|
| `#DIV0` | division by zero |
| `#VALUE` | text (or another invalid operand) used in arithmetic |
| `#NAME` | unknown function or name — including every function that isn't one of the five |
| `#REF` | the sheet doesn't exist, or the cell a reference pointed to was deleted (the stored formula then contains `#REF!`) |
| `#CYCLE` | a formula depends on itself, directly or through other cells |

Errors propagate: one bad cell makes every formula that reads it an error. Fix the source, not the symptom.

### Verified patterns

Data in rows 2–10 of columns B (amount), C (prior), D (price), E (qty):

| Goal | Formula |
|---|---|
| line total | `=D2*E2` |
| share of total (format `0.0%`) | `=B2/SUM($B$2:$B$10)` |
| change vs prior (format `0.0%`) | `=IF(C2=0,0,(B2-C2)/C2)` |
| running total | `=SUM($B$2:B2)` (fill each row) |
| average | `=ROUND(SUM(B2:B10)/COUNT(B2:B10),2)` |
| tiers | `=IF(B2>=100,"high",IF(B2>=50,"mid","low"))` |
| both conditions | `=IF((B2>50)*(C2>50),"both","no")` |
| either condition | `=IF((B2>50)+(C2>50)>0,"yes","no")` |
| not equal | `=IF(B2=C2,0,1)` |
| money rounding | `=ROUND(D2*E2*1.0825,2)` |
| total in another sheet | `=SUM(Sales!B2:B10)` |
| ratio across sheets | `=SUM(Sales!C2:C10)/SUM(Sales!B2:B10)` |
| text match | `=IF(A2="Widget","yes","no")` |

Results of decimal arithmetic keep their digits (`0.50`, `10.00`); wrap in `ROUND(…, n)` when you want a fixed number of places.

## Values written to cells

| Text you write | Stored as |
|---|---|
| `42`, `-7` | integer |
| `12.5`, `0.25` | decimal (needs digits after the point; no exponent) |
| `true`, `false` | boolean (lower case) |
| empty | blank (distinct from `0` and from empty text) |
| `2026-09-22` | text, unless the column is typed as a date |
| `$5`, `1,000`, `5%`, `007`, `+5`, `1e3` | **text** — `SUM`/`COUNT` ignore it; ids like ZIP codes stay intact |
| `=…` | a formula (its calculated value shows in the cell) |

## Styles (`format`)

`style` merges into the cell's existing style; `null` removes a property; the same style is reused across cells, so formatting a big range is cheap.

- `font`: `bold`, `italic`, `underline` (booleans), `size` (points, a number such as `14` or `10.5`; default 11), `color` (`#RRGGBB`)
- `fill`: `color`
- `alignment`: `horizontal` (`left` | `center` | `right`), `wrapText` (boolean)
- `border`: `{style, color}` for all four edges, or per edge `{top|right|bottom|left: {style, color}}`; `style` is `none | thin | medium | thick | dashed | dotted | double`
- `numberFormat`: see below

A larger `size` grows each row it touches to fit (about 1.3 × the size in points — 24 pt text gives a 31.5 pt row) and the new height is saved in the file, so printing and Excel export match; lowering or clearing the size shrinks the row again, unless the user set that row taller by hand. Imported Excel files may also carry a font name and vertical alignment; those are preserved but not shown.

### Number formats that render

| `numberFormat` | 1234.5 shows | 0.256 shows |
|---|---|---|
| `0` | 1235 | 0 |
| `0.00` | 1234.50 | 0.26 |
| `#,##0` | 1,235 | 0 |
| `#,##0.00` | 1,234.50 | 0.26 |
| `"$"#,##0.00` (also `$#,##0.00`, `"€"#,##0.00`) | $1,234.50 | $0.26 |
| `0%` / `0.0%` | 123450% | 26% / 25.6% |
| `General` | 1234.5 | 0.256 |

A format only changes the display, never the stored value. Suffix text (`#,##0 "USD"`), scientific (`0.00E+00`), date formats and colour codes (`[Red]`) are **not** supported — they fall back to showing the plain value.

## Print settings (`set_print`)

`print` keys (a key set to `null` is removed): `orientation` (`portrait` | `landscape`), `paperSize` (`letter` `legal` `tabloid` `a3` `a4` `a5`), `margins` (`{top,right,bottom,left}` in inches), `scale` (percent), `fitToWidth` / `fitToHeight` (number of pages; `0` = no limit), `area` (`"A1:H20"`), `repeatRows` (`"1:1"`), `repeatColumns` (`"A:A"`), `pageOrder` (`downThenOver` | `overThenDown`), `gridlines` (bool), `centerHorizontally` (bool), `columnBreaks` / `rowBreaks` (1-based numbers after which to break).

Common: `{"orientation":"landscape","fitToWidth":1,"fitToHeight":0,"repeatRows":"1:1","gridlines":true}` — landscape, every column on one page width, header row repeated on each page.
