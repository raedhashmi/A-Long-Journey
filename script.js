    // ======================
    // STARFIELD CONFIGURATION
    // ======================
    const starCanvas = document.getElementById("starCanvas");
    const ctx = starCanvas.getContext("2d");
    
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    
    // Starfield parameters
    const stars = [];
    const starBaseSpeed = 1.5;
    const topAngle = 6;    // Vertical perspective adjustment
    const sideAngle = 4;   // Horizontal perspective adjustment

    // Star object factory
    function createStar(targetSpeed) {
        return {
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            z: Math.random() * starCanvas.width,
            speed: 0.5, // Initial speed
            targetSpeed: 0.5 + Math.random() * targetSpeed // Target speed
        };
    }

    // Initialize starfield
    for (let i = 0; i < 900; i++) {
        stars.push(createStar(starBaseSpeed));
    }
    
    // ======================
    // STARFIELD ANIMATION
    // ======================
    function animateStars() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);
        
        ctx.fillStyle = "white";
        for (let star of stars) {
            // Smooth speed transition
            star.speed = THREE.MathUtils.lerp(star.speed, star.targetSpeed, 0.1);
            star.z -= star.speed;

            // Star recycling
            if (star.z <= 0) {
                star.x = Math.random() * starCanvas.width;
                star.y = Math.random() * starCanvas.height;
                star.z = starCanvas.width;
            }

            // Perspective projection
            const sx = (star.x - starCanvas.width/2) * (starCanvas.width/star.z) + starCanvas.width/sideAngle;
            const sy = (star.y - starCanvas.height/2) * (starCanvas.width/star.z) + starCanvas.height/topAngle;
            const radius = Math.max(0.5, 2 - star.z/starCanvas.width * 2);
            
            ctx.beginPath();
            ctx.arc(sx, sy, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(animateStars);

        localStorage.setItem('boost', -221.6711901929367 + Math.random() * 10);
        localStorage.setItem('rotation', Math.random() * 90 - 45);
    }
    
    animateStars();

    // ======================
    // 3D MODEL CONFIGURATION
    // ======================
    const modelCanvas = document.getElementById("modelCanvas");

    const renderer = new THREE.WebGLRenderer({ 
        canvas: modelCanvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true
    });
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 9, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // ======================
    // MODEL LOADING & RENDERING
    // ======================
    new THREE.GLTFLoader().load(
        './aquarius.glb',
        (gltf) => {
            let boost = 0;
            let rotation = 0;
            const model = gltf.scene;
            model.scale.set(2, 2, 2);
            model.rotation.set(0, 0, rotation);
            
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    if (child.material.map) {
                        child.material.map.anisotropy = 16;
                        child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
                        child.material.map.magFilter = THREE.LinearFilter;
                        child.material.map.needsUpdate = true;
                    }
                }
            });
            
            scene.add(model);
            camera.position.set(59.64304614952218, -10.090324644247719, boost);
            camera.lookAt(model.position);
            
            renderer.setSize(modelCanvas.width, modelCanvas.height, true);
            renderer.resetState();

            console.log('RENDERER:', {
                context: renderer.getContext().getParameter(renderer.getContext().VERSION),
                maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
                dpr: window.devicePixelRatio
            });

            // Adjust OrbitControls configuration
            controls.minDistance = 3;
            controls.maxDistance = 5000;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            // Animation loop
            function updateModel() {
                let currentBoost = -200;
                let currentRotation = 0;
                let targetRotation = THREE.MathUtils.degToRad(45 * (Math.random() - 0.5));
                const rotationLerpFactor = 0.06;
                
                function animate() {
                    // Boost interpolation
                    currentBoost = THREE.MathUtils.lerp(
                        currentBoost,
                        -200 + (Math.sin(Date.now() * 0.001) * 30),
                        0.1
                    );

                    // Star speed control
                    if (currentBoost < -200) {
                        // Boost mode - faster stars
                        stars.forEach(star => star.targetSpeed = 0.5 + Math.random() * 10);
                    } else {
                        // Normal mode - reset stars
                        stars.forEach(star => star.targetSpeed = 0.5 + Math.random() * 1.5);
                        if (stars.length > 900) stars.splice(0, stars.length - 900);
                        while (stars.length < 900) stars.push(createStar(1.5));
                    }

                    // Camera animation
                    camera.position.z = currentBoost;

                    // Smooth rotation animation
                    currentRotation = THREE.MathUtils.lerp(
                        currentRotation,
                        targetRotation,
                        rotationLerpFactor
                    );

                    // Update target rotation periodically
                    if (Math.abs(currentRotation - targetRotation) < 0.01) {
                        targetRotation = THREE.MathUtils.degToRad(45 * (Math.random() - 0.5));
                    }

                    // Apply rotation to model
                    model.rotation.z = currentRotation;
                    
                    requestAnimationFrame(animate);
                }
                animate();
            }
            updateModel();
        },
        undefined,
        (error) => console.error(error)
    );

    // ======================
    // WINDOW RESIZE HANDLING
    // ======================
    window.addEventListener('load', () => {
        const setCanvasSize = (canvas) => {
            const rect = canvas.getBoundingClientRect();
            const width = rect.width * window.devicePixelRatio;
            const height = rect.height * window.devicePixelRatio;
            
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
        };
        
        setCanvasSize(starCanvas);
        setCanvasSize(modelCanvas);
        
        camera.aspect = modelCanvas.width / modelCanvas.height;
        camera.updateProjectionMatrix();
        renderer.setSize(modelCanvas.width, modelCanvas.height, false);
        renderer.setPixelRatio(window.devicePixelRatio);
    });
    
    window.addEventListener('resize', () => {
        window.location.reload();
    })

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();