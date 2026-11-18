// GLBViewer — uses global THREE (loaded via script tags)
// Depends on: THREE, THREE.OrbitControls, THREE.GLTFLoader

class GLBViewer {
  constructor(canvas, glbPath) {
    this.canvas = canvas;
    this.glbPath = glbPath;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x321a1f);

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    this.scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dir2.position.set(-5, -3, -5);
    this.scene.add(dir2);

    // Controls
    this.controls = new THREE.OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.0;

    // Load model
    this.model = null;
    this.loadModel();

    // Resize
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);

    // Animation loop
    this.animate();
  }

  loadModel() {
    const loader = new THREE.GLTFLoader();
    const modelId = this.canvas.id.replace('canvas-', '');
    loader.load(
      this.glbPath,
      (gltf) => {
        this.model = gltf.scene;

        // Center and scale model to fit nicely
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        this.model.scale.setScalar(scale);

        const scaledBox = new THREE.Box3().setFromObject(this.model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        this.model.position.sub(scaledCenter);

        this.scene.add(this.model);

        // Hide loading indicator
        const loading = document.getElementById('loading-' + modelId);
        if (loading) loading.style.display = 'none';
      },
      undefined,
      (error) => {
        console.error('GLB load error for ' + this.glbPath, error);
        const loading = document.getElementById('loading-' + modelId);
        if (loading) {
          loading.style.display = 'block';
          loading.textContent = '3D model unavailable';
          loading.style.color = '#e74c3c';
        }
      }
    );
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.GLBViewer = GLBViewer;
