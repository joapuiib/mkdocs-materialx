/*
 * Copyright (c) 2016-2025 Martin Donath <martin.donath@squidfunk.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { translation } from "~/_"
import { h } from "~/utilities"

/* ----------------------------------------------------------------------------
 * Helper types
 * ------------------------------------------------------------------------- */

/**
 * Custom code button
 */
interface CustomCodeButton {
  id: string                            /* Button identifier */
  title: string                         /* Accessible label */
  content?: string                      /* Visible button content */
  class?: string                        /* Additional class names */
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Render code block button
 *
 * @param type - Button type
 * @param title - Button title
 * @param options - Button options
 *
 * @returns Element
 */
function renderCodeButton(
  type: string,
  title: string,
  options: {
    className?: string
    content?: string
    clipboardTarget?: string
  } = {}
): HTMLElement {
  return (
    <button
      class={["md-code__button", options.className].filter(Boolean).join(" ")}
      title={title}
      aria-label={title}
      data-md-type={type}
      data-md-code-button={type}
      data-clipboard-target={options.clipboardTarget}
    >
      {options.content
        ? <span class="md-code__button-label">{options.content}</span>
        : null}
    </button>
  )
}

/**
 * Render a 'copy-to-clipboard' button
 *
 * @param id - Unique identifier
 *
 * @returns Element
 */
export function renderClipboardButton(id: string): HTMLElement {
  return renderCodeButton("copy", translation("clipboard.copy"), {
    clipboardTarget: `#${id} > code`
  })
}

export function renderSelectionButton(): HTMLElement {
  return renderCodeButton("select", "Toggle line selection")
}

export function renderCustomCodeButton(
  { id, title, content, class: className }: CustomCodeButton
): HTMLElement {
  return renderCodeButton(id, title, {
    className,
    content
  })
}

export function renderCodeBlockNavigation() {
  return (
    <nav class="md-code__nav"></nav>
  )
}
