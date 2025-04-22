const API_1 = "https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=";
const API_2 = "https://person.api.uspeoplesearch.net/person/v3?x=";

let darkMode = false;
let recentSearches = [];

function lookupNumber() {
  const phone = document.getElementById("phoneInput").value;
  if (!phone) return alert("Enter a valid number.");

  const resultBox = document.getElementById("result");
  resultBox.innerText = "Loading...";

  fetch(API_1 + phone)
    .then(res => res.json())
    .then(tcpaData => {
      fetch(API_2 + phone)
        .then(res => res.json())
        .then(personData => {
          const p = personData.person?.[0] || {};
          const data = `
📞 Phone: ${phone}
🧍 Name: ${p.first_name || 'N/A'} ${p.last_name || ''}
📍 Address: ${p.address || 'N/A'}, ${p.city || ''}, ${p.state || ''} ${p.zip || ''}
🎂 Age: ${p.age || 'N/A'} | DOB: ${p.dob || 'N/A'}
📵 Blacklisted: ${tcpaData.blacklisted}
🚫 DNC National: ${tcpaData.dnc_national}
🚫 DNC State: ${tcpaData.dnc_state}
⚖️ Litigator: ${tcpaData.litigator}
🌐 Carrier: ${tcpaData.carrier}
      `;
          resultBox.innerText = data;

          addRecentSearch(phone);
        });
    })
    .catch(() => {
      resultBox.innerText = "❌ Failed to fetch data.";
    });
}

function copyResult() {
  const result = document.getElementById("result").innerText;
  navigator.clipboard.writeText(result).then(() => alert("Copied to clipboard!"));
}

function exportPDF() {
  const result = document.getElementById("result").innerText;
  const blob = new Blob([result], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "lookup-result.pdf";
  link.click();
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode");
}

function addRecentSearch(phone) {
  recentSearches.unshift(phone);
  recentSearches = recentSearches.slice(0, 5);
  document.getElementById("recentSearches").innerHTML = "Recent: " + recentSearches.join(", ");
}

// Background game - Chrome Dino
const canvas = document.getElementById('dino-game');
const ctx = canvas.getContext('2d');
let x = 50, y = 130, vy = 0, jumping = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawDino() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0ff";
  ctx.fillRect(x, y, 50, 50);
  requestAnimationFrame(drawDino);
}

function gravity() {
  if (jumping) {
    vy += 0.5;
    y += vy;
    if (y >= 130) {
      y = 130;
      vy = 0;
      jumping = false;
    }
  }
  setTimeout(gravity, 20);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !jumping) {
    jumping = true;
    vy = -10;
  }
});

drawDino();
gravity();
