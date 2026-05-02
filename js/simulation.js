/**
 * @module Simulation
 * Manages the real-time dashboard data simulation, booth locating, and queue estimation.
 */

/** @const {Array<Object>} */
const zones = [
    { id: 'zone-north', name: 'North Booths', density: 'low' },
    { id: 'zone-south', name: 'South Booths', density: 'med' },
    { id: 'zone-east', name: 'East Booths', density: 'high' },
    { id: 'zone-west', name: 'West Booths', density: 'low' },
    { id: 'zone-central', name: 'Central HQ', density: 'med' }
];

/**
 * Initializes the dashboard simulation and periodic updates.
 */
export function initSimulation() {
    renderDensityMap();
    renderWaitTimes();
    
    // Simulate real-time updates every 8 seconds for efficiency
    setInterval(() => {
        simulateChanges();
        renderDensityMap();
        renderWaitTimes();
        updateMovementSuggestion();
    }, 8000);

    updateMovementSuggestion();
    initBoothLocator();
}

/**
 * Handles the booth locating interactive simulation.
 */
function initBoothLocator() {
    const locateBtn = document.getElementById('locate-booth-btn');
    if (!locateBtn) return;

    locateBtn.addEventListener('click', () => {
        // Visual feedback for locating process
        locateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';
        locateBtn.disabled = true;

        setTimeout(() => {
            const resultDiv = document.getElementById('booth-result');
            const nameEl = document.getElementById('assigned-booth-name');
            const distEl = document.getElementById('booth-distance');
            const timeEl = document.getElementById('best-time-suggestion');
            
            // Logic to simulate nearest booth selection
            const nearest = zones[Math.floor(Math.random() * zones.length)];
            const distance = (Math.random() * 2 + 0.5).toFixed(1); 
            
            nameEl.textContent = `Polling Station: ${nearest.name} (Room 2A)`;
            distEl.textContent = distance;

            // Context-aware suggestion based on current mock state
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

            // Hook into global notifications if module is loaded
            import('./notifications.js').then(m => {
                m.addNotification(`Located nearest booth: ${nearest.name}`);
            });

        }, 1500);
    });
}

/**
 * Mutates zone density states to simulate dynamic crowd movement.
 * @private
 */
function simulateChanges() {
    const states = ['low', 'med', 'high'];
    const numChanges = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numChanges; i++) {
        const zoneIndex = Math.floor(Math.random() * zones.length);
        const newState = states[Math.floor(Math.random() * states.length)];
        
        // Trigger alert if state shifts to high
        if(zones[zoneIndex].density !== 'high' && newState === 'high') {
            import('./notifications.js').then(m => {
                m.addNotification(`Crowd Alert: ${zones[zoneIndex].name} is currently highly congested.`, true);
            });
        }
        
        zones[zoneIndex].density = newState;
    }
}

/**
 * Renders the visual density map grid.
 */
function renderDensityMap() {
    const mapEl = document.getElementById('density-map');
    if (!mapEl) return;
    
    const fragment = document.createDocumentFragment();
    
    zones.forEach(zone => {
        const el = document.createElement('div');
        el.className = `zone zone-${zone.density}`;
        
        let iconName = 'fa-user';
        if(zone.density === 'med') iconName = 'fa-user-group';
        if(zone.density === 'high') iconName = 'fa-users';

        const icon = document.createElement('i');
        icon.className = `fa-solid ${iconName}`;
        
        const label = document.createElement('span');
        label.style.marginTop = '5px';
        label.style.fontSize = '0.8rem';
        label.style.textAlign = 'center';
        label.textContent = zone.name;

        el.appendChild(icon);
        el.appendChild(label);
        fragment.appendChild(el);
    });

    mapEl.innerHTML = '';
    mapEl.appendChild(fragment);
}

/**
 * Renders the wait time list with class-based coloring.
 */
function renderWaitTimes() {
    const listEl = document.getElementById('wait-list');
    if (!listEl) return;

    const fragment = document.createDocumentFragment();
    
    zones.forEach(zone => {
        let baseTime = 5;
        let classColor = 'good';
        
        if (zone.density === 'med') { baseTime = 25; classColor = 'warn'; }
        if (zone.density === 'high') { baseTime = 55; classColor = 'bad'; }
        
        const time = baseTime + Math.floor(Math.random() * 15) - 5;
        
        const li = document.createElement('li');
        li.className = 'wait-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = zone.name;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = `wait-time ${classColor}`;
        timeSpan.textContent = `${time > 0 ? time : 0} mins`;
        
        li.appendChild(nameSpan);
        li.appendChild(timeSpan);
        fragment.appendChild(li);
    });

    listEl.innerHTML = '';
    listEl.appendChild(fragment);
}

/**
 * Updates the global movement advice banner.
 */
function updateMovementSuggestion() {
    const suggestionEl = document.getElementById('movement-suggestion');
    if(!suggestionEl) return;

    const lowZones = zones.filter(z => z.density === 'low');
    const highZones = zones.filter(z => z.density === 'high');

    const icon = document.createElement('i');
    const text = document.createElement('span');

    if (highZones.length > 0 && lowZones.length > 0) {
        icon.className = 'fa-solid fa-route';
        text.textContent = `Avoid ${highZones[0].name}. Try visiting ${lowZones[0].name} for faster processing.`;
        suggestionEl.style.color = 'var(--accent)';
    } else if (highZones.length > 2) {
        icon.className = 'fa-solid fa-triangle-exclamation';
        text.textContent = 'High congestion across most areas. Delay visit if possible.';
        suggestionEl.style.color = 'var(--danger)';
    } else {
        icon.className = 'fa-solid fa-check-circle';
        text.textContent = 'Traffic flows are currently optimal. Good time to visit.';
        suggestionEl.style.color = 'var(--success)';
    }

    suggestionEl.innerHTML = '';
    suggestionEl.appendChild(icon);
    suggestionEl.appendChild(document.createTextNode(' '));
    suggestionEl.appendChild(text);
}
