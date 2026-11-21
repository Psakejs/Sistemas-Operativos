/* Glosario: búsqueda con resaltado, atajo "/" e índice que sigue la lectura */
(function () {
  var input = document.getElementById("cBuscar");
  var cuenta = document.getElementById("cCuenta");
  var vacio = document.getElementById("cVacio");
  if (!input) return;

  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var temas = Array.prototype.slice.call(document.querySelectorAll(".gl-tema"));
  var itemsToc = Array.prototype.slice.call(document.querySelectorAll(".gl-toc-item"));
  var filas = Array.prototype.slice.call(document.querySelectorAll(".gl-row"));
  var total = filas.length;

  /* Alto real del menú superior, para que lo fijo no quede tapado */
  function medirHeader() {
    if (header) document.body.style.setProperty("--gl-header", header.offsetHeight + "px");
  }
  medirHeader();
  window.addEventListener("resize", medirHeader);

  /* ---------- Búsqueda ---------- */
  var norm = function (t) {
    return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };

  filas.forEach(function (f) {
    f._html = f.innerHTML;
    f._texto = norm(f.textContent);
  });

  /* Resalta la coincidencia solo en nodos de texto (no rompe <code> ni otras etiquetas) */
  function resaltar(el, q) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodos = [];
    while (walker.nextNode()) nodos.push(walker.currentNode);
    nodos.forEach(function (n) {
      var txt = n.nodeValue;
      var base = norm(txt);
      var i = base.indexOf(q);
      if (i === -1) return;
      var frag = document.createDocumentFragment();
      var desde = 0;
      while (i !== -1) {
        frag.appendChild(document.createTextNode(txt.slice(desde, i)));
        var m = document.createElement("mark");
        m.textContent = txt.slice(i, i + q.length);
        frag.appendChild(m);
        desde = i + q.length;
        i = base.indexOf(q, desde);
      }
      frag.appendChild(document.createTextNode(txt.slice(desde)));
      n.parentNode.replaceChild(frag, n);
    });
  }

  function buscar() {
    var q = norm(input.value.trim());
    var vistos = 0;

    filas.forEach(function (f) {
      var ok = q === "" || f._texto.indexOf(q) !== -1;
      f.innerHTML = f._html;
      f.hidden = !ok;
      if (ok) {
        vistos++;
        if (q) resaltar(f, q);
      }
    });

    temas.forEach(function (tema) {
      var enTema = 0;
      tema.querySelectorAll(".gl-sub").forEach(function (sub) {
        var n = sub.querySelectorAll(".gl-row:not([hidden])").length;
        sub.hidden = n === 0;
        var diagrama = sub.querySelector(".gl-diagram");
        if (diagrama) diagrama.hidden = q !== "";
        var link = document.querySelector('.gl-toc-subs a[href="#' + sub.id + '"]');
        if (link) link.parentNode.hidden = n === 0;
        enTema += n;
      });
      tema.hidden = enTema === 0;
      var item = document.querySelector('.gl-toc-item[data-tema="' + tema.id + '"]');
      if (item) item.hidden = enTema === 0;
    });

    if (vacio) vacio.hidden = vistos !== 0;
    cuenta.textContent = q === "" ? total + " conceptos"
      : vistos === 0 ? "Ningún concepto coincide con la búsqueda."
      : vistos + (vistos === 1 ? " concepto encontrado" : " conceptos encontrados");
    marcarActivo();
  }

  input.addEventListener("input", buscar);

  /* "/" enfoca el buscador; Escape lo limpia */
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    var escribiendo = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    if (e.key === "/" && !escribiendo && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && input.value) {
      input.value = "";
      buscar();
    }
  });

  /* ---------- Índice: marca el tema que se está leyendo ---------- */
  var activo = null;
  function marcarActivo() {
    var limite = (header ? header.offsetHeight : 0) + 140;
    var actual = null;
    temas.forEach(function (tema) {
      if (tema.hidden) return;
      if (tema.getBoundingClientRect().top <= limite || actual === null) actual = tema;
    });
    var id = actual ? actual.id : null;
    if (id === activo) return;
    activo = id;
    itemsToc.forEach(function (item) {
      var es = item.getAttribute("data-tema") === id;
      item.classList.toggle("is-active", es);
      var link = item.querySelector(".gl-toc-link");
      if (es) {
        link.setAttribute("aria-current", "true");
        /* En celular, mantiene visible el tema activo en la barra horizontal */
        var barra = item.closest(".gl-toc");
        if (barra && barra.scrollWidth > barra.clientWidth) {
          barra.scrollTo({ left: item.offsetLeft - 18, behavior: "smooth" });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var pendiente = false;
  window.addEventListener("scroll", function () {
    if (pendiente) return;
    pendiente = true;
    window.requestAnimationFrame(function () {
      pendiente = false;
      marcarActivo();
    });
  }, { passive: true });

  cuenta.textContent = total + " conceptos";
  marcarActivo();
})();
