import './style.css';
import * as THREE from 'three';

// ==========================================
// 1. BOOT TERMINAL & LOADING SCREEN
// ==========================================
function initLoadingScreen(onComplete) {
    const loadingScreen = document.getElementById('loading-screen');
    const bootLog = document.getElementById('boot-log');
    const progressFill = document.getElementById('progress-fill');
    
    if (!loadingScreen || !bootLog || !progressFill) {
        if (onComplete) onComplete();
        return;
    }

    const logs = [
        "BIOS Version: v2.6.0-NEON-AQUARIUM",
        "Initializing GPU WebGL context...",
        "Device: WebGL 2.0 (ThreeJS r160 Core Active)",
        "Loading system assets & modules...",
        "Module [BIOLUMINESCENT_SPECIES] .... LOADED",
        "Module [SPINE_WIGGLE_ENGINE] ....... LOADED",
        "Module [SCISSOR_MULTI_VIEWPORT] ... LOADED",
        "Module [SCROLL_INTERSECT_OBS] ..... LOADED",
        "Calibrating neon glow intensity...",
        "Connecting to neural node [redwan.amin@dev.io]...",
        "Syncing Git logs: 743 contributions parsed...",
        "System fully synchronized. Establishing display link...",
        "BOOT SEQUENCE COMPLETE."
    ];

    let currentLogIndex = 0;
    
    function addLogLine() {
        if (currentLogIndex < logs.length) {
            const line = document.createElement('div');
            line.className = 'boot-log-line font-mono text-xs mb-1';
            
            // Success highlight
            if (logs[currentLogIndex].includes('LOADED') || logs[currentLogIndex].includes('COMPLETE')) {
                line.innerHTML = `<span class="text-primary-container">[OK]</span> ${logs[currentLogIndex]}`;
            } else {
                line.innerHTML = `<span class="text-on-secondary-container">>></span> ${logs[currentLogIndex]}`;
            }
            
            bootLog.appendChild(line);
            bootLog.scrollTop = bootLog.scrollHeight;
            
            // Update progress bar
            const percent = ((currentLogIndex + 1) / logs.length) * 100;
            progressFill.style.width = `${percent}%`;
            
            currentLogIndex++;
            setTimeout(addLogLine, 120 + Math.random() * 100);
        } else {
            // End boot sequence
            setTimeout(() => {
                loadingScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (onComplete) onComplete();
                }, 600);
            }, 500);
        }
    }
    
    // Start boot sequence after 300ms
    setTimeout(addLogLine, 300);
}

// ==========================================
// 2. SCROLL REVEAL ANIMATIONS (AOS-LIKE)
// ==========================================
function initScrollReveal() {
    const elementsToReveal = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-slide-left, .reveal-slide-right, .reveal-scale-up'
    );
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve if we only want animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elementsToReveal.forEach((el) => {
        observer.observe(el);
    });
}

// ==========================================
// 3. GITHUB CONTRIBUTION GRAPH DYNAMIC GENERATION
// ==========================================
function initGithubGraph() {
    const graph = document.getElementById('contribution-graph');
    if (!graph) return;
    
    const colors = [
        'bg-surface-variant', 
        'bg-on-primary-fixed-variant', 
        'bg-on-primary-container', 
        'bg-primary-container', 
        'bg-primary-fixed'
    ];
    
    // Generate ~357 squares (51 weeks x 7 days)
    for (let i = 0; i < 357; i++) {
        // Higher weight on lower contribution days to look realistic
        let colorIdx = 0;
        const rand = Math.random();
        if (rand > 0.45 && rand <= 0.75) colorIdx = 1;
        else if (rand > 0.75 && rand <= 0.9) colorIdx = 2;
        else if (rand > 0.9 && rand <= 0.97) colorIdx = 3;
        else if (rand > 0.97) colorIdx = 4;
        
        const randomColor = colors[colorIdx];
        const square = document.createElement('div');
        square.className = `w-3 h-3 rounded-sm ${randomColor} transition-transform duration-300 hover:scale-125 cursor-pointer relative group`;
        
        // Add absolute tooltip on hover
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-container text-[10px] font-mono rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-outline-variant';
        
        const commits = colorIdx === 0 ? 'No' : colorIdx * 2 + Math.floor(Math.random() * 2);
        tooltip.textContent = `${commits} commits on terminal node ${i}`;
        
        square.appendChild(tooltip);
        graph.appendChild(square);
    }
}

// ==========================================
// 4. UTILITY INTERACTIONS (EMAIL & FORM)
// ==========================================
window.copyEmail = function() {
    const emailText = document.getElementById('email-text');
    const copySuccess = document.getElementById('copy-success');
    if (!emailText || !copySuccess) return;

    navigator.clipboard.writeText(emailText.innerText.trim()).then(() => {
        copySuccess.classList.remove('hidden');
        setTimeout(() => {
            copySuccess.classList.add('hidden');
        }, 4000);
    });
};

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const origText = button.textContent;
        
        button.disabled = true;
        button.textContent = "TRANSMITTING PACKET...";
        
        setTimeout(() => {
            button.textContent = "PACKET DELIVERED [OK]";
            button.style.borderColor = "#64ffda";
            button.style.color = "#64ffda";
            form.reset();
            
            setTimeout(() => {
                button.disabled = false;
                button.textContent = origText;
                button.style.borderColor = "";
                button.style.color = "";
            }, 3000);
        }, 1500);
    });
    
    // Bind copy button separately
    const copyBtn = document.getElementById('btn-copy-email');
    if (copyBtn) {
        copyBtn.addEventListener('click', window.copyEmail);
    }
}

// Smooth scrolling for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 5. THREE.JS NEON FISH BACKGROUND
// ==========================================
function initNeonFishBackground() {
    const container = document.getElementById('fish-bg');
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    
    // Perspective camera for depth
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x64ffda, 2.5, 30);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8a2be2, 2.0, 30); // purple neon fill
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // --- PROCEDURAL 3D FISH RIG ---
    const fishRig = new THREE.Group();

    // Fish skin material - Semi-translucent, physical skin with high wet shine and neon emissive glow
    const fishMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00d2c4,           // base teal
        emissive: 0x0c313a,        // bioluminescent base glow
        roughness: 0.15,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transmission: 0.35,        // semi-transparent
        thickness: 0.5,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide
    });

    const finMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x64ffda,
        emissive: 0x143c3c,
        roughness: 0.1,
        metalness: 0.3,
        clearcoat: 0.8,
        transmission: 0.65,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
    });

    // Torso (Main structural body part)
    const torsoGeo = new THREE.SphereGeometry(0.55, 32, 16);
    torsoGeo.scale(1.0, 1.4, 1.9); // Elongated in Z, slightly flattened in X, taller in Y
    const torso = new THREE.Mesh(torsoGeo, fishMaterial);
    fishRig.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.52, 32, 16);
    headGeo.scale(0.9, 1.2, 1.1);
    const head = new THREE.Mesh(headGeo, fishMaterial);
    head.position.set(0, 0, 0.75); // Forward along Z axis
    torso.add(head);

    // Eyes (Neon glowing spheres)
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.32, 0.15, 0.35);
    head.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.32, 0.15, 0.35);
    head.add(rightEye);

    // Spine Segment 1: Midbody (Chained to Torso)
    const midbodyGeo = new THREE.SphereGeometry(0.42, 32, 16);
    midbodyGeo.scale(0.8, 1.1, 1.2);
    const midbody = new THREE.Mesh(midbodyGeo, fishMaterial);
    midbody.position.set(0, 0, -0.75); // Behind torso
    torso.add(midbody);

    // Spine Segment 2: Tail Base (Chained to Midbody)
    const tailBaseGeo = new THREE.SphereGeometry(0.28, 16, 16);
    tailBaseGeo.scale(0.6, 0.9, 1.1);
    const tailBase = new THREE.Mesh(tailBaseGeo, fishMaterial);
    tailBase.position.set(0, 0, -0.65); // Behind midbody
    midbody.add(tailBase);

    // Spine Segment 3: Caudal Fin (Chained to Tail Base)
    // Custom tail fin geometry shape
    const caudalFinShape = new THREE.Shape();
    caudalFinShape.moveTo(0, 0);
    caudalFinShape.quadraticCurveTo(0.3, 0.6, 0.1, 0.9);
    caudalFinShape.quadraticCurveTo(0.0, 0.3, 0, 0.1);
    caudalFinShape.quadraticCurveTo(0.0, -0.3, 0.1, -0.9);
    caudalFinShape.quadraticCurveTo(-0.3, -0.6, 0, 0);
    
    const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const caudalFinGeo = new THREE.ExtrudeGeometry(caudalFinShape, extrudeSettings);
    caudalFinGeo.center();
    caudalFinGeo.rotateY(Math.PI / 2); // align along spine
    const caudalFin = new THREE.Mesh(caudalFinGeo, finMaterial);
    caudalFin.position.set(0, 0, -0.45);
    tailBase.add(caudalFin);

    // Pectoral Fins (Flapping joints on torso)
    const pectoralFinShape = new THREE.Shape();
    pectoralFinShape.moveTo(0, 0);
    pectoralFinShape.bezierCurveTo(0.3, 0.1, 0.6, -0.1, 0.75, -0.3);
    pectoralFinShape.bezierCurveTo(0.5, -0.4, 0.2, -0.3, 0, 0);
    
    const pectoralGeo = new THREE.ExtrudeGeometry(pectoralFinShape, extrudeSettings);
    pectoralGeo.center();
    
    // Left Pectoral
    const leftPectoralGroup = new THREE.Group();
    leftPectoralGroup.position.set(0.45, -0.15, 0.35);
    const leftPectoralMesh = new THREE.Mesh(pectoralGeo, finMaterial);
    leftPectoralMesh.rotation.set(0.2, 0.5, -0.3);
    leftPectoralGroup.add(leftPectoralMesh);
    torso.add(leftPectoralGroup);

    // Right Pectoral
    const rightPectoralGroup = new THREE.Group();
    rightPectoralGroup.position.set(-0.45, -0.15, 0.35);
    const rightPectoralMesh = new THREE.Mesh(pectoralGeo, finMaterial);
    rightPectoralMesh.rotation.set(0.2, -0.5, 0.3);
    rightPectoralMesh.scale.x = -1; // Mirror image
    rightPectoralGroup.add(rightPectoralMesh);
    torso.add(rightPectoralGroup);

    // Dorsal Fin (Top spine)
    const dorsalShape = new THREE.Shape();
    dorsalShape.moveTo(0, 0);
    dorsalShape.quadraticCurveTo(0, 0.6, -0.5, 0.85);
    dorsalShape.quadraticCurveTo(-0.7, 0.5, -0.6, 0);
    dorsalShape.closePath();
    
    const dorsalGeo = new THREE.ExtrudeGeometry(dorsalShape, extrudeSettings);
    dorsalGeo.center();
    dorsalGeo.rotateY(Math.PI / 2);
    const dorsalFin = new THREE.Mesh(dorsalGeo, finMaterial);
    dorsalFin.position.set(0, 0.9, -0.1);
    torso.add(dorsalFin);

    // Ventral Fin (Bottom spine)
    const analFin = new THREE.Mesh(dorsalGeo, finMaterial);
    analFin.scale.set(0.6, 0.6, 0.6);
    analFin.rotation.z = Math.PI; // upside down
    analFin.position.set(0, -0.8, -0.5);
    midbody.add(analFin);

    // Bioluminescent Internal Point Light
    const internalLight = new THREE.PointLight(0x00ffcc, 1.8, 4);
    internalLight.position.set(0, 0, 0);
    torso.add(internalLight);

    // Scale down the whole fish rig for screen background sizing
    fishRig.scale.set(1.4, 1.4, 1.4);
    scene.add(fishRig);

    // --- BUBBLE / PLANKTON DUST SYSTEM ---
    const bubbleCount = 120;
    const bubbleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(bubbleCount * 3);
    const speeds = [];
    const amplitudes = [];

    for (let i = 0; i < bubbleCount; i++) {
        // Spread bubbles all over the 3D viewport space
        positions[i * 3] = (Math.random() - 0.5) * 16;     // X
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;  // Z

        speeds.push(0.01 + Math.random() * 0.015);
        amplitudes.push(0.2 + Math.random() * 0.4);
    }

    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Canvas Texture for circular, soft-edge glowing bubbles
    const bubbleCanvas = document.createElement('canvas');
    bubbleCanvas.width = 16;
    bubbleCanvas.height = 16;
    const ctx = bubbleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(100, 255, 218, 1)');
    grad.addColorStop(0.3, 'rgba(100, 255, 218, 0.5)');
    grad.addColorStop(1, 'rgba(100, 255, 218, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const bubbleTexture = new THREE.CanvasTexture(bubbleCanvas);

    const bubbleMat = new THREE.PointsMaterial({
        size: 0.18,
        map: bubbleTexture,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const bubbleParticles = new THREE.Points(bubbleGeo, bubbleMat);
    scene.add(bubbleParticles);

    // --- TRAJECTORY CURVE SETUP ---
    // Smooth Lissajous curve movement for organic cruising path
    let time = 0;
    const clock = new THREE.Clock();

    function updatePhysics() {
        const delta = clock.getDelta();
        // Constant slow increment to maintain swim loop
        time += delta;

        // 1. Calculate future fish coordinate to derive heading vector
        const currentPos = new THREE.Vector3(
            Math.sin(time * 0.25) * 5.2,
            Math.cos(time * 0.12) * 2.2,
            Math.sin(time * 0.15) * 1.5 - 2.5
        );

        const futurePos = new THREE.Vector3(
            Math.sin((time + 0.02) * 0.25) * 5.2,
            Math.cos((time + 0.02) * 0.12) * 2.2,
            Math.sin((time + 0.02) * 0.15) * 1.5 - 2.5
        );

        fishRig.position.copy(currentPos);

        // Derive direction vector and make fish head look at it
        const dir = new THREE.Vector3().subVectors(futurePos, currentPos).normalize();
        
        // Target look-at position
        const lookTarget = currentPos.clone().add(dir);
        fishRig.lookAt(lookTarget);

        // Add roll bank angle during sharp X turns for realistic lean
        const rollAngle = -dir.x * 0.9;
        fishRig.rotateZ(rollAngle);

        // 2. Realistic Spinal Wiggle (Carangiform locomotion)
        // Waves travel from torso to midbody to tailbase to caudal fin with phase delays
        const wiggleSpeed = 9.5;
        const wiggleAmp = 0.25;

        midbody.rotation.y = Math.sin(time * wiggleSpeed - 0.7) * wiggleAmp;
        tailBase.rotation.y = Math.sin(time * wiggleSpeed - 1.4) * wiggleAmp;
        caudalFin.rotation.y = Math.sin(time * wiggleSpeed - 2.1) * (wiggleAmp * 1.4);

        // Flapping pectoral fins in opposite sync
        const flapSpeed = 4.75;
        leftPectoralGroup.rotation.y = Math.sin(time * flapSpeed) * 0.28;
        rightPectoralGroup.rotation.y = -Math.sin(time * flapSpeed) * 0.28;

        // 3. Float Bubbles Upwards
        const bubblePositions = bubbleParticles.geometry.attributes.position.array;
        for (let i = 0; i < bubbleCount; i++) {
            // Drift upward
            bubblePositions[i * 3 + 1] += speeds[i];
            
            // Side-to-side sway
            bubblePositions[i * 3] += Math.sin(time * 0.5 + i) * 0.003;

            // Loop back when passing top boundary
            if (bubblePositions[i * 3 + 1] > 5) {
                bubblePositions[i * 3 + 1] = -5;
                bubblePositions[i * 3] = (Math.random() - 0.5) * 16;
            }
        }
        bubbleParticles.geometry.attributes.position.needsUpdate = true;

        // Pulsing bioluminescent intensity
        internalLight.intensity = 1.5 + Math.sin(time * 2.0) * 0.7;
    }

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);
        updatePhysics();
        renderer.render(scene, camera);
    }

    // --- RESIZE HANDLER ---
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    animate();
}

// ==========================================
// 6. THREE.JS MULTI-SCENE VIEWPORT RENDERER (PROJECTS)
// ==========================================

// Helper to create the exact rotating wireframe panels with diagonal 'X' lines
function createWireframePanel(w, h, d) {
    const hw = w / 2;
    const hh = h / 2;
    const hd = d / 2;
    
    // 8 vertices representing the bounding box corner coordinates
    const vertices = [
        // Front face
        -hw, -hh,  hd, // 0
         hw, -hh,  hd, // 1
         hw,  hh,  hd, // 2
        -hw,  hh,  hd, // 3
        // Back face
        -hw, -hh, -hd, // 4
         hw, -hh, -hd, // 5
         hw,  hh, -hd, // 6
        -hw,  hh, -hd  // 7
    ];
    
    // Connect indices to form lines (front boundary, back boundary, side connectors, and crossed diagonals)
    const indices = [
        // Front boundary lines
        0, 1,  1, 2,  2, 3,  3, 0,
        // Back boundary lines
        4, 5,  5, 6,  6, 7,  7, 4,
        // Side connector lines
        0, 4,  1, 5,  2, 6,  3, 7,
        // Front face crossed diagonals
        0, 2,  1, 3,
        // Back face crossed diagonals
        4, 6,  5, 7
    ];
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    
    const mat = new THREE.LineBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.45
    });
    
    return new THREE.LineSegments(geo, mat);
}

function initProject3DScenes() {
    const placeholders = document.querySelectorAll('.project-3d-placeholder');
    if (placeholders.length === 0) return;

    const sharedGlowMat = new THREE.MeshPhysicalMaterial({
        color: 0x64ffda,
        emissive: 0x004135,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.85
    });

    const sharedWireMat = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });

    const clock = new THREE.Clock();

    placeholders.forEach((placeholder, idx) => {
        const projectType = placeholder.getAttribute('data-project');

        // Create a dedicated canvas inside this placeholder
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
        placeholder.style.position = 'relative';
        placeholder.appendChild(canvas);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, placeholder.clientWidth / placeholder.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 5);

        // Lights
        const pointLight = new THREE.PointLight(0x64ffda, 3, 10);
        pointLight.position.set(2, 2, 3);
        scene.add(pointLight);
        scene.add(new THREE.AmbientLight(0x0e243a, 0.8));

        // Root group for rotation & mouse tilt
        const group = new THREE.Group();
        scene.add(group);

        // Wireframe panel behind everything
        const wireframePanel = createWireframePanel(1.8, 2.4, 0.12);
        group.add(wireframePanel);

        let mouseX = 0, mouseY = 0, isHovered = false;
        let updateFn = () => {};

        // ---- SCENE TYPES ----
        if (projectType === 'synapse') {
            // Neural network: floating nodes + dynamic connection lines
            const nodeCount = 14;
            const nodeGeo = new THREE.SphereGeometry(0.07, 12, 12);
            const nodeMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });
            const nodeHoverMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const nodes = [];
            const nodeSpeeds = [];

            for (let i = 0; i < nodeCount; i++) {
                const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
                node.position.set(
                    (Math.random() - 0.5) * 1.5,
                    (Math.random() - 0.5) * 2.2,
                    (Math.random() - 0.5) * 0.1
                );
                group.add(node);
                nodes.push(node);
                nodeSpeeds.push(new THREE.Vector3(
                    (Math.random() - 0.5) * 0.004,
                    (Math.random() - 0.5) * 0.004,
                    0
                ));
            }

            const lineMat = new THREE.LineBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.3 });
            let linesMesh = null;

            // Add a central glowing hub
            const hubGeo = new THREE.SphereGeometry(0.14, 16, 16);
            const hubMat = new THREE.MeshPhysicalMaterial({
                color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.6,
                roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.9
            });
            const hub = new THREE.Mesh(hubGeo, hubMat);
            group.add(hub);

            // Glowing ring around hub
            const ringGeo = new THREE.TorusGeometry(0.25, 0.01, 8, 48);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.6 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            group.add(ring);

            updateFn = (time) => {
                if (linesMesh) { group.remove(linesMesh); linesMesh.geometry.dispose(); }
                const linePositions = [];
                const maxDist = 0.85;
                const speedMult = isHovered ? 2.5 : 1.0;

                nodes.forEach((node, i) => {
                    node.position.addScaledVector(nodeSpeeds[i], speedMult);
                    if (Math.abs(node.position.x) > 0.8) nodeSpeeds[i].x *= -1;
                    if (Math.abs(node.position.y) > 1.15) nodeSpeeds[i].y *= -1;

                    if (isHovered) {
                        const p = 1.0 + Math.sin(time * 8 + i * 0.8) * 0.4;
                        node.scale.setScalar(p);
                        node.material.color.setHex(0xffffff);
                    } else {
                        node.scale.setScalar(1);
                        node.material.color.setHex(0x64ffda);
                    }

                    // Lines to hub
                    const dh = node.position.distanceTo(hub.position);
                    if (dh < maxDist * 1.2) {
                        linePositions.push(node.position.x, node.position.y, node.position.z, 0, 0, 0);
                    }
                    // Lines between nodes
                    for (let j = i + 1; j < nodeCount; j++) {
                        if (node.position.distanceTo(nodes[j].position) < maxDist) {
                            linePositions.push(
                                node.position.x, node.position.y, node.position.z,
                                nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
                            );
                        }
                    }
                });

                if (linePositions.length > 0) {
                    const lg = new THREE.BufferGeometry();
                    lg.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
                    linesMesh = new THREE.LineSegments(lg, lineMat);
                    group.add(linesMesh);
                }

                hub.rotation.y += 0.02;
                ring.rotation.y = time * 1.5;
                ring.rotation.x = Math.sin(time * 0.5) * 0.4;
                hub.material.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.3;
                pointLight.intensity = isHovered ? 5.0 : 3.0;

                const rotSpeed = isHovered ? 0.65 : 0.22;
                group.rotation.y = time * rotSpeed + mouseX * 0.45;
                group.rotation.x = Math.sin(time * 0.4) * 0.08 + mouseY * 0.3;
                group.position.y = Math.sin(time * 1.2 + idx) * 0.1;
                wireframePanel.material.opacity = isHovered ? 0.75 : 0.4;
            };

        } else if (projectType === 'ghost') {
            // Ghost Shell: spinning rings + falling matrix particles + icosahedron
            const rings = [];
            for (let i = 0; i < 4; i++) {
                const rGeo = new THREE.TorusGeometry(0.28 + i * 0.15, 0.012, 4, 48);
                const rMat = new THREE.MeshBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.6 - i * 0.1 });
                const ring = new THREE.Mesh(rGeo, rMat);
                ring.rotation.x = Math.PI / 2;
                ring.rotation.z = (i * Math.PI) / 3;
                group.add(ring);
                rings.push(ring);
            }

            const coreGeo = new THREE.IcosahedronGeometry(0.2, 1);
            const core = new THREE.Mesh(coreGeo, sharedGlowMat.clone());
            group.add(core);

            // Matrix rain particles
            const particleCount = 50;
            const pGeo = new THREE.BufferGeometry();
            const pPos = new Float32Array(particleCount * 3);
            const pSpeeds = [];
            for (let i = 0; i < particleCount; i++) {
                pPos[i * 3]     = (Math.random() - 0.5) * 1.6;
                pPos[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
                pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
                pSpeeds.push(0.006 + Math.random() * 0.018);
            }
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            const pMat = new THREE.PointsMaterial({ color: 0x64ffda, size: 0.04, transparent: true, opacity: 0.85 });
            const particles = new THREE.Points(pGeo, pMat);
            group.add(particles);

            updateFn = (time) => {
                const rotMult = isHovered ? 4.0 : 1.0;
                rings.forEach((ring, ri) => {
                    const dir = ri % 2 === 0 ? 1 : -1;
                    ring.rotation.z += 0.012 * rotMult * dir;
                    ring.rotation.x += 0.004 * rotMult * (ri % 2 === 0 ? 0.5 : -0.5);
                });

                core.rotation.y -= 0.015 * rotMult;
                core.rotation.x += 0.008 * rotMult;

                const pp = particles.geometry.attributes.position.array;
                for (let i = 0; i < particleCount; i++) {
                    pp[i * 3 + 1] -= pSpeeds[i] * rotMult;
                    if (pp[i * 3 + 1] < -1.3) {
                        pp[i * 3 + 1] = 1.3;
                        pp[i * 3] = (Math.random() - 0.5) * 1.6;
                    }
                }
                particles.geometry.attributes.position.needsUpdate = true;

                if (isHovered) {
                    core.scale.setScalar(1.0 + Math.sin(time * 12) * 0.18);
                    pointLight.intensity = 5.0;
                } else {
                    core.scale.setScalar(1);
                    pointLight.intensity = 3.0;
                }

                const rotSpeed = isHovered ? 0.65 : 0.22;
                group.rotation.y = time * rotSpeed + mouseX * 0.45;
                group.rotation.x = Math.sin(time * 0.4) * 0.1 + mouseY * 0.3;
                group.position.y = Math.sin(time * 1.2 + idx) * 0.1;
                wireframePanel.material.opacity = isHovered ? 0.75 : 0.4;
            };

        } else if (projectType === 'ledger') {
            // Ledger: 3D block chain with orbiting cubes & glowing connectors
            const cubes = [];
            const basePositions = [
                new THREE.Vector3(-0.55, 0.55, 0),
                new THREE.Vector3(0.55, 0, 0),
                new THREE.Vector3(-0.55, -0.55, 0),
                new THREE.Vector3(0, 0.55, 0.3)
            ];

            const cubeGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
            basePositions.forEach((pos) => {
                const mat = sharedGlowMat.clone();
                mat.emissive.setHex(0x003d2a);
                const cube = new THREE.Mesh(cubeGeo, mat);
                cube.position.copy(pos);
                group.add(cube);
                cubes.push(cube);
            });

            // Glowing connection lines
            const connGeo = new THREE.BufferGeometry();
            const connPositions = new Float32Array([
                basePositions[0].x, basePositions[0].y, basePositions[0].z,
                basePositions[1].x, basePositions[1].y, basePositions[1].z,
                basePositions[1].x, basePositions[1].y, basePositions[1].z,
                basePositions[2].x, basePositions[2].y, basePositions[2].z,
                basePositions[2].x, basePositions[2].y, basePositions[2].z,
                basePositions[3].x, basePositions[3].y, basePositions[3].z,
                basePositions[3].x, basePositions[3].y, basePositions[3].z,
                basePositions[0].x, basePositions[0].y, basePositions[0].z,
            ]);
            connGeo.setAttribute('position', new THREE.Float32BufferAttribute(connPositions, 3));
            const connMat = new THREE.LineBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.5 });
            group.add(new THREE.LineSegments(connGeo, connMat));

            // Central pulsing orb
            const orbGeo = new THREE.SphereGeometry(0.1, 16, 16);
            const orbMat = new THREE.MeshPhysicalMaterial({
                color: 0x64ffda, emissive: 0x64ffda, emissiveIntensity: 0.8,
                roughness: 0, metalness: 0.3, transparent: true, opacity: 0.9
            });
            const orb = new THREE.Mesh(orbGeo, orbMat);
            group.add(orb);

            updateFn = (time) => {
                const speedMult = isHovered ? 3.5 : 1.0;
                cubes.forEach((cube, ci) => {
                    cube.rotation.x += 0.018 * speedMult * (ci % 2 === 0 ? 1 : -1);
                    cube.rotation.y += 0.012 * speedMult;
                    cube.rotation.z += 0.006 * speedMult * ci;
                    const sw = Math.sin(time * 1.8 + ci * 1.3) * 0.18;
                    cube.position.x = basePositions[ci].x + sw;
                    cube.position.y = basePositions[ci].y + Math.cos(time * 1.4 + ci) * 0.1;
                });

                orb.material.emissiveIntensity = 0.5 + Math.sin(time * 4) * 0.4;
                orb.scale.setScalar(1.0 + Math.sin(time * 5) * 0.12);
                pointLight.intensity = isHovered ? 6.0 : 3.0;

                const rotSpeed = isHovered ? 0.65 : 0.22;
                group.rotation.y = time * rotSpeed + mouseX * 0.45;
                group.rotation.x = Math.sin(time * 0.4) * 0.1 + mouseY * 0.3;
                group.position.y = Math.sin(time * 1.2 + idx) * 0.1;
                wireframePanel.material.opacity = isHovered ? 0.75 : 0.4;
            };
        }

        // Mouse interaction on parent card
        const parentCard = placeholder.closest('.project-ui-overlay');
        if (parentCard) {
            parentCard.addEventListener('mousemove', (e) => {
                const rect = parentCard.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            });
            parentCard.addEventListener('mouseenter', () => { isHovered = true; });
            parentCard.addEventListener('mouseleave', () => { isHovered = false; mouseX = 0; mouseY = 0; });
        }

        // Resize observer keeps canvas pixel dimensions matched to CSS size
        const resizeObserver = new ResizeObserver(() => {
            const w = placeholder.clientWidth;
            const h = placeholder.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        });
        resizeObserver.observe(placeholder);

        // Per-card animation loop
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            updateFn(time);
            renderer.render(scene, camera);
        }
        animate();
    });
}

// ==========================================
// 7. INITIALIZATION CONTROLLER
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic modules pre-initialization
    initGithubGraph();
    initContactForm();
    
    // 2. Boot terminal sequence. Once complete, load visual animations
    initLoadingScreen(() => {
        initScrollReveal();
        initNeonFishBackground();
        initProject3DScenes();
    });
});
