const canvas = document.getElementById('dino-game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dino = { x: 50, y: canvas.height - 60, w: 40, h: 40, vy: 0, gravity: 2, jump: -25, onGround: true };
let obstacles = [];
let keys = {};

function spawnObstacle() {
  obstacles.push({ x: canvas.width, y: canvas.height - 50, w: 30, h: 50 });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(dino.x, dino.y, dino.w, dino.h);

  obstacles.forEach(obs => {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
  });
}

function update() {
  if (keys[' ']) {
    if (dino.onGround) {
      dino.vy = dino.jump;
      dino.onGround = false;
    }
  }

  dino.y += dino.vy;
  dino.vy += dino.gravity;

  if (dino.y + dino.h >= canvas.height - 20) {
    dino.y = canvas.height - dino.h - 20;
    dino.vy = 0;
    dino.onGround = true;
  }

  obstacles.forEach(obs => obs.x -= 6);
  obstacles = obstacles.filter(obs => obs.x + obs.w > 0);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

setInterval(spawnObstacle, 1500);
requestAnimationFrame(gameLoop);

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

async function lookupNumber() {
  const phone = document.getElementById('phoneInput').value;
  if (!phone) return alert("Please enter a number.");

  const resultBox = document.getElementById('resultBox');
  resultBox.classList.remove('hidden');

  try {
    const [tcpa, person] = await Promise.all([
      fetch(`https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=${phone}`).then(res => res.json()),
      fetch(`https://person.api.uspeoplesearch.net/person/v3?x=${phone}`).then(res => res.json())
    ]);

    const info = person.person[0];
    document.getElementById('name').innerText = info.name || 'N/A';
    document.getElementById('age').innerText = info.age || 'N/A';
    document.getElementById('dob').innerText = info.dob || 'N/A';
    document.getElementById('address').innerText = info.address || 'N/A';
    document.getElementById('city').innerText = info.city || 'N/A';
    document.getElementById('state').innerText = info.state || 'N/A';

    document.getElementById('dnc_national').innerText = tcpa.dnc_national ? 'Yes' : 'No';
    document.getElementById('dnc_state').innerText = tcpa.dnc_state ? 'Yes' : 'No';
    document.getElementById('litigator').innerText = tcpa.litigator ? 'Yes' : 'No';
    document.getElementById('spam').innerText = tcpa.spam ? 'Yes' : 'No';

  } catch (err) {
    alert("Failed to fetch data.");
    console.error(err);
  }
}

function copyResult() {
  const resultBox = document.getElementById('resultBox');
  const text = resultBox.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Result copied to clipboard!");
  });
}
