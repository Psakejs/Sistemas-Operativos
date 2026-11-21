/* Buscador del glosario: filtra los conceptos mientras se escribe */
(function () {
  var input = document.getElementById("cBuscar");
  var cuenta = document.getElementById("cCuenta");
  if (!input) return;
  var norm = function (t) {
    return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll(".concept-card"));
  var total = document.querySelectorAll(".concept-card .edit-area p").length;
  cuenta.textContent = total + " conceptos";

  input.addEventListener("input", function () {
    var q = norm(input.value.trim());
    var vistos = 0;
    tarjetas.forEach(function (card) {
      var enTarjeta = 0;
      var hijos = Array.prototype.slice.call(card.querySelectorAll(".edit-area > *"));
      var grupo = null, enGrupo = 0;
      var cerrarGrupo = function () { if (grupo) grupo.hidden = q !== "" && enGrupo === 0; };
      hijos.forEach(function (el) {
        if (el.tagName === "H4") { cerrarGrupo(); grupo = el; enGrupo = 0; return; }
        var ok = q === "" || norm(el.textContent).indexOf(q) !== -1;
        el.hidden = !ok;
        if (ok) { enGrupo++; enTarjeta++; }
      });
      cerrarGrupo();
      card.hidden = q !== "" && enTarjeta === 0;
      vistos += enTarjeta;
    });
    cuenta.textContent = q === "" ? total + " conceptos"
      : vistos === 0 ? "Ningún concepto coincide con la búsqueda."
      : vistos + (vistos === 1 ? " concepto encontrado" : " conceptos encontrados");
  });
})();
