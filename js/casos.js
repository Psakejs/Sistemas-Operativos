/* Casos prácticos: muestra un caso a la vez, con índice lateral y anterior / siguiente.
   Sin JavaScript la página muestra todos los casos seguidos. */
(function () {
  var main = document.querySelector(".casos");
  if (!main) return;

  var header = document.querySelector(".site-header");
  var casos = Array.prototype.slice.call(main.querySelectorAll(".cs-case"));
  var links = Array.prototype.slice.call(main.querySelectorAll(".cs-side-link[data-caso]"));
  if (!casos.length) return;

  function medirHeader() {
    if (header) document.body.style.setProperty("--cs-header", header.offsetHeight + "px");
  }
  medirHeader();
  window.addEventListener("resize", medirHeader);

  main.classList.add("cs-js");

  /* Enlaces anterior / siguiente, armados con el texto que ya tiene cada caso */
  function enlace(caso, clase, flecha) {
    var a = document.createElement("a");
    a.href = "#" + caso.id;
    a.className = clase;
    var etiqueta = caso.querySelector(".cs-kicker span").textContent;
    var titulo = caso.querySelector("h2").textContent;
    var s = document.createElement("span");
    s.textContent = clase === "cs-prev" ? flecha + " " + etiqueta : etiqueta + " " + flecha;
    a.appendChild(s);
    a.appendChild(document.createTextNode(titulo));
    return a;
  }
  casos.forEach(function (caso, i) {
    var pager = caso.querySelector(".cs-pager");
    if (i > 0) pager.appendChild(enlace(casos[i - 1], "cs-prev", "←"));
    if (i < casos.length - 1) pager.appendChild(enlace(casos[i + 1], "cs-next", "→"));
  });

  /* Busca el caso al que apunta el enlace (#caso-3 o #caso-3-solucion) */
  function casoDesdeHash(hash) {
    if (!hash || hash.length < 2) return null;
    var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    return el ? el.closest(".cs-case") : null;
  }

  function abrir(caso) {
    casos.forEach(function (c) { c.classList.toggle("is-open", c === caso); });
    var n = caso.getAttribute("data-caso");
    links.forEach(function (l) {
      var es = l.getAttribute("data-caso") === n;
      l.classList.toggle("is-active", es);
      if (es) {
        l.setAttribute("aria-current", "true");
        var barra = l.closest(".cs-side");
        if (barra && barra.scrollWidth > barra.clientWidth) {
          barra.scrollTo({ left: l.offsetLeft - 18, behavior: "smooth" });
        }
      } else {
        l.removeAttribute("aria-current");
      }
    });
  }

  function irA(hash, desplazar) {
    var caso = casoDesdeHash(hash);
    if (!caso) return false;
    abrir(caso);
    if (desplazar) {
      var destino = document.getElementById(decodeURIComponent(hash.slice(1)));
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return true;
  }

  /* Clics en el índice, el índice lateral, los saltos y anterior / siguiente */
  main.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#caso-"]');
    if (!a) return;
    var hash = a.getAttribute("href");
    if (!casoDesdeHash(hash)) return;
    e.preventDefault();
    irA(hash, true);
    if (history.pushState) history.pushState(null, "", hash);
  });

  window.addEventListener("popstate", function () {
    if (!irA(location.hash, true)) abrir(casos[0]);
  });

  if (!irA(location.hash, false)) abrir(casos[0]);
  else {
    var destino = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (destino) setTimeout(function () { destino.scrollIntoView({ block: "start" }); }, 0);
  }
})();
