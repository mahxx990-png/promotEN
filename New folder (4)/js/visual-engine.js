// Visual Engine: Three.js Particles + GSAP Animations
document.addEventListener('DOMContentLoaded', () => {

    // ─── GSAP Entrance ───
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".app-header h1", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
    });

    gsap.from(".orb-container", {
        scale: 0.6,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
        delay: 0.5
    });

    gsap.from(".output-card", {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4
    });

    gsap.from(".section-tag", {
        opacity: 0,
        y: 10,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.6
    });

    // ─── Three.js Background ───
    const canvas = document.getElementById('background-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    // ── Particle Field ──
    const count = 1800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
        positions[i]     = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.025,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ── Grid Lines ──
    const gridGeo = new THREE.BufferGeometry();
    const gridVerts = [];
    const gridSize = 20, gridDivisions = 20;
    const step = gridSize / gridDivisions;
    const half = gridSize / 2;

    for (let i = 0; i <= gridDivisions; i++) {
        gridVerts.push(-half, -3, i * step - half);
        gridVerts.push( half, -3, i * step - half);
        gridVerts.push(i * step - half, -3, -half);
        gridVerts.push(i * step - half, -3,  half);
    }

    gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridVerts), 3));
    const gridMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.07 });
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    scene.add(grid);

    // ── Mouse Parallax ──
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let targetRotX = 0, targetRotY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        gsap.to(cursorGlow, {
            left: mouseX,
            top: mouseY,
            duration: 0.8,
            ease: "power2.out"
        });

        targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.3;
        targetRotX = (e.clientY / window.innerHeight - 0.5) * -0.2;
    });

    // ── Animation Loop ──
    const clock = new THREE.Clock();
    const animate = () => {
        const t = clock.getElapsedTime();

        particles.rotation.y += 0.0004;
        particles.rotation.x = 0.0002 * Math.sin(t * 0.5);

        grid.rotation.y = targetRotY * 0.5;

        // Breathing material opacity
        mat.opacity = 0.35 + 0.1 * Math.sin(t * 0.7);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
