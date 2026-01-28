# Prewind

A lightweight CSS utility library with no build step. Prewind provides the most useful utilities for everyday styling while encouraging a simpler, more maintainable approach to CSS. The entire library is ~7KB gzipped. No build step, no purging, no tree-shaking — just one CSS file.

If you know Tailwind, you already know Prewind. The utilities you reach for every day — flex, padding, margin, text color, background, borders, rounded corners, shadows — they're all here with the same class names. The only difference: use t-shirt sizes (`p-md`, `gap-lg`) instead of arbitrary numbers. Skip the animations and complex state variants, and you'll find that most of what you actually type in Tailwind works exactly the same way.

Created by [Codepilot](https://codepilot.com). Inspired by [Tailwind CSS](https://tailwindcss.com) and [Utopia](https://utopia.fyi).

## Philosophy: Global First

Prewind follows a "Global First" approach to styling. Instead of reaching for utility classes by default, start with global CSS and get more specific only when needed:

1. **Global CSS for global styles.** Navigation links, typography defaults, form elements — things that should look the same everywhere belong in your global stylesheets.

2. **Utility classes for one-offs.** When you need to tweak spacing, change a color, or adjust layout for a specific element, use a utility class. This is where Prewind shines.

3. **Inline styles for arbitrary values.** If you need a margin of exactly 37px for one specific case, use a `style` attribute. Don't fight the platform.

This approach keeps your HTML readable. You won't end up with 30 classes on a single element.

Prewind works with the platform, not around it. CSS already has a cascade, variables, and specificity rules that work well — we don't need to reinvent them.

## Getting Started

Create a `styles.css` file that sets up CSS layers, imports your theme and Prewind, and contains your global styles:

```css
@layer reset, styles, prewind;

@import url("theme.css");
@import url("https://unpkg.com/prewindcss@1.2.4");

@layer styles {
  body {
    font-family: var(--font-body);
    color: var(--black);
    background: var(--white);
  }

  /* Your global styles go here */
}
```

Then link to it in your HTML:

```html
<link rel="stylesheet" href="styles.css" />
```

That's it. The layer order ensures Prewind utility classes override your global styles when you need them to.

### The theme file

The `theme.css` import contains CSS variables for colors, spacing, fonts, and other design tokens. Run `npx prewindcss theme` to copy the default theme to your clipboard, then save it as `theme.css` and customize as needed. See the [Theming](#theming) section for details on all available variables.

### The included reset

Prewind includes a minimal CSS reset in the `reset` layer. It sets `box-sizing: border-box` on all elements, removes default margins and padding, makes images block-level and responsive, inherits fonts on form elements, and removes default button and link styling. You can see the full reset at the top of [prewind.css](https://github.com/codepilotsf/prewind/blob/main/prewind.css).

## Theming

All of prewind's design decisions flow through CSS variables. To customize your site's look, edit these variables. These variables aren't just for utility classes — you can reference them in your own CSS too. This keeps your global styles and utility classes consistent.

### Colors

Prewind uses simple, memorable color names:

**Brand colors** for your primary palette:

- `--brand-1`, `--brand-1-light`
- `--brand-2`, `--brand-2-light`
- `--brand-3`, `--brand-3-light`
- `--brand-4`, `--brand-4-light`

**Neutral colors** for things like text and backgrounds:

- `--black`, `--darker`, `--dark`, `--midtone`, `--light`, `--lighter`, `--white`

**Semantic colors** for UI feedback:

- `--success`, `--success-light`
- `--info`, `--info-light`
- `--warning`, `--warning-light`
- `--error`, `--error-light`
- `--link`
- `--highlight`

## Fluid Sizing

Prewind uses t-shirt sizes for spacing and typography: `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`.

These aren't arbitrary — they're generated using the same math as [Utopia](https://utopia.fyi). Each size scales fluidly with the viewport using CSS `clamp()`, and the proportional relationship between sizes stays constant. So when the viewport grows, `md` and `lg` both get bigger, but `lg` is always the same ratio larger than `md`.

This gives you responsive typography and spacing without writing media queries, and it enforces a consistent design system. You pick from a constrained set of sizes, which leads to more harmonious layouts than choosing arbitrary pixel values.

To generate custom fluid sizes for your project:

```bash
npx prewindcss text   # Generate fluid typography scale
npx prewindcss space  # Generate fluid spacing scale
```

Each command launches an interactive configurator where you can adjust:

- Viewport range (min/max)
- Base size at each viewport
- Scale ratio (using musical intervals like Major Third, Perfect Fifth, etc.)

The generated CSS is copied to your clipboard — just paste it into your theme variables.

Note: The t-shirt sizes used for borders (`--border-sm`, `--border-lg`), border radius (`--rounded-sm`, `--rounded-lg`), and shadows (`shadow-sm`, `shadow-lg`, are not fluid — they're fixed values you set manually in your theme variables.

## Prewind vs Tailwind

Prewind is a lightweight Tailwind alternative. It's for projects where you want utility classes without the complexity.

**Choose Prewind when:**

- You don't want a build step
- You prefer a constrained design system with t-shirt sizes
- You're comfortable writing global CSS for global styles
- You want a smaller library that covers most common cases

**Choose Tailwind when:**

- You want utilities for everything (grid, animations, transforms, gradients)
- You need arbitrary values like `w-[347px]`
- You want comprehensive hover/focus/active/disabled variants
- You don't mind using a build system

### What Prewind leaves out

Prewind intentionally excludes some things to stay lightweight and encourage better practices:

**No grid utilities.** Flexbox covers most layout needs. For complex grids, write CSS.

**No animations, transitions, or transforms.** These are powerful features that benefit from being defined in one place (your global CSS) rather than scattered across utility classes.

**No predefined color palette.** Tailwind ships with hundreds of color utilities like `bg-sky-500`. Prewind uses semantic color names like `bg-brand-1` that you define yourself. You pick your own colors.

**No arbitrary values.** Instead of `m-[37px]`, use `style="margin: 37px"`. This keeps the utility class system constrained to your design tokens.

**No ring utilities.** Modern CSS supports `outline-radius`, so prewind uses outline utilities instead of the box-shadow workaround used for Tailwind `ring` utilities.

**Limited variants.** Hover variants exist for colors, background opacity, and cursor. Responsive variants exist for display, flexbox, and text alignment. That covers most real-world needs without exploding the file size.

The goal is useful utilities for most of what you need, most of the time — not coverage of every edge case.

### Prewind-Only Classes

These utility classes are unique to Prewind or behave differently than their Tailwind counterparts:

- **`container`** — Uses CSS `clamp()` for fluid responsive width, unlike Tailwind's breakpoint-based container.
- **`max-w-text`** — Constrains width for optimal reading measure.
- **`max-w-form`** — Constrains width for form layouts.
- **`debug`** — Adds a dashed lime outline and subtle green background to visualize layout boundaries during development.
- **`revert`** — Resets all CSS properties to browser defaults using `all: revert`.
- **`bg-opacity-{n}`** — Controls background opacity with values ranging from 0 to 100 in increments of 10.
- **`font-body`**, **`font-heading`** — Prewind uses semantic font family names instead of Tailwind's `font-sans`, `font-serif`, `font-mono`.

---

## Reference

### General

| Class             | Property                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| `container`       | `margin-inline: auto; padding: var(--container-padding); width: clamp(360px, 100%, var(--container-max))` |
| `revert`          | `all: revert`                                                                                             |
| `debug`           | `outline: 2px dashed lime; outline-offset: -2px; background: rgba(0, 255, 0, 0.05)`                       |
| `appearance-none` | `appearance: none`                                                                                        |

### Accessibility

| Class         | Property                                         |
| ------------- | ------------------------------------------------ |
| `sr-only`     | Visually hidden but accessible to screen readers |
| `not-sr-only` | Reverses `sr-only`                               |

### Aspect Ratio

| Class           | Property               |
| --------------- | ---------------------- |
| `aspect-square` | `aspect-ratio: 1 / 1`  |
| `aspect-video`  | `aspect-ratio: 16 / 9` |
| `aspect-auto`   | `aspect-ratio: auto`   |

### Backdrop Blur

| Class                | Property                      |
| -------------------- | ----------------------------- |
| `backdrop-blur-sm`   | `backdrop-filter: blur(4px)`  |
| `backdrop-blur`      | `backdrop-filter: blur(8px)`  |
| `backdrop-blur-lg`   | `backdrop-filter: blur(16px)` |
| `backdrop-blur-none` | `backdrop-filter: none`       |

### Backgrounds

Background color classes use the `--bg-opacity` variable, allowing you to control opacity separately:

```html
<div class="bg-brand-1 bg-opacity-50">50% opacity background</div>
```

| Class                | Property                                                            |
| -------------------- | ------------------------------------------------------------------- |
| `bg-{color}`         | `background: rgb(from var(--{color}) r g b / var(--bg-opacity, 1))` |
| `bg-opacity-{0-100}` | `--bg-opacity: {value}`                                             |

Available colors: `brand-1`, `brand-1-light`, `brand-2`, `brand-2-light`, `brand-3`, `brand-3-light`, `brand-4`, `brand-4-light`, `black`, `darker`, `dark`, `midtone`, `light`, `lighter`, `white`, `success`, `success-light`, `info`, `info-light`, `warning`, `warning-light`, `error`, `error-light`, `link`, `highlight`

Opacity values: `0`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90`, `100`

### Borders

**Width:**

| Class       | Property                                              |
| ----------- | ----------------------------------------------------- |
| `border`    | `border-width: var(--border); border-style: solid`    |
| `border-sm` | `border-width: var(--border-sm); border-style: solid` |
| `border-lg` | `border-width: var(--border-lg); border-style: solid` |
| `border-t`  | Top border only (also `-sm`, `-lg` variants)          |
| `border-r`  | Right border only (also `-sm`, `-lg` variants)        |
| `border-b`  | Bottom border only (also `-sm`, `-lg` variants)       |
| `border-l`  | Left border only (also `-sm`, `-lg` variants)         |

**Radius:**

| Class          | Property                           |
| -------------- | ---------------------------------- |
| `rounded-none` | `border-radius: 0`                 |
| `rounded-sm`   | `border-radius: var(--rounded-sm)` |
| `rounded`      | `border-radius: var(--rounded)`    |
| `rounded-lg`   | `border-radius: var(--rounded-lg)` |
| `rounded-full` | `border-radius: 9999px`            |

**Style:**

| Class           | Property               |
| --------------- | ---------------------- |
| `border-dashed` | `border-style: dashed` |
| `border-dotted` | `border-style: dotted` |

**Color:**

| Class            | Property                       |
| ---------------- | ------------------------------ |
| `border-{color}` | `border-color: var(--{color})` |

Same colors as backgrounds.

### Cursor

| Class                | Property              |
| -------------------- | --------------------- |
| `cursor-auto`        | `cursor: auto`        |
| `cursor-default`     | `cursor: default`     |
| `cursor-pointer`     | `cursor: pointer`     |
| `cursor-wait`        | `cursor: wait`        |
| `cursor-text`        | `cursor: text`        |
| `cursor-move`        | `cursor: move`        |
| `cursor-not-allowed` | `cursor: not-allowed` |
| `cursor-grab`        | `cursor: grab`        |
| `cursor-grabbing`    | `cursor: grabbing`    |

### Display

| Class          | Property                |
| -------------- | ----------------------- |
| `block`        | `display: block`        |
| `inline-block` | `display: inline-block` |
| `inline`       | `display: inline`       |
| `flex`         | `display: flex`         |
| `inline-flex`  | `display: inline-flex`  |
| `hidden`       | `display: none`         |
| `contents`     | `display: contents`     |

### Flexbox

**Container:**

| Class              | Property                         |
| ------------------ | -------------------------------- |
| `flex-row`         | `flex-direction: row`            |
| `flex-col`         | `flex-direction: column`         |
| `flex-row-reverse` | `flex-direction: row-reverse`    |
| `flex-col-reverse` | `flex-direction: column-reverse` |
| `flex-wrap`        | `flex-wrap: wrap`                |
| `flex-nowrap`      | `flex-wrap: nowrap`              |
| `justify-start`    | `justify-content: flex-start`    |
| `justify-center`   | `justify-content: center`        |
| `justify-end`      | `justify-content: flex-end`      |
| `justify-between`  | `justify-content: space-between` |
| `justify-around`   | `justify-content: space-around`  |
| `items-start`      | `align-items: flex-start`        |
| `items-center`     | `align-items: center`            |
| `items-end`        | `align-items: flex-end`          |
| `items-stretch`    | `align-items: stretch`           |

**Item:**

| Class           | Property                 |
| --------------- | ------------------------ |
| `self-start`    | `align-self: flex-start` |
| `self-center`   | `align-self: center`     |
| `self-end`      | `align-self: flex-end`   |
| `self-stretch`  | `align-self: stretch`    |
| `flex-1`        | `flex: 1 1 0%`           |
| `flex-auto`     | `flex: 1 1 auto`         |
| `flex-none`     | `flex: none`             |
| `flex-grow`     | `flex-grow: 1`           |
| `flex-grow-0`   | `flex-grow: 0`           |
| `flex-shrink`   | `flex-shrink: 1`         |
| `flex-shrink-0` | `flex-shrink: 0`         |

### Gap

| Class          | Property                          |
| -------------- | --------------------------------- |
| `gap-{size}`   | `gap: var(--space-{size})`        |
| `gap-x-{size}` | `column-gap: var(--space-{size})` |
| `gap-y-{size}` | `row-gap: var(--space-{size})`    |

Sizes: `0`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

### Lists

| Class          | Property                       |
| -------------- | ------------------------------ |
| `list-none`    | `list-style-type: none`        |
| `list-disc`    | `list-style-type: disc`        |
| `list-decimal` | `list-style-type: decimal`     |
| `list-inside`  | `list-style-position: inside`  |
| `list-outside` | `list-style-position: outside` |

### Margin

| Class        | Property                                |
| ------------ | --------------------------------------- |
| `m-{size}`   | `margin: var(--space-{size})`           |
| `mt-{size}`  | `margin-top: var(--space-{size})`       |
| `mr-{size}`  | `margin-right: var(--space-{size})`     |
| `mb-{size}`  | `margin-bottom: var(--space-{size})`    |
| `ml-{size}`  | `margin-left: var(--space-{size})`      |
| `mx-{size}`  | `margin-left` and `margin-right`        |
| `my-{size}`  | `margin-top` and `margin-bottom`        |
| `-mt-{size}` | Negative top margin                     |
| `-mr-{size}` | Negative right margin                   |
| `-mb-{size}` | Negative bottom margin                  |
| `-ml-{size}` | Negative left margin                    |
| `m-auto`     | `margin: auto`                          |
| `mt-auto`    | `margin-top: auto`                      |
| `mr-auto`    | `margin-right: auto`                    |
| `mb-auto`    | `margin-bottom: auto`                   |
| `ml-auto`    | `margin-left: auto`                     |
| `mx-auto`    | `margin-left: auto; margin-right: auto` |
| `my-auto`    | `margin-top: auto; margin-bottom: auto` |

Sizes: `0`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `full`

### Object Fit

| Class               | Property                 |
| ------------------- | ------------------------ |
| `object-contain`    | `object-fit: contain`    |
| `object-cover`      | `object-fit: cover`      |
| `object-fill`       | `object-fit: fill`       |
| `object-0`          | `object-fit: none`       |
| `object-scale-down` | `object-fit: scale-down` |

### Opacity

| Class             | Property           |
| ----------------- | ------------------ |
| `opacity-{0-100}` | `opacity: {value}` |

Values: `0`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90`, `100`

### Outlines

Prewind uses outlines instead of "ring" utilities. Modern CSS supports rounded outlines, so there's no need for the box-shadow workaround.

**Width:**

| Class        | Property                                                |
| ------------ | ------------------------------------------------------- |
| `outline`    | `outline-width: var(--border); outline-style: solid`    |
| `outline-sm` | `outline-width: var(--border-sm); outline-style: solid` |
| `outline-lg` | `outline-width: var(--border-lg); outline-style: solid` |
| `outline-0`  | `outline-style: none`                                   |

**Style:**

| Class            | Property                |
| ---------------- | ----------------------- |
| `outline-dashed` | `outline-style: dashed` |
| `outline-dotted` | `outline-style: dotted` |

**Color:**

| Class             | Property                        |
| ----------------- | ------------------------------- |
| `outline-{color}` | `outline-color: var(--{color})` |

Same colors as backgrounds and borders.

### Overflow

| Class                | Property              |
| -------------------- | --------------------- |
| `overflow-auto`      | `overflow: auto`      |
| `overflow-hidden`    | `overflow: hidden`    |
| `overflow-visible`   | `overflow: visible`   |
| `overflow-scroll`    | `overflow: scroll`    |
| `overflow-x-auto`    | `overflow-x: auto`    |
| `overflow-x-hidden`  | `overflow-x: hidden`  |
| `overflow-x-visible` | `overflow-x: visible` |
| `overflow-x-scroll`  | `overflow-x: scroll`  |
| `overflow-y-auto`    | `overflow-y: auto`    |
| `overflow-y-hidden`  | `overflow-y: hidden`  |
| `overflow-y-visible` | `overflow-y: visible` |
| `overflow-y-scroll`  | `overflow-y: scroll`  |

### Padding

| Class       | Property                              |
| ----------- | ------------------------------------- |
| `p-{size}`  | `padding: var(--space-{size})`        |
| `pt-{size}` | `padding-top: var(--space-{size})`    |
| `pr-{size}` | `padding-right: var(--space-{size})`  |
| `pb-{size}` | `padding-bottom: var(--space-{size})` |
| `pl-{size}` | `padding-left: var(--space-{size})`   |
| `px-{size}` | `padding-left` and `padding-right`    |
| `py-{size}` | `padding-top` and `padding-bottom`    |

Sizes: `0`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `full`

### Pointer Events

| Class                 | Property               |
| --------------------- | ---------------------- |
| `pointer-events-none` | `pointer-events: none` |
| `pointer-events-auto` | `pointer-events: auto` |

### Position

| Class      | Property                               |
| ---------- | -------------------------------------- |
| `static`   | `position: static`                     |
| `relative` | `position: relative`                   |
| `absolute` | `position: absolute`                   |
| `fixed`    | `position: fixed`                      |
| `sticky`   | `position: sticky`                     |
| `inset-0`  | `top: 0; right: 0; bottom: 0; left: 0` |
| `top-0`    | `top: 0`                               |
| `right-0`  | `right: 0`                             |
| `bottom-0` | `bottom: 0`                            |
| `left-0`   | `left: 0`                              |

### Resize

| Class         | Property             |
| ------------- | -------------------- |
| `resize-none` | `resize: none`       |
| `resize`      | `resize: both`       |
| `resize-y`    | `resize: vertical`   |
| `resize-x`    | `resize: horizontal` |

### Shadows

| Class         | Property                       |
| ------------- | ------------------------------ |
| `shadow-sm`   | `box-shadow: var(--shadow-sm)` |
| `shadow`      | `box-shadow: var(--shadow)`    |
| `shadow-lg`   | `box-shadow: var(--shadow-lg)` |
| `shadow-none` | `box-shadow: none`             |

### Sizing

**Width:**

| Class      | Property       |
| ---------- | -------------- |
| `w-0`      | `width: 0`     |
| `w-auto`   | `width: auto`  |
| `w-full`   | `width: 100%`  |
| `w-screen` | `width: 100vw` |

**Height:**

| Class      | Property        |
| ---------- | --------------- |
| `h-0`      | `height: 0`     |
| `h-auto`   | `height: auto`  |
| `h-full`   | `height: 100%`  |
| `h-screen` | `height: 100vh` |

**Min/Max:**

| Class          | Property                       |
| -------------- | ------------------------------ |
| `min-w-0`      | `min-width: 0`                 |
| `min-w-full`   | `min-width: 100%`              |
| `min-w-screen` | `min-width: 100vw`             |
| `max-w-0`      | `max-width: 0`                 |
| `max-w-full`   | `max-width: 100%`              |
| `max-w-screen` | `max-width: 100vw`             |
| `max-w-form`   | `max-width: var(--max-w-form)` |
| `max-w-text`   | `max-width: var(--max-w-text)` |
| `min-h-0`      | `min-height: 0`                |
| `min-h-full`   | `min-height: 100%`             |
| `min-h-screen` | `min-height: 100vh`            |
| `max-h-0`      | `max-height: 0`                |
| `max-h-full`   | `max-height: 100%`             |
| `max-h-screen` | `max-height: 100vh`            |

### Text

**Color:**

| Class          | Property                |
| -------------- | ----------------------- |
| `text-{color}` | `color: var(--{color})` |

Same colors as backgrounds.

**Size:**

| Class       | Property                      |
| ----------- | ----------------------------- |
| `text-sm`   | `font-size: var(--text-sm)`   |
| `text-base` | `font-size: var(--text-base)` |
| `text-lg`   | `font-size: var(--text-lg)`   |
| `text-xl`   | `font-size: var(--text-xl)`   |
| `text-2xl`  | `font-size: var(--text-2xl)`  |
| `text-3xl`  | `font-size: var(--text-3xl)`  |
| `text-4xl`  | `font-size: var(--text-4xl)`  |

**Alignment:**

| Class          | Property              |
| -------------- | --------------------- |
| `text-left`    | `text-align: left`    |
| `text-center`  | `text-align: center`  |
| `text-right`   | `text-align: right`   |
| `text-justify` | `text-align: justify` |

**Decoration:**

| Class          | Property                             |
| -------------- | ------------------------------------ |
| `underline`    | `text-decoration-line: underline`    |
| `line-through` | `text-decoration-line: line-through` |
| `no-underline` | `text-decoration-line: none`         |

**Weight:**

| Class         | Property                          |
| ------------- | --------------------------------- |
| `font-normal` | `font-weight: var(--font-normal)` |
| `font-bold`   | `font-weight: var(--font-bold)`   |

**Family:**

| Class          | Property                           |
| -------------- | ---------------------------------- |
| `font-body`    | `font-family: var(--font-body)`    |
| `font-heading` | `font-family: var(--font-heading)` |

**Line Height:**

| Class             | Property             |
| ----------------- | -------------------- |
| `leading-tight`   | `line-height: 1.25`  |
| `leading-snug`    | `line-height: 1.375` |
| `leading-normal`  | `line-height: 1.5`   |
| `leading-relaxed` | `line-height: 1.625` |

**Letter Spacing:**

| Class             | Property                   |
| ----------------- | -------------------------- |
| `tracking-tight`  | `letter-spacing: -0.025em` |
| `tracking-normal` | `letter-spacing: 0`        |
| `tracking-wide`   | `letter-spacing: 0.025em`  |

**Transform:**

| Class        | Property                     |
| ------------ | ---------------------------- |
| `uppercase`  | `text-transform: uppercase`  |
| `lowercase`  | `text-transform: lowercase`  |
| `capitalize` | `text-transform: capitalize` |

### User Select

| Class         | Property            |
| ------------- | ------------------- |
| `select-none` | `user-select: none` |
| `select-text` | `user-select: text` |
| `select-all`  | `user-select: all`  |
| `select-auto` | `user-select: auto` |

### Vertical Align

| Class               | Property                      |
| ------------------- | ----------------------------- |
| `align-baseline`    | `vertical-align: baseline`    |
| `align-top`         | `vertical-align: top`         |
| `align-middle`      | `vertical-align: middle`      |
| `align-bottom`      | `vertical-align: bottom`      |
| `align-text-top`    | `vertical-align: text-top`    |
| `align-text-bottom` | `vertical-align: text-bottom` |

### Visibility

| Class       | Property              |
| ----------- | --------------------- |
| `visible`   | `visibility: visible` |
| `invisible` | `visibility: hidden`  |

### Whitespace

| Class                 | Property                |
| --------------------- | ----------------------- |
| `whitespace-normal`   | `white-space: normal`   |
| `whitespace-nowrap`   | `white-space: nowrap`   |
| `whitespace-pre`      | `white-space: pre`      |
| `whitespace-pre-wrap` | `white-space: pre-wrap` |

### Word Break

| Class          | Property                                                         |
| -------------- | ---------------------------------------------------------------- |
| `break-normal` | `overflow-wrap: normal; word-break: normal`                      |
| `break-words`  | `overflow-wrap: break-word`                                      |
| `break-all`    | `word-break: break-all`                                          |
| `truncate`     | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |

### Z-Index

| Class   | Property       |
| ------- | -------------- |
| `z-0`   | `z-index: 0`   |
| `z-10`  | `z-index: 10`  |
| `z-20`  | `z-index: 20`  |
| `z-30`  | `z-index: 30`  |
| `z-40`  | `z-index: 40`  |
| `z-50`  | `z-index: 50`  |
| `z-60`  | `z-index: 60`  |
| `z-70`  | `z-index: 70`  |
| `z-80`  | `z-index: 80`  |
| `z-90`  | `z-index: 90`  |
| `z-100` | `z-index: 100` |

## Variants

### Hover

Hover variants are available for colors, background opacity, and cursor:

| Prefix                     | Example                |
| -------------------------- | ---------------------- |
| `hover:text-{color}`       | `hover:text-brand-1`   |
| `hover:bg-{color}`         | `hover:bg-brand-1`     |
| `hover:bg-opacity-{value}` | `hover:bg-opacity-50`  |
| `hover:cursor-{type}`      | `hover:cursor-pointer` |

### Responsive

Responsive variants are available for display, flexbox, and text alignment at four breakpoints:

| Prefix | Breakpoint |
| ------ | ---------- |
| `sm:`  | 640px      |
| `md:`  | 768px      |
| `lg:`  | 1024px     |
| `xl:`  | 1280px     |

**Available responsive utilities:**

- Display: `hidden`, `block`, `inline-block`, `inline`, `flex`, `inline-flex`
- Flex direction: `flex-row`, `flex-col`, `flex-row-reverse`, `flex-col-reverse`
- Flex wrap: `flex-wrap`, `flex-nowrap`
- Justify: `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`
- Align: `items-start`, `items-center`, `items-end`, `items-stretch`
- Text alignment: `text-left`, `text-center`, `text-right`, `text-justify`

Example:

```html
<div class="flex flex-col md:flex-row gap-md">
  <div class="hidden lg:block">Visible on large screens</div>
</div>
```
