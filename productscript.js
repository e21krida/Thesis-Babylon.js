import * as BABYLON from 'babylonjs';
const canvasContainer = document.querySelector('.canvas-container');

function getURLParam(parameter) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

document.addEventListener('DOMContentLoaded', function () {
  const canvasNumber = getURLParam('canvas');
  console.log(canvasNumber);
  if (canvasNumber) {
    generateCanvas(canvasNumber);
  }
})

function generateCanvas(canvasNumber) {
  console.log("generateCanvas working!");
  const canvasWrapper = document.createElement('div');
  canvasWrapper.classList.add('canvas-wrapper');
  const canvas = document.createElement('canvas');
  canvas.id = `canvas${canvasNumber}`;
  canvas.width = 800;
  canvas.height = 370;
  canvasWrapper.appendChild(canvas);
  const text = document.createElement('div');
  text.classList.add('canvas-text');
  text.textContent = `Canvas ${canvasNumber}`;
  canvasWrapper.appendChild(text);
  canvasContainer.appendChild(canvasWrapper);
  console.log(`Generating canvas: canvas${canvasNumber}`);
  generateBabylon(canvasNumber);
}

function generateBabylon(canvasNumber) {
  const canvasId = `canvas${canvasNumber}`;
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
    if (window.fpsTrackerActive) {
      const fpsEvent = new CustomEvent('logFPS', { detail: `Canvas ${canvasNumber} - Current FPS: ${getFPS()}` });
      window.dispatchEvent(fpsEvent);
    }
  }

  animate();
}