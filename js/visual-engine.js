class VisualEngine {
  constructor() {
    this.canvas = document.getElementById('visualizer');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

    resize() {
              this.canvas.width = window.innerWidth;
              this.canvas.height = window.innerHeight;
    }

    draw(audioData, physicsData) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

              // Draw audio visualization
      if (audioData) {
        this.ctx.beginPath();
                    const sliceWidth = this.canvas.width / audioData.length;
                    let x = 0;
        for (let i = 0; i < audioData.length; i++) {
          const v = audioData[i] / 128.0;
                          const y = v * this.canvas.height / 2;
          if (i === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
                          x += sliceWidth;
        }
                      this.ctx.strokeStyle = '#00ff00';
        this.ctx.stroke();
      }

                // Draw physics particles
        if (physicsData && physicsData.particles) {
          physicsData.particles.forEach(p => {
                            this.ctx.globalAlpha = p.life;
                            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
          });
                      this.ctx.globalAlpha = 1.0;
        }
        }
        }
          window.VisualEngine = new VisualEngine();
