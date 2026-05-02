// Smart Checklist Logic

const defaultTasks = [
    { id: 't1', text: 'Verify name in Electoral Roll', completed: false, date: '15 Days Left' },
    { id: 't2', text: 'Obtain Voter ID (EPIC)', completed: false, date: 'Done if exist', urgent: false },
    { id: 't3', text: 'Locate assigned Polling Booth', completed: false, date: '5 Days Left', urgent: true },
    { id: 't4', text: 'Check Candidate Affidavits (KYC App)', completed: false, date: 'Before Voting' },
    { id: 't5', text: 'Cast Vote', completed: false, date: 'Polling Day', urgent: true }
];

let tasks = [];

function initChecklist() {
    loadTasks();
    renderTasks();
}

function loadTasks() {
    const saved = localStorage.getItem('electSmart_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        tasks = JSON.parse(JSON.stringify(defaultTasks));
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem('electSmart_tasks', JSON.stringify(tasks));
    updateProgress();
}

function renderTasks() {
    const listEl = document.getElementById('task-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <label for="task-${task.id}">
                <span>${task.text}</span>
            </label>
            <div class="task-date ${task.urgent && !task.completed ? 'urgent' : ''}">
                ${task.urgent && !task.completed ? '<i class="fa-solid fa-circle-exclamation"></i> ' : ''}
                ${task.date}
            </div>
        `;
        
        listEl.appendChild(li);

        // Add event listener to checkbox
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            task.completed = e.target.checked;
            renderTasks(); // Re-render to update styles
            saveTasks();
            
            if(task.completed && window.addNotification) {
                window.addNotification(`Task Completed: ${task.text}`);
            }
        });
    });
    
    updateProgress();
}

function updateProgress() {
    const progressEl = document.getElementById('checklist-progress');
    if (!progressEl) return;

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressEl.style.width = `${percentage}%`;
    
    if (percentage === 100 && completed > 0 && window.addNotification) {
        // Prevent spamming
        const justFinished = localStorage.getItem('electSmart_checklist_done');
        if (!justFinished) {
            window.addNotification('Congratulations! You are fully prepared to vote.', true);
            localStorage.setItem('electSmart_checklist_done', 'true');
        }
    } else {
        localStorage.removeItem('electSmart_checklist_done');
    }
}
