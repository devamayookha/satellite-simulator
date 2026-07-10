# 🛰️ Satellite Constellation Coverage Simulator

An interactive web-based simulator that visualizes satellite orbits, calculates real-time Earth coverage, and identifies coverage gaps using a simplified 2D equirectangular projection.

![Dashboard Screenshot](screenshot.png)

## 📖 About the Project

Visualizing how satellite constellations (like Starlink or OneWeb) provide global coverage is complex. Traditional tools require heavy 3D rendering or complex orbital mechanics.

I built this project to demonstrate how a lightweight, 2D mathematical model can accurately simulate satellite ground tracks and coverage footprints in real-time. It allows users to configure constellation parameters and instantly see how they impact global coverage and blind spots.

## 🛠️ Tech Stack

* **Backend:** Python, Flask
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6)
* **Graphics:** HTML5 `<canvas>` for high-performance 2D rendering
* **Math:** Simplified kinematic orbital projection (Sine-wave ground tracks)

## 🚀 How to Run Locally

This project runs entirely on your local machine. No databases or external APIs are required.

1. **Clone the repository:**
```bash
   git clone https://github.com/your-username/satellite-simulator.git
   cd satellite-simulator
```

2. **Install dependencies:**
```bash
   pip install flask
```

3. **Run the server:**
```bash
   python app.py
```

4. **Open your browser:**
   Navigate to `http://127.0.0.1:5000`

## How to Use

* **Constellation Config:** Adjust the number of satellites, orbital planes, altitude, inclination, and coverage radius. Click "Update Simulation" to apply changes.
* **Simulation Controls:** Use the Play/Pause button to freeze the simulation, and the slider to speed up time (up to 50x).
* **Live Stats:** Watch the "Current Coverage" percentage update in real-time. The "Max Coverage" tracks the highest coverage achieved during the session.
* **Visuals:** Green grid squares indicate covered areas; red squares indicate coverage gaps. White dots represent the satellites.

## 🔮 Future Improvements (Version 2)

* **Real Orbital Data:** Integrate Two-Line Element (TLE) data from CelesTrak to track actual satellites like the ISS.
* **Historical Gap Tracking:** Implement a state machine to calculate the exact duration of coverage gaps over a 24-hour period.
* **3D Visualization:** Upgrade the rendering engine to a 3D WebGL globe for a more realistic spatial representation.

## 👤 Author

**B.R Devamayookha**
GitHub: [@devamayookha](https://github.com/devamayookha)

---

*Built as a portfolio project to demonstrate full-stack web development, mathematical modeling, and real-time data visualization.*