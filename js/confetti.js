export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const colors = ['#7c5cfc', '#fc5c7d', '#43e97b', '#f9a825', '#4facfe', '#fff'];

  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -100,
    r: Math.random() * 8 + 3,
    d: Math.random() * 90,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.floor(Math.random() * 10) - 10,
    tiltAngleIncrementor: Math.random() * 0.07 + 0.05,
    tiltAngle: 0,
    speed: Math.random() * 2 + 1,
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncrementor;
      p.y += p.speed;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
      ctx.stroke();
    });

    frame++;
    if (frame < 200) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}