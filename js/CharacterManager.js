import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js";

class CharacterManager {
    constructor(scene) {
        this.scene = scene;
        this.mixers = [];
    }

    loadModelAndAnimation(animation, position, rotation) {
        const loader = new FBXLoader();

        loader.load('files/img/knight.fbx', (object) => {
            object.scale.set(0.025, 0.025, 0.025); 
            object.position.set(position.x, position.y, position.z);
            object.rotation.y = rotation;
            this.scene.add(object);

            const mixer = new THREE.AnimationMixer(object);
            this.mixers.push(mixer);

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

    update(delta) {
        this.mixers.forEach(mixer => mixer.update(delta));
    }
}

export { CharacterManager };
