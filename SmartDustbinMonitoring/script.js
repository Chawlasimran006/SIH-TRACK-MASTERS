// --- JAVASCRIPT LOGIC (The Simulation) ---

// Initial mock data for the bins
const bins = {
    'bin-001': { level: 20, element: null }, // Low fill
    'bin-002': { level: 75, element: null }, // Medium fill
    'bin-003': { level: 98, element: null }  // Critical fill
};

const alertBar = document.getElementById('sms-alert');

function initializeBins() {
    // Cache the DOM elements on load
    for (const id in bins) {
        bins[id].element = document.getElementById(`bin-card-${id}`);
    }
}

function updateBinStatus() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });

    for (const id in bins) {
        const bin = bins[id];
        const fillElement = document.getElementById(`fill-${id}`);
        const markerElement = document.getElementById(`marker-${id}`);
        const timeElement = document.getElementById(`time-${id}`);
        const cardElement = bins[id].element;
        
        // 1. SIMULATE LIVE DATA CHANGE (HC-SR04 Sensor)
        
        // Bin 1: Slowly increases (simulating waste being thrown)
        if (id === 'bin-001') {
            // Add a random 1-4% increase every interval
            if (bin.level < 90) { 
                // Only increase if below the critical threshold
                bin.level += Math.floor(Math.random() * 4) + 1;
            } else {
                // Keep it full once it hits the alert threshold
                bin.level = 98;
            }
        } 
        // Bin 2: Remains steady in the medium range (simulating regular activity)
        else if (id === 'bin-002') {
            bin.level = 75; 
        }
        // Bin 3: Remains critical for demonstration
        else if (id === 'bin-003') {
            bin.level = 98; 
        }
        
        // Ensure level is capped at 100%
        bin.level = Math.min(bin.level, 100);

        // 2. UPDATE VISUALS (Fill Bar and Time)
        // Check if fill element exists and percentage is greater than 0
        if (fillElement && bin.level > 0) {
            fillElement.style.width = `${bin.level}%`;
            fillElement.textContent = `${bin.level}%`;
        } else if (fillElement) {
             // Handle 0% fill state visually if needed
             fillElement.style.width = '0%';
             fillElement.textContent = '';
        }
        
        timeElement.textContent = timeString;

        // 3. APPLY STATUS COLORS AND CLASSES
        
        // Reset classes
        cardElement.className = 'bin-card';
        markerElement.className = 'map-marker';
        fillElement.className = 'level-fill';
        let statusText = '';

        if (bin.level >= 90) {
            // CRITICAL STATUS
            cardElement.classList.add('critical');
            markerElement.classList.add('marker-red');
            fillElement.classList.add('fill-red');
            statusText = 'CRITICAL';
            
            // **SIMULATE SMS ALERT (SIM900A)**
            if (id === 'bin-003') {
                alertBar.style.display = 'block';
            }

        } else if (bin.level >= 70) {
            // MEDIUM STATUS
            cardElement.classList.add('medium');
            markerElement.classList.add('marker-yellow');
            fillElement.classList.add('fill-yellow');
            statusText = 'MEDIUM';
            // Hide alert bar if the previously critical bin is no longer critical
            if (id === 'bin-003' && alertBar.style.display === 'block') {
                alertBar.style.display = 'none'; 
            }

        } else {
            // LOW STATUS
            cardElement.classList.add('low');
            markerElement.classList.add('marker-green');
            fillElement.classList.add('fill-green');
            statusText = 'LOW';
            if (id === 'bin-003' && alertBar.style.display === 'block') {
                alertBar.style.display = 'none'; 
            }
        }

        // Update card status text
        cardElement.querySelector('h3 span').textContent = statusText;
        
        // Update marker tooltips for map
        markerElement.title = `Bin-${id}: ${bin.level}%`;
    }
}

// 1. Run the initialization function
initializeBins();
// 2. ***IMMEDIATELY CALL UPDATE STATUS TO LOAD DATA ON PAGE START***
updateBinStatus(); 
// 3. Start the continuous simulation loop (runs every 4 seconds)
setInterval(updateBinStatus, 4000);