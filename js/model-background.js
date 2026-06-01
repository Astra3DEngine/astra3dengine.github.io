/**
 * 3D Model Background Animation
 * Loads and displays GLTF model in background with slow rotation
 */

class ModelBackground {
    constructor() {
        this.container = document.getElementById('hero-bg');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.animationId = null;
        
        this.init();
    }
    
    /**
     * Initialize Three.js scene
     */
    init() {
        if (!this.container) {
            console.error('Hero background container not found');
            return;
        }
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.loadModel();
        this.startAnimation();
    }
    
    /**
     * Setup Three.js scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
    }
    
    /**
     * Setup camera
     */
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 15, 60);
        this.camera.lookAt(0, 0, 0);
    }
    
    /**
     * Setup WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    /**
     * Setup lighting
     */
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x66ccff, 0.8);
        directionalLight.position.set(50, 50, 50);
        this.scene.add(directionalLight);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-50, -50, -50);
        this.scene.add(directionalLight2);
    }
    
    /**
     * Load GLTF model
     */
    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'assets/Weighted Companion Cube.gltf',
            (gltf) => {
                this.model = gltf.scene;
                
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 28 / maxDim;
                
                this.model.scale.setScalar(scale);
                this.model.position.sub(center.multiplyScalar(scale));
                
                const pivotGroup = new THREE.Group();
                pivotGroup.add(this.model);
                pivotGroup.position.set(0, 0, 0);
                
                this.scene.add(pivotGroup);
                this.model = pivotGroup;
            },
            (progress) => {
                console.log('Model loading: ', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }
    
    /**
     * Start animation loop
     */
    startAnimation() {
        this.animate();
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (this.model) {
            this.model.rotation.y += 0.003;
            this.model.rotation.x = 0.2;
        }
        
        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    /**
     * Stop animation and cleanup
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.container && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

const modelBackground = new ModelBackground();