import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

const models = {};
const canvasContainer = document.querySelector('.canvas-container');

window.onload = function () {
  generateCanvases();
};

function generateCanvases() {
  fetch('modelinformation.json')
    .then(response => response.json())
    .then(modelData => {
      modelData.forEach((model, i) => {
        createCanvases(model, i);
      })
    })
}

function createCanvases(model, index) {
  const canvasId = `canvas${index + 1}`;
  const canvasWrapper = document.createElement('div');
  canvasWrapper.classList.add('canvas-wrapper');
  const canvas = document.createElement('canvas');
  canvas.classList.add('product-canvas');
  canvas.id = canvasId;
  canvas.width = 800;
  canvas.height = 370;
  canvasWrapper.appendChild(canvas);
  const text = document.createElement('div');
  text.classList.add('product-canvas-text');
  text.textContent = `Canvas ${index + 1}: ${model.name}`;
  canvasWrapper.appendChild(text);
  canvasContainer.appendChild(canvasWrapper);
  //canvas.addEventListener('click', function () {
  //  window.location.href = `product.html?name=${model.name}`;
  //});

  initializeBabylon(canvasId, model.path);
}

function initializeBabylon(canvasId, modelPath) {
  const canvas = document.getElementById(canvasId);
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3.FromHexString('#cccccc');
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  initializeModel(canvasId, modelPath, scene, canvas, engine)
}

function initializeModel(canvasId, modelPath, scene, canvas, engine) {
  BABYLON.SceneLoader.ImportMesh("", modelPath, "", scene, function (meshes, particleSystems, skeletons) {
    let rootMeshes = scene.transformNodes.find(node => node.name == "Sketchfab_model");
    console.log(rootMeshes);
    models[canvasId] = [rootMeshes];
    rootMeshes.rotationQuaternion = null;
    rootMeshes.rotation.x = -Math.PI / 2;
    scaleModelBabylon(rootMeshes, 1);
    rootMeshes.normalizeToUnitCube();
    const camera = new BABYLON.ArcRotateCamera("arcCamera", Math.PI / 1, Math.PI / 1, 1.5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    scene.activeCamera = camera;
    adjustCameraBabylon(rootMeshes, camera);

    animate(scene, canvasId, engine);
  })
}

function scaleModelBabylon(model, targetHeight) {
  let boundingBox = model.getHierarchyBoundingVectors();
  let size = boundingBox.max.subtract(boundingBox.min);
  let scaleFactor = targetHeight / size.x;
  model.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
}

function adjustCameraBabylon(model, camera) {
  let boundingBox = model.getHierarchyBoundingVectors();
  let size = boundingBox.max.subtract(boundingBox.min);
  let center = boundingBox.min.add(size.scale(0.5));
  let maxDim = Math.max(size.x, size.y, size.z);
  let distance = maxDim * 1;
  camera.radius = distance;
  camera.setTarget(center);
  camera.alpha = Math.PI / 2;
  camera.beta = Math.PI / 2;
}

function animate(scene, canvasId, engine) {
  engine.runRenderLoop(function () {
    if (models[canvasId]) {
      models[canvasId].forEach(rootMesh => {
        rootMesh.rotation.y += 0.01;
      });
    }
    scene.render();
  });
  if (window.fpsTrackerActive) {
    const fpsEvent = new CustomEvent('logFPS', { detail: `Canvas ${canvasNumber} - Current FPS: ${getFPS()}` });
    window.dispatchEvent(fpsEvent);
  }
}