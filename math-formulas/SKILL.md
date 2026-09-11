---
name: math-formulas
description: Write mathematical/scientific formulas in chat, markdown files, kanban cards, agent streams, or mindmap node labels — Coder renders LaTeX math via KaTeX. Use when a response needs an equation, formula, or scientific notation instead of ASCII approximations.
---

# Math formulas in Coder

Coder renders LaTeX-style math anywhere it renders markdown: chat messages, `.md` file previews, kanban cards, and orchestration agent streams. The renderer is `remark-math` (scans for the delimiters below) feeding **KaTeX** (typesets the math). This is standard GitHub/ChatGPT-style math markdown — not a Coder-specific extension.

**Mindmap node labels** (`.mindmap.md` canvas, see the `mermaid-mindmap` skill) also support the same `$...$`/`$$...$$` syntax, via a separate code path (`src/lib/mindmap/mathLabel.ts`) since mindmap labels are plain strings, not markdown — but the delimiters and supported syntax are identical to everywhere else.

## Delimiters

| Syntax | Renders as |
|---|---|
| `$...$` | inline math, flows within a sentence |
| `$$...$$` | block math, centered on its own line(s) |

```
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$.

$$\sum_{i=1}^n x_i^2 = \left(\sum_{i=1}^n x_i\right)^2 - 2\sum_{i<j} x_i x_j$$
```

Whatever is between the delimiters is handed to KaTeX as-is — write real LaTeX math syntax there, not plain text with `^`/`_` sprinkled in and not Markdown formatting (`**bold**` etc. does not work inside math).

## What works

- Sub/superscripts: `x_i`, `x^2`, combined `x_i^2`, multi-char with braces `x^{10}`, `a_{i,j}`
- Fractions, roots: `\frac{a}{b}`, `\sqrt{x}`, `\sqrt[3]{x}`
- Greek letters: `\alpha \beta \gamma \Delta \Omega \pi \theta \lambda \sigma`
- Big operators: `\sum`, `\prod`, `\int`, `\lim`, with `_{}`/`^{}` bounds — `\int_0^\infty`, `\lim_{x \to 0}`
- Relations/operators: `\leq \geq \neq \approx \times \cdot \pm \infty \partial \nabla`
- Grouping/sizing: `\left( ... \right)`, `\left[ ... \right]`, `\left\{ ... \right\}` (auto-sized brackets)
- Matrices/vectors: `\begin{pmatrix} a & b \\ c & d \end{pmatrix}`, `\vec{v}`, `\hat{x}`, `\bar{x}`
- Text inside math: `\text{for all } x \in \mathbb{R}`
- Common sets: `\mathbb{R}`, `\mathbb{N}`, `\mathbb{Z}`, `\mathbb{C}`
- Multi-line aligned equations: `\begin{aligned} a &= b \\ c &= d \end{aligned}`

## What doesn't work

- **No `\ref`/`\label`/equation numbering** — KaTeX has no cross-referencing or auto-numbered equations. Number manually in surrounding text if needed.
- **No `\newcommand`/custom macros defined mid-document** — each `$...$`/`$$...$$` block is typeset independently; don't rely on a macro defined in an earlier formula.
- **No arbitrary LaTeX packages** (`tikz`, `chemfig`, etc.) — KaTeX implements a fixed subset of LaTeX math mode, not a full LaTeX engine. If it's not a recognized command, KaTeX renders a visible error placeholder instead of silently failing.
- **No plain-text math inside the delimiters** — `$3 x^2$` where you meant multiplication needs `\times` or `\cdot` (`$3 \times x^2$`); a bare `x` next to a number is just juxtaposition in LaTeX, which is usually fine for implied multiplication but don't expect `*` to render as anything.
- **Don't use `\(...\)` or `\[...\]` delimiters** — only `$...$` and `$$...$$` are wired up (remark-math's default delimiter set). The bracket-style delimiters are not recognized and will render as literal text.
- **Escaping `$` for literal dollar signs**: if you need a literal `$` character near math (e.g. "$5 per item"), be aware remark-math may try to parse it as a delimiter if another `$` appears later in the same block of text — keep prose with real currency `$` signs away from math blocks, or escape with `\$`.

## When to use this vs. plain text

- Use math delimiters for actual formulas, equations, or expressions with mathematical notation (exponents, fractions, summations, Greek letters, etc.).
- Don't wrap plain numbers or simple arithmetic in `$...$` just to use math styling — `2 + 2 = 4` reads fine as plain text; save KaTeX for when notation actually needs it (e.g. `$O(n \log n)$` for complexity, `$\frac{1}{2}mv^2$` for physics).
- Inside code blocks (fenced with `` ``` ``), math delimiters are NOT processed — they render as literal text, same as any other markdown syntax inside code fences. This is correct behavior; don't try to typeset math inside a code block.
