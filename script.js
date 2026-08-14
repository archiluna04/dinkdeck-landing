// Two small, generic behaviors — no framework, no build step.

// Tab groups: any [data-tabs] wrapper containing [data-tab] buttons and
// sibling [data-tab-panel] elements. Clicking a button shows the panel whose
// data-tab-panel matches the button's data-tab.
document.querySelectorAll('[data-tabs]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-tab]')
  const panels = group.querySelectorAll('[data-tab-panel]')
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab')
      buttons.forEach((b) => b.setAttribute('aria-selected', String(b === btn)))
      panels.forEach((p) => {
        p.hidden = p.getAttribute('data-tab-panel') !== target
      })
    })
  })
})

// FAQ accordion: each [data-faq-q] toggles the [data-faq-a] inside its
// parent .faq-item. Independent items — opening one does not close another.
document.querySelectorAll('[data-faq-q]').forEach((question) => {
  const item = question.closest('.faq-item')
  const answer = item?.querySelector('[data-faq-a]')
  const glyph = question.querySelector('[data-faq-glyph]')
  if (!answer) return
  question.addEventListener('click', () => {
    const open = !answer.hidden
    answer.hidden = open
    question.setAttribute('aria-expanded', String(!open))
    if (glyph) glyph.textContent = open ? '+' : '×'
  })
})
