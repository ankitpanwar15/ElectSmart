/**
 * @module Checklist
 * Manages the voter's personalized checklist and persistence in LocalStorage.
 */

/** @const {Array<Object>} */
const defaultTasks = [
    { id: 't1', text: 'Verify name in Electoral Roll', completed: false, date: '15 Days Left', link: 'https://voters.eci.gov.in/' },
    { id: 't2', text: 'Obtain Voter ID (EPIC)', completed: false, date: 'Done if exist', urgent: false, link: 'https://voters.eci.gov.in/' },
    { id: 't3', text: 'Locate assigned Polling Booth', completed: false, date: '5 Days Left', urgent: true, link: 'https://electoralsearch.eci.gov.in/pollingstation' },
    { id: 't4', text: 'Check Candidate Affidavits (KYC App)', completed: false, date: 'Before Voting', link: 'https://www.myneta.info/' },
    { id: 't5', text: 'Cast Vote', completed: false, date: 'Polling Day', urgent: true }
];

let tasks = [];

/**
 * Initializes the checklist system and renders items.
 */
export function initChecklist() {
    loadTasks();
    renderTasks();
    initSharing();
}

/**
 * Loads tasks from LocalStorage or defaults to the initial set.
 * @private
 */
function loadTasks() {
    const saved = localStorage.getItem('electSmart_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        tasks = JSON.parse(JSON.stringify(defaultTasks));
        saveTasks();
    }
}

/**
 * Persists the current task state to LocalStorage.
 * @private
 */
function saveTasks() {
    localStorage.setItem('electSmart_tasks', JSON.stringify(tasks));
    updateProgress();
}

/**
 * Renders the task list to the DOM using secure manipulation.
 */
export function renderTasks() {
    const listEl = document.getElementById('task-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', task.text);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content-flex';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'task-info';
        
        const label = document.createElement('label');
        label.setAttribute('for', `task-${task.id}`);
        label.textContent = task.text;
        infoDiv.appendChild(label);
        
        const metaDiv = document.createElement('div');
        metaDiv.className = 'task-meta';
        
        if (task.link && !task.completed) {
            const linkBtn = document.createElement('a');
            linkBtn.href = task.link;
            linkBtn.target = '_blank';
            linkBtn.className = 'task-action-btn';
            linkBtn.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Official Tool';
            metaDiv.appendChild(linkBtn);
        }

        const dateDiv = document.createElement('div');
        dateDiv.className = `task-date ${task.urgent && !task.completed ? 'urgent' : ''}`;
        
        if (task.urgent && !task.completed) {
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-circle-exclamation';
            dateDiv.appendChild(icon);
            dateDiv.appendChild(document.createTextNode(' '));
        }
        dateDiv.appendChild(document.createTextNode(task.date));
        metaDiv.appendChild(dateDiv);
        
        contentDiv.appendChild(infoDiv);
        contentDiv.appendChild(metaDiv);
        
        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        listEl.appendChild(li);

        checkbox.addEventListener('change', (e) => {
            task.completed = e.target.checked;
            renderTasks(); 
            saveTasks();
            
            if(task.completed) {
                import('./notifications.js').then(m => {
                    m.addNotification(`Task Completed: ${task.text}`);
                });
            }
        });
    });
    
    updateProgress();
}

/**
 * Initializes the social sharing logic for the checklist.
 * @private
 */
function initSharing() {
    const shareBtn = document.getElementById('share-checklist');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', () => {
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        const percent = Math.round((completed / total) * 100);
        
        const shareText = `🇮🇳 I am ${percent}% prepared for the upcoming elections! 🗳️\nChecklist status: ${completed}/${total} tasks done.\n\nBe a responsible citizen. Get prepared with Electo AI.`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Electo AI Voter Readiness',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText + '\n' + window.location.href);
            import('./notifications.js').then(m => {
                m.addNotification('Readiness status copied to clipboard!', true);
            });
        }
    });
}

/**
 * Calculates and updates the checklist completion progress.
 * @private
 */
function updateProgress() {
    const progressEl = document.getElementById('checklist-progress');
    if (!progressEl) return;

    const total = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    
    progressEl.style.width = `${percentage}%`;
    
    if (percentage === 100 && completedCount > 0) {
        const justFinished = localStorage.getItem('electSmart_checklist_done');
        if (!justFinished) {
            import('./notifications.js').then(m => {
                m.addNotification('Congratulations! You are fully prepared to vote.', true);
            });
            localStorage.setItem('electSmart_checklist_done', 'true');
        }
    } else {
        localStorage.removeItem('electSmart_checklist_done');
    }
}
