// APEX OS · Navegador APEX: páginas internas, historial e iframes
// ===== Browser =====
const pages = {
  'apex://home': `
    <div class="browser-page">
      <h1>APEX Browser</h1>
      <p>Navegador simulado dentro de APEX OS.</p>
      <h2>Páginas disponibles</h2>
      <ul>
        <li><a href="apex://home" data-nav>Inicio</a></li>
        <li><a href="apex://so" data-nav>Proyecto Sistemas Operativos</a></li>
        <li><a href="apex://about" data-nav>Acerca de APEX</a></li>
        <li><a href="https://psakejs.github.io/Sistemas-Operativos/proyecto.html" data-nav>Página real (iframe)</a></li>
      </ul>
      <p>Escribe una dirección o haz clic en los enlaces.</p>
    </div>`,
  'apex://so': `
    <div class="browser-page">
      <h1>Proyecto — Sistemas Operativos</h1>
      <p><strong>Video Tutorial | Dual Boot Lubuntu + Windows</strong></p>
      <p>Instalación de Lubuntu 26.04.1 LTS junto a Windows 10 en un Lenovo IdeaPad S145-14IWL para aprender fundamentos de Linux y demostrar el funcionamiento de un sistema operativo.</p>
      <h2>Hardware</h2>
      <ul>
        <li>CPU: Intel Core i7-8565U</li>
        <li>RAM: 4 GB</li>
        <li>GPU: Intel UHD 620 + NVIDIA MX110</li>
        <li>Disco: 1 TB HDD (con errores de lectura)</li>
      </ul>
      <h2>Plan de particiones</h2>
      <table>
        <tr><th>Partición</th><th>Tamaño</th><th>Formato</th><th>Uso</th></tr>
        <tr><td>sda1</td><td>~499 MB</td><td>NTFS</td><td>Recovery</td></tr>
        <tr><td>sda2</td><td>100 MB</td><td>EFI</td><td>Windows EFI</td></tr>
        <tr><td>sda4</td><td>~506 GB</td><td>NTFS</td><td>Windows C:</td></tr>
        <tr><td>sda6</td><td>~324 GB</td><td>NTFS</td><td>Windows D:</td></tr>
        <tr><td>sda7</td><td>512 MiB</td><td>FAT32</td><td>EFI Lubuntu</td></tr>
        <tr><td>sda8</td><td>~99.5 GiB</td><td>ext4</td><td>Root Lubuntu</td></tr>
      </table>
      <p>GRUB muestra el menú de arranque dual. Ambos sistemas arrancan correctamente.</p>
      <p><a href="https://psakejs.github.io/Sistemas-Operativos/proyecto.html" target="_blank">Ver página completa →</a></p>
    </div>`,
  'apex://about': `
    <div class="browser-page">
      <h1>Acerca de APEX OS</h1>
      <p>Escritorio ficticio de demostración construido con HTML, CSS y JavaScript puro.</p>
      <p>Paleta: negro #0E0E10 · rojo #D00000 · rojo oscuro #6A040F</p>
    </div>`
};
let currentPage = 'apex://home';
let history = ['apex://home'];
let histIndex = 0;

function loadBrowserPage(url) {
  const content = document.getElementById('br-content');
  const urlInput = document.getElementById('br-url');
  urlInput.value = url;
  currentPage = url;

  if (url.startsWith('apex://') && pages[url]) {
    content.innerHTML = pages[url];
  } else if (url.startsWith('http')) {
    content.innerHTML = `<iframe src="${url}" style="width:100%;height:100%;border:0;background:#fff" sandbox="allow-scripts allow-same-origin"></iframe>`;
  } else {
    content.innerHTML = `<div class="browser-page"><h1>Página no encontrada</h1><p>No se pudo cargar: ${url}</p><p><a href="apex://home" data-nav>Volver al inicio</a></p></div>`;
  }
  // Bind nav links
  content.querySelectorAll('[data-nav]').forEach(a => {
    a.onclick = e => { e.preventDefault(); navigateTo(a.getAttribute('href') || a.href); };
  });
}
function navigateTo(url) {
  history = history.slice(0, histIndex + 1);
  history.push(url);
  histIndex = history.length - 1;
  loadBrowserPage(url);
}
document.getElementById('br-go').onclick = () => navigateTo(document.getElementById('br-url').value.trim() || 'apex://home');
document.getElementById('br-url').onkeydown = e => { if (e.key === 'Enter') navigateTo(e.target.value.trim()); };
document.getElementById('br-back').onclick = () => { if (histIndex > 0) { histIndex--; loadBrowserPage(history[histIndex]); } };
document.getElementById('br-fwd').onclick = () => { if (histIndex < history.length - 1) { histIndex++; loadBrowserPage(history[histIndex]); } };
document.getElementById('br-home').onclick = () => navigateTo('apex://home');

