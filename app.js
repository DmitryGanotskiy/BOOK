    import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
    import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
    import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
    import { FBXLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js";
    import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
    import { CSS3DObject, CSS3DRenderer } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';

    class SceneManager {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.table = null;
            this.cameraPosition = new THREE.Vector3(0, -5, 15);
            this.cameraFrontOfImagePosition = new THREE.Vector3(-3, -1.4, 5);
            this.cameraAtImage = false;
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.clock = new THREE.Clock();
            this.clickableObjects = [];
            this.mixers = [];
            this.paths = [
                { name: 'person', path: 'person', position: { x: -5.9, y: -1.4, z: 3.4}, rotation: Math.PI / 2},
                { name: 'person2', path: 'person2', position: {x: 5.9, y: -1.4, z: 3.4}, rotation: Math.PI /2},
                { name: 'landscape', path: 'landscape', position: { x: -5.8, y: -1.4, z: 6.8}, rotation: Math.PI / 2},
                { name: 'tiger', path: 'tiger', position: {x: 5.8, y: -1.4, z: 6.8}, rotation: Math.PI /2},
            ];            
            
            //this.book = document.getElementById('canvas');

            // Scene setup
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

            // Lighting
            this.pointLight = new THREE.PointLight(0xffffff);
            this.pointLight.intensity = 10; // Adjust intensity
            this.pointLight.distance = 20; // Adjust distance
            this.pointLight.decay = 4;
            this.pointLight.castShadow = true;
            this.scene.add(this.pointLight);

            // Controls
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation to 90 degrees
            this.controls.minPolarAngle = 0; // Limit vertical rotation to the horizon
            this.controls.enableZoom = false; // Disable zoom
            this.controls.enablePan = false; // Disable panning
            this.controls.maxAzimuthAngle = Math.PI / 3; // Limit horizontal rotation to 60 degrees left
            this.controls.minAzimuthAngle = -Math.PI / 3; // Limit horizontal rotation to 60 degrees right

            //Fog
            this.scene.fog = new THREE.Fog( 'black', -10, 20 );

            // Initial camera position
            this.camera.position.set(0, -5, 15);

            // Event listener for window resize
            window.addEventListener("resize", () => this.onWindowResize());
            window.addEventListener("wheel", (event) => this.onMouseWheel(event));
            window.addEventListener("click", (event) => this.onDocumentMouseClick(event));  

            this.paths.forEach(path => {
                this.loadImages(path);
            });

            this.loadModelAndAnimation("wave", new THREE.Vector3(3, -4.4, -2), Math.PI *1.8);
            this.loadModelAndAnimation("clap", new THREE.Vector3(-3, -4.4, -2), Math.PI *-1.8);
            this.loadModelAndAnimation("clap", new THREE.Vector3(3, -4.4, -4), Math.PI *1.8);
            this.loadModelAndAnimation("wave", new THREE.Vector3(-3, -4.4, -4), Math.PI *-1.8);
            this.loadModelAndAnimation("wave", new THREE.Vector3(3, -4.4, -6), Math.PI *1.8);
            this.loadModelAndAnimation("clap", new THREE.Vector3(-3, -4.4, -6), Math.PI *-1.8);
            //this.loadModelAndAnimation();
            // Start animation loop
            this.animate();
        }

        loadModel(path) {
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

                        // Make the camera look at the table
                        this.controls.target.copy(object.position);
                        this.controls.target.y += 3

                        //this.addScrollableWebpage();
                    } else if (path === "laptop") {
                        object.scale.set(0.02, 0.02, 0.02);
                        object.position.set(1, -2.1, -10);
                        object.rotation.y = Math.PI*2;
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

        loadModelAndAnimation(animation, position, rotation) {
            const loader = new FBXLoader();
        
            loader.load('files/img/knight.fbx', (object) => {
                object.scale.set(0.025, 0.025, 0.025); 
                object.position.set(position.x, position.y, position.z);
                object.rotation.y = rotation;
                this.scene.add(object);
        
                const mixer = new THREE.AnimationMixer(object);
                this.mixers.push(mixer); // Store each mixer in an array
        
                const animLoader = new FBXLoader();
                animLoader.load(`files/img/${animation}.fbx`, (anim) => {
                    const action = mixer.clipAction(anim.animations[0]);
                    action.play();
                }, undefined, (error) => {
                    console.error('An error occurred while loading the animation:', error);
                });
        
            }, undefined, (error) => {
                console.error('An error occurred while loading the model:', error);
            });
        }
        

        onDocumentMouseClick(event) {
            event.preventDefault();
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.clickableObjects);
        
            if (intersects.length > 0) {
                if (!this.cameraAtImage) {
                    // Store the previous camera position
                    this.previousCameraPosition = this.camera.position.clone();
                }
        
                const targetPosition = intersects[0].object.position.clone(); // Get the position of the clicked object
                const targetLookAt = intersects[0].object.position.clone(); // Look at the clicked object
                this.cameraAtImage = !this.cameraAtImage;
        
                const tween = new TWEEN.Tween(this.camera.position)
                    .to({ x: targetPosition.x/2, y: targetPosition.y, z: targetPosition.z}, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => {
                        this.controls.target.copy(targetLookAt);
                    })
                    .start();
        
                if (!this.cameraAtImage) {
                    // Return to previous camera position on the second click
                    new TWEEN.Tween(this.camera.position)
                        .to(this.previousCameraPosition, 1000)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() => {   
                            this.controls.target.copy(this.table.position);
                            this.controls.target.y = -1
                        })
                        .start();
                }
            }
        }
        
        onMouseWheel(event) {
            const delta = Math.sign(event.deltaY);
            const moveSpeed = 0.5;
            const moveVector = new THREE.Vector3();
            this.camera.getWorldDirection(moveVector);
            moveVector.multiplyScalar(delta * moveSpeed);

            // Current position
            const currentPos = this.camera.position.clone();
            const targetPos = currentPos.add(moveVector);

            // Tween animation
            new TWEEN.Tween(this.camera.position)
                .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }

        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.css3dRenderer.setSize(window.innerWidth, window.innerHeight);
        }

        lookTables() {
            if (this.camera.position.z <= -5) {
                new TWEEN.Tween(this.camera.position)
                    .to({ x: 0, y: -1.2, z: -10 }, 50)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => {   
                        this.controls.target.copy(this.table.position);
                    })
                    .start();
                console.log(this.camera.position.z);
            }
        }

        animate() {
            // Update the light's position to match the camera's position
            this.pointLight.position.copy(this.camera.position);
            this.lookTables();

            const delta = this.clock.getDelta();
            this.mixers.forEach(mixer => mixer.update(delta));
            // Update TWEEN
            TWEEN.update();

            requestAnimationFrame(() => this.animate());
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this.css3dRenderer.render(this.scene, this.camera);
            
        }
    }

    // Initialize the scene manager
    const sceneManager = new SceneManager('container3D');

    // Load models
    sceneManager.loadModel('louvre');
    sceneManager.loadModel('table');
    sceneManager.loadModel('laptop');
