/**
 * The Family Campaign — campaign reader progressive enhancement.
 *
 * Without JS: all dispatches render as stacked letters.
 * With JS: shows one dispatch at a time with ink-in and page-turn effects.
 */

(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stage = document.querySelector('[data-js="pages"]');
  if (!stage) return;

  const controls = document.querySelector('[data-js="controls"]');
  const prevBtn = document.querySelector('[data-js="prev"]');
  const nextBtn = document.querySelector('[data-js="next"]');
  const folio = document.querySelector('[data-js="folio"]');
  const hint = document.querySelector('[data-js="hint"]');

  const pages = Array.from(stage.querySelectorAll('.dispatch-page'));
  if (pages.length === 0) return;

  let currentIndex = pages.findIndex((p) => p.classList.contains('is-active'));
  if (currentIndex < 0) currentIndex = 0;

  // Replace letter text with word spans for ink-in effect.
  pages.forEach((page) => {
    const letter = page.querySelector('[data-js="letter"]');
    if (!letter) return;

    const paragraphs = Array.from(letter.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      const text = p.textContent || '';
      const words = text.split(/(\s+)/).filter((s) => s.length > 0);
      p.innerHTML = words
        .map((w) => (/^\s+$/.test(w) ? w : `<span class="word">${escapeHtml(w)}</span>`))
        .join('');
    });
  });

  let inkTimer = null;
  let sealTimer = null;

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function updateControls() {
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === pages.length - 1;
    if (folio) folio.textContent = `Dispatch ${currentIndex + 1} of ${pages.length}`;
  }

  function clearInkState(page) {
    if (!page) return;
    const words = page.querySelectorAll('.word');
    words.forEach((w) => w.classList.remove('is-inked'));
    page.querySelector('.dispatch-page__seal')?.classList.remove('is-pressed');
    if (hint) hint.classList.remove('is-hidden');
    clearTimeout(inkTimer);
    clearTimeout(sealTimer);
  }

  function inkIn(page) {
    if (!page) return;

    const words = Array.from(page.querySelectorAll('.word'));
    const seal = page.querySelector('.dispatch-page__seal');

    if (prefersReducedMotion) {
      words.forEach((w) => w.classList.add('is-inked'));
      seal?.classList.add('is-pressed');
      if (hint) hint.classList.add('is-hidden');
      return;
    }

    let i = 0;
    const interval = 55;

    function step() {
      if (i >= words.length) {
        sealTimer = setTimeout(() => {
          seal?.classList.add('is-pressed');
          if (hint) hint.classList.add('is-hidden');
        }, 200);
        return;
      }
      words[i].classList.add('is-inked');
      i += 1;
      inkTimer = setTimeout(step, interval);
    }

    step();
  }

  function completeInk(page) {
    if (!page) return;
    clearTimeout(inkTimer);
    clearTimeout(sealTimer);
    const words = page.querySelectorAll('.word');
    words.forEach((w) => w.classList.add('is-inked'));
    page.querySelector('.dispatch-page__seal')?.classList.add('is-pressed');
    if (hint) hint.classList.add('is-hidden');
  }

  function showPage(index, direction = 1) {
    const outgoing = pages[currentIndex];
    const incoming = pages[index];
    if (!incoming || index === currentIndex) return;

    if (outgoing) {
      clearInkState(outgoing);
      if (!prefersReducedMotion) {
        outgoing.classList.add('is-exit');
        outgoing.classList.remove('is-active');
        setTimeout(() => outgoing.classList.remove('is-exit'), 320);
      } else {
        outgoing.classList.remove('is-active');
      }
      outgoing.setAttribute('aria-hidden', 'true');
    }

    currentIndex = index;
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');

    updateControls();
    inkIn(incoming);
  }

  prevBtn?.addEventListener('click', () => showPage(currentIndex - 1, -1));
  nextBtn?.addEventListener('click', () => showPage(currentIndex + 1, 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      showPage(currentIndex - 1, -1);
    } else if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
      e.preventDefault();
      showPage(currentIndex + 1, 1);
    }
  });

  // Tap/click page to finish ink.
  stage.addEventListener('click', (e) => {
    const page = pages[currentIndex];
    const words = page.querySelectorAll('.word');
    const uninked = Array.from(words).some((w) => !w.classList.contains('is-inked'));
    if (uninked) {
      e.preventDefault();
      completeInk(page);
    }
  });

  updateControls();
  inkIn(pages[currentIndex]);
})();
