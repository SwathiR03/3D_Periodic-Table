// 3D Periodic Table Visualization
const elements = [
    { 
        symbol: 'H', 
        atomicNumber: 1, 
        atomicMass: 1.008, 
        funFact: 'Hydrogen is the most abundant element in the universe' 
    },
    { 
        symbol: 'He', 
        atomicNumber: 2, 
        atomicMass: 4.003, 
        funFact: 'Helium was first discovered in the sun before being found on Earth' 
    },
    { 
        symbol: 'Li', 
        atomicNumber: 3, 
        atomicMass: 6.941, 
        funFact: 'Lithium is used in rechargeable batteries for electric vehicles' 
    },
    { 
        symbol: 'Be', 
        atomicNumber: 4, 
        atomicMass: 9.012, 
        funFact: 'Beryllium is used in aerospace and military applications' 
    },
    { 
        symbol: 'B', 
        atomicNumber: 5, 
        atomicMass: 10.81, 
        funFact: 'Boron is used in making heat-resistant glass' 
    },
    { 
        symbol: 'C', 
        atomicNumber: 6, 
        atomicMass: 12.01, 
        funFact: 'Carbon is the basis of all known life' 
    },
    { 
        symbol: 'N', 
        atomicNumber: 7, 
        atomicMass: 14.01, 
        funFact: '78% of Earth\'s atmosphere is nitrogen' 
    },
    { 
        symbol: 'O', 
        atomicNumber: 8, 
        atomicMass: 16.00, 
        funFact: 'Oxygen is essential for most life forms' 
    },
    { 
        symbol: 'F', 
        atomicNumber: 9, 
        atomicMass: 19.00, 
        funFact: 'Fluorine is the most reactive of all elements' 
    },
    { 
        symbol: 'Ne', 
        atomicNumber: 10, 
        atomicMass: 20.18, 
        funFact: 'Neon is used in illuminated signs' 
    },
    { 
        symbol: 'Na', 
        atomicNumber: 11, 
        atomicMass: 22.99, 
        funFact: 'Sodium is a key component of table salt' 
    },
    { 
        symbol: 'Mg', 
        atomicNumber: 12, 
        atomicMass: 24.31, 
        funFact: 'Magnesium is crucial for plant chlorophyll' 
    },
    { 
        symbol: 'Al', 
        atomicNumber: 13, 
        atomicMass: 26.98, 
        funFact: 'Aluminum is the most abundant metal in Earth\'s crust' 
    },
    { 
        symbol: 'Si', 
        atomicNumber: 14, 
        atomicMass: 28.09, 
        funFact: 'Silicon is the primary component of computer chips' 
    },
    { 
        symbol: 'P', 
        atomicNumber: 15, 
        atomicMass: 30.97, 
        funFact: 'Phosphorus is essential for DNA and cell membranes' 
    },
    { 
        symbol: 'S', 
        atomicNumber: 16, 
        atomicMass: 32.07, 
        funFact: 'Sulfur is used in gunpowder and matches' 
    },
    { 
        symbol: 'Cl', 
        atomicNumber: 17, 
        atomicMass: 35.45, 
        funFact: 'Chlorine is used to disinfect water' 
    },
    { 
        symbol: 'Ar', 
        atomicNumber: 18, 
        atomicMass: 39.95, 
        funFact: 'Argon is the third most abundant gas in Earth\'s atmosphere' 
    },
    { 
        symbol: 'K', 
        atomicNumber: 19, 
        atomicMass: 39.10, 
        funFact: 'Potassium is crucial for nerve and muscle function' 
    },
    { 
        symbol: 'Ca', 
        atomicNumber: 20, 
        atomicMass: 40.08, 
        funFact: 'Calcium is the primary component of bones and teeth' 
    }
];

// Sort elements by atomic number to ensure correct order
elements.sort((a, b) => a.atomicNumber - b.atomicNumber);

let scene, camera, renderer, raycaster, selectedElement = null;
const elementMeshes = [];
const keyboard = {};

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Raycaster for element selection
    raycaster = new THREE.Raycaster();

    // Create element cubes
    elements.forEach((element, index) => {
        const geometry = new THREE.BoxGeometry(4, 6, 2);  // More rectangular cubes
        const material = new THREE.MeshPhongMaterial({ color: getElementColor(element.atomicNumber) });
        const cube = new THREE.Mesh(geometry, material);

        // Custom positioning for first 10 elements (Hydrogen to Neon)
        if (index < 10) {
            // First row
            cube.position.x = (index - 4.5) * 6;  // Centered positioning
            cube.position.y = 8;  // First row
        } else if (index < 20) {
            // Second row
            cube.position.x = ((index - 10) - 4.5) * 6;  // Centered positioning
            cube.position.y = -8;  // Second row
        }

        // Add text to the cube
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;  // Larger canvas
        canvas.height = 512;  // Larger canvas
        context.fillStyle = 'white';
        context.font = 'Bold 50px Arial';  // Adjusted font size
        context.textAlign = 'center';
        context.fillText(`${element.symbol}`, 256, 180);
        context.fillText(`#${element.atomicNumber}`, 256, 250);
        context.fillText(`Mass: ${element.atomicMass}`, 256, 320);

        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({ map: texture });
        cube.material = [
            material, material, material, material, 
            textMaterial, material
        ];

        // Add element data to the cube
        cube.elementData = element;

        scene.add(cube);
        elementMeshes.push(cube);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    scene.add(pointLight);

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    renderer.domElement.addEventListener('wheel', onMouseWheel, false);
}

function getElementColor(atomicNumber) {
    const colors = [
        0xff6666, 0xffcc66, 0xffff66, 0xccff66, 
        0x66ff66, 0x66ffcc, 0x66ccff, 0x6666ff, 
        0xcc66ff, 0xff66cc, 0xff9933, 0xffcc99, 
        0x99ff99, 0x99ccff, 0x9966ff, 0xff6699, 
        0x66ffcc, 0x99ffcc, 0xccff99, 0xff99cc
    ];
    return colors[atomicNumber - 1];
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycasting for hover effects
    const mouse = new THREE.Vector2(mouseX, mouseY);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(elementMeshes);

    elementMeshes.forEach(cube => {
        // Highlight hovered cube
        if (intersects.length > 0 && intersects[0].object === cube) {
            cube.scale.set(1.1, 1.1, 1.1);
        } else {
            cube.scale.set(1, 1, 1);
        }
    });
}

function onMouseClick(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    const mouse = new THREE.Vector2(mouseX, mouseY);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(elementMeshes);

    if (intersects.length > 0) {
        selectedElement = intersects[0].object.elementData;
        updateFactDisplay();
    }
}

function updateFactDisplay() {
    const factDisplay = document.getElementById('fact-display');
    if (selectedElement) {
        factDisplay.innerHTML = `
            <strong>${selectedElement.symbol} - Element #${selectedElement.atomicNumber}</strong><br>
            ${selectedElement.funFact}
        `;
    }
}

function onKeyDown(event) {
    keyboard[event.key.toLowerCase()] = true;
}

function onKeyUp(event) {
    keyboard[event.key.toLowerCase()] = false;
}

function handleMovement() {
    const moveSpeed = 0.2;
    
    if (keyboard['w']) camera.position.y += moveSpeed;
    if (keyboard['s']) camera.position.y -= moveSpeed;
    if (keyboard['a']) camera.position.x -= moveSpeed;
    if (keyboard['d']) camera.position.x += moveSpeed;
}

function onMouseWheel(event) {
    // Prevent default scrolling
    event.preventDefault();

    // Zoom in/out based on wheel delta
    const zoomSpeed = 0.1;
    const delta = event.deltaY;

    // Adjust camera z-position (zoom)
    camera.position.z += delta * zoomSpeed;

    // Limit zoom range
    camera.position.z = Math.max(10, Math.min(camera.position.z, 100));
}

function animate() {
    requestAnimationFrame(animate);
    
    // Handle camera movement
    handleMovement();
    
    renderer.render(scene, camera);
}

init();
animate();
