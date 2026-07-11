# 🛰️ Satellite Constellation Coverage Simulator

An interactive web-based simulator that visualizes satellite orbits, calculates real-time Earth coverage, and identifies coverage gaps using a simplified 2D equirectangular projection.

**Live Demo:** [satellite-simulator-g7zj.onrender.com](https://satellite-simulator-g7zj.onrender.com/)

---

## 📖 About the Project

Visualizing how satellite constellations (like Starlink or OneWeb) provide global coverage is complex. Traditional tools require heavy 3D rendering or complex orbital mechanics.

I built this project to demonstrate how a lightweight, 2D mathematical model can accurately simulate satellite ground tracks and coverage footprints in real-time. It allows users to configure constellation parameters and instantly see how they impact global coverage and blind spots.

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6)
- **Graphics:** HTML5 Canvas for high-performance 2D rendering
- **Math:** Simplified kinematic orbital projection

---

## 🚀 How to Run Locally

No databases or external APIs required.

**1. Clone the repository**

```bash
git clone https://github.com/devamayookha/satellite-constellation-simulator.git
cd satellite-constellation-simulator
```

**2. Install dependencies**

```bash
pip install flask
```

**3. Run the server**

```bash
python app.py
```

**4. Open your browser**

```
http://127.0.0.1:5000
```

---

## 🎮 How to Use

- **Constellation Config:** Adjust satellites, orbital planes, altitude, inclination, and coverage radius. Click "Update Simulation" to apply.
- **Simulation Controls:** Play/Pause to freeze the simulation. Speed slider goes up to 50x.
- **Live Stats:** Watch Current Coverage update in real-time. Max Coverage tracks the highest coverage achieved.
- **Visuals:** Green = covered, Red = gap, White dots = satellites.

---

## 🔮 Version 2 Roadmap

- Real TLE data from CelesTrak for actual satellite tracking
- Historical gap tracking over a 24-hour period
- 3D WebGL globe rendering

---

## Screenshots

*(Coming soon)*

---

## About

Built as part of an AI × Space Technology portfolio series by a 2nd year B.Tech AI & Data Science student.

---

## 👤 Author

**B R Devamayookha**
AI & Data Science Student
[GitHub](https://github.com/devamayookha) · [LinkedIn](https://linkedin.com/in/b-r-devamayookha-627305375)