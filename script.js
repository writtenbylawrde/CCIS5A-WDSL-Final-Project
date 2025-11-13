document.querySelectorAll('.deck').forEach(initDeck);

function initDeck(deck) {
  const cards = Array.from(deck.querySelectorAll('.product-card'));

  function setDeckHeight() {
    const h = Math.max(...cards.map(c => c.offsetHeight));
    deck.style.height = h + 'px';
  }
  setDeckHeight();
  window.addEventListener('resize', setDeckHeight);

  let order = cards.map((_, i) => i);

  function applyPositions() {
    cards.forEach(c => {
      c.classList.forEach(k => {
        if (/^card-pos-/.test(k) || k === 'deal-in') c.classList.remove(k);
      });
    });

    order.forEach((cardIndex, posIndex) => {
      const card = cards[cardIndex];
      const pos = Math.min(posIndex, 5); 
      card.classList.add(`card-pos-${pos}`);
      card.setAttribute(
        'aria-label',
        `Produktkarte ${cardIndex + 1}${pos === 0 ? ' (vorn)' : ''}`
      );
    });
  }

  function next() {
    const first = order.shift();
    order.push(first);
    const front = cards[order[0]];
    front.classList.add('deal-in');
    applyPositions();
    setTimeout(() => front.classList.remove('deal-in'), 420);
  }

  function prev() {
    const last = order.pop();
    order.unshift(last);
    const front = cards[order[0]];
    front.classList.add('deal-in');
    applyPositions();
    setTimeout(() => front.classList.remove('deal-in'), 420);
  }

  applyPositions();

  // Buttons (scoped to this carousel)
  deck.closest('.carousel')
      .querySelector('.nav.next')
      ?.addEventListener('click', next);
  deck.closest('.carousel')
      .querySelector('.nav.prev')
      ?.addEventListener('click', prev);

  // Keyboard (global, still works for all decks)
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Pointer/Swipe
  let startX = 0, dragging = false;
  deck.addEventListener('pointerdown', e => {
    dragging = true;
    startX = e.clientX;
    deck.setPointerCapture(e.pointerId);
  });
  deck.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    const TH = 40;
    if (dx > TH) prev();
    else if (dx < -TH) next();
  });
  deck.addEventListener('pointercancel', () => (dragging = false));
}