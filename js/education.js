/**
 * @module Education
 * Handles educational content including election timelines, interactive flashcards, 
 * EVM simulator, and identification guides.
 */

/** @const {Array<Object>} */
const timelineData = [
    { title: "1. Delimitation", desc: "Boundaries of constituencies are drawn based on population to ensure equal representation." },
    { title: "2. Electoral Rolls", desc: "The Election Commission prepares and updates the voter list, registering eligible citizens." },
    { title: "3. Notification", desc: "Election dates are announced, and the Model Code of Conduct comes into immediate effect." },
    { title: "4. Nominations", desc: "Candidates file their nomination papers, which are then scrutinized by the Returning Officer." },
    { title: "5. Campaigning", desc: "Parties release manifestos and campaign. This ends 48 hours before polling begins." },
    { title: "6. Polling Day", desc: "Voters cast their vote using EVMs and verify via VVPAT at designated booths." },
    { title: "7. Counting & Results", desc: "Votes are counted under strict supervision, and winning candidates are officially declared." }
];

/** @const {Array<Object>} */
const flashcardsData = [
    { front: "EVM", back: "Electronic Voting Machine used to record votes digitally." },
    { front: "VVPAT", back: "Voter Verifiable Paper Audit Trail. Prints a slip confirming the vote cast." },
    { front: "ECI", back: "Election Commission of India. The constitutional body overseeing elections." },
    { front: "MCC", back: "Model Code of Conduct. Guidelines for candidates to ensure fair elections." },
    { front: "NOTA", back: "None of the Above. An option allowing voters to reject all candidates." }
];

/** @const {Array<Object>} */
const candidatesData = [
    { num: 1, name: "Candidate A", party: "Party 1" },
    { num: 2, name: "Candidate B", party: "Party 2" },
    { num: 3, name: "Candidate C", party: "Party 3" },
    { num: 4, name: "NOTA", party: "None of the Above" }
];

/** @const {Array<Object>} */
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

let currentCardIndex = 0;
let isEVMReady = true;

/**
 * Initializes the education module listeners and sub-components.
 */
export function initEducation() {
    initTabs();
    renderTimeline();
    renderFlashcard();
    initEVM();
    initIDs();

    // Flashcard Controls
    const prevBtn = document.getElementById('prev-card');
    const nextBtn = document.getElementById('next-card');

    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            renderFlashcard();
        }
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (currentCardIndex < flashcardsData.length - 1) {
            currentCardIndex++;
            renderFlashcard();
        }
    });
}

/**
 * Sets up the internal tab switching logic for the Learn section.
 * @private
 */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));
            
            btn.classList.add('active');
            const target = document.getElementById(`tab-${btn.dataset.tab}`);
            if (target) target.classList.remove('hidden');
        });
    });
}

/**
 * Renders the election schedule timeline.
 */
function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    const phases = [
        { key: 'phase-1', date: 'March 16', status: 'completed' },
        { key: 'phase-2', date: 'March 20', status: 'completed' },
        { key: 'phase-3', date: 'March 27', status: 'active' },
        { key: 'phase-4', date: 'April 4', status: 'pending' },
        { key: 'phase-5', date: 'April 19 - June 1', status: 'pending' },
        { key: 'phase-6', date: 'June 4', status: 'pending' }
    ];

    container.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'vertical-timeline';

    phases.forEach(p => {
        const item = document.createElement('div');
        item.className = `timeline-step ${p.status}`;
        item.innerHTML = `
            <div class="step-marker"></div>
            <div class="step-content">
                <span class="step-date">${p.date}</span>
                <h4 data-i18n="${p.key}"></h4>
                <p data-i18n="${p.key}-desc"></p>
            </div>
        `;
        list.appendChild(item);
    });

    container.appendChild(list);
    
    // Refresh translations
    import('./i18n.js').then(m => m.initI18n());
}

/**
 * Renders the current flashcard with flip animation logic.
 */
function renderFlashcard() {
    const container = document.getElementById('flashcard-container');
    const counter = document.getElementById('card-counter');
    if (!container || !counter) return;

    const cardData = flashcardsData[currentCardIndex];
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = '';
        const flashcard = document.createElement('div');
        flashcard.className = 'flashcard';
        flashcard.setAttribute('role', 'button');
        flashcard.setAttribute('aria-label', `Flashcard: ${cardData.front}. Click to see description.`);
        flashcard.tabIndex = 0;
        
        flashcard.addEventListener('click', () => flashcard.classList.toggle('is-flipped'));
        flashcard.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') flashcard.classList.toggle('is-flipped');
        });

        const front = document.createElement('div');
        front.className = 'card-face card-front';
        const frontH3 = document.createElement('h3');
        frontH3.textContent = cardData.front;
        const flipHint = document.createElement('div');
        flipHint.style.position = 'absolute';
        flipHint.style.bottom = '10px';
        flipHint.style.fontSize = '0.8rem';
        flipHint.style.color = 'var(--text-muted)';
        flipHint.textContent = 'Click to flip';
        front.appendChild(frontH3);
        front.appendChild(flipHint);

        const back = document.createElement('div');
        back.className = 'card-face card-back';
        const backP = document.createElement('p');
        backP.textContent = cardData.back;
        back.appendChild(backP);

        flashcard.appendChild(front);
        flashcard.appendChild(back);
        container.appendChild(flashcard);

        counter.textContent = `${currentCardIndex + 1} / ${flashcardsData.length}`;
        
        const prevBtn = document.getElementById('prev-card');
        const nextBtn = document.getElementById('next-card');
        if (prevBtn) prevBtn.disabled = currentCardIndex === 0;
        if (nextBtn) nextBtn.disabled = currentCardIndex === flashcardsData.length - 1;
        
        container.style.opacity = '1';
    }, 200);
}

/**
 * Inits the EVM Mock interface.
 */
function initEVM() {
    const evmContainer = document.getElementById('evm-candidates');
    if (!evmContainer) return;

    const fragment = document.createDocumentFragment();
    candidatesData.forEach((cand, index) => {
        const row = document.createElement('div');
        row.className = 'evm-candidate-row';
        
        const num = document.createElement('div');
        num.className = 'candidate-num';
        num.textContent = cand.num;

        const info = document.createElement('div');
        info.className = 'candidate-info';
        const name = document.createElement('div');
        name.className = 'candidate-name';
        name.textContent = cand.name;
        const party = document.createElement('div');
        party.className = 'candidate-party';
        party.textContent = cand.party;
        info.appendChild(name);
        info.appendChild(party);

        const btnContainer = document.createElement('div');
        btnContainer.className = 'evm-button-container';
        const light = document.createElement('div');
        light.className = 'evm-light';
        light.id = `light-${index}`;
        const btn = document.createElement('button');
        btn.className = 'evm-btn';
        btn.setAttribute('aria-label', `Cast vote for ${cand.name}`);
        btn.addEventListener('click', () => castVote(index));

        btnContainer.appendChild(light);
        btnContainer.appendChild(btn);
        
        row.appendChild(num);
        row.appendChild(info);
        row.appendChild(btnContainer);
        fragment.appendChild(row);
    });

    evmContainer.innerHTML = '';
    evmContainer.appendChild(fragment);
}

/**
 * Simulates casting a vote on the EVM.
 * @param {number} index - Candidate index.
 * @async
 */
async function castVote(index) {
    if (!isEVMReady) return;
    isEVMReady = false;

    const cand = candidatesData[index];
    const readyLight = document.getElementById('evm-ready-light');
    const candLight = document.getElementById(`light-${index}`);

    if (readyLight) readyLight.classList.add('off');
    if (candLight) candLight.classList.add('active');

    // Beep sound generation
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 1500);
    } catch (e) {
        console.warn('Audio context failed', e);
    }

    printVVPATSlip(cand);
    
    // Notify via central module
    import('./notifications.js').then(m => {
        m.addNotification(`Vote recorded for ${cand.name} via EVM simulator.`);
    });

    // Reset sequence
    setTimeout(() => {
        if (candLight) candLight.classList.remove('active');
        if (readyLight) readyLight.classList.remove('off');
        isEVMReady = true;
    }, 8000);
}

/**
 * Animates the VVPAT paper trail slip.
 * @param {Object} candidate - Selected candidate data.
 * @private
 */
function printVVPATSlip(candidate) {
    const slipEl = document.getElementById('vvpat-slip');
    const contentEl = document.getElementById('slip-content');
    if (!slipEl || !contentEl) return;

    contentEl.innerHTML = '';
    const slNo = document.createElement('strong');
    slNo.textContent = `Sl. No: ${candidate.num}`;
    const name = document.createElement('strong');
    name.style.display = 'block';
    name.textContent = candidate.name;
    const party = document.createElement('span');
    party.style.fontSize = '0.8rem';
    party.style.color = '#555';
    party.textContent = candidate.party;
    const votedText = document.createElement('div');
    votedText.style.marginTop = '10px';
    votedText.style.textAlign = 'center';
    votedText.textContent = '[X] Voted';

    contentEl.appendChild(slNo);
    contentEl.appendChild(name);
    contentEl.appendChild(party);
    contentEl.appendChild(votedText);
    
    slipEl.classList.remove('hidden');
    setTimeout(() => slipEl.classList.add('printed'), 50);
    
    setTimeout(() => {
        slipEl.classList.remove('printed');
        setTimeout(() => slipEl.classList.add('hidden'), 2000);
    }, 7000);
}

/**
 * Inits the Accepted IDs grid.
 */
function initIDs() {
    const grid = document.getElementById('id-grid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    idData.forEach(id => {
        const div = document.createElement('div');
        div.className = 'id-card';
        
        const icon = document.createElement('i');
        icon.className = `fa-solid ${id.icon} id-icon`;
        
        const name = document.createElement('span');
        name.style.fontWeight = '500';
        name.textContent = id.name;
        
        div.appendChild(icon);
        div.appendChild(name);
        fragment.appendChild(div);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
}
