/**
 * @module Notifications
 * Handles the system-wide notification panel and browser push notifications.
 */

let notifications = [];

/**
 * Initializes the notification system listeners.
 */
export function initNotifications() {
    const notifBtn = document.getElementById('notification-btn');
    const notifPanel = document.getElementById('notifications-panel');

    if (!notifBtn || !notifPanel) return;

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
    addNotification('Welcome to Electo AI India. Your dashboard is ready.');
}

/**
 * Adds a new notification to the system.
 * @param {string} message - The notification text.
 * @param {boolean} [isUrgent=false] - Whether this is a high-priority alert.
 */
export function addNotification(message, isUrgent = false) {
    const notif = {
        id: Date.now(),
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        urgent: isUrgent
    };

    notifications.unshift(notif);
    
    // Maintain a max of 10 notifications for memory efficiency
    if (notifications.length > 10) notifications.pop();

    updateNotifUI();

    // Trigger Browser Notification if granted and urgent
    if (isUrgent && "Notification" in window && Notification.permission === "granted") {
        new Notification("Electo AI Alert", {
            body: message,
            icon: "/icon.png"
        });
    }
}

/**
 * Syncs the internal notification state with the DOM.
 * @private
 */
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
        li.setAttribute('role', 'alert');
        
        // Use a safe approach to inject content
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.marginBottom = '5px';
        
        const typeSpan = document.createElement('span');
        typeSpan.style.fontWeight = 'bold';
        typeSpan.style.color = n.urgent ? 'var(--danger)' : 'var(--accent)';
        typeSpan.innerHTML = n.urgent ? '<i class="fa-solid fa-triangle-exclamation"></i> Alert' : 'Update';
        
        const timeSpan = document.createElement('span');
        timeSpan.style.fontSize = '0.8rem';
        timeSpan.style.color = 'var(--text-muted)';
        timeSpan.textContent = n.time;
        
        header.appendChild(typeSpan);
        header.appendChild(timeSpan);
        
        const body = document.createElement('div');
        body.textContent = n.message;
        
        li.appendChild(header);
        li.appendChild(body);
        listEl.appendChild(li);
    });

    if (unreadCount > 0) {
        badgeEl.textContent = unreadCount;
        badgeEl.classList.remove('hidden');
    } else {
        badgeEl.classList.add('hidden');
    }
}

/**
 * Marks all current notifications as read.
 * @private
 */
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
