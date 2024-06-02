import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { LightManager } from './LightManager.js';
import { CharacterManager } from './CharacterManager.js';
import { ObjectManager } from './ObjectManager.js';
import { SetupManager } from './SetupManager.js';

class SceneManager {
    constructor(containerId) {
        this.setupManager = new SetupManager(containerId);
        this.lightManager = new LightManager(this.setupManager.scene, this.setupManager.camera);
        this.characterManager = new CharacterManager(this.setupManager.scene);
        this.objectManager = new ObjectManager(this.setupManager.scene);

        this.paths = [
            { name: 'person', path: 'person', position: { x: -5.9, y: -1.4, z: 3.4 }, rotation: Math.PI / 2 },
            { name: 'person2', path: 'person2', position: { x: 5.9, y: -1.4, z: 3.4 }, rotation: Math.PI / 2 },
            { name: 'landscape', path: 'landscape', position: { x: -5.8, y: -1.4, z: 6.8 }, rotation: Math.PI / 2 },
            { name: 'tiger', path: 'tiger', position: { x: 5.8, y: -1.4, z: 6.8 }, rotation: Math.PI / 2 },
        ];

        this.clock = new THREE.Clock();
        this.cameraAtImage = false;

        this.paths.forEach(path => {
            this.objectManager.loadImages(path);
        });

        this.characterManager.loadModelAndAnimation("wave", new THREE.Vector3(3, -4.4, -2), Math.PI * 1.8);
        this.characterManager.loadModelAndAnimation("clap", new THREE.Vector3(-3, -4.4, -2), Math.PI * -1.8);
        this.characterManager.loadModelAndAnimation("clap", new THREE.Vector3(3, -4.4, -4), Math.PI * 1.8);
        this.characterManager.loadModelAndAnimation("wave", new THREE.Vector3(-3, -4.4, -4), Math.PI * -1.8);
        this.characterManager.loadModelAndAnimation("wave", new THREE.Vector3(3, -4.4, -6), Math.PI * 1.8);
        this.characterManager.loadModelAndAnimation("clap", new THREE.Vector3(-3, -4.4, -6), Math.PI * -1.8);

        window.addEventListener("click", (event) => this.onDocumentMouseClick(event));

        this.animate();
    }

    onDocumentMouseClick(event) {
        event.preventDefault();
        this.mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster = new THREE.Raycaster();
        this.raycaster.setFromCamera(this.mouse, this.setupManager.camera);
        const intersects = this.raycaster.intersectObjects(this.objectManager.getClickableObjects());

        if (intersects.length > 0) {
            if (!this.cameraAtImage) {
                this.previousCameraPosition = this.setupManager.camera.position.clone();
            }

            const targetPosition = intersects[0].object.position.clone();
            const targetLookAt = intersects[0].object.position.clone();
            this.cameraAtImage = !this.cameraAtImage;

            const tween = new TWEEN.Tween(this.setupManager.camera.position)
                .to({ x: targetPosition.x / 2, y: targetPosition.y, z: targetPosition.z }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    this.setupManager.controls.target.copy(targetLookAt);
                })
                .start();

            if (!this.cameraAtImage) {
                new TWEEN.Tween(this.setupManager.camera.position)
                    .to(this.previousCameraPosition, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => {
                        this.setupManager.controls.target.copy(this.objectManager.getTable().position);
                        this.setupManager.controls.target.y = -1;
                    })
                    .start();
            }
        }
    }

    lookTables() {
        if (this.setupManager.camera.position.z <= -5) {
            new TWEEN.Tween(this.setupManager.camera.position)
                .to({ x: 0, y: -1.2, z: -10 }, 50)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    this.setupManager.controls.target.copy(this.objectManager.getTable().position);
                })
                .start();
        }
    }

    animate() {
        this.lightManager.updateLightPosition();
        this.lookTables();

        const delta = this.clock.getDelta();
        this.characterManager.update(delta);
        TWEEN.update();

        requestAnimationFrame(() => this.animate());
        this.setupManager.controls.update();
        this.setupManager.renderer.render(this.setupManager.scene, this.setupManager.camera);
        this.setupManager.css3dRenderer.render(this.setupManager.scene, this.setupManager.camera);
    }
}

export { SceneManager };
