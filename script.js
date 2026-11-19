// Type A Student Planner - Phase 1 Functional MVP (Standalone GitHub Version)
document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'typeA_planner_phase1_v1';
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let toastTimer = null;
    function showToast(msg) {
        const toast = document.getElementById('toast-banner');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
    }

    function getDefaultState() {
        return {
            settings: { startHour: 8, endHour: 22 },
            classes: [
                { id: 'c1', code: 'MGIS 130', name: 'Management Information Systems', days: ['Mon', 'Wed'], startHour: 8, duration: 1, location: 'Golisano Hall' },
                { id: 'c2', code: 'HSP 310', name: 'Hospitality Operations', days: ['Tue', 'Thu'], startHour: 10, duration: 2, location: 'Saunders 210' },
                { id: 'c3', code: 'STAT 145', name: 'Intro to Statistics', days: ['Mon', 'Wed', 'Fri'], startHour: 13, duration: 1, location: 'Gosnell Hall' }
            ],
            assignments: [
                { id: 'a1', classCode: 'MGIS 130', title: 'Phase 1 Functional Build Check-in', dueDate: '2026-11-18', weight: '15%', isExam: false, done: false },
                { id: 'a2', classCode: 'HSP 310', title: 'Operations Case Study Analysis', dueDate: '2026-11-20', weight: '20%', isExam: false, done: false },
                { id: 'a3', classCode: 'STAT 145', title: 'Unit 3 Probability Exam', dueDate: '2026-11-24', weight: '30%', isExam: true, done: false }
            ],
            events: [
                { id: 'e1', date: '2026-11-19', time: '17:00', title: 'Academic Advisor Check-in', type: 'event' },
                { id: 'e2', date: '2026-11-26', time: '12:00', title: 'Thanksgiving Dinner w/ Family', type: 'event' }
            ],
            dailyData: {
                '2026-11-18': {
                    customBlocks: [{ id: 'b1', hour: 15, title: 'Code Review & GitHub Push' }],
                    homeworkTasks: [{ id: 'hw1', text: 'Complete STAT 145 Practice Set 7', classCode: 'STAT 145', done: false }],
                    generalTasks: [
                        { id: 'gt1', text: 'Pick up groceries for meal prep', done: false },
                        { id: 'gt2', text: 'Email group members about presentation', done: true }
                    ],
                    notes: 'Focus on getting Phase 1 data flow rock solid before styling.',
                    futureTodo: '- Order winter boots\n- Outline December finals study schedule',
                    meals: {
                        breakfast: 'Greek yogurt, berries & granola',
                        lunch: 'Chipotle chicken bowl w/ brown rice',
                        dinner: 'Grilled salmon, quinoa & roasted broccoli',
                        snacks: 'Apple + 80oz water'
                    },
                    workout: {
                        plan: 'Upper Body Strength (45 mins)',
                        notes: 'Bench press 3x10, Rows 3x12, Shoulder press 3x10',
                        done: false
                    },
                    top3: ['Finish Phase 1 MVP', 'Submit MGIS check-in', 'Hit 80oz water goal']
                }
            },
            monthlyPriorities: {
                '2026-11': [
                    { id: 'mp1', text: 'Finish all 3 phases of Type A Student Planner', done: false },
                    { id: 'mp2', text: 'Maintain >90% average across all courses', done: false }
                ]
            }
        };
    }

    let state = loadState();
    let currentView = 'daily';
    let selectedDate = new Date(2026, 10, 18);
    let stagingItems = [];

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : getDefaultState();
        } catch {
            return getDefaultState();
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {}
        renderSmartAlerts();
    }

    function formatDateKey(dateObj) {
        return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    }

    function formatMonthKey(dateObj) {
        return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    }

    function parseLocalDate(dateStr) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function ensureDayRecord(dateKey) {
        if (!state.dailyData[dateKey]) {
            state.dailyData[dateKey] = {
                customBlocks: [], homeworkTasks: [], generalTasks: [], notes: '', futureTodo: '',
                meals: { breakfast: '', lunch: '', dinner: '', snacks: '' },
                workout: { plan: '', notes: '', done: false },
                top3: ['', '', '']
            };
        }
        return state.dailyData[dateKey];
    }

    function getMondayOfWeek(dateObj) {
        const d = new Date(dateObj);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function formatHourLabel(h) {
        if (h === 0) return '12:00 AM';
        if (h < 12) return `${h}:00 AM`;
        if (h === 12) return '12:00 PM';
        return `${h - 12}:00 PM`;
    }

    // Navigation & Controls
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const viewTitle = document.getElementById('view-title');
    const activeDateLabel = document.getElementById('active-date-label');

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            navItems.forEach(b => b.classList.remove('active'));
            viewSections.forEach(sec => sec.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            document.getElementById(`${currentView}-view`).classList.add('active');
            viewTitle.textContent = btn.textContent;
            renderAll();
        });
    });

    document.getElementById('prev-period-btn').addEventListener('click', () => {
        if (currentView === 'daily') selectedDate.setDate(selectedDate.getDate() - 1);
        else if (currentView === 'weekly') selectedDate.setDate(selectedDate.getDate() - 7);
        else selectedDate.setMonth(selectedDate.getMonth() - 1);
        renderAll();
    });

    document.getElementById('next-period-btn').addEventListener('click', () => {
        if (currentView === 'daily') selectedDate.setDate(selectedDate.getDate() + 1);
        else if (currentView === 'weekly') selectedDate.setDate(selectedDate.getDate() + 7);
        else selectedDate.setMonth(selectedDate.getMonth() + 1);
        renderAll();
    });

    document.getElementById('today-btn').addEventListener('click', () => {
        selectedDate = new Date(2026, 10, 18);
        renderAll();
    });

    document.getElementById('reset-demo-btn').addEventListener('click', () => {
        state = getDefaultState();
        saveState();
        renderAll();
        showToast('Demo schedule & assignments restored!');
    });

    function updateHeaderDateLabel() {
        if (currentView === 'daily') {
            activeDateLabel.textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (currentView === 'weekly') {
            const mon = getMondayOfWeek(selectedDate);
            const sun = new Date(mon);
            sun.setDate(mon.getDate() + 6);
            activeDateLabel.textContent = `Week of ${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else {
            activeDateLabel.textContent = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
    }

    function renderSmartAlerts() {
        const list = document.getElementById('smart-alerts-list');
        list.innerHTML = '';
        const alerts = [];
        state.assignments.filter(a => !a.done).forEach(a => {
            const due = parseLocalDate(a.dueDate);
            const diffDays = Math.round((due - selectedDate) / (1000 * 60 * 60 * 24));
            if (a.isExam && diffDays >= 0 && diffDays <= 7) {
                alerts.push({ text: `EXAM (${diffDays === 0 ? 'Today' : diffDays + 'd'}): ${a.classCode} - ${a.title}`, urgent: true });
            } else if (!a.isExam && diffDays >= 0 && diffDays <= 2) {
                alerts.push({ text: `DUE (${diffDays === 0 ? 'Today' : diffDays + 'd'}): ${a.classCode} - ${a.title}`, urgent: diffDays === 0 });
            }
        });
        if (alerts.length === 0) {
            list.innerHTML = '<li>All caught up for upcoming deadlines!</li>';
            return;
        }
        alerts.forEach(al => {
            const li = document.createElement('li');
            if (al.urgent) li.className = 'urgent';
            li.textContent = al.text;
            list.appendChild(li);
        });
    }

    const startHourSelect = document.getElementById('start-hour-select');
    const endHourSelect = document.getElementById('end-hour-select');
    const blockHourSelect = document.getElementById('block-hour-select');

    function initTimeRangeSelectors() {
        startHourSelect.innerHTML = '';
        endHourSelect.innerHTML = '';
        for (let h = 5; h <= 23; h++) {
            startHourSelect.appendChild(new Option(formatHourLabel(h), h, false, h === state.settings.startHour));
            endHourSelect.appendChild(new Option(formatHourLabel(h), h, false, h === state.settings.endHour));
        }
        refreshBlockHourDropdown();
    }

    function refreshBlockHourDropdown() {
        const prev = blockHourSelect.value;
        blockHourSelect.innerHTML = '';
        for (let h = state.settings.startHour; h <= state.settings.endHour; h++) {
            blockHourSelect.appendChild(new Option(formatHourLabel(h), h));
        }
        if (prev && Number(prev) >= state.settings.startHour && Number(prev) <= state.settings.endHour) {
            blockHourSelect.value = prev;
        }
    }

    startHourSelect.addEventListener('change', () => {
        state.settings.startHour = Math.min(Number(startHourSelect.value), state.settings.endHour - 1);
        refreshBlockHourDropdown();
        saveState();
        renderDailyView();
    });

    endHourSelect.addEventListener('change', () => {
        state.settings.endHour = Math.max(Number(endHourSelect.value), state.settings.startHour + 1);
        refreshBlockHourDropdown();
        saveState();
        renderDailyView();
    });

    document.getElementById('add-timeblock-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const hour = Number(blockHourSelect.value);
        const titleInp = document.getElementById('block-title-input');
        const dayRecord = ensureDayRecord(formatDateKey(selectedDate));
        dayRecord.customBlocks.push({ id: 'blk_' + Date.now(), hour, title: titleInp.value.trim() });
        titleInp.value = '';
        saveState();
        renderDailyView();
        showToast(`Blocked ${formatHourLabel(hour)}`);
    });

    function renderDailyView() {
        const dateKey = formatDateKey(selectedDate);
        const dayName = DAY_NAMES[selectedDate.getDay()];
        const dayRecord = ensureDayRecord(dateKey);

        const hwClassSel = document.getElementById('homework-class-select');
        hwClassSel.innerHTML = '<option value="">General</option>';
        state.classes.forEach(c => hwClassSel.appendChild(new Option(c.code, c.code)));

        const grid = document.getElementById('daily-time-grid');
        grid.innerHTML = '';
        for (let h = state.settings.startHour; h <= state.settings.endHour; h++) {
            const row = document.createElement('div');
            row.className = 'time-slot-row';
            const label = document.createElement('div');
            label.className = 'time-slot-label';
            label.textContent = formatHourLabel(h);
            const content = document.createElement('div');
            content.className = 'time-slot-content';

            state.classes.forEach(cls => {
                if (cls.days.includes(dayName) && h >= cls.startHour && h < cls.startHour + (cls.duration || 1)) {
                    const pill = document.createElement('div');
                    pill.className = 'block-pill';
                    pill.innerHTML = `<span><strong>${cls.code}</strong> &middot; ${cls.name} (${cls.location || 'Class'})</span>`;
                    content.appendChild(pill);
                }
            });

            state.events.filter(ev => ev.date === dateKey).forEach(ev => {
                if (parseInt(ev.time.split(':')[0], 10) === h) {
                    const pill = document.createElement('div');
                    pill.className = 'block-pill custom';
                    pill.innerHTML = `<span>${ev.title} (${ev.time})</span>`;
                    content.appendChild(pill);
                }
            });

            dayRecord.customBlocks.filter(b => b.hour === h).forEach(blk => {
                const pill = document.createElement('div');
                pill.className = 'block-pill custom';
                pill.innerHTML = `<span>${blk.title}</span><button title="Remove block">&times;</button>`;
                pill.querySelector('button').addEventListener('click', (e) => {
                    e.stopPropagation();
                    dayRecord.customBlocks = dayRecord.customBlocks.filter(item => item.id !== blk.id);
                    saveState();
                    renderDailyView();
                });
                content.appendChild(pill);
            });

            row.addEventListener('click', () => {
                blockHourSelect.value = h;
                const titleInput = document.getElementById('block-title-input');
                titleInput.placeholder = `Block ${formatHourLabel(h)}...`;
                titleInput.focus();
            });

            row.appendChild(label);
            row.appendChild(content);
            grid.appendChild(row);
        }

        const hwList = document.getElementById('daily-homework-list');
        hwList.innerHTML = '';
        state.assignments.filter(a => a.dueDate === dateKey).forEach(a => {
            const li = document.createElement('li');
            if (a.done) li.className = 'done';
            li.innerHTML = `<label><input type="checkbox" ${a.done ? 'checked' : ''}><span>${a.title}</span></label><span class="tag-pill">${a.classCode} &middot; ${a.weight}</span>`;
            li.querySelector('input').addEventListener('change', (e) => { a.done = e.target.checked; saveState(); renderDailyView(); });
            hwList.appendChild(li);
        });

        dayRecord.homeworkTasks.forEach(task => {
            const li = document.createElement('li');
            if (task.done) li.className = 'done';
            li.innerHTML = `<label><input type="checkbox" ${task.done ? 'checked' : ''}><span>${task.text}</span></label>${task.classCode ? `<span class="tag-pill">${task.classCode}</span>` : ''}<button class="btn-text">&times;</button>`;
            li.querySelector('input').addEventListener('change', (e) => { task.done = e.target.checked; saveState(); renderDailyView(); });
            li.querySelector('button').addEventListener('click', () => { dayRecord.homeworkTasks = dayRecord.homeworkTasks.filter(t => t.id !== task.id); saveState(); renderDailyView(); });
            hwList.appendChild(li);
        });
        if (hwList.children.length === 0) hwList.innerHTML = '<li class="subtext">No homework due or added for today.</li>';

        const genList = document.getElementById('daily-general-list');
        genList.innerHTML = '';
        dayRecord.generalTasks.forEach(task => {
            const li = document.createElement('li');
            if (task.done) li.className = 'done';
            li.innerHTML = `<label><input type="checkbox" ${task.done ? 'checked' : ''}><span>${task.text}</span></label><button class="btn-text">&times;</button>`;
            li.querySelector('input').addEventListener('change', (e) => { task.done = e.target.checked; saveState(); renderDailyView(); });
            li.querySelector('button').addEventListener('click', () => { dayRecord.generalTasks = dayRecord.generalTasks.filter(t => t.id !== task.id); saveState(); renderDailyView(); });
            genList.appendChild(li);
        });
        if (genList.children.length === 0) genList.innerHTML = '<li class="subtext">No general tasks yet.</li>';

        const notesArea = document.getElementById('daily-notes-area');
        const futureArea = document.getElementById('future-todo-area');
        notesArea.value = dayRecord.notes || '';
        futureArea.value = dayRecord.futureTodo || '';
        notesArea.oninput = () => { dayRecord.notes = notesArea.value; saveState(); };
        futureArea.oninput = () => { dayRecord.futureTodo = futureArea.value; saveState(); };

        document.querySelectorAll('.daily-meal-input').forEach(inp => {
            const mealType = inp.dataset.meal;
            inp.value = dayRecord.meals[mealType] || '';
            inp.oninput = () => { dayRecord.meals[mealType] = inp.value; saveState(); };
        });

        const woDone = document.getElementById('daily-workout-done');
        const woPlan = document.getElementById('daily-workout-plan');
        const woNotes = document.getElementById('daily-workout-notes');
        woDone.checked = !!dayRecord.workout.done;
        woPlan.value = dayRecord.workout.plan || '';
        woNotes.value = dayRecord.workout.notes || '';
        woDone.onchange = () => { dayRecord.workout.done = woDone.checked; saveState(); };
        woPlan.oninput = () => { dayRecord.workout.plan = woPlan.value; saveState(); };
        woNotes.oninput = () => { dayRecord.workout.notes = woNotes.value; saveState(); };
    }

    document.getElementById('add-homework-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = document.getElementById('homework-input');
        const cls = document.getElementById('homework-class-select').value;
        ensureDayRecord(formatDateKey(selectedDate)).homeworkTasks.push({ id: 'hw_' + Date.now(), text: inp.value.trim(), classCode: cls, done: false });
        inp.value = '';
        saveState();
        renderDailyView();
    });

    document.getElementById('add-general-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = document.getElementById('general-input');
        ensureDayRecord(formatDateKey(selectedDate)).generalTasks.push({ id: 'gt_' + Date.now(), text: inp.value.trim(), done: false });
        inp.value = '';
        saveState();
        renderDailyView();
    });

    document.getElementById('rollover-btn').addEventListener('click', () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevKey = formatDateKey(prevDate);
        const prevRecord = state.dailyData[prevKey];
        if (!prevRecord) { showToast('No tasks found on the previous day to roll over.'); return; }
        const todayRecord = ensureDayRecord(formatDateKey(selectedDate));
        let movedCount = 0;
        prevRecord.generalTasks = prevRecord.generalTasks.filter(t => {
            if (!t.done) { todayRecord.generalTasks.push({ ...t, id: 'gt_' + Date.now() + Math.random() }); movedCount++; return false; }
            return true;
        });
        prevRecord.homeworkTasks = prevRecord.homeworkTasks.filter(t => {
            if (!t.done) { todayRecord.homeworkTasks.push({ ...t, id: 'hw_' + Date.now() + Math.random() }); movedCount++; return false; }
            return true;
        });
        saveState();
        renderDailyView();
        showToast(`Rolled over ${movedCount} unfinished task(s) from ${prevKey}.`);
    });

    // Weekly View
    document.getElementById('toggle-weekly-event-form').addEventListener('click', () => {
        const form = document.getElementById('weekly-event-form');
        form.classList.toggle('hidden');
        document.getElementById('week-event-date').value = formatDateKey(selectedDate);
    });

    document.getElementById('weekly-event-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.events.push({
            id: 'ev_' + Date.now(),
            date: document.getElementById('week-event-date').value,
            time: document.getElementById('week-event-time').value,
            title: document.getElementById('week-event-title').value.trim(),
            type: document.getElementById('week-event-type').value
        });
        document.getElementById('week-event-title').value = '';
        saveState();
        renderWeeklyView();
        showToast('Event added across Weekly, Daily, and Monthly schedules!');
    });

    function renderWeeklyView() {
        const monday = getMondayOfWeek(selectedDate);
        const todayKey = formatDateKey(new Date(2026, 10, 18));
        const daysGrid = document.getElementById('week-days-grid');
        const mealsTbody = document.getElementById('weekly-meals-tbody');
        const fitnessList = document.getElementById('weekly-fitness-list');
        daysGrid.innerHTML = ''; mealsTbody.innerHTML = ''; fitnessList.innerHTML = '';

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dKey = formatDateKey(d);
            const dShort = DAY_NAMES[d.getDay()];
            const dayRec = ensureDayRecord(dKey);

            const col = document.createElement('div');
            col.className = 'week-day-col' + (dKey === todayKey ? ' today-col' : '');
            col.innerHTML = `<div class="week-day-header"><h4>${dShort}</h4><span>${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>`;

            const prioBox = document.createElement('div');
            prioBox.className = 'week-sub-box';
            prioBox.innerHTML = '<h5>Top 3 Priorities</h5>';
            for (let p = 0; p < 3; p++) {
                const pInp = document.createElement('input');
                pInp.type = 'text'; pInp.className = 'priority-slot-input'; pInp.placeholder = `Priority #${p + 1}`;
                pInp.value = (dayRec.top3 && dayRec.top3[p]) || '';
                pInp.oninput = () => { if (!dayRec.top3) dayRec.top3 = ['', '', '']; dayRec.top3[p] = pInp.value; saveState(); };
                prioBox.appendChild(pInp);
            }
            col.appendChild(prioBox);

            const schedBox = document.createElement('div');
            schedBox.className = 'week-sub-box';
            schedBox.innerHTML = '<h5>Schedule</h5><ul class="week-mini-list"></ul>';
            const schedUl = schedBox.querySelector('ul');
            state.classes.filter(c => c.days.includes(dShort)).forEach(c => { const li = document.createElement('li'); li.textContent = `${formatHourLabel(c.startHour)} · ${c.code}`; schedUl.appendChild(li); });
            state.events.filter(ev => ev.date === dKey).forEach(ev => { const li = document.createElement('li'); li.textContent = `${ev.time} · ${ev.title}`; schedUl.appendChild(li); });
            if (schedUl.children.length === 0) schedUl.innerHTML = '<li class="subtext">No classes/events</li>';
            col.appendChild(schedBox);

            const dueBox = document.createElement('div');
            dueBox.className = 'week-sub-box';
            dueBox.innerHTML = '<h5>Due Dates &amp; Reminders</h5><ul class="week-mini-list"></ul>';
            const dueUl = dueBox.querySelector('ul');
            state.assignments.filter(a => a.dueDate === dKey).forEach(a => { const li = document.createElement('li'); li.className = 'due-item'; li.textContent = `${a.classCode}: ${a.title} (${a.weight})`; dueUl.appendChild(li); });
            if (dueUl.children.length === 0) dueUl.innerHTML = '<li class="subtext">None due</li>';
            col.appendChild(dueBox);
            daysGrid.appendChild(col);

            const tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${dShort}</strong></td>`;
            ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
                const td = document.createElement('td');
                const mInp = document.createElement('input');
                mInp.type = 'text'; mInp.value = dayRec.meals[mealType] || ''; mInp.placeholder = '...';
                mInp.oninput = () => { dayRec.meals[mealType] = mInp.value; saveState(); };
                td.appendChild(mInp); tr.appendChild(td);
            });
            mealsTbody.appendChild(tr);

            const fitRow = document.createElement('div');
            fitRow.className = 'fitness-day-row';
            fitRow.innerHTML = `<strong>${dShort} (${d.getDate()})</strong>`;
            const fInp = document.createElement('input');
            fInp.type = 'text'; fInp.placeholder = 'Plan workout or rest day...'; fInp.value = dayRec.workout.plan || '';
            fInp.oninput = () => { dayRec.workout.plan = fInp.value; saveState(); };
            fitRow.appendChild(fInp);
            fitnessList.appendChild(fitRow);
        }
    }

    // Monthly View
    document.getElementById('toggle-monthly-event-form').addEventListener('click', () => {
        const form = document.getElementById('monthly-event-form');
        form.classList.toggle('hidden');
        document.getElementById('month-event-date').value = formatDateKey(selectedDate);
    });

    document.getElementById('monthly-event-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.events.push({
            id: 'ev_' + Date.now(),
            date: document.getElementById('month-event-date').value,
            time: document.getElementById('month-event-time').value,
            title: document.getElementById('month-event-title').value.trim(),
            type: document.getElementById('month-event-type').value
        });
        document.getElementById('month-event-title').value = '';
        saveState();
        renderMonthlyView();
        showToast('Important date added to calendar!');
    });

    function renderMonthlyView() {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const monthKey = formatMonthKey(selectedDate);
        const todayKey = formatDateKey(new Date(2026, 10, 18));

        document.getElementById('monthly-grid-heading').textContent = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const grid = document.getElementById('monthly-calendar-grid');
        grid.innerHTML = '';

        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let blank = 0; blank < firstDayIndex; blank++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day-cell empty';
            grid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(year, month, day);
            const cellKey = formatDateKey(cellDate);
            const cell = document.createElement('div');
            cell.className = 'cal-day-cell' + (cellKey === todayKey ? ' is-today' : '');
            cell.innerHTML = `<div class="cal-day-num">${day}</div>`;

            state.assignments.filter(a => a.dueDate === cellKey).forEach(a => {
                const badge = document.createElement('div');
                badge.className = 'cal-badge assignment';
                badge.textContent = `${a.classCode}: ${a.title}`;
                cell.appendChild(badge);
            });

            state.events.filter(ev => ev.date === cellKey).forEach(ev => {
                const badge = document.createElement('div');
                badge.className = 'cal-badge event';
                badge.textContent = ev.title;
                cell.appendChild(badge);
            });

            cell.addEventListener('click', () => {
                selectedDate = cellDate;
                document.querySelector('.nav-item[data-view="daily"]').click();
            });
            grid.appendChild(cell);
        }

        const prioList = document.getElementById('monthly-priorities-list');
        prioList.innerHTML = '';
        if (!state.monthlyPriorities[monthKey]) state.monthlyPriorities[monthKey] = [];
        state.monthlyPriorities[monthKey].forEach(item => {
            const li = document.createElement('li');
            if (item.done) li.className = 'done';
            li.innerHTML = `<label><input type="checkbox" ${item.done ? 'checked' : ''}><span>${item.text}</span></label><button class="btn-text">&times;</button>`;
            li.querySelector('input').addEventListener('change', (e) => { item.done = e.target.checked; saveState(); renderMonthlyView(); });
            li.querySelector('button').addEventListener('click', () => { state.monthlyPriorities[monthKey] = state.monthlyPriorities[monthKey].filter(p => p.id !== item.id); saveState(); renderMonthlyView(); });
            prioList.appendChild(li);
        });
    }

    document.getElementById('add-monthly-priority-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = document.getElementById('monthly-priority-input');
        const monthKey = formatMonthKey(selectedDate);
        if (!state.monthlyPriorities[monthKey]) state.monthlyPriorities[monthKey] = [];
        state.monthlyPriorities[monthKey].push({ id: 'mp_' + Date.now(), text: inp.value.trim(), done: false });
        inp.value = '';
        saveState();
        renderMonthlyView();
    });

    // Document Upload & Staging
    const uploadModal = document.getElementById('upload-modal');
    const docRawText = document.getElementById('doc-raw-text');
    const stagingTbody = document.getElementById('staging-tbody');
    const confirmStagingBtn = document.getElementById('confirm-staging-btn');

    document.getElementById('open-upload-modal').addEventListener('click', () => uploadModal.classList.add('active'));
    document.getElementById('close-upload-modal').addEventListener('click', () => uploadModal.classList.remove('active'));
    document.getElementById('cancel-upload-modal').addEventListener('click', () => uploadModal.classList.remove('active'));

    document.getElementById('doc-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { docRawText.value = ev.target.result; };
        reader.readAsText(file);
    });

    document.getElementById('load-sample-doc-btn').addEventListener('click', () => {
        docRawText.value = [
            'Class: PSYC 101 | Intro to Psychology | Days: Tue, Thu | Time: 14:00 | Location: Liberal Arts 102',
            'Assignment: PSYC 101 | Research Paper Outline | Due: 2026-11-21 | Weight: 15% | Type: Homework',
            'Assignment: MGIS 130 | Final Live Demo | Due: 2026-12-02 | Weight: 25% | Type: Exam',
            'Event: Study Group Review Session | Date: 2026-11-22 | Time: 16:00'
        ].join('\n');
    });

    document.getElementById('parse-doc-btn').addEventListener('click', () => {
        const lines = docRawText.value.split('\n').map(l => l.trim()).filter(Boolean);
        stagingItems = [];
        lines.forEach(line => {
            const parts = line.split('|').map(p => p.trim());
            const lower = line.toLowerCase();
            if (lower.startsWith('class:')) {
                const code = parts[0].replace(/^class:\s*/i, '');
                const name = parts[1] || code;
                const daysStr = (parts.find(p => /^days:/i.test(p)) || 'Days: Mon, Wed').replace(/^days:\s*/i, '');
                const timeStr = (parts.find(p => /^time:/i.test(p)) || 'Time: 09:00').replace(/^time:\s*/i, '');
                const locStr = (parts.find(p => /^location:/i.test(p)) || 'Location: Campus').replace(/^location:\s*/i, '');
                stagingItems.push({ category: 'Class', course: code, title: `${name} (${locStr})`, dateOrDays: daysStr, timeOrWeight: timeStr });
            } else if (lower.startsWith('assignment:')) {
                const course = parts[0].replace(/^assignment:\s*/i, '');
                const title = parts[1] || 'Course Assignment';
                const due = (parts.find(p => /^due:/i.test(p)) || `Due: ${formatDateKey(selectedDate)}`).replace(/^due:\s*/i, '');
                const weight = (parts.find(p => /^weight:/i.test(p)) || 'Weight: 10%').replace(/^weight:\s*/i, '');
                const isExam = /exam|midterm|final/i.test(line);
                stagingItems.push({ category: isExam ? 'Exam' : 'Assignment', course, title, dateOrDays: due, timeOrWeight: weight });
            } else {
                const title = parts[0].replace(/^event:\s*/i, '');
                const date = (parts.find(p => /^date:/i.test(p)) || `Date: ${formatDateKey(selectedDate)}`).replace(/^date:\s*/i, '');
                const time = (parts.find(p => /^time:/i.test(p)) || 'Time: 12:00').replace(/^time:\s*/i, '');
                stagingItems.push({ category: 'Event', course: 'Personal', title, dateOrDays: date, timeOrWeight: time });
            }
        });
        renderStagingTable();
    });

    document.getElementById('add-staging-row-btn').addEventListener('click', () => {
        stagingItems.push({ category: 'Assignment', course: state.classes[0]?.code || 'COURSE 101', title: 'New Deliverable', dateOrDays: formatDateKey(selectedDate), timeOrWeight: '10%' });
        renderStagingTable();
    });

    function renderStagingTable() {
        stagingTbody.innerHTML = '';
        if (stagingItems.length === 0) {
            stagingTbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No items staged yet.</td></tr>';
            confirmStagingBtn.disabled = true;
            return;
        }
        confirmStagingBtn.disabled = false;
        stagingItems.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><select data-field="category"><option ${item.category === 'Class' ? 'selected' : ''}>Class</option><option ${item.category === 'Assignment' ? 'selected' : ''}>Assignment</option><option ${item.category === 'Exam' ? 'selected' : ''}>Exam</option><option ${item.category === 'Event' ? 'selected' : ''}>Event</option></select></td>
                <td><input type="text" data-field="course" value="${item.course}"></td>
                <td><input type="text" data-field="title" value="${item.title}"></td>
                <td><input type="text" data-field="dateOrDays" value="${item.dateOrDays}"></td>
                <td><input type="text" data-field="timeOrWeight" value="${item.timeOrWeight}"></td>
                <td><button type="button" class="btn-text">&times;</button></td>
            `;
            tr.querySelectorAll('input, select').forEach(el => el.addEventListener('change', () => { stagingItems[idx][el.dataset.field] = el.value; }));
            tr.querySelector('button').addEventListener('click', () => { stagingItems.splice(idx, 1); renderStagingTable(); });
            stagingTbody.appendChild(tr);
        });
    }

    confirmStagingBtn.addEventListener('click', () => {
        stagingItems.forEach(item => {
            if (item.category === 'Class') {
                const parsedDays = item.dateOrDays.split(',').map(d => d.trim().slice(0, 3));
                const hourNum = parseInt(item.timeOrWeight.split(':')[0], 10) || 9;
                state.classes.push({ id: 'cls_' + Date.now() + Math.random(), code: item.course, name: item.title, days: parsedDays, startHour: hourNum, duration: 1, location: 'Campus' });
            } else if (item.category === 'Assignment' || item.category === 'Exam') {
                state.assignments.push({ id: 'asg_' + Date.now() + Math.random(), classCode: item.course, title: item.title, dueDate: item.dateOrDays, weight: item.timeOrWeight, isExam: item.category === 'Exam', done: false });
            } else {
                state.events.push({ id: 'ev_' + Date.now() + Math.random(), date: item.dateOrDays, time: item.timeOrWeight || '12:00', title: item.title, type: 'event' });
            }
        });
        stagingItems = [];
        docRawText.value = '';
        renderStagingTable();
        uploadModal.classList.remove('active');
        saveState();
        renderAll();
        showToast('Items distributed across Daily, Weekly, and Monthly views!');
    });

    // Classes & Master Assignment Modal
    const masterModal = document.getElementById('master-modal');
    const filterClassSelect = document.getElementById('filter-class-select');
    const sortAssignmentsSelect = document.getElementById('sort-assignments-select');

    document.getElementById('open-master-btn').addEventListener('click', () => { renderMasterModal(); masterModal.classList.add('active'); });
    document.getElementById('close-master-modal').addEventListener('click', () => masterModal.classList.remove('active'));
    filterClassSelect.addEventListener('change', renderMasterModal);
    sortAssignmentsSelect.addEventListener('change', renderMasterModal);

    function renderMasterModal() {
        const classesGrid = document.getElementById('master-classes-grid');
        classesGrid.innerHTML = '';
        const prevFilter = filterClassSelect.value;
        filterClassSelect.innerHTML = '<option value="ALL">All Classes</option>';

        state.classes.forEach(c => {
            filterClassSelect.appendChild(new Option(c.code, c.code));
            const card = document.createElement('div');
            card.className = 'class-card';
            card.innerHTML = `<h4>${c.code}</h4><p class="subtext">${c.name}</p><p class="subtext mt-8"><strong>${c.days.join(', ')}</strong> at ${formatHourLabel(c.startHour)}</p>`;
            classesGrid.appendChild(card);
        });
        filterClassSelect.value = prevFilter || 'ALL';

        const tbody = document.getElementById('master-assignments-tbody');
        tbody.innerHTML = '';
        let list = [...state.assignments];
        if (filterClassSelect.value !== 'ALL') list = list.filter(a => a.classCode === filterClassSelect.value);
        if (sortAssignmentsSelect.value === 'weight') list.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
        else list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

        list.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><input type="checkbox" ${a.done ? 'checked' : ''}></td><td><strong>${a.classCode}</strong></td><td>${a.title}</td><td>${a.dueDate}</td><td>${a.weight}</td><td><button class="btn-text">&times;</button></td>`;
            tr.querySelector('input').addEventListener('change', (e) => { a.done = e.target.checked; saveState(); renderAll(); });
            tr.querySelector('button').addEventListener('click', () => { state.assignments = state.assignments.filter(item => item.id !== a.id); saveState(); renderMasterModal(); renderAll(); });
            tbody.appendChild(tr);
        });
    }

    function renderAll() {
        updateHeaderDateLabel();
        renderSmartAlerts();
        if (currentView === 'daily') renderDailyView();
        if (currentView === 'weekly') renderWeeklyView();
        if (currentView === 'monthly') renderMonthlyView();
    }

    initTimeRangeSelectors();
    renderAll();
});