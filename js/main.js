import { SceneManager } from './SceneManager.js';

const sceneManager = new SceneManager('container3D');
sceneManager.objectManager.loadModel('louvre', sceneManager.setupManager.controls);
sceneManager.objectManager.loadModel('table', sceneManager.setupManager.controls);
sceneManager.objectManager.loadModel('laptop', sceneManager.setupManager.controls);
