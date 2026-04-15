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

import {
  CodeButtonContext,
  CodeButtonPlugin,
  CustomCodeButton
} from "~/_"
import { renderCustomCodeButton } from "~/templates"
import { extractCodeBlockText } from "~/utilities"

/* ----------------------------------------------------------------------------
 * Helper types
 * ------------------------------------------------------------------------- */

/**
 * Built-in code button
 */
type BuiltInCodeButton =
  | "copy"
  | "select"

/**
 * Registered code button plugins
 */
const plugins: CodeButtonPlugin[] = []

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Set up code button extensions
 *
 * This function exposes a registration hook that can be used from
 * `extra_javascript` before the initial `DOMContentLoaded` emission.
 */
export function setupCodeBlockButtons(): void {
  window.registerCodeBlockButtons = plugin => {
    plugins.push(plugin)
  }
}

/**
 * Extract code block language
 *
 * @param el - Code block element
 *
 * @returns Code block language or nothing
 */
export function getCodeBlockLanguage(
  el: HTMLElement
): string | undefined {
  for (const name of Array.from(el.classList)) {
    if (name.startsWith("language-"))
      return name.slice("language-".length)
  }

  return undefined
}

/**
 * Create code button context
 *
 * @param el - Code block element
 * @param parent - Code block container
 * @param selection - Code block supports selection
 *
 * @returns Code button context
 */
export function getCodeButtonContext(
  el: HTMLElement, parent: HTMLElement, selection: boolean
): CodeButtonContext {
  return {
    container: parent,
    code: el,
    language: getCodeBlockLanguage(el),
    source: extractCodeBlockText(el),
    selection
  }
}

/**
 * Check whether built-in button is enabled
 *
 * @param name - Button name
 * @param context - Code button context
 *
 * @returns Test result
 */
export function isBuiltInCodeButtonEnabled(
  name: BuiltInCodeButton, context: CodeButtonContext
): boolean {
  return plugins.every(plugin => {
    const handler = plugin[name]
    return typeof handler !== "function" || handler(context) !== false
  })
}

/**
 * Render custom code buttons
 *
 * @param context - Code button context
 *
 * @returns Buttons
 */
export function renderCustomCodeButtons(
  context: CodeButtonContext
): HTMLElement[] {
  return plugins.flatMap(plugin => {
    const buttons = plugin.buttons?.(context) || []
    return buttons
      .filter(button => typeof button.enabled !== "function" || button.enabled(context))
      .map(button => mountCustomCodeButton(button, context))
  })
}

/**
 * Mount custom code button
 *
 * @param config - Button configuration
 * @param context - Code button context
 *
 * @returns Button
 */
function mountCustomCodeButton(
  config: CustomCodeButton,
  context: CodeButtonContext
): HTMLElement {
  const button = renderCustomCodeButton(config)
  button.addEventListener("click", event => {
    event.preventDefault()
    config.onClick({
      ...context,
      button,
      event
    })
  })

  return button
}
