import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";

class SetupManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        this.css3dRenderer = new CSS3DRenderer();
        this.css3dRenderer.setSize(window.innerWidth, window.innerHeight);
        this.css3dRenderer.domElement.style.position = 'absolute';
        this.css3dRenderer.domElement.style.top = 0;
        this.container.appendChild(this.css3dRenderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minPolarAngle = 0;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.maxAzimuthAngle = Math.PI / 3;
        this.controls.minAzimuthAngle = -Math.PI / 3;

        this.scene.fog = new THREE.Fog('black', -10, 20);
        this.camera.position.set(0, -1, 15);
        this.controls.target.set(0, -1, -10);  // Ensure the initial target is near the table

        window.addEventListener("resize", () => this.onWindowResize());
        window.addEventListener("wheel", (event) => this.onMouseWheel(event));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseWheel(event) {
        if(this.camera.position.z <= 17){
            const delta = Math.sign(event.deltaY);
            const moveSpeed = 0.5;
            const moveVector = new THREE.Vector3();
            this.camera.getWorldDirection(moveVector);
            moveVector.multiplyScalar(delta * moveSpeed);
        
            const currentPos = this.camera.position.clone();
            const targetPos = currentPos.add(moveVector);
        
            new TWEEN.Tween(this.camera.position)
                .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            console.log(this.camera.position.z)
            this.appearText(targetPos.z);
        } else this.camera.position.z -= 1
    }    

    appearText(positionZ) {
        const intro = document.getElementById('intro');
        const author = document.getElementById('author');
        
        if (this.camera.position.z <= 15 && this.camera.position.z >= 12) {
            intro.style.opacity = '1';
        } else {
            intro.style.opacity = '0';
        }
        if (this.camera.position.z <= 11 && this.camera.position.z >= 9) {
            author.style.opacity = '1';
        } else {
            author.style.opacity = '0';
        }
    }
    
}

export { SetupManager };
