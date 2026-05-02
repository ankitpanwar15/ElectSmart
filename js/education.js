// Education Module: Timeline and Flashcards

const timelineData = [
    { title: "1. Delimitation", desc: "Boundaries of constituencies are drawn based on population to ensure equal representation." },
    { title: "2. Electoral Rolls", desc: "The Election Commission prepares and updates the voter list, registering eligible citizens." },
    { title: "3. Notification", desc: "Election dates are announced, and the Model Code of Conduct comes into immediate effect." },
    { title: "4. Nominations", desc: "Candidates file their nomination papers, which are then scrutinized by the Returning Officer." },
    { title: "5. Campaigning", desc: "Parties release manifestos and campaign. This ends 48 hours before polling begins." },
    { title: "6. Polling Day", desc: "Voters cast their vote using EVMs and verify via VVPAT at designated booths." },
    { title: "7. Counting & Results", desc: "Votes are counted under strict supervision, and winning candidates are officially declared." }
];

const flashcardsData = [
    { front: "EVM", back: "Electronic Voting Machine used to record votes digitally." },
    { front: "VVPAT", back: "Voter Verifiable Paper Audit Trail. Prints a slip confirming the vote cast." },
    { front: "ECI", back: "Election Commission of India. The constitutional body overseeing elections." },
    { front: "MCC", back: "Model Code of Conduct. Guidelines for candidates to ensure fair elections." },
    { front: "NOTA", back: "None of the Above. An option allowing voters to reject all candidates." }
];

let currentCardIndex = 0;

function initEducation() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
        });
    });

    renderTimeline();
    renderFlashcard();
    initEVM();
    initIDs();

    // Flashcard Controls
    document.getElementById('prev-card').addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            renderFlashcard();
        }
    });

    document.getElementById('next-card').addEventListener('click', () => {
        if (currentCardIndex < flashcardsData.length - 1) {
            currentCardIndex++;
            renderFlashcard();
        }
    });
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    container.innerHTML = '';
    timelineData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderFlashcard() {
    const container = document.getElementById('flashcard-container');
    const counter = document.getElementById('card-counter');
    if (!container || !counter) return;

    const card = flashcardsData[currentCardIndex];
    
    // Animate out
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = `
            <div class="flashcard" onclick="this.classList.toggle('is-flipped')">
                <div class="card-face card-front">
                    <h3>${card.front}</h3>
                    <div style="position:absolute; bottom:10px; font-size:0.8rem; color:var(--text-muted)">Click to flip</div>
                </div>
                <div class="card-face card-back">
                    <p>${card.back}</p>
                </div>
            </div>
        `;
        counter.textContent = `${currentCardIndex + 1} / ${flashcardsData.length}`;
        
        // Disable/Enable buttons
        document.getElementById('prev-card').disabled = currentCardIndex === 0;
        document.getElementById('next-card').disabled = currentCardIndex === flashcardsData.length - 1;
        
        // Animate in
        container.style.opacity = '1';
    }, 200);
}

// --- EVM Simulator Logic ---
const candidatesData = [
    { num: 1, name: "Candidate A", party: "Party 1" },
    { num: 2, name: "Candidate B", party: "Party 2" },
    { num: 3, name: "Candidate C", party: "Party 3" },
    { num: 4, name: "NOTA", party: "None of the Above" }
];

let isEVMReady = true;

function initEVM() {
    const evmContainer = document.getElementById('evm-candidates');
    if (!evmContainer) return;

    evmContainer.innerHTML = '';
    candidatesData.forEach((cand, index) => {
        const row = document.createElement('div');
        row.className = 'evm-candidate-row';
        row.innerHTML = `
            <div class="candidate-num">${cand.num}</div>
            <div class="candidate-info">
                <div class="candidate-name">${cand.name}</div>
                <div class="candidate-party">${cand.party}</div>
            </div>
            <div class="evm-button-container">
                <div class="evm-light" id="light-${index}"></div>
                <button class="evm-btn" onclick="castVote(${index})"></button>
            </div>
        `;
        evmContainer.appendChild(row);
    });
}

// Ensure function is available globally for onclick handler
window.castVote = function(index) {
    if (!isEVMReady) return;
    isEVMReady = false;

    const cand = candidatesData[index];
    
    // UI Updates on EVM
    document.getElementById('evm-ready-light').classList.add('off');
    const light = document.getElementById(`light-${index}`);
    light.classList.add('active');

    // Beep sound (using Web Audio API to avoid needing an external asset)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000 Hz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    
    // Stop beep after 1.5 seconds
    setTimeout(() => {
        oscillator.stop();
    }, 1500);

    // Print VVPAT slip
    printVVPATSlip(cand);
    
    if (window.addNotification) {
        window.addNotification(`Vote recorded for ${cand.name} via EVM simulator.`);
    }

    // Reset EVM after cycle completes (7 seconds total)
    setTimeout(() => {
        light.classList.remove('active');
        document.getElementById('evm-ready-light').classList.remove('off');
        isEVMReady = true;
    }, 8000);
}

function printVVPATSlip(candidate) {
    const slipEl = document.getElementById('vvpat-slip');
    const contentEl = document.getElementById('slip-content');
    
    // Set content
    contentEl.innerHTML = `
        <strong>Sl. No: ${candidate.num}</strong><br>
        <strong>${candidate.name}</strong><br>
        <span style="font-size:0.8rem; color:#555;">${candidate.party}</span><br>
        <div style="margin-top:10px; text-align:center;">
            [X] Voted
        </div>
    `;
    
    // Animate slip appearing
    slipEl.classList.remove('hidden');
    
    // Need a tiny timeout to allow CSS to register the block display before animating
    setTimeout(() => {
        slipEl.classList.add('printed');
    }, 50);
    
    // Slip falls into the box after 7 seconds (as per real VVPAT)
    setTimeout(() => {
        slipEl.classList.remove('printed');
        
        setTimeout(() => {
            slipEl.classList.add('hidden');
        }, 2000); // Wait for transition to finish
    }, 7000);
}

// --- Accepted IDs Logic ---
const idData = [
    { name: "Aadhaar Card", icon: "fa-address-card" },
    { name: "PAN Card", icon: "fa-id-card" },
    { name: "Driving License", icon: "fa-car" },
    { name: "Passport", icon: "fa-passport" },
    { name: "MNREGA Job Card", icon: "fa-briefcase" },
    { name: "Bank/Post Office Passbook", icon: "fa-book" },
    { name: "Health Insurance Smart Card", icon: "fa-notes-medical" },
    { name: "Pension Document", icon: "fa-file-invoice" },
    { name: "Official ID Cards (Govt/PSU)", icon: "fa-id-badge" },
    { name: "Smart Card issued by RGI", icon: "fa-sim-card" },
    { name: "UDID Card", icon: "fa-wheelchair" }
];

function initIDs() {
    const grid = document.getElementById('id-grid');
    if (!grid) return;

    grid.innerHTML = '';
    idData.forEach(id => {
        const div = document.createElement('div');
        div.className = 'id-card';
        div.innerHTML = `
            <i class="fa-solid ${id.icon} id-icon"></i>
            <span style="font-weight: 500;">${id.name}</span>
        `;
        grid.appendChild(div);
    });
}
