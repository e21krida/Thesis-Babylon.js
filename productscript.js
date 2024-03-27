import * as BABYLON from 'babylonjs';
const canvasContainer = document.querySelector('.product-canvas-container');

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
  const canvasWrapper = document.createElement('div');
  canvasWrapper.classList.add('product-canvas-wrapper');
  const canvas = document.createElement('canvas');
  canvas.classList.add('product-canvas');
  canvas.id = `canvas${canvasNumber}`;
  canvas.width = 800;
  canvas.height = 370;
  canvasWrapper.appendChild(canvas);
  const text = document.createElement('div');
  text.classList.add('product-canvas-text');
  text.textContent = `Canvas ${canvasNumber}`;
  const description = document.createElement("p");
  description.classList.add("description");
  description.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a nibh condimentum, suscipit nunc quis, pharetra neque. Aliquam convallis sed magna at auctor. Vivamus tincidunt luctus dui, at imperdiet purus tincidunt vitae. Phasellus euismod lacus vel quam bibendum, in ultrices velit eleifend. Curabitur eget suscipit eros, et finibus augue. Fusce orci urna, feugiat dictum mollis non, pellentesque id lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum mi at tempor consectetur. Sed sit amet urna vel metus egestas bibendum sed a leo. Pellentesque luctus nisl eu tincidunt vulputate. Fusce facilisis non ligula eu vehicula. Sed fringilla odio id malesuada porttitor. Vestibulum finibus aliquet lectus, et dapibus lacus elementum nec. Nulla lobortis, lectus ut hendrerit pretium.";
  canvasWrapper.appendChild(text);
  text.appendChild(description);
  canvasContainer.appendChild(canvasWrapper);
  console.log(`Generating canvas: canvas${canvasNumber}`);
  generateBabylon(canvasNumber);
}

function generateBabylon(canvasNumber) {
  const canvasId = `canvas${canvasNumber}`;
  const canvas = document.getElementById(canvasId);
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3.FromHexString('#cccccc');
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