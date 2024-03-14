import * as BABYLON from 'babylonjs';

const times = [];
let fps;
const canvasContainer = document.querySelector('.canvas-container');
function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    refreshLoop();
  });
}

refreshLoop();

function getFPS() {
  return fps || 0;
}



function generateCanvases() {
  for (let i = 1; i <= 12; i++) {
    const canvasWrapper = document.createElement('div');
    canvasWrapper.classList.add('canvas-wrapper');
    const canvas = document.createElement('canvas');
    canvas.id = `canvas${i}`;
    canvas.width = 800;
    canvas.height = 370;
    canvasWrapper.appendChild(canvas);
    const text = document.createElement('div');
    text.classList.add('canvas-text');
    text.textContent = `Canvas ${i}`;
    canvasWrapper.appendChild(text);
    canvasContainer.appendChild(canvasWrapper);
    console.log(`Generating canvas: canvas${i}`);
    generateBabylon(`canvas${i}`, i);
  }
}

function generateBabylon(canvasId, canvasNumber) {
  const canvas = document.getElementById(canvasId);
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3.FromHexString('#bccbe3');
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  const material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseColor = new BABYLON.Color3.FromHexString('#fc7526');
  box.material = material;
  const camera = new BABYLON.ArcRotateCamera("arcCamera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  scene.activeCamera = camera;
  camera.target = box.position;

  function animate() {
    requestAnimationFrame(animate);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    scene.render();
    console.log(`Canvas ${canvasNumber} - Current FPS:`, getFPS());
  }

  animate();
}

window.onload = function () {
  generateCanvases();
};