# Sistemas-Operativos

Página web del proyecto final de la asignatura Sistemas Operativos (Corporación Universitaria Remington, grupo 2610B16G1).

## Páginas

- **Presentación** (`index.html`): presentación del estudiante y del sitio.
- **Temas** (`temas.html`): los cuatro bloques de la asignatura.
- **Conceptos** (`conceptos.html`): glosario de hardware, software, redes y seguridad.
- **Casos prácticos** (`casos-practicos.html`): problemas de los talleres y sus soluciones.
- **Repaso del parcial** (`repaso.html`): temas, tarjetas de memoria, preguntas con explicación y simulacros mitad teóricos y mitad prácticos.
- **Proyecto - Video Tutorial** (`proyecto.html`): instalación de Lubuntu junto a Windows en arranque dual.

- **APEX OS** (`apex-os-mejorado.html`): simulación de un PC en el navegador, con arranque, login (`apex` / `apex`), ventanas, terminal, navegador y Arcade.

## Juegos del Arcade de APEX OS

Además de los clásicos propios (Snake, Pong, Breakout, Invaders, Asteroids), el Arcade abre juegos retro guardados en la carpeta `juegos/`. Se cargan dentro de la ventana y no dependen de ningún servidor externo.

| Juego | Cómo funciona | Licencia |
|---|---|---|
| DOOM (Freedoom) | Motor FastDoom en DOSBox compilado a WebAssembly (js-dos) | Freedoom: BSD · FastDoom: GPL-2.0 |
| Zork I, II y III | Intérprete Z-machine (ifvms.js) | MIT (Microsoft, 2025) |
| Digger | DOSBox (js-dos) | Freeware |
| Buscaminas | Recreación propia en JavaScript | Código propio |
| Raycaster | Motor 3D propio en JavaScript | Código propio |

Desde la terminal de APEX: `games` lista los juegos y `launch doom` (o `zork`, `digger`, `buscaminas`, `raycaster`, `arcade`) los abre.

Los juegos de DOS y Zork descargan archivos, así que **APEX OS debe abrirse desde GitHub Pages o un servidor local** (`python3 -m http.server`), no con doble clic. El resto del sitio sí funciona con doble clic.

Créditos: [js-dos](https://github.com/caiiiycuk/js-dos) 8.5.4 (GPL-2.0) · [FastDoom](https://github.com/viti95/FastDoom) 1.3.0 (GPL-2.0) · [Freedoom](https://freedoom.github.io/) 0.13.0 (BSD) · Zork de Infocom, [historicalsource](https://github.com/historicalsource/zork1) (MIT) · [ifvms.js](https://github.com/curiousdannii/ifvms.js) y [glkote-term](https://github.com/curiousdannii/glkote-term) (MIT) · Digger © Windmill Software 1983 (freeware). Las licencias completas están dentro de cada carpeta de `juegos/`.

## Cómo abrirla

Abre `index.html` en el navegador. No necesita instalación ni servidor. El progreso del repaso se guarda en el navegador que uses.
