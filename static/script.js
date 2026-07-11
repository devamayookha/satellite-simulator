// static/script.js

// ============================================
// CONFIGURATION & SETUP
// ============================================
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

const earthImg = new Image();
earthImg.src = '/static/earth_map.jpg';

const MAP_WIDTH = canvas.width;
const MAP_HEIGHT = canvas.height;
const EARTH_RADIUS = 6371;

const COLS = 36;
const ROWS = 18;
const CELL_WIDTH = MAP_WIDTH / COLS;
const CELL_HEIGHT = MAP_HEIGHT / ROWS;

let isImageLoaded = false;
let simulationTime = 0;
let satellites = [];

let isPaused = false;
let simSpeedMultiplier = 10;
let maxCoverage = 0;

// ============================================
// SATELLITE CLASS
// ============================================
class Satellite {
    constructor(id, plane, positionInPlane, config) {
        this.id = id;
        this.raan = (plane / config.numPlanes) * 360;
        this.meanAnomaly = (positionInPlane / (config.numSatellites / config.numPlanes)) * 360;

        const semiMajorAxis = EARTH_RADIUS + config.altitude;
        this.orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / 398600);
        this.orbitalPeriodMin = this.orbitalPeriod / 60;
        this.angularVelocity = 360 / this.orbitalPeriodMin;
        this.config = config;
    }

    getPosition(timeMinutes) {
        const M = (this.meanAnomaly + this.angularVelocity * timeMinutes) % 360;
        const M_rad = M * Math.PI / 180;
        const inc_rad = this.config.inclination * Math.PI / 180;
        const latitude = Math.asin(Math.sin(inc_rad) * Math.sin(M_rad)) * 180 / Math.PI;

        const earthRotation = (timeMinutes / (24 * 60)) * 360;
        let longitude = (this.raan + M - earthRotation) % 360;
        if (longitude > 180) longitude -= 360;
        if (longitude < -180) longitude += 360;

        return { latitude, longitude };
    }

    toCanvasCoords(lat, lon) {
        const x = (lon + 180) / 360 * MAP_WIDTH;
        const y = (90 - lat) / 180 * MAP_HEIGHT;
        return { x, y };
    }

    getCoverageRadiusPixels() {
        const kmPerPixelAtEquator = 40075 / MAP_WIDTH;
        const pos = this.getPosition(simulationTime);
        const latRad = pos.latitude * Math.PI / 180;
        const correctionFactor = 1 / Math.max(Math.cos(latRad), 0.1);
        return (this.config.coverageRadius / kmPerPixelAtEquator) * correctionFactor;
    }
}

// ============================================
// INITIALIZATION & CONTROLS
// ============================================
function initSatellites() {
    const numSats = parseInt(document.getElementById('numSats').value);
    const numPlanes = parseInt(document.getElementById('numPlanes').value);
    const altitude = parseInt(document.getElementById('altitude').value);
    const inclination = parseInt(document.getElementById('inclination').value);
    const coverageRadius = parseInt(document.getElementById('coverageRadius').value);

    if (isNaN(numSats) || isNaN(numPlanes) || isNaN(altitude) || isNaN(inclination) || isNaN(coverageRadius)) {
        alert("⚠️ Error: Please enter valid numbers for all fields.");
        return;
    }

    if (numSats <= 0 || numPlanes <= 0 || altitude <= 0 || coverageRadius <= 0) {
        alert("⚠️ Error: Satellites, Planes, Altitude, and Radius must be greater than zero.");
        return;
    }

    if (inclination < 0 || inclination > 180) {
        alert("⚠️ Error: Inclination must be between 0 and 180 degrees.");
        return;
    }

    if (numPlanes > numSats) {
        alert("⚠️ Error: You cannot have more planes than satellites!");
        return;
    }

    if (numSats % numPlanes !== 0) {
        alert("⚠️ Warning: Satellites don't divide evenly into planes. Adjusting to fit.");
    }

    const config = {
        numSatellites: numSats,
        numPlanes: numPlanes,
        altitude: altitude,
        inclination: inclination,
        coverageRadius: coverageRadius
    };

    satellites = [];
    let satelliteId = 0;
    const satsPerPlane = Math.floor(config.numSatellites / config.numPlanes);

    for (let plane = 0; plane < config.numPlanes; plane++) {
        for (let pos = 0; pos < satsPerPlane; pos++) {
            satellites.push(new Satellite(satelliteId++, plane, pos, config));
        }
    }

    console.log(`Updated: ${satellites.length} satellites.`);

    maxCoverage = 0;
    document.getElementById('maxCoverageStat').innerText = '0%';
}

// Event Listeners
document.getElementById('updateBtn').addEventListener('click', () => {
    initSatellites();
    maxCoverage = 0;
    document.getElementById('maxCoverageStat').innerText = '0%';
});

document.getElementById('playPauseBtn').addEventListener('click', function() {
    isPaused = !isPaused;
    this.innerText = isPaused ? 'Play' : 'Pause';
    this.style.backgroundColor = isPaused ? '#28a745' : '#ff9800';
});

document.getElementById('simSpeed').addEventListener('input', function() {
    simSpeedMultiplier = parseInt(this.value);
    document.getElementById('speedValue').innerText = simSpeedMultiplier + 'x';
});

// ============================================
// ANIMATION LOOP
// ============================================
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isImageLoaded) {
        ctx.drawImage(earthImg, 0, 0, MAP_WIDTH, MAP_HEIGHT);
    } else {
        ctx.fillStyle = '#001f3f';
        ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    }

    if (!isPaused) {
        simulationTime += simSpeedMultiplier / 60;
    }

    let grid = Array(ROWS).fill().map(() => Array(COLS).fill(false));
    let coveredCells = 0;

    satellites.forEach(sat => {
        const pos = sat.getPosition(simulationTime);
        const coords = sat.toCanvasCoords(pos.latitude, pos.longitude);
        const radius = sat.getCoverageRadiusPixels();

        // Draw ground track trail
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;

        for (let t = simulationTime - 30; t < simulationTime; t += 0.5) {
            const trailPos = sat.getPosition(t);
            const trailCoords = sat.toCanvasCoords(
                trailPos.latitude,
                trailPos.longitude
            );
            if (t === Math.ceil(simulationTime - 30)) {
                ctx.moveTo(trailCoords.x, trailCoords.y);
            } else {
                ctx.lineTo(trailCoords.x, trailCoords.y);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw coverage circle
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
        ctx.fill();

        // Draw satellite dot
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Mark grid cells
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c]) continue;

                const cellCenterX = c * CELL_WIDTH + CELL_WIDTH / 2;
                const cellCenterY = r * CELL_HEIGHT + CELL_HEIGHT / 2;

                const dx = cellCenterX - coords.x;
                const dy = cellCenterY - coords.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= radius) {
                    grid[r][c] = true;
                }
            }
        }
    });

    // Draw grid overlay
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) {
                ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
                coveredCells++;
            } else {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            }
            ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        }
    }

    // Update stats
    const coveragePercent = ((coveredCells / (ROWS * COLS)) * 100).toFixed(1);
    document.getElementById('coverageStat').innerText = coveragePercent + '%';

    if (parseFloat(coveragePercent) > maxCoverage) {
        maxCoverage = parseFloat(coveragePercent);
        document.getElementById('maxCoverageStat').innerText = maxCoverage.toFixed(1) + '%';
    }

    document.getElementById('timeStat').innerText =
        `${Math.floor(simulationTime / 60)}h ${Math.floor(simulationTime % 60)}m`;

    requestAnimationFrame(animate);
}

// ============================================
// START
// ============================================
earthImg.onload = () => {
    isImageLoaded = true;
    initSatellites();
    requestAnimationFrame(animate);
};

// Fallback: start even if earth map fails to load
earthImg.onerror = () => {
    isImageLoaded = false;
    initSatellites();
    requestAnimationFrame(animate);
};