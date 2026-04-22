// Physics Engine: Matter.js Implementation
const NeuralPhysics = {
    engine: null,
    render: null,
    world: null,
    bodies: [],

    init() {
        const container = document.querySelector('#physics-container');
        const width = window.innerWidth;
        const height = window.innerHeight * 2.5; // Dynamic height for scrolling

        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.world.gravity.y = 0.5;

        this.render = Matter.Render.create({
            element: container,
            engine: this.engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: 'transparent'
            }
        });

        // Invisible Boundaries
        const ground = Matter.Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true });
        const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
        const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });
        
        Matter.World.add(this.world, [ground, leftWall, rightWall]);

        // Mouse Constraint
        const mouse = Matter.Mouse.create(this.render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        Matter.World.add(this.world, mouseConstraint);

        // Map HTML elements to physics
        this.bindElements();

        Matter.Runner.run(this.engine);
        // Render.run(this.render); // Keep hidden for clean UI, only use for debugging
    },

    bindElements() {
        const elements = document.querySelectorAll('.physics-element');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const body = Matter.Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + window.scrollY + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.5,
                    friction: 0.1,
                    chamfer: { radius: 20 },
                    render: { visible: false }
                }
            );

            this.bodies.push({ body, el });
            Matter.World.add(this.world, body);
        });

        this.updateLoop();
    },

    updateLoop() {
        const update = () => {
            this.bodies.forEach(({ body, el }) => {
                const { x, y } = body.position;
                const angle = body.angle;

                // Sync HTML element to physics body
                el.style.transform = `translate(${x - el.offsetLeft - el.offsetWidth / 2}px, ${y - window.scrollY - el.offsetTop - el.offsetHeight / 2}px) rotate(${angle}rad)`;
            });

            requestAnimationFrame(update);
        };

        update();
    },

    spawnParticle(x, y) {
        const particle = Matter.Bodies.circle(x, y, Math.random() * 10 + 5, {
            restitution: 0.8,
            render: { fillStyle: '#6366f1' }
        });
        Matter.World.add(this.world, particle);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    NeuralPhysics.init();
});
