// Three small, generic behaviors — no framework, no build step.

/**
 * Where the forms post. Overridable from the console for local testing:
 *   window.DINKDECK_API = 'http://localhost:8080/v1'
 * before the forms are used.
 */
const API = window.DINKDECK_API || 'https://api.dinkdeck.net/v1'

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

// Submission forms: any [data-submission-form] posts its own fields to the
// API as the kind named in data-kind. One handler for both forms — they
// differ only in which inputs they happen to contain.
document.querySelectorAll('[data-submission-form]').forEach((form) => {
  const button = form.querySelector('[data-submit]')
  const note = form.querySelector('[data-note]')
  const label = button ? button.textContent : ''

  const say = (text, tone) => {
    if (!note) return
    note.textContent = text
    note.className = `form-note form-note--${tone}`
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    // `novalidate` is on the form so this runs instead of the browser's own
    // bubble, keeping the message in the same place as every other one.
    if (!form.checkValidity()) {
      say('Check the fields above — something is missing or malformed.', 'bad')
      form.reportValidity()
      return
    }

    const data = Object.fromEntries(new FormData(form).entries())
    if (button) {
      button.disabled = true
      button.textContent = 'Sending…'
    }
    say('Sending…', 'quiet')

    try {
      const res = await fetch(`${API}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, kind: form.getAttribute('data-kind') }),
      })
      if (!res.ok) {
        // 429 is the rate limiter, and worth saying plainly — "try again"
        // on a wall somebody will hit again immediately is just confusing.
        throw new Error(
          res.status === 429
            ? 'That is a lot of messages in a short time. Try again in a little while.'
            : 'Something went wrong sending that.',
        )
      }
      form.reset()
      say('Thanks — that reached us. We reply by email.', 'ok')
      if (button) button.textContent = 'Sent'
      return
    } catch (err) {
      say(
        err instanceof TypeError
          ? 'Could not reach the server. Check your connection and try again.'
          : err.message,
        'bad',
      )
      if (button) {
        button.disabled = false
        button.textContent = label
      }
    }
  })
})
