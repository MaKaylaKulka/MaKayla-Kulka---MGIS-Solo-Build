/* Warm Autumn / Fall Aesthetic preserved cleanly for Phase 1 Wireframe */
:root {
    --bg-main: #FDFBF7;
    --bg-card: #FFFFFF;
    --primary: #C85A17;
    --primary-hover: #A64710;
    --accent: #E08236;
    --text-main: #2C221E;
    --text-muted: #7A6E65;
    --border: #EBE3D5;
    --sidebar-bg: #F4EBE1;
    --success: #388E3C;
    --warning: #D32F2F;
    --radius: 10px;
    --shadow: 0 3px 14px rgba(44, 34, 30, 0.05);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

body {
    background-color: var(--bg-main);
    color: var(--text-main);
    min-height: 100vh;
}

.app-container {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.sidebar {
    width: 240px;
    background-color: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    flex-shrink: 0;
}

.brand h2 { font-size: 1.2rem; font-weight: 700; }
.brand h2 span { color: var(--primary); }
.brand p { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

.nav-links {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-item {
    padding: 11px 14px;
    background: transparent;
    border: none;
    text-align: left;
    color: var(--text-muted);
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.nav-item:hover, .nav-item.active {
    background-color: var(--primary);
    color: #FFFFFF;
}

.sidebar-alerts {
    margin-top: 28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
}

.sidebar-alerts h4 {
    font-size: 0.78rem;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 8px;
}

.sidebar-alerts ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.78rem;
    color: var(--text-main);
}

.sidebar-alerts li.urgent { color: var(--warning); font-weight: 600; }
.full-width { width: 100%; }

/* Toast Notification Banner */
.toast-banner {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--text-main);
    color: #FFFFFF;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    z-index: 2000;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
    transition: all 0.2s ease;
}

.toast-banner.show { opacity: 1; transform: translateY(0); }

/* Main Content */
.main-content { flex: 1; overflow-y: auto; padding: 24px 28px; }

.top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
}

.header-left h1 { font-size: 1.55rem; font-weight: 700; }

.date-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-muted);
}

.header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

/* Buttons & Inputs */
.btn { padding: 9px 16px; font-size: 0.85rem; font-weight: 600; border-radius: 8px; cursor: pointer; border: none; }
.btn-sm { padding: 6px 12px; font-size: 0.8rem; }
.btn-primary { background-color: var(--primary); color: #FFFFFF; }
.btn-primary:hover { background-color: var(--primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-main); }
.btn-outline:hover { background: var(--border); }
.btn-text { background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer; font-size: 0.8rem; }
.btn-icon { background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; padding: 3px 9px; cursor: pointer; font-weight: 700; }

input[type="text"], input[type="date"], input[type="time"], select, textarea {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.85rem;
    background: var(--bg-main);
    color: var(--text-main);
}

input:focus, select:focus, textarea:focus { outline: 2px solid var(--accent); background: #FFFFFF; }

.view-section { display: none; }
.view-section.active { display: block; }
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 8px; }
.card-header h2 { font-size: 1.02rem; font-weight: 700; }
.subtext { font-size: 0.78rem; color: var(--text-muted); }
.badge { background: var(--sidebar-bg); color: var(--primary); font-size: 0.72rem; font-weight: 600; padding: 3px 9px; border-radius: 12px; }
.mb-8 { margin-bottom: 8px; }
.mb-12 { margin-bottom: 12px; }
.mb-20 { margin-bottom: 20px; }
.mt-8 { margin-top: 8px; }
.hidden { display: none !important; }

/* Daily, Weekly, Monthly & Modals */
.daily-layout { display: grid; grid-template-columns: 1.25fr 1.15fr 0.9fr; gap: 18px; align-items: start; }
.daily-middle-col, .daily-right-col { display: flex; flex-direction: column; gap: 18px; }
.time-range-controls { display: flex; gap: 8px; font-size: 0.78rem; }
.time-range-controls label { display: flex; align-items: center; gap: 4px; color: var(--text-muted); }
.time-range-controls select { width: auto; padding: 4px 6px; font-size: 0.78rem; }
.inline-block-adder { display: flex; gap: 6px; margin-bottom: 10px; background: var(--bg-main); padding: 8px; border-radius: 8px; border: 1px solid var(--border); }
.inline-block-adder select { width: 115px; flex-shrink: 0; }
.time-grid { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.time-slot-row { display: flex; border-bottom: 1px solid var(--border); min-height: 44px; cursor: pointer; transition: background 0.12s; }
.time-slot-row:last-child { border-bottom: none; }
.time-slot-row:hover { background-color: #FAF4EC; }
.time-slot-label { width: 78px; padding: 8px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); background: var(--bg-main); border-right: 1px solid var(--border); flex-shrink: 0; }
.time-slot-content { flex: 1; padding: 6px 10px; display: flex; flex-direction: column; gap: 4px; }
.block-pill { padding: 5px 9px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; display: flex; justify-content: space-between; align-items: center; background: #FDECE2; border-left: 4px solid var(--primary); }
.block-pill.custom { background: #FFF3E0; border-left-color: var(--accent); }
.block-pill button { background: none; border: none; color: var(--text-muted); cursor: pointer; font-weight: 700; margin-left: 8px; }
.inline-add-form { display: flex; gap: 6px; margin-bottom: 12px; }
.inline-add-form select { width: 110px; flex-shrink: 0; }
.inline-add-form button { flex-shrink: 0; }
.checkbox-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.checkbox-list li { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: var(--bg-main); border-radius: 6px; font-size: 0.85rem; }
.checkbox-list li.done span { text-decoration: line-through; color: var(--text-muted); }
.checkbox-list label { display: flex; align-items: center; gap: 8px; cursor: pointer; flex: 1; }
.tag-pill { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--sidebar-bg); color: var(--primary); font-weight: 600; }
.notes-split, .meal-fields { display: flex; flex-direction: column; gap: 10px; }
.field-label, .field-group label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
.check-inline { font-size: 0.82rem; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; }
.weekly-event-form { display: grid; grid-template-columns: 140px 110px 1fr 150px auto; gap: 8px; margin-bottom: 16px; padding: 12px; background: var(--bg-main); border-radius: 8px; border: 1px solid var(--border); }
.week-days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
.week-day-col { background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 10px; min-height: 360px; }
.week-day-col.today-col { border: 2px solid var(--primary); background: #FFFDF9; }
.week-day-header { border-bottom: 1px solid var(--border); padding-bottom: 6px; text-align: center; }
.week-day-header h4 { font-size: 0.85rem; font-weight: 700; }
.week-day-header span { font-size: 0.72rem; color: var(--text-muted); }
.week-sub-box h5 { font-size: 0.72rem; text-transform: uppercase; color: var(--primary); margin-bottom: 4px; }
.week-mini-list { list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 0.76rem; }
.week-mini-list li { background: var(--bg-card); padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border); }
.week-mini-list li.due-item { border-left: 3px solid var(--warning); font-weight: 600; }
.priority-slot-input { padding: 4px 6px !important; font-size: 0.76rem !important; margin-bottom: 4px; background: var(--bg-card) !important; }
.weekly-bottom-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 18px; }
.table-responsive { overflow-x: auto; }
.planner-table { width: 100%; border-collapse: collapse; text-align: left; }
.planner-table th { background: var(--sidebar-bg); font-weight: 600; border-bottom: 1px solid var(--border); }
.planner-table td { border-bottom: 1px solid var(--border); }
.compact-table th, .compact-table td { padding: 8px 10px; font-size: 0.8rem; }
.weekly-fitness-list { display: flex; flex-direction: column; gap: 8px; }
.fitness-day-row { display: grid; grid-template-columns: 75px 1fr; align-items: center; gap: 8px; font-size: 0.82rem; }
.monthly-layout { display: grid; grid-template-columns: 2.2fr 1fr; gap: 18px; align-items: start; }
.calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 700; font-size: 0.8rem; color: var(--text-muted); padding-bottom: 8px; }
.monthly-calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.cal-day-cell { min-height: 92px; border: 1px solid var(--border); border-radius: 6px; padding: 6px; background: var(--bg-main); cursor: pointer; display: flex; flex-direction: column; gap: 3px; }
.cal-day-cell:hover { border-color: var(--primary); }
.cal-day-cell.empty { background: transparent; border: none; cursor: default; }
.cal-day-cell.is-today { border: 2px solid var(--primary); background: #FFF8F2; }
.cal-day-num { font-size: 0.78rem; font-weight: 700; margin-bottom: 2px; }
.cal-badge { font-size: 0.68rem; padding: 2px 5px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cal-badge.assignment { background: #FDECEA; color: var(--warning); font-weight: 600; }
.cal-badge.event { background: var(--sidebar-bg); color: var(--primary); font-weight: 600; }
.modal { display: none; position: fixed; inset: 0; background: rgba(44, 34, 30, 0.55); justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
.modal.active { display: flex; }
.modal-content { background: var(--bg-card); border-radius: var(--radius); padding: 24px; width: 100%; max-width: 780px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
.upload-controls-row { display: grid; grid-template-columns: 1.3fr 1.2fr auto; gap: 12px; margin-bottom: 12px; }
.staging-box { border: 1px solid var(--border); border-radius: 8px; padding: 12px; background: var(--bg-main); margin-bottom: 16px; }
.staging-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.filter-row { display: flex; gap: 8px; }
.filter-row select { width: auto; }
.empty-cell { text-align: center; color: var(--text-muted); padding: 16px; }
.classes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.class-card { background: var(--bg-main); border: 1px solid var(--border); border-top: 4px solid var(--primary); border-radius: 8px; padding: 12px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; }

@media (max-width: 1200px) {
    .daily-layout { grid-template-columns: 1fr; }
    .week-days-grid { grid-template-columns: repeat(2, 1fr); }
    .weekly-bottom-grid { grid-template-columns: 1fr; }
    .monthly-layout { grid-template-columns: 1fr; }
}