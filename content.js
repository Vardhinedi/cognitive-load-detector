// -------- Mouse Tracking --------
let lastX = 0;
let lastY = 0;
let lastTime = Date.now();

let velocities = [];

document.addEventListener("mousemove", (e) => {
  const currentTime = Date.now();

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const dt = currentTime - lastTime;

  if (dt === 0) return;

  const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

  velocities.push(velocity);

  lastX = e.clientX;
  lastY = e.clientY;
  lastTime = currentTime;
});

// -------- Typing Tracking --------
let lastKeyTime = Date.now();
let keyIntervals = [];

document.addEventListener("keydown", () => {
  const currentTime = Date.now();
  const interval = currentTime - lastKeyTime;

  keyIntervals.push(interval);

  lastKeyTime = currentTime;
});

// -------- UI Adaptation --------
function applyUI(state) {
  if (state === "High Load") {
    document.body.style.filter = "brightness(70%) grayscale(20%)";
  } else if (state === "Medium Load") {
    document.body.style.filter = "brightness(85%)";
  } else {
    document.body.style.filter = "none";
  }
}

// -------- 🔥 State Smoothing (NEW) --------
let stateHistory = [];

function getStableState(currentState) {
  stateHistory.push(currentState);

  // keep last 3 states
  if (stateHistory.length > 3) {
    stateHistory.shift();
  }

  // majority voting
  const count = {};
  stateHistory.forEach((s) => {
    count[s] = (count[s] || 0) + 1;
  });

  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  );
}

// -------- Aggregation + Cognitive Load --------
setInterval(() => {
  let avgVelocity = 0;
  let avgInterval = 0;

  if (velocities.length > 0) {
    avgVelocity =
      velocities.reduce((a, b) => a + b, 0) / velocities.length;
  }

  if (keyIntervals.length > 0) {
    avgInterval =
      keyIntervals.reduce((a, b) => a + b, 0) / keyIntervals.length;
  }

  let loadScore = 0;

  // Typing signals
  if (avgInterval > 800) loadScore += 1;
  if (avgInterval > 2000) loadScore += 1;

  // Mouse signals
  if (avgVelocity < 0.5) loadScore += 1;
  if (avgVelocity < 0.2) loadScore += 1;

  // -------- Raw State --------
  let rawState = "Focused";
  if (loadScore >= 3) rawState = "High Load";
  else if (loadScore === 2) rawState = "Medium Load";

  // -------- 🔥 Apply Smoothing --------
  let state = getStableState(rawState);

  console.log("Raw:", rawState, "| Stable:", state, "| Score:", loadScore);

  // Apply UI
  applyUI(state);

  // Save to storage
  chrome.storage.local.set(
    {
      cognitiveState: state,
      cognitiveScore: loadScore
    },
    () => {
      console.log("✅ Data saved to storage:", state, loadScore);
    }
  );

  // Reset buffers
  velocities = [];
  keyIntervals = [];
}, 5000);