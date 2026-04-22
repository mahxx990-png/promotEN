class PhysicsEngine {
      constructor() {
                this.gravity = 0.5;
                this.friction = 0.98;
                this.particles = [];
      }

    createParticle(x, y, color) {
              return {
                            x, y,
                            vx: (Math.random() - 0.5) * 10,
                            vy: (Math.random() - 0.5) * 10,
                            life: 1.0,
                            color
              };
    }

    update(data) {
              // Update particles or other physics based on audio data
          if (data && data.length > 0) {
                        const intensity = data.reduce((a, b) => a + b) / data.length;
                        if (intensity > 50) {
                                          for (let i = 0; i < 5; i++) {
                                                                this.particles.push(this.createParticle(
                                                                                          window.innerWidth / 2,
                                                                                          window.innerHeight / 2,
                                                                                          `hsl(${Math.random() * 360}, 70%, 50%)`
                                                                                      ));
                                          }
                        }
          }

          this.particles.forEach((p, index) => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += this.gravity;
                        p.vx *= this.friction;
                        p.vy *= this.friction;
                        p.life -= 0.02;
                        if (p.life <= 0) this.particles.splice(index, 1);
          });
    }
}
window.PhysicsEngine = new PhysicsEngine();
