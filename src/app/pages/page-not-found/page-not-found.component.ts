import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ContentLayout } from '../../layouts/content/content.component';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
    selector: 'app-page-not-found',
    imports: [ContentLayout],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor() {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.initScene();
      this.addEventListeners();
    }
  }

  private initScene() {
    // Создаем сцену
    this.scene = new THREE.Scene();

    // Создаем камеру
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
    this.camera.position.set(2.5, 1.3, 3.5);
    this.camera.rotateY(Math.PI / 4);
    this.camera.rotateX(-Math.PI / 12);

    // Создаем рендерер
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Загружаем модель
    const loader = new GLTFLoader();
    loader.load(
      '/shikatan-3d/scene.gltf',
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
        this.animate();
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
      }
    );
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    // Обновляем контроллеры, если они существуют
    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  private addEventListeners() {
    this.renderer.domElement.addEventListener(
      'click',
      this.onMouseClick.bind(this),
      false
    );
  }

  private onMouseClick(event: MouseEvent) {
    // Вычисляем позицию мыши в нормализованных координатах устройства (-1 до +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Обновляем луч
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Вычисляем пересечения
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      // Если есть пересечения, включаем OrbitControls
      this.addOrbitControls();
    }
  }

  private addOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.15;
    this.controls.enableZoom = true;
  }
}
