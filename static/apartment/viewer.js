// Loads the rooms listed in #splat-view's data-scenes into one gaussian-splats-3d
// viewer. The .splat files are already in a shared frame (meters, Y up, north -Z),
// cropped to each room and cut below the ceiling so the camera can look in from above.
import * as GS from '@mkkellogg/gaussian-splats-3d';

const root = document.getElementById('splat-view');
const status = document.getElementById('splat-status');
const base = root.dataset.base;
const scenes = root.dataset.scenes.split(',').filter(Boolean);

const viewer = new GS.Viewer({
  rootElement: root,
  cameraUp: [0, 1, 0],
  initialCameraPosition: [3.5, 8.0, 3.2],
  initialCameraLookAt: [3.5, 0.3, -3.6],
  sharedMemoryForWorkers: false, // GitHub Pages can't send COOP/COEP headers
  sphericalHarmonicsDegree: 0,
});

const t0 = performance.now();
viewer
  .addSplatScenes(scenes.map((s) => ({ path: `${base}${s}.splat`, format: GS.SceneFormat.Splat })), true)
  .then(() => {
    viewer.start();
    status.textContent = 'Drag to orbit, right-drag to pan, scroll to zoom.';
    window.__splatReady = ((performance.now() - t0) / 1000).toFixed(1);
  })
  .catch((e) => {
    status.textContent = `The scan didn't load: ${e}`;
    window.__splatError = String(e);
  });
