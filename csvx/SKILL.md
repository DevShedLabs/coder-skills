---
name: csvx
description: Read, build, edit, calculate, format and export spreadsheets in CSVX (.csvx; imports Excel and CSV) with the csvx_* tools. Use for spreadsheets, .xlsx, .csvx, formulas, totals, summary sheets, or tabular data as a sheet.
---

# CSVX spreadsheets

A `.csvx` file is a ZIP: the data is CSV and everything else (formulas, styles, print settings) is JSON. **Never use `read_file` / `write_file` / `edit_file` on one** — they refuse. Use the four tools:

| Tool | Use it to |
|---|---|
| `csvx_info` | See sheets, sizes, column headers, source file, problems |
| `csvx_read` | Read a window of cells (as displayed) plus their formulas |
| `csvx_edit` | Apply a batch of edits (atomic, one undo step, saved immediately) |
| `csvx_convert` | Import `.csv` / `.tsv` / `.xlsx` → `.csvx`; export `.csvx` → `.xlsx` or one sheet → `.csv` |

An Excel file is imported with `csvx_convert … to:"csvx"` (the original XLSX is kept inside and can be exported unchanged). To make a **new** spreadsheet: `write_file` a `.csv`, convert it, then edit.

## Workflow

1. **Orient** — `csvx_info` first. It tells you the sheet names, the header of every column, and any validation problems.
2. **Read only what you need** — headers plus a few rows to learn the shape; then the specific range. Never read a whole big sheet into the conversation: reads are capped at 200 rows × 40 columns and return a `next` range when cut short. Let formulas do the aggregating instead of reading thousands of rows.
3. **Edit in one batch** — put related edits in a single `csvx_edit` call. If any edit is invalid **nothing** is applied and the error says which edit failed, so a fix-and-retry is always safe. Don't rewrite a whole sheet to change a few cells.
4. **Verify** — read back the cells you changed. A formula result of `#DIV0`, `#VALUE`, `#NAME`, `#REF` or `#CYCLE` means the formula is wrong; fix it, don't report success.
5. **Report in A1 terms** — say what you changed ("added `D2:D41` with `=B2*C2`, summed in `Summary!B2`"), and anything you could not do.

The user may have the workbook open: your edits appear live in their tab and ⌘Z undoes a whole batch. Don't delete or overwrite data they didn't ask you to touch.

## Addressing

- **A1 everywhere.** Columns are letters, rows are numbers. **Row 1 is the header row** (the column names, which may be empty); data starts at **row 2**. The same numbers are used in formulas and in every tool.
- `set_cells` at row 1 renames columns. `insert_rows` takes a row number **≥ 2** (before it); the header row can't be deleted or displaced.
- `sheet` is a name or id and defaults to the first sheet. In **formulas**, quote names with spaces: `'Q 1'!B2`. Renaming a sheet rewrites the formulas that use it; inserting or deleting rows/columns shifts references automatically.
- Writing beyond the current data grows the sheet; you never need to pre-size it. (The editor shows a blank A–Z × 100-row grid around the data, but that padding is never in the file.)

## Formulas — only five functions exist

`SUM`, `COUNT`, `IF`, `ROUND`, `ABS`. Operators: `+ - * / %` and comparisons `= < <= > >=`. Anything else — `AVERAGE`, `MIN`, `MAX`, `COUNTA`, `SUMIF`, `VLOOKUP`, `AND`/`OR`/`NOT`, text or date functions, `^`, `&` — gives **`#NAME`**. Do not write them. Instead:

| You want | Write |
|---|---|
| average | `=ROUND(SUM(B2:B10)/COUNT(B2:B10),2)` |
| not equal | `=IF(B2=C2,0,1)` — swap the branches. **Don't use `!=`** (it currently fails to parse) |
| AND / OR | `=(B2>50)*(C2>50)` / `=(B2>50)+(C2>50)>0` — comparisons are 1/0 in arithmetic |
| min / max, lookups, text joins, conditional sums | not expressible: compute it yourself, write the **value**, and tell the user it won't update |

More rules: ranges are cell ranges only (`B2:B10`, not `B:B`); `$B$2` anchors are fine; blank cells count as 0 in arithmetic; text in arithmetic → `#VALUE`; `COUNT` counts numbers only; dividing by zero → `#DIV0` (guard with `IF(B2=0,0,…)`); formulas calculate automatically after every edit. Verified patterns are in `formulas-and-formats.md` (use `read_skill_file`).

## Values: plain numbers, not formatted text

Write numbers as plain digits — `42`, `12.5`, `-3`. **`$5`, `1,000`, `5%`, `007` are stored as text**, and `SUM` silently ignores text. Show currency or percent with a `numberFormat` (store `0.256`, format `0.0%`), never by typing the symbol. Booleans are `true`/`false`; dates are `YYYY-MM-DD` text (date arithmetic isn't supported). When importing messy data, check that numeric columns really are numbers.

## Formatting

`format` merges a style into a range: `font {bold, italic, underline, size, color}` (`size` in points, e.g. `14`; the default is 11 — a larger size automatically grows the rows it touches), `fill {color}`, `alignment {horizontal: left|center|right, wrapText}`, `border {style, color}`, `numberFormat`. Colors are `#RRGGBB`; `null` removes a property. Number formats that render: `0`, `0.00`, `#,##0`, `#,##0.00`, `"$"#,##0.00`, `0%`, `0.0%` (and other symbol prefixes); suffix text, scientific and date formats do **not**. Details in the reference file.

## Examples

Add a computed column, a total row, and a summary sheet (sheet "Sales", data in rows 2–41):

```json
[
  {"op":"set_cells","at":"D1","values":[["Total"]]},
  {"op":"set_cells","at":"D2","values":[["=B2*C2"],["=B3*C3"]]},
  {"op":"set_cells","at":"A42","values":[["Grand total","","","=SUM(D2:D41)"]]},
  {"op":"add_sheet","name":"Summary"},
  {"op":"set_cells","sheet":"Summary","at":"A1","values":[["Metric","Value"],["Revenue","=SUM(Sales!D2:D41)"],["Orders","=COUNT(Sales!D2:D41)"]]}
]
```

Style the header and show a column as currency:

```json
[
  {"op":"format","range":"A1:D1","style":{"font":{"bold":true},"fill":{"color":"#E8F0FE"}}},
  {"op":"format","range":"D2:D42","style":{"numberFormat":"\"$\"#,##0.00","alignment":{"horizontal":"right"}}}
]
```

Formulas in a `values` block are stored exactly as written — there is no fill-down — so write each row's own references (`=B2*C2`, `=B3*C3`, …) in one block.

## What the tools can't do

No charts, pivot tables, images, comments, macros or external links (outside CSVX Core 1.0); the tools don't create named ranges, merged cells, conditional formatting, data validation or frozen panes. If asked, say so and offer the closest thing (a formatted summary sheet, a computed flag column). Legacy `.xls` isn't supported — ask for `.xlsx`.
