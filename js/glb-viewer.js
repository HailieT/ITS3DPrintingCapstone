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
    // Don't auto-spin for users who asked for reduced motion
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.controls.autoRotate = !reduceMotion;
    this.controls.autoRotateSpeed = 1.0;
    // OrbitControls sets touch-action:none, which traps page scrolling on touch screens.
    // pan-y lets vertical swipes scroll the page; horizontal drags still rotate the model.
    canvas.style.touchAction = 'pan-y';

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
    const modelId = this.canvas.id.replace('canvas-', '');

    // Try base64 data first (works from file://), fall back to file path
    if (window.GLB_DATA && window.GLB_DATA[modelId]) {
      var dataUrl = 'data:model/gltf-binary;base64,' + window.GLB_DATA[modelId];
      this.loadFromUrl(dataUrl, modelId);
    } else {
      this.loadFromUrl(this.glbPath, modelId);
    }
  }

  loadFromUrl(url, modelId) {
    const loader = new THREE.GLTFLoader();
    loader.load(
      url,
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
        console.error('GLB load error for ' + url, error);
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
    this.rafId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Stop rendering and free GPU resources
  dispose() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.controls) this.controls.dispose();
    if (this.model) {
      this.model.traverse(function (child) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(function (m) { m.dispose(); });
          } else {
            child.material.dispose();
          }
        }
      });
    }
    if (this.renderer) this.renderer.dispose();
    this.scene = null;
    this.camera = null;
    this.model = null;
  }
}

window.GLBViewer = GLBViewer;
