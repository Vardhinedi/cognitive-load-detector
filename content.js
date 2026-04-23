// -------- GLOBAL DATASET (optional for logging) --------
let dataset = [];

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

// -------- Scroll Tracking --------
let lastScrollY = window.scrollY;
let lastScrollTime = Date.now();

let scrollSpeeds = [];

window.addEventListener("scroll", () => {
  const currentTime = Date.now();

  const dy = Math.abs(window.scrollY - lastScrollY);
  const dt = currentTime - lastScrollTime;

  if (dt === 0) return;

  const speed = dy / dt;

  scrollSpeeds.push(speed);

  lastScrollY = window.scrollY;
  lastScrollTime = currentTime;
});

// -------- Utility --------
function variance(arr) {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
}

// -------- ML Prediction (based on trained model) --------
function predictLoad(features) {
  const {
    avgVelocity,
    varVelocity,
    avgInterval,
    varTyping
  } = features;

  let score = 0;

  // Learned weights from your model
  score += avgVelocity * 0.4;
  score += varVelocity * 0.3;
  score += avgInterval * 0.0005;
  score += varTyping * 0.00001;

  if (score > 2.5) return "Medium Load";
  return "Focused";
}

// -------- UI Adaptation --------
function applyUI(state) {
  if (state === "Medium Load") {
    document.body.style.filter = "brightness(85%)";
  } else {
    document.body.style.filter = "none";
  }
}

// -------- State Smoothing --------
let stateHistory = [];

function getStableState(currentState) {
  stateHistory.push(currentState);

  if (stateHistory.length > 3) {
    stateHistory.shift();
  }

  const count = {};
  stateHistory.forEach((s) => {
    count[s] = (count[s] || 0) + 1;
  });

  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  );
}

// -------- Aggregation --------
setInterval(() => {
  let avgVelocity = 0;
  let avgInterval = 0;
  let avgScroll = 0;

  let varVelocity = variance(velocities);
  let varTyping = variance(keyIntervals);
  let varScroll = variance(scrollSpeeds);

  if (velocities.length > 0) {
    avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  }

  if (keyIntervals.length > 0) {
    avgInterval = keyIntervals.reduce((a, b) => a + b, 0) / keyIntervals.length;
  }

  if (scrollSpeeds.length > 0) {
    avgScroll = scrollSpeeds.reduce((a, b) => a + b, 0) / scrollSpeeds.length;
  }

  // -------- FILTER NOISE --------
  if (avgVelocity === 0 && avgInterval === 0 && avgScroll === 0) {
    return; // skip useless sample
  }

  // -------- CLAMP VALUES --------
  avgVelocity = Math.min(avgVelocity, 20);
  varVelocity = Math.min(varVelocity, 100);
  avgInterval = Math.min(avgInterval, 2000);

  // -------- FEATURES --------
  const features = {
    avgVelocity,
    varVelocity,
    avgInterval,
    varTyping,
    avgScroll,
    varScroll
  };

  // -------- ML Prediction --------
  let rawState = predictLoad(features);

  let state = getStableState(rawState);

  console.log("State:", state, "| Features:", features);

  applyUI(state);

  // -------- Save to storage --------
  chrome.storage.local.set({
    cognitiveState: state
  });

  // -------- Save dataset (optional) --------
  dataset.push({
    ...features,
    label: state === "Medium Load" ? 1 : 0
  });

  if (dataset.length > 200) dataset.shift();

  // Reset
  velocities = [];
  keyIntervals = [];
  scrollSpeeds = [];
}, 5000);

// -------- EXPORT DATASET --------
setInterval(() => {
  console.log("FULL DATASET:", JSON.stringify(dataset));
}, 30000);