/* Componente de video: tarjeta con portada de YouTube que abre el video en una ventana flotante.
   Uso en el HTML:
   <div class="video-card" data-youtube="ID_DEL_VIDEO" data-title="Título" data-meta="Texto pequeño">
     <a href="https://www.youtube.com/watch?v=ID_DEL_VIDEO">Ver el video en YouTube</a>
   </div>
   El enlace interno es el respaldo si JavaScript no está disponible. */
(function () {
  var cards = document.querySelectorAll('.video-card[data-youtube]');
  if (!cards.length) return;

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>';
  var extIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* Ventana flotante (una sola para toda la página) */
  var modal, frameBox, modalTitle, modalLink, lastFocus;
  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="video-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="video-modal-title">' +
      '<div class="video-modal__bar">' +
      '<p class="video-modal__title" id="video-modal-title"></p>' +
      '<a class="video-btn" target="_blank" rel="noopener" aria-label="Abrir en YouTube" title="Abrir en YouTube">' + extIcon + '</a>' +
      '<button type="button" class="video-btn video-btn--close" aria-label="Cerrar video" title="Cerrar (Esc)">' + closeIcon + '</button>' +
      '</div>' +
      '<div class="video-modal__frame"></div>' +
      '</div>';
    document.body.appendChild(modal);
    frameBox = modal.querySelector('.video-modal__frame');
    modalTitle = modal.querySelector('.video-modal__title');
    modalLink = modal.querySelector('a.video-btn');
    modal.querySelector('.video-btn--close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        var f = modal.querySelectorAll('a, button, iframe');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function open(id, title) {
    if (!modal) buildModal();
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    modalLink.href = 'https://www.youtube.com/watch?v=' + id;
    frameBox.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0" title="' + esc(title) + '"' +
      ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"' +
      ' referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    modal.hidden = false;
    document.documentElement.classList.add('video-open');
    requestAnimationFrame(function () { modal.classList.add('is-visible'); });
    modal.querySelector('.video-btn--close').focus();
  }

  function close() {
    modal.classList.remove('is-visible');
    document.documentElement.classList.remove('video-open');
    frameBox.innerHTML = '';
    modal.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  /* Tarjetas con portada */
  cards.forEach(function (card) {
    var id = card.dataset.youtube;
    var title = card.dataset.title || 'Video';
    var meta = card.dataset.meta || 'YouTube';
    var url = 'https://www.youtube.com/watch?v=' + id;
    card.innerHTML =
      '<img class="video-card__thumb" alt="" loading="lazy" src="https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg">' +
      '<span class="video-card__shade" aria-hidden="true"></span>' +
      '<span class="video-card__badge" aria-hidden="true"><span class="video-card__dot"></span>Video tutorial</span>' +
      '<button type="button" class="video-card__trigger" aria-label="Reproducir video: ' + esc(title) + '">' +
      '<span class="video-card__play">' + playIcon + '</span>' +
      '</button>' +
      '<a class="video-btn video-card__yt" href="' + url + '" target="_blank" rel="noopener" aria-label="Abrir en YouTube" title="Abrir en YouTube">' + extIcon + '</a>' +
      '<span class="video-card__info" aria-hidden="true">' +
      '<span class="video-card__title">' + esc(title) + '</span>' +
      '<span class="video-card__meta">' + esc(meta) + '</span>' +
      '</span>';
    var img = card.querySelector('img');
    /* Si el video no tiene portada en alta resolución, YouTube devuelve una imagen de 120 px: se cambia por la normal */
    img.addEventListener('load', function () {
      if (img.naturalWidth <= 120 && img.src.indexOf('hqdefault') < 0) img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    });
    img.addEventListener('error', function () {
      if (img.src.indexOf('hqdefault') < 0) img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    });
    card.querySelector('.video-card__trigger').addEventListener('click', function () { open(id, title); });
    card.classList.add('is-ready');
  });
})();
