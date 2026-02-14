// Puppet Master - Web Edition
// Physics-based ragdoll sandbox game using Three.js

// Global variables
let scene, camera, renderer;
let puppet, puppetParts = {};
let selectedPart = null;
let isDragging = false;
let currentTool = 'drag';
let score = 0;
let slowMotion = false;
let clock = new THREE.Clock();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Physics constants
const GRAVITY = -9.8;
const PUPPET_MASS = 1.0;
const ELASTICITY = 0.7;

// Initialize the game
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8B4513); // Wooden color
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-canvas').appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513, // Wooden color
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create walls to contain the puppet
    const wallPositions = [
        { x: 0, y: 2.5, z: -10 },
        { x: 0, y: 2.5, z: 10 },
        { x: -10, y: 2.5, z: 0 },
        { x: 10, y: 2.5, z: 0 }
    ];
    
    wallPositions.forEach(pos => {
        const wallGeometry = new THREE.BoxGeometry(pos.x === 0 ? 20 : 0.1, 5, pos.z === 0 ? 20 : 0.1);
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z));
        wall.castShadow = true;
        scene.add(wall);
    });
    
    // Create the puppet
    createPuppet();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start animation loop
    animate();
}

// Create the puppet with physics
function createPuppet() {
    // Puppet root
    puppet = new THREE.Group();
    scene.add(puppet);
    
    // Define puppet dimensions
    const headRadius = 0.5;
    const torsoHeight = 1.5;
    const limbLength = 1.0;
    const limbRadius = 0.2;
    
    // Materials for puppet parts
    const puppetMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B4513, // Burlap brown
        shininess: 30
    });
    
    // Head
    const headGeometry = new THREE.SphereGeometry(headRadius, 16, 16);
    const headMesh = new THREE.Mesh(headGeometry, puppetMaterial);
    headMesh.castShadow = true;
    headMesh.position.y = torsoHeight + headRadius;
    puppet.add(headMesh);
    puppetParts.head = {
        mesh: headMesh,
        position: new THREE.Vector3(0, torsoHeight + headRadius, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
    };
    
    // Torso
    const torsoGeometry = new THREE.CylinderGeometry(0.4, 0.4, torsoHeight, 16);
    const torsoMesh = new THREE.Mesh(torsoGeometry, puppetMaterial);
    torsoMesh.castShadow = true;
    torsoMesh.position.y = torsoHeight / 2;
    puppet.add(torsoMesh);
    puppetParts.torso = {
        mesh: torsoMesh,
        position: new THREE.Vector3(0, torsoHeight / 2, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
    };
    
    // Left Arm
    const leftArmGeometry = new THREE.CylinderGeometry(limbRadius, limbRadius, limbLength, 8);
    const leftArmMesh = new THREE.Mesh(leftArmGeometry, puppetMaterial);
    leftArmMesh.castShadow = true;
    leftArmMesh.position.set(-0.5, torsoHeight * 0.75, 0);
    leftArmMesh.rotation.z = Math.PI / 2;
    puppet.add(leftArmMesh);
    puppetParts.leftArm = {
        mesh: leftArmMesh,
        position: new THREE.Vector3(-0.5, torsoHeight * 0.75, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
    };
    
    // Right Arm
    const rightArmGeometry = new THREE.CylinderGeometry(limbRadius, limbRadius, limbLength, 8);
    const rightArmMesh = new THREE.Mesh(rightArmGeometry, puppetMaterial);
    rightArmMesh.castShadow = true;
    rightArmMesh.position.set(0.5, torsoHeight * 0.75, 0);
    rightArmMesh.rotation.z = -Math.PI / 2;
    puppet.add(rightArmMesh);
    puppetParts.rightArm = {
        mesh: rightArmMesh,
        position: new THREE.Vector3(0.5, torsoHeight * 0.75, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
    };
    
    // Left Leg
    const leftLegGeometry = new THREE.CylinderGeometry(limbRadius, limbRadius, limbLength, 8);
    const leftLegMesh = new THREE.Mesh(leftLegGeometry, puppetMaterial);
    leftLegMesh.castShadow = true;
    leftLegMesh.position.set(-0.3, limbLength / 2, 0);
    puppet.add(leftLegMesh);
    puppetParts.leftLeg = {
        mesh: leftLegMesh,
        position: new THREE.Vector3(-0.3, limbLength / 2, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
    };
    
    // Right Leg
    const rightLegGeometry = new THREE.CylinderGeometry(limbRadius, limbRadius, limbLength, 8);
    const rightLegMesh = new THREE.Mesh(rightLegGeometry, puppetMaterial);
    rightLegMesh.castShadow = true;
    rightLegMesh.position.set(0.3, limbLength / 2, 0);
    puppet.add(rightLegMesh);
    puppetParts.rightLeg = {
        mesh: rightLegMesh,
        position: new THREE.Vector3(0.3, limbLength / 2, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
    };
    
    // Position the puppet in the center
    puppet.position.set(0, 0, 0);
}

// Set up event listeners
function setupEventListeners() {
    // Mouse/touch events
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Tool selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
        });
    });
    
    // Control buttons
    document.getElementById('reset-btn').addEventListener('click', resetPuppet);
    document.getElementById('slowmo-btn').addEventListener('click', toggleSlowMotion);
}

// Mouse event handlers
function onMouseDown(event) {
    if (currentTool === 'drag') {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(Object.values(puppetParts).map(part => part.mesh));
        
        if (intersects.length > 0) {
            selectedPart = intersects[0].object;
            isDragging = true;
        }
    } else {
        applyToolForce(event.clientX, event.clientY);
    }
}

function onMouseMove(event) {
    if (isDragging && selectedPart) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate intersection point with a plane at the puppet's height
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), puppet.position.y);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);
        
        // Apply force to the selected part
        const part = Object.values(puppetParts).find(p => p.mesh === selectedPart);
        if (part) {
            // Calculate direction from current position to mouse position
            const direction = new THREE.Vector3(
                intersection.x - part.position.x,
                intersection.y - part.position.y,
                intersection.z - part.position.z
            ).multiplyScalar(0.1); // Scale down the force
            
            part.velocity.add(direction);
        }
    }
}

function onMouseUp() {
    isDragging = false;
    selectedPart = null;
}

// Touch event handlers
function onTouchStart(event) {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        if (currentTool === 'drag') {
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(Object.values(puppetParts).map(part => part.mesh));
            
            if (intersects.length > 0) {
                selectedPart = intersects[0].object;
                isDragging = true;
            }
        } else {
            applyToolForce(touch.clientX, touch.clientY);
        }
        event.preventDefault();
    }
}

function onTouchMove(event) {
    if (event.touches.length > 0 && isDragging && selectedPart) {
        const touch = event.touches[0];
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), puppet.position.y);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);
        
        const part = Object.values(puppetParts).find(p => p.mesh === selectedPart);
        if (part) {
            const direction = new THREE.Vector3(
                intersection.x - part.position.x,
                intersection.y - part.position.y,
                intersection.z - part.position.z
            ).multiplyScalar(0.1);
            
            part.velocity.add(direction);
        }
        event.preventDefault();
    }
}

function onTouchEnd() {
    isDragging = false;
    selectedPart = null;
}

// Apply force based on selected tool
function applyToolForce(x, y) {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(puppetParts).map(part => part.mesh));
    
    if (intersects.length > 0) {
        const part = Object.values(puppetParts).find(p => p.mesh === intersects[0].object);
        if (part) {
            switch(currentTool) {
                case 'hammer':
                    part.velocity.y += 2.0;
                    part.velocity.x += (Math.random() - 0.5) * 1.0;
                    part.velocity.z += (Math.random() - 0.5) * 1.0;
                    updateScore(5);
                    break;
                    
                case 'knife':
                    // Apply cutting force
                    part.velocity.x += (Math.random() - 0.5) * 3.0;
                    part.velocity.z += (Math.random() - 0.5) * 3.0;
                    part.velocity.y += Math.random() * 1.0;
                    updateScore(10);
                    break;
                    
                case 'nail':
                    // Apply pinning force (temporary constraint)
                    part.velocity.multiplyScalar(0.1);
                    updateScore(3);
                    break;
                    
                case 'fire':
                    // Apply explosive force
                    part.velocity.x += (Math.random() - 0.5) * 4.0;
                    part.velocity.y += Math.random() * 3.0;
                    part.velocity.z += (Math.random() - 0.5) * 4.0;
                    updateScore(15);
                    break;
            }
        }
    }
}

// Update score
function updateScore(points) {
    score += points;
    document.getElementById('score-value').textContent = score;
}

// Reset puppet to initial state
function resetPuppet() {
    // Reset all parts to their initial positions
    Object.keys(puppetParts).forEach(key => {
        const part = puppetParts[key];
        part.position.copy(part.mesh.position);
        part.velocity.set(0, 0, 0);
        part.acceleration.set(0, 0, 0);
    });
    
    // Reset puppet group position
    puppet.position.set(0, 0, 0);
    puppet.rotation.set(0, 0, 0);
    
    // Reset score
    score = 0;
    document.getElementById('score-value').textContent = score;
}

// Toggle slow motion
function toggleSlowMotion() {
    slowMotion = !slowMotion;
    const btn = document.getElementById('slowmo-btn');
    btn.classList.toggle('active', slowMotion);
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Calculate delta time
    let deltaTime = clock.getDelta();
    if (slowMotion) {
        deltaTime *= 0.3; // Slow motion effect
    }
    
    // Update physics
    updatePhysics(deltaTime);
    
    // Render the scene
    renderer.render(scene, camera);
}

// Update physics for all puppet parts
function updatePhysics(deltaTime) {
    // Apply physics to each puppet part
    Object.keys(puppetParts).forEach(key => {
        const part = puppetParts[key];
        
        // Apply gravity
        part.acceleration.y = GRAVITY * PUPPET_MASS;
        
        // Update velocity based on acceleration
        part.velocity.add(part.acceleration.clone().multiplyScalar(deltaTime));
        
        // Update position based on velocity
        part.position.add(part.velocity.clone().multiplyScalar(deltaTime));
        
        // Apply damping to simulate air resistance
        part.velocity.multiplyScalar(0.98);
        
        // Boundary checks to keep parts in the scene
        if (part.position.x < -9) {
            part.position.x = -9;
            part.velocity.x *= -ELASTICITY;
        } else if (part.position.x > 9) {
            part.position.x = 9;
            part.velocity.x *= -ELASTICITY;
        }
        
        if (part.position.z < -9) {
            part.position.z = -9;
            part.velocity.z *= -ELASTICITY;
        } else if (part.position.z > 9) {
            part.position.z = 9;
            part.velocity.z *= -ELASTICITY;
        }
        
        // Floor collision
        if (part.position.y < 0.5) {
            part.position.y = 0.5;
            part.velocity.y *= -ELASTICITY;
            part.velocity.x *= 0.8; // Friction
            part.velocity.z *= 0.8;
        }
        
        // Update the mesh position to match the calculated position
        part.mesh.position.copy(part.position);
    });
    
    // Update puppet group based on head position (as reference point)
    if (puppetParts.head) {
        puppet.position.y = puppetParts.head.position.y - 2.0; // Adjust based on head height
    }
}

// Initialize the game when the page loads
window.onload = init;