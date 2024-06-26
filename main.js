import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

//scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 1); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const lightColor = new THREE.Color("#916E68");

function addAreaLight(x, y, z, rotX, rotY, rotZ) {
    const width = 1;
    const height = 1;
    const intensity = 10;

    const light = new THREE.RectAreaLight(lightColor, intensity, width, height);
    light.position.set(x, y, z);
    light.rotation.set(
        THREE.MathUtils.degToRad(rotX),
        THREE.MathUtils.degToRad(rotY),
        THREE.MathUtils.degToRad(rotZ)
    );
    light.castShadow = true;
    scene.add(light);

    const helper = new RectAreaLightHelper(light);
    light.add(helper);
}

addAreaLight(-0.395729, -0.020474, 0.859245, -180, -92.517, 123.167);
addAreaLight(-0.07245, -2.0776, 0.119404, 87.3718, 0, -1.99721);
addAreaLight(3.59147, -2.47316, 2.96547, -0.000004, -66.2263, 152.054);

const loader = new GLTFLoader();
let model;
loader.load('/models/Switch_02.glb', function(gltf) {
    gltf.scene.traverse(function(node) {
        if (node.isMesh) {

           //metalness
            const material = new THREE.MeshStandardMaterial({
                metalness: 1, 
                roughness: 0.5, 
                color: 0xffffff,
                envMapIntensity: 1, 
            });
            node.material = material;

            //shadows for the mesh
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    model = gltf.scene;
    scene.add(model);

    const bbox = new THREE.Box3().setFromObject(model);
    const center = bbox.getCenter(new THREE.Vector3());
    model.position.sub(center);
}, undefined, function(error) {
    console.error(error);
});

//orbit controls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//handle window resizing
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
