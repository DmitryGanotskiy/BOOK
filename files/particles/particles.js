let particles = document.getElementsByClassName('particles'),
    radius = 1.5,
    number = 40;

Array.from(particles).forEach(node => {
  const color = node.dataset.color,
        ctx = node.getContext('2d'),
        clr = hexToRgbA(color),
        width = window.innerWidth,
        height = window.innerHeight;

  node.width = width;
  node.height = height;

  let dots = {
    num: number,
    distance: 300,
    d_radius: 200,
    velocity: 0.09,
    array: []
  };

  function Dot() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
	this.vx = (Math.random() - 0.5) * dots.velocity; // Randomize velocity direction
    this.vy = (Math.random() - 0.5) * dots.velocity;
    this.radius = Math.random() * radius;
    this.opacity = Math.random(); // Add opacity property
    this.growing = true; // Flag to indicate if the particle is growing or shrinking
  }

  Dot.prototype = {
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = `rgba(${clr.r}, ${clr.g}, ${clr.b}, ${this.opacity})`; // Apply opacity
      ctx.shadowBlur = 20; // Adjust the blur radius for glow effect
      ctx.shadowColor = clr; // Set shadow color to particle color
      ctx.fill();
    },

    animate: function () {
      for (let i = 0; i < dots.num; i++) {
        let dot = dots.array[i];
        if (dot.x < 0 || dot.x > width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        } else if (dot.y < 0 || dot.y > height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Adjust opacity for twinkling effect
        if (dot.growing) {
          dot.opacity += 0.001; // Increase opacity
          if (dot.opacity >= 1) dot.growing = false; // Start shrinking when opacity reaches 1
        } else {
          dot.opacity -= 0.001; // Decrease opacity
          if (dot.opacity <= 0) dot.growing = true; // Start growing when opacity reaches 0
        }
      }
    }
  };

  function createDots() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < dots.num; i++) {
      if (!dots.array[i]) {
        dots.array.push(new Dot());
      }
      let dot = dots.array[i];
      dot.create();
    }
    dots.array.forEach(dot => dot.animate());
  }

  setInterval(createDots, 1000 / 30);
});

function hexToRgbA(hex) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');
    if (c.length == 3) { c = [c[0], c[0], c[1], c[1], c[2], c[2]]; }
    c = `0x${c.join('')}`;
    return {
      r: (c >> 16) & 255,
      g: (c >> 8) & 255,
      b: c & 255
    };
  }
  throw new Error('Bad Hex');
}
