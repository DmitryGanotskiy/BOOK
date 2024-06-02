import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

class ObjectManager {
    constructor(scene) {
        this.scene = scene;
        this.clickableObjects = [];
        this.table = null;
    }

    loadModel(path, controls) {
        const loader = new GLTFLoader();
        loader.load(
            `models/${path}/scene.gltf`,
            (gltf) => {
                const object = gltf.scene;
                if (path === "louvre") {
                    object.scale.set(1, 1, 1);
                } else if (path === "table") {
                    object.scale.set(3, 3, 3);
                    object.position.y = -4.4;
                    object.position.z = -10;
                    object.rotation.y = Math.PI / 2;
                    this.table = object;

                    controls.target.copy(object.position);
                    controls.target.y += 3;
                } else if (path === "laptop") {
                    object.scale.set(0.02, 0.02, 0.02);
                    object.position.set(1, -2.1, -10);
                    object.rotation.y = Math.PI * 2;
                    this.table = object;
                }
                this.scene.add(object);
                console.log("Model loaded:", path);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );
    }

    loadImages(img) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(`files/img/${img.path}.jpg`, (texture) => {
            const geometry = new THREE.PlaneGeometry(2.3, 3.1);
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(img.position.x, img.position.y, img.position.z);
            plane.rotation.y = img.rotation;
            this.scene.add(plane);
    
            plane.userData.clickable = true;
            this.clickableObjects.push(plane);
        });
    }

    getClickableObjects() {
        return this.clickableObjects;
    }

    getTable() {
        return this.table;
    }
}

export { ObjectManager };
