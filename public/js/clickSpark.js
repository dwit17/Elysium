/**
 * ClickSpark - Vanilla JS Implementation of React-Bits ClickSpark
 * High-performance, Retina-aware canvas spark particle effect on user click.
 */
(function () {
  'use strict';

  class ClickSpark {
    constructor(options = {}) {
      this.sparkColor = options.sparkColor || '#ffffff';
      this.sparkSize = options.sparkSize !== undefined ? options.sparkSize : 10;
      this.sparkRadius = options.sparkRadius !== undefined ? options.sparkRadius : 15;
      this.sparkCount = options.sparkCount !== undefined ? options.sparkCount : 8;
      this.duration = options.duration !== undefined ? options.duration : 400;
      this.easing = options.easing || 'ease-out';
      this.extraScale = options.extraScale !== undefined ? options.extraScale : 1.0;

      this.sparks = [];
      this.animationId = null;
      this.canvas = null;
      this.ctx = null;
      this.dpr = 1;

      this.init();
    }

    easeFunc(t) {
      switch (this.easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        case 'ease-out':
        default:
          return t * (2 - t);
      }
    }

    init() {
      // Find or create global overlay canvas
      let canvas = document.getElementById('click-spark-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'click-spark-canvas';
        canvas.className = 'click-spark-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        canvas.style.userSelect = 'none';
        document.body.appendChild(canvas);
      }

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      this.handleResize();
      window.addEventListener('resize', () => this.handleResize(), { passive: true });

      // Listen on pointerdown for instant tactile response
      window.addEventListener('pointerdown', (e) => this.handleClick(e), { passive: true });
    }

    handleResize() {
      if (!this.canvas) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.canvas.width = Math.floor(width * this.dpr);
      this.canvas.height = Math.floor(height * this.dpr);
    }

    handleClick(e) {
      if (!this.canvas || !this.ctx) return;

      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      for (let i = 0; i < this.sparkCount; i++) {
        this.sparks.push({
          x: x,
          y: y,
          angle: (2 * Math.PI * i) / this.sparkCount,
          startTime: now
        });
      }

      if (!this.animationId) {
        this.animationId = requestAnimationFrame((timestamp) => this.draw(timestamp));
      }
    }

    draw(timestamp) {
      if (!this.ctx || !this.canvas) return;

      const dpr = this.dpr;
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.scale(dpr, dpr);

      this.sparks = this.sparks.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= this.duration) {
          return false;
        }

        const progress = elapsed / this.duration;
        const eased = this.easeFunc(progress);

        const distance = eased * this.sparkRadius * this.extraScale;
        const lineLength = this.sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = this.sparkColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      ctx.restore();

      if (this.sparks.length > 0) {
        this.animationId = requestAnimationFrame((timestamp) => this.draw(timestamp));
      } else {
        this.animationId = null;
        ctx.clearRect(0, 0, width, height);
      }
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.clickSparkInstance = new ClickSpark({
        sparkColor: '#ffffff',
        sparkSize: 10,
        sparkRadius: 15,
        sparkCount: 8,
        duration: 400,
        easing: 'ease-out',
        extraScale: 1.0
      });
    });
  } else {
    window.clickSparkInstance = new ClickSpark({
      sparkColor: '#ffffff',
      sparkSize: 10,
      sparkRadius: 15,
      sparkCount: 8,
      duration: 400,
      easing: 'ease-out',
      extraScale: 1.0
    });
  }

  window.ClickSpark = ClickSpark;
})();
