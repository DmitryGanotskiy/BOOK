import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

class LightManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.initLight();
    }

    initLight() {
        this.pointLight = new THREE.PointLight(0xffffff);
        this.pointLight.intensity = 10;
        this.pointLight.distance = 20;
        this.pointLight.decay = 4;
        this.pointLight.castShadow = true;
        this.scene.add(this.pointLight);
    }

    updateLightPosition() {
        this.pointLight.position.copy(this.camera.position);
    }
}

export { LightManager };
