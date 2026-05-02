// Notification System

let notifications = [];

function initNotifications() {
    const notifBtn = document.getElementById('notification-btn');
    const notifPanel = document.getElementById('notifications-panel');

    // Toggle Panel
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifPanel.classList.toggle('hidden');
        markAllRead();
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!notifPanel.contains(e.target) && e.target !== notifBtn && !notifBtn.contains(e.target)) {
            notifPanel.classList.add('hidden');
        }
    });

    // Request Browser Notification Permission
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }

    // Add initial welcome notification
    window.addNotification('Welcome to ElectSmart India. Your dashboard is ready.');
}

// Global function exposed to other modules
window.addNotification = function(message, isUrgent = false) {
    const notif = {
        id: Date.now(),
        message: message,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        read: false,
        urgent: isUrgent
    };

    notifications.unshift(notif);
    
    // Keep max 10
    if (notifications.length > 10) notifications.pop();

    updateNotifUI();

    // Trigger Browser Notification if granted and urgent
    if (isUrgent && "Notification" in window && Notification.permission === "granted") {
        new Notification("ElectSmart Alert", {
            body: message,
            icon: "/icon.png" // Fallback if no icon exists
        });
    }
};

function updateNotifUI() {
    const listEl = document.getElementById('notif-list');
    const badgeEl = document.getElementById('notif-badge');
    
    if (!listEl || !badgeEl) return;

    listEl.innerHTML = '';
    let unreadCount = 0;

    notifications.forEach(n => {
        if (!n.read) unreadCount++;
        
        const li = document.createElement('li');
        if (!n.read) li.classList.add('unread');
        
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="font-weight:bold; color: ${n.urgent ? 'var(--danger)' : 'var(--accent)'}">
                    ${n.urgent ? '<i class="fa-solid fa-triangle-exclamation"></i> Alert' : 'Update'}
                </span>
                <span style="font-size:0.8rem; color:var(--text-muted)">${n.time}</span>
            </div>
            <div>${n.message}</div>
        `;
        listEl.appendChild(li);
    });

    if (unreadCount > 0) {
        badgeEl.textContent = unreadCount;
        badgeEl.classList.remove('hidden');
    } else {
        badgeEl.classList.add('hidden');
    }
}

function markAllRead() {
    let changed = false;
    notifications.forEach(n => {
        if (!n.read) {
            n.read = true;
            changed = true;
        }
    });
    if (changed) updateNotifUI();
}
