// Dino Game Logic
const canvas = document.getElementById("dino-game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dino = {
  x: 50,
  y: canvas.height - 100,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 1.5,
  jumpPower: -20,
  grounded: true,
};

let obstacles = [];
let frame = 0;
let gameSpeed = 6;

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && dino.grounded) {
    dino.dy = dino.jumpPower;
    dino.grounded = false;
  }
});

function drawDino() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
  ctx.fillStyle = "#ff5050";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dino Physics
  dino.y += dino.dy;
  dino.dy += dino.gravity;

  if (dino.y >= canvas.height - 100) {
    dino.y = canvas.height - 100;
    dino.dy = 0;
    dino.grounded = true;
  }

  // Obstacle logic
  if (frame % 90 === 0) {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - 50,
      width: 30,
      height: 50,
    });
  }

  obstacles.forEach((obs, i) => {
    obs.x -= gameSpeed;
    if (obs.x + obs.width < 0) obstacles.splice(i, 1);

    // Collision detection
    if (
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      obstacles = [];
      alert("Game Over! Reload to try again.");
    }
  });

  drawDino();
  drawObstacles();
  frame++;
  requestAnimationFrame(updateGame);
}

updateGame();


// Lookup Logic
async function lookupNumber() {
  const phone = document.getElementById("phone-input").value.trim();
  const resultDiv = document.getElementById("result");

  if (!phone) {
    resultDiv.innerHTML = "Please enter a phone number.";
    return;
  }

  resultDiv.innerHTML = "🔍 Fetching...";

  try {
    const tcpaRes = await fetch(`https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=${phone}`);
    const tcpaData = await tcpaRes.json();

    const personRes = await fetch(`https://person.api.uspeoplesearch.net/person/v3?x=${phone}`);
    const personData = await personRes.json();

    let html = `<strong>📞 Phone: </strong>${phone}<br/>`;

    if (tcpaData) {
      html += `<strong>Litigator:</strong> ${tcpaData.litigator ? 'Yes' : 'No'}<br/>`;
      html += `<strong>Blacklist:</strong> ${tcpaData.blacklist ? 'Yes' : 'No'}<br/>`;
      html += `<strong>DNC National:</strong> ${tcpaData.dnc_national ? 'Yes' : 'No'}<br/>`;
      html += `<strong>DNC State:</strong> ${tcpaData.dnc_state ? 'Yes' : 'No'}<br/>`;
      html += `<strong>State:</strong> ${tcpaData.state}<br/>`;
    }

    if (personData && personData.person && personData.person.length > 0) {
      const p = personData.person[0];
      html += `<br/><strong>👤 Name:</strong> ${p.name}<br/>`;
      html += `<strong>Age:</strong> ${p.age}<br/>`;
      html += `<strong>DOB:</strong> ${p.dob}<br/>`;
      html += `<strong>Address:</strong> ${p.address}, ${p.city}, ${p.state} ${p.zip}<br/>`;
    }

    resultDiv.innerHTML = html;

  } catch (err) {
    resultDiv.innerHTML = "❌ Failed to fetch data.";
    console.error(err);
  }
}
