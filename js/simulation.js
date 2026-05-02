// Real-Time Dashboard Simulation Logic

const zones = [
    { id: 'zone-north', name: 'North Booths', density: 'low' },
    { id: 'zone-south', name: 'South Booths', density: 'med' },
    { id: 'zone-east', name: 'East Booths', density: 'high' },
    { id: 'zone-west', name: 'West Booths', density: 'low' },
    { id: 'zone-central', name: 'Central HQ', density: 'med' }
];

function initSimulation() {
    renderDensityMap();
    renderWaitTimes();
    
    // Simulate real-time updates every 8 seconds
    setInterval(() => {
        simulateChanges();
        renderDensityMap();
        renderWaitTimes();
        updateMovementSuggestion();
    }, 8000);

    updateMovementSuggestion();
    initBoothLocator();
}

// --- Booth Locator Logic ---
function initBoothLocator() {
    const locateBtn = document.getElementById('locate-booth-btn');
    if (!locateBtn) return;

    locateBtn.addEventListener('click', () => {
        // Simulate finding location
        locateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';
        locateBtn.disabled = true;

        setTimeout(() => {
            const resultDiv = document.getElementById('booth-result');
            const nameEl = document.getElementById('assigned-booth-name');
            const distEl = document.getElementById('booth-distance');
            const timeEl = document.getElementById('best-time-suggestion');
            
            // Randomly select one of the zones as the nearest booth
            const nearest = zones[Math.floor(Math.random() * zones.length)];
            const distance = (Math.random() * 2 + 0.5).toFixed(1); // Random distance 0.5 - 2.5 km
            
            nameEl.textContent = `Polling Station: ${nearest.name} (Room 2A)`;
            distEl.textContent = distance;

            // Determine best time based on current density of that zone
            if (nearest.density === 'high') {
                timeEl.innerHTML = `Current wait is long. <strong>Best time to visit: Between 1:00 PM - 3:00 PM</strong>`;
                timeEl.style.color = 'var(--warning)';
            } else if (nearest.density === 'med') {
                timeEl.innerHTML = `Moderate crowd. <strong>Visiting now is okay, or wait until after 4:00 PM.</strong>`;
                timeEl.style.color = 'var(--text-main)';
            } else {
                timeEl.innerHTML = `Queue is currently empty! <strong>Best time to visit: Right Now.</strong>`;
                timeEl.style.color = 'var(--success)';
            }

            locateBtn.style.display = 'none';
            resultDiv.classList.remove('hidden');

            if (window.addNotification) {
                window.addNotification(`Located nearest booth: ${nearest.name}`);
            }

        }, 1500);
    });
}

function simulateChanges() {
    const states = ['low', 'med', 'high'];
    // Randomly change 1-2 zones
    const numChanges = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numChanges; i++) {
        const zoneIndex = Math.floor(Math.random() * zones.length);
        const newState = states[Math.floor(Math.random() * states.length)];
        
        // If it suddenly becomes high, trigger an alert
        if(zones[zoneIndex].density !== 'high' && newState === 'high') {
            if(window.addNotification) {
                window.addNotification(`Crowd Alert: ${zones[zoneIndex].name} is currently highly congested.`);
            }
        }
        
        zones[zoneIndex].density = newState;
    }
}

function renderDensityMap() {
    const mapEl = document.getElementById('density-map');
    if (!mapEl) return;
    
    mapEl.innerHTML = '';
    zones.forEach(zone => {
        const el = document.createElement('div');
        el.className = `zone zone-${zone.density}`;
        
        let icon = 'fa-user';
        if(zone.density === 'med') icon = 'fa-user-group';
        if(zone.density === 'high') icon = 'fa-users';

        el.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span style="margin-top:5px; font-size:0.8rem; text-align:center;">${zone.name}</span>
        `;
        mapEl.appendChild(el);
    });
}

function renderWaitTimes() {
    const listEl = document.getElementById('wait-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    
    // Generate wait times based on density
    zones.forEach(zone => {
        let baseTime = 5;
        let classColor = 'good';
        
        if (zone.density === 'med') { baseTime = 25; classColor = 'warn'; }
        if (zone.density === 'high') { baseTime = 55; classColor = 'bad'; }
        
        // Add random variance
        const time = baseTime + Math.floor(Math.random() * 15) - 5;
        
        const li = document.createElement('li');
        li.className = 'wait-item';
        li.innerHTML = `
            <span>${zone.name}</span>
            <span class="wait-time ${classColor}">${time > 0 ? time : 0} mins</span>
        `;
        listEl.appendChild(li);
    });
}

function updateMovementSuggestion() {
    const suggestionEl = document.getElementById('movement-suggestion');
    if(!suggestionEl) return;

    const lowZones = zones.filter(z => z.density === 'low');
    const highZones = zones.filter(z => z.density === 'high');

    if (highZones.length > 0 && lowZones.length > 0) {
        suggestionEl.innerHTML = `<i class="fa-solid fa-route"></i> <span>Avoid ${highZones[0].name}. Try visiting ${lowZones[0].name} for faster processing.</span>`;
    } else if (highZones.length > 2) {
        suggestionEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--danger)"></i> <span style="color: var(--danger)">High congestion across most areas. Delay visit if possible.</span>`;
    } else {
        suggestionEl.innerHTML = `<i class="fa-solid fa-check-circle" style="color: var(--success)"></i> <span style="color: var(--success)">Traffic flows are currently optimal. Good time to visit.</span>`;
    }
}
