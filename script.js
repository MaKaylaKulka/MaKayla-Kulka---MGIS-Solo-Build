// Type A Student Planner - Processing & Presentation Layer Logic
document.addEventListener('DOMContentLoaded', () => {
    // Current Date display
    const dateEl = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);

    // Navigation switching
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const viewTitle = document.getElementById('view-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            viewSections.forEach(sec => sec.classList.remove('active'));

            item.classList.add('active');
            const viewName = item.getAttribute('data-view');
            const targetSection = document.getElementById(`${viewName}-view`);
            if (targetSection) {
                targetSection.classList.add('active');
                viewTitle.textContent = item.textContent;
            }
        });
    });

    // Calendar Sync Simulation
    const syncBtn = document.getElementById('sync-calendar-btn');
    syncBtn.addEventListener('click', () => {
        syncBtn.textContent = 'Syncing...';
        syncBtn.style.backgroundColor = 'var(--accent)';
        setTimeout(() => {
            syncBtn.textContent = 'Synced to Calendar ✓';
            setTimeout(() => {
                syncBtn.textContent = 'Sync Calendar';
                syncBtn.style.backgroundColor = '';
            }, 3000);
        }, 1200);
    });

    // Modal Handling for Syllabus Upload (AI Workflow simulation)
    const modal = document.getElementById('upload-modal');
    const openModalBtn = document.getElementById('open-upload-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelModalBtn = document.getElementById('cancel-modal');
    const dropzone = document.getElementById('dropzone');
    const fileNameDisplay = document.getElementById('file-name-display');
    const previewList = document.getElementById('preview-list');
    const confirmUploadBtn = document.getElementById('confirm-upload');
    const triggerScannerBtn = document.getElementById('trigger-scanner-btn');

    function toggleModal(show) {
        if (show) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
            fileNameDisplay.textContent = 'No file selected';
            previewList.innerHTML = '<li><em>Upload a syllabus to preview parsed assignments and due dates...</em></li>';
            confirmUploadBtn.disabled = true;
        }
    }

    openModalBtn.addEventListener('click', () => toggleModal(true));
    if (triggerScannerBtn) triggerScannerBtn.addEventListener('click', () => toggleModal(true));
    closeModalBtn.addEventListener('click', () => toggleModal(false));
    cancelModalBtn.addEventListener('click', () => toggleModal(false));

    // Simulate file drop / selection
    dropzone.addEventListener('click', () => {
        fileNameDisplay.textContent = 'MGIS130_Syllabus_Fall2026.pdf (Selected)';
        previewList.innerHTML = `
            <li><strong>Assignment 1:</strong> Project Proposal & 3-Layer Plan (Due: Nov 20) - 25%</li>
            <li><strong>Milestone:</strong> GitHub Repo & Status Check-In - Complete</li>
            <li><strong>Live Demo:</strong> Dec 2, 2026 (Classroom 302) - 16%</li>
        `;
        confirmUploadBtn.disabled = false;
    });

    confirmUploadBtn.addEventListener('click', () => {
        confirmUploadBtn.textContent = 'Saving to DB...';
        setTimeout(() => {
            alert('Syllabus successfully parsed and added to your planner database!');
            toggleModal(false);
            confirmUploadBtn.textContent = 'Confirm & Save to Database';
        }, 800);
    });

    // Add Priority Task interaction
    const addPriorityBtn = document.getElementById('add-priority-btn');
    const prioritiesList = document.getElementById('priorities-list');

    if (addPriorityBtn) {
        addPriorityBtn.addEventListener('click', () => {
            const taskText = prompt('Enter new top daily priority:');
            if (taskText && taskText.trim() !== '') {
                const li = document.createElement('li');
                li.innerHTML = `<label><input type="checkbox"> ${taskText.trim()}</label>`;
                prioritiesList.appendChild(li);
            }
        });
    }
});
