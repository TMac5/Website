// Navigation and Section Management
function navigateTo(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active-section');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }

    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle navigation clicks
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const sectionId = href.substring(1);
            navigateTo(sectionId);
        });
    });

    // Load saved data
    loadReminders();
    loadNotes();
});

// Open Tool Function (placeholder for future implementation)
function openTool(toolName) {
    alert(`${toolName} will be implemented soon!`);
    console.log(`Opening tool: ${toolName}`);
}

// Reminders Functionality
let reminders = [];

function addReminder() {
    const textInput = document.getElementById('reminder-text');
    const timeInput = document.getElementById('reminder-time');
    
    const text = textInput.value.trim();
    const time = timeInput.value;

    if (!text) {
        alert('Please enter a reminder text!');
        return;
    }

    const reminder = {
        id: Date.now(),
        text: text,
        time: time,
        completed: false,
        createdAt: new Date().toISOString()
    };

    reminders.push(reminder);
    saveReminders();
    renderReminders();
    
    // Clear inputs
    textInput.value = '';
    timeInput.value = '';
}

function renderReminders() {
    const remindersList = document.getElementById('reminders-list');
    remindersList.innerHTML = '';

    if (reminders.length === 0) {
        remindersList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No reminders yet. Add your first reminder!</p>';
        return;
    }

    reminders.forEach(reminder => {
        const reminderItem = document.createElement('div');
        reminderItem.className = `reminder-item glass ${reminder.completed ? 'completed' : ''}`;
        
        const formattedTime = reminder.time ? new Date(reminder.time).toLocaleString() : 'No specific time';
        
        reminderItem.innerHTML = `
            <div class="reminder-info">
                <div class="reminder-text">${escapeHtml(reminder.text)}</div>
                <div class="reminder-time">⏰ ${formattedTime}</div>
            </div>
            <button class="delete-btn" onclick="deleteReminder(${reminder.id})">Delete</button>
        `;

        remindersList.appendChild(reminderItem);
    });
}

function deleteReminder(id) {
    reminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders();
    renderReminders();
}

function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function loadReminders() {
    const saved = localStorage.getItem('reminders');
    if (saved) {
        reminders = JSON.parse(saved);
        renderReminders();
    } else {
        renderReminders();
    }
}

// Notes Functionality
let notes = [];

function addNote() {
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title && !content) {
        alert('Please enter a title or content for your note!');
        return;
    }

    const note = {
        id: Date.now(),
        title: title || 'Untitled Note',
        content: content,
        createdAt: new Date().toISOString()
    };

    notes.push(note);
    saveNotes();
    renderNotes();
    
    // Clear inputs
    titleInput.value = '';
    contentInput.value = '';
}

function renderNotes() {
    const notesGrid = document.getElementById('notes-grid');
    notesGrid.innerHTML = '';

    if (notes.length === 0) {
        notesGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem; grid-column: 1/-1;">No notes yet. Create your first note!</p>';
        return;
    }

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card glass';
        
        const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        noteCard.innerHTML = `
            <button class="delete-note-btn" onclick="deleteNote(${note.id})">✕</button>
            <h4>${escapeHtml(note.title)}</h4>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-date">📅 ${formattedDate}</div>
        `;

        notesGrid.appendChild(noteCard);
    });
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const saved = localStorage.getItem('notes');
    if (saved) {
        notes = JSON.parse(saved);
        renderNotes();
    } else {
        renderNotes();
    }
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add reminder when in reminder input
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'reminder-text') {
            addReminder();
        } else if (activeElement.id === 'note-title' || activeElement.id === 'note-content') {
            addNote();
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add some sample data for demonstration (optional - comment out in production)
// Uncomment the lines below to see sample data on first load
/*
if (localStorage.getItem('notes') === null && localStorage.getItem('reminders') === null) {
    notes = [
        { id: 1, title: 'Welcome Note', content: 'This is your personal dashboard! You can add notes, reminders, and use calculators here.', createdAt: new Date().toISOString() }
    ];
    saveNotes();
    renderNotes();
}
*/

console.log('Dashboard initialized successfully! 🚀');
