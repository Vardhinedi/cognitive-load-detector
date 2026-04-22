# CLD ( No Sensor)

A browser extension that estimates user cognitive load using interaction patterns such as mouse movement and typing behavior—without requiring hardware sensors.

---

## Features
- Real-time mouse & typing tracking
- Feature engineering (velocity, typing intervals)
- Cognitive load scoring (Focused / Medium / High)
- Dynamic UI adaptation (brightness, grayscale)
- React-based dashboard for visualization

---

## Tech Stack
- React (Vite)
- Chrome Extension (Manifest v3)
- JavaScript

---

## How it Works
1. Capture interaction signals  
2. Aggregate features every 5 seconds  
3. Compute cognitive load score  
4. Adapt UI + display in dashboard  

---

## Demo
(Add screenshot here later)

---

## How to Run

1. Download this repo  
2. Go to `chrome://extensions/`  
3. Enable **Developer Mode**  
4. Click **Load unpacked**  
5. Select this folder  