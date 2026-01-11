// Arduino Helper - Main JavaScript
import { invoke } from '@tauri-apps/api/core';

// Toast Notification System
function showToast(type, title, message, duration = 4000) {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div class="toast-message">${message}</div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// State
let projects = [];
let selectedProject = null;
let currentCategory = 'all';
let currentDifficulty = 'all';
let searchQuery = '';
let rules = [];
let generatedFilePath = null;

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const wikiView = document.getElementById('wiki-view');
const generatorView = document.getElementById('generator-view');
const searchInput = document.getElementById('search-input');
const projectList = document.getElementById('project-list');
const projectDetail = document.getElementById('project-detail');
const categoryFilters = document.getElementById('category-filters');
const difficultyFilters = document.getElementById('difficulty-filters');
const rulesList = document.getElementById('rules-list');
const addRuleBtn = document.getElementById('add-rule-btn');
const generateBtn = document.getElementById('generate-btn');
const openIdeBtn = document.getElementById('open-ide-btn');
const generatedCodeEl = document.getElementById('generated-code');
const resetBtn = document.getElementById('reset-btn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadProjects();
  setupEventListeners();
});

// Load projects
async function loadProjects() {
  try {
    const data = await invoke('read_projects_json');
    const parsed = JSON.parse(data);
    projects = parsed.projects;
  } catch (e) {
    try {
      const response = await fetch('/data/projects.json');
      const data = await response.json();
      projects = data.projects;
    } catch (err) {
      console.error('Fehler beim Laden der Projekte:', err);
      projects = [];
    }
  }

  document.getElementById('total-projects').textContent = projects.length;
  renderProjectList();
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
    });
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderProjectList();
  });

  // Category filters
  categoryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderProjectList();
    }
  });

  // Difficulty filters
  difficultyFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      difficultyFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentDifficulty = e.target.dataset.difficulty;
      renderProjectList();
    }
  });

  // Component cards - toggle on click
  document.querySelectorAll('.component-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking stepper buttons
      if (e.target.closest('.component-stepper')) return;

      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      card.classList.toggle('selected', checkbox.checked);
      onComponentsChanged();
    });
  });

  // Stepper buttons
  document.querySelectorAll('.component-stepper').forEach(stepper => {
    const min = parseInt(stepper.dataset.min) || 1;
    const max = parseInt(stepper.dataset.max) || 7;
    const valueEl = stepper.querySelector('.stepper-value');
    const minusBtn = stepper.querySelector('.stepper-minus');
    const plusBtn = stepper.querySelector('.stepper-plus');

    const updateButtons = () => {
      const val = parseInt(valueEl.textContent);
      minusBtn.classList.toggle('disabled', val <= min);
      plusBtn.classList.toggle('disabled', val >= max);
    };

    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let val = parseInt(valueEl.textContent);
      if (val > min) {
        valueEl.textContent = val - 1;
        updateButtons();
        onComponentsChanged();
      }
    });

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let val = parseInt(valueEl.textContent);
      if (val < max) {
        valueEl.textContent = val + 1;
        updateButtons();
        onComponentsChanged();
      }
    });

    updateButtons();
  });

  // Generator - Add rule
  addRuleBtn.addEventListener('click', addRule);

  // Generator - Generate code
  generateBtn.addEventListener('click', generateCode);

  // Generator - Open in IDE
  openIdeBtn.addEventListener('click', openInArduinoIDE);

  // Generator - Reset
  resetBtn.addEventListener('click', resetGenerator);

  // Generator - Copy code
  document.getElementById('copy-generated-btn').addEventListener('click', () => {
    if (window.generatedCode) {
      copyToClipboard(window.generatedCode, document.getElementById('copy-generated-btn'));
    }
  });

  // Output tabs
  document.querySelectorAll('.output-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;

      // Update tab buttons
      document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      document.querySelectorAll('.output-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${tabName}`).classList.add('active');
    });
  });
}

// Copy to clipboard helper
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);

    // Visual feedback
    const originalText = button.querySelector('span').textContent;
    button.classList.add('copied');
    button.querySelector('span').textContent = 'Kopiert!';

    setTimeout(() => {
      button.classList.remove('copied');
      button.querySelector('span').textContent = originalText;
    }, 2000);
  } catch (err) {
    showToast('error', 'Fehler', 'Kopieren fehlgeschlagen');
  }
}

// Switch view
function switchView(view) {
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  wikiView.classList.toggle('active', view === 'wiki');
  generatorView.classList.toggle('active', view === 'generator');
}

// Filter and render project list
function renderProjectList() {
  const filtered = projects.filter(project => {
    const matchesCategory = currentCategory === 'all' || project.category === currentCategory;
    const matchesDifficulty = currentDifficulty === 'all' || project.difficulty === currentDifficulty;
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery) ||
      project.description.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  projectList.innerHTML = filtered.map(project => `
    <div class="project-item ${selectedProject?.id === project.id ? 'active' : ''}" data-id="${project.id}">
      <div class="project-item-title">${project.title}</div>
      <div class="project-item-meta">
        <span class="badge badge-category">${project.category}</span>
        <span class="badge badge-difficulty ${project.difficulty === 'Fortgeschritten' ? 'advanced' : ''}">${project.difficulty}</span>
      </div>
    </div>
  `).join('');

  projectList.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id);
      selectProject(id);
    });
  });
}

// Select project
async function selectProject(id) {
  selectedProject = projects.find(p => p.id === id);
  if (!selectedProject) return;

  renderProjectList();

  let code = '';
  try {
    code = await invoke('read_solution_file', { filename: selectedProject.code });
  } catch (e) {
    try {
      const response = await fetch(`/solutions/${selectedProject.code}`);
      code = await response.text();
    } catch (err) {
      code = '// Code konnte nicht geladen werden';
    }
  }

  projectDetail.innerHTML = `
    <div class="project-header">
      <h2>${selectedProject.title}</h2>
      <p>${selectedProject.description}</p>
      <div class="project-tags">
        <span class="badge badge-category">${selectedProject.category}</span>
        <span class="badge badge-difficulty ${selectedProject.difficulty === 'Fortgeschritten' ? 'advanced' : ''}">${selectedProject.difficulty}</span>
      </div>
    </div>

    <div class="project-info">
      <div class="info-card">
        <h4>Benötigte Bauteile</h4>
        <ul>
          ${selectedProject.peripherals.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
      <div class="info-card">
        <h4>Verwendete Pins</h4>
        <ul>
          ${selectedProject.pins.digital.length > 0 ? `<li>Digital: ${selectedProject.pins.digital.join(', ')}</li>` : ''}
          ${selectedProject.pins.analog.length > 0 ? `<li>Analog: ${selectedProject.pins.analog.join(', ')}</li>` : ''}
          ${selectedProject.pins.digital.length === 0 && selectedProject.pins.analog.length === 0 ? '<li>Keine Pins definiert</li>' : ''}
        </ul>
      </div>
    </div>

    <div class="code-section">
      <div class="code-header">
        <h3>${selectedProject.code}</h3>
        <div class="code-header-actions">
          <button class="btn-copy" id="copy-solution-btn" title="Code kopieren">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>Kopieren</span>
          </button>
          <button class="btn btn-primary" id="open-solution-btn">In Arduino IDE öffnen</button>
        </div>
      </div>
      <div class="code-content">
        <pre>${escapeHtml(code)}</pre>
      </div>
    </div>
  `;

  document.getElementById('copy-solution-btn').addEventListener('click', () => {
    copyToClipboard(code, document.getElementById('copy-solution-btn'));
  });

  document.getElementById('open-solution-btn').addEventListener('click', async () => {
    try {
      await invoke('open_solution_in_ide', { filename: selectedProject.code });
    } catch (e) {
      showToast('error', 'Fehler', 'Arduino IDE konnte nicht geöffnet werden: ' + e);
    }
  });
}

// ==================== CODE GENERATOR ====================

// Show custom dialog
function showDialog() {
  return new Promise((resolve) => {
    const overlay = document.getElementById('dialog-overlay');
    const confirmBtn = document.getElementById('dialog-confirm');
    const cancelBtn = document.getElementById('dialog-cancel');

    overlay.classList.remove('hidden');

    const cleanup = () => {
      overlay.classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeydown);
    };

    const onConfirm = () => {
      cleanup();
      resolve(true);
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    const onOverlayClick = (e) => {
      if (e.target === overlay) {
        cleanup();
        resolve(false);
      }
    };

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        cleanup();
        resolve(false);
      } else if (e.key === 'Enter') {
        cleanup();
        resolve(true);
      }
    };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeydown);
  });
}

// Reset generator to initial state
async function resetGenerator() {
  // Show custom confirm dialog
  const confirmed = await showDialog();
  if (!confirmed) {
    return;
  }

  // Clear all cards and checkboxes
  document.querySelectorAll('.component-card').forEach(card => {
    card.classList.remove('selected');
    const cb = card.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = false;
  });

  // Reset all steppers to 1
  document.querySelectorAll('.component-stepper').forEach(stepper => {
    const valueEl = stepper.querySelector('.stepper-value');
    const minusBtn = stepper.querySelector('.stepper-minus');
    const plusBtn = stepper.querySelector('.stepper-plus');
    if (valueEl) valueEl.textContent = '1';
    if (minusBtn) minusBtn.classList.add('disabled');
    if (plusBtn) plusBtn.classList.remove('disabled');
  });

  // Clear rules
  rules = [];
  renderRules();

  // Reset generated code
  generatedCodeEl.innerHTML = `<code>// Wähle Komponenten und füge Regeln hinzu,
// um Arduino-Code zu generieren.</code>`;

  // Reset diagram
  document.getElementById('breadboard-diagram').innerHTML = `
    <div class="diagram-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="placeholder-icon">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 3v18"/>
      </svg>
      <p>Wähle Komponenten aus und klicke "Code generieren"</p>
      <p class="hint">Der Schaltplan wird automatisch erstellt</p>
    </div>
  `;

  // Disable IDE button
  openIdeBtn.disabled = true;
  window.generatedCode = null;
  generatedFilePath = null;
}

// Get selected components with counts
function getSelectedComponents() {
  const components = { outputs: [], inputs: [] };

  document.querySelectorAll('.component-card.selected').forEach(card => {
    const component = card.dataset.component;
    const type = card.dataset.type;
    const stepperValue = card.querySelector('.stepper-value');
    const count = stepperValue ? parseInt(stepperValue.textContent) || 1 : 1;

    const item = { component, count };
    if (type === 'output') {
      components.outputs.push(item);
    } else {
      components.inputs.push(item);
    }
  });

  return components;
}

// Generate dynamic condition options based on selected inputs
function getConditionOptions() {
  const components = getSelectedComponents();
  const options = [];

  components.inputs.forEach(inp => {
    switch (inp.component) {
      case 'button':
        for (let i = 1; i <= inp.count; i++) {
          const label = inp.count > 1 ? `Taster${i}` : 'Taster';
          options.push({ value: `button${i}_pressed`, label: `${label} gedrückt` });
          options.push({ value: `button${i}_not_pressed`, label: `${label} nicht gedrückt` });
        }
        break;
      case 'potentiometer':
        options.push({ value: 'poti_low', label: 'Poti niedrig (<30%)' });
        options.push({ value: 'poti_mid', label: 'Poti mittel (30-70%)' });
        options.push({ value: 'poti_high', label: 'Poti hoch (>70%)' });
        break;
      case 'ldr':
        options.push({ value: 'light_low', label: 'Licht dunkel (<300)' });
        options.push({ value: 'light_mid', label: 'Licht mittel (300-700)' });
        options.push({ value: 'light_high', label: 'Licht hell (>700)' });
        break;
      case 'tmp36':
        options.push({ value: 'temp_cold', label: 'Temperatur kalt (<18°C)' });
        options.push({ value: 'temp_normal', label: 'Temperatur normal (18-25°C)' });
        options.push({ value: 'temp_hot', label: 'Temperatur warm (>25°C)' });
        break;
      case 'pir':
        options.push({ value: 'motion_detected', label: 'Bewegung erkannt' });
        options.push({ value: 'motion_none', label: 'Keine Bewegung' });
        break;
      case 'ultrasonic':
        options.push({ value: 'distance_near', label: 'Abstand nah (<30cm)' });
        options.push({ value: 'distance_mid', label: 'Abstand mittel (30-100cm)' });
        options.push({ value: 'distance_far', label: 'Abstand weit (>100cm)' });
        break;
      case 'joystick':
        options.push({ value: 'joy_left', label: 'Joystick links' });
        options.push({ value: 'joy_right', label: 'Joystick rechts' });
        options.push({ value: 'joy_up', label: 'Joystick oben' });
        options.push({ value: 'joy_down', label: 'Joystick unten' });
        options.push({ value: 'joy_center', label: 'Joystick Mitte' });
        options.push({ value: 'joy_button', label: 'Joystick-Taste gedrückt' });
        break;
    }
  });

  return options;
}

// Generate dynamic action options based on selected outputs
function getActionOptions() {
  const components = getSelectedComponents();
  const options = [];

  components.outputs.forEach(out => {
    switch (out.component) {
      case 'led':
        for (let i = 1; i <= out.count; i++) {
          const label = out.count > 1 ? `LED${i}` : 'LED';
          options.push({ value: `led${i}_on`, label: `${label} an` });
          options.push({ value: `led${i}_off`, label: `${label} aus` });
          options.push({ value: `led${i}_blink`, label: `${label} blinkt` });
          options.push({ value: `led${i}_toggle`, label: `${label} umschalten` });
        }
        break;
      case 'rgb-led':
        options.push({ value: 'rgb_red', label: 'RGB rot' });
        options.push({ value: 'rgb_green', label: 'RGB grün' });
        options.push({ value: 'rgb_blue', label: 'RGB blau' });
        options.push({ value: 'rgb_yellow', label: 'RGB gelb' });
        options.push({ value: 'rgb_cyan', label: 'RGB cyan' });
        options.push({ value: 'rgb_magenta', label: 'RGB magenta' });
        options.push({ value: 'rgb_white', label: 'RGB weiß' });
        options.push({ value: 'rgb_off', label: 'RGB aus' });
        break;
      case 'piezo':
        options.push({ value: 'piezo_on', label: 'Summer an' });
        options.push({ value: 'piezo_off', label: 'Summer aus' });
        options.push({ value: 'piezo_beep', label: 'Summer piept' });
        break;
      case 'relay':
        options.push({ value: 'relay_on', label: 'Relais an' });
        options.push({ value: 'relay_off', label: 'Relais aus' });
        break;
      case 'servo':
        options.push({ value: 'servo_0', label: 'Servo 0°' });
        options.push({ value: 'servo_45', label: 'Servo 45°' });
        options.push({ value: 'servo_90', label: 'Servo 90°' });
        options.push({ value: 'servo_135', label: 'Servo 135°' });
        options.push({ value: 'servo_180', label: 'Servo 180°' });
        break;
    }
  });

  // Serial output options based on inputs
  components.inputs.forEach(inp => {
    switch (inp.component) {
      case 'tmp36':
        options.push({ value: 'serial_temp', label: 'Serial: Temperatur' });
        break;
      case 'ldr':
        options.push({ value: 'serial_light', label: 'Serial: Lichtwert' });
        break;
      case 'potentiometer':
        options.push({ value: 'serial_poti', label: 'Serial: Poti-Wert' });
        break;
      case 'ultrasonic':
        options.push({ value: 'serial_distance', label: 'Serial: Distanz' });
        break;
      case 'joystick':
        options.push({ value: 'serial_joystick', label: 'Serial: Joystick-Position' });
        options.push({ value: 'serial_joystick_dir', label: 'Serial: Joystick-Richtung' });
        break;
      case 'button':
        for (let i = 1; i <= inp.count; i++) {
          const label = inp.count > 1 ? `Taster${i}` : 'Taster';
          options.push({ value: `serial_button${i}`, label: `Serial: ${label}-Status` });
        }
        break;
      case 'pir':
        options.push({ value: 'serial_motion', label: 'Serial: Bewegung' });
        break;
    }
  });

  return options;
}

// Called when components change
function onComponentsChanged() {
  // Re-render rules with updated options
  renderRules();
}

// Add a new rule
function addRule() {
  const conditionOptions = getConditionOptions();
  const actionOptions = getActionOptions();

  if (actionOptions.length === 0) {
    showToast('warning', 'Keine Komponenten', 'Bitte wähle mindestens eine Ausgabe-Komponente aus.');
    return;
  }

  const ruleId = Date.now();
  // New structure: conditions and actions are arrays with {value, operator}
  // operator is 'AND' or 'OR' and applies BEFORE this condition/action
  // delay is used when no inputs (sequence mode)
  rules.push({
    id: ruleId,
    conditions: [{ value: '', operator: null }],
    actions: [{ value: '', operator: null }], // multiple actions support
    delay: 500 // default delay for sequence mode
  });
  renderRules();
}

// Add a condition to an existing rule
function addConditionToRule(ruleId, operator) {
  const rule = rules.find(r => r.id === ruleId);
  if (rule) {
    rule.conditions.push({ value: '', operator: operator });
    renderRules();
  }
}

// Remove a condition from a rule
function removeConditionFromRule(ruleId, condIndex) {
  const rule = rules.find(r => r.id === ruleId);
  if (rule && rule.conditions.length > 1) {
    rule.conditions.splice(condIndex, 1);
    // If we removed the first condition, clear the operator of the new first
    if (condIndex === 0 && rule.conditions.length > 0) {
      rule.conditions[0].operator = null;
    }
    renderRules();
  }
}

// Add an action to an existing rule
function addActionToRule(ruleId) {
  const rule = rules.find(r => r.id === ruleId);
  if (rule) {
    rule.actions.push({ value: '', operator: 'UND' });
    renderRules();
  }
}

// Remove an action from a rule
function removeActionFromRule(ruleId, actionIndex) {
  const rule = rules.find(r => r.id === ruleId);
  if (rule && rule.actions.length > 1) {
    rule.actions.splice(actionIndex, 1);
    // If we removed the first action, clear the operator of the new first
    if (actionIndex === 0 && rule.actions.length > 0) {
      rule.actions[0].operator = null;
    }
    renderRules();
  }
}

// Remove a rule
function removeRule(id) {
  rules = rules.filter(r => r.id !== id);
  renderRules();
}

// Render all rules with dynamic options
function renderRules() {
  const conditionOptions = getConditionOptions();
  const actionOptions = getActionOptions();
  const isSequenceMode = conditionOptions.length === 0; // No inputs = sequence mode

  const conditionOptionsHtml = conditionOptions.map(opt =>
    `<option value="${opt.value}">${opt.label}</option>`
  ).join('');

  const actionOptionsHtml = actionOptions.map(opt =>
    `<option value="${opt.value}">${opt.label}</option>`
  ).join('');

  rulesList.innerHTML = rules.map((rule, ruleIndex) => {
    // Ensure actions array exists (migration from old format)
    if (!rule.actions) {
      rule.actions = rule.action ? [{ value: rule.action, operator: null }] : [{ value: '', operator: null }];
    }

    if (isSequenceMode) {
      // Sequence mode: just actions with delay (multiple actions)
      const actionsHtml = rule.actions.map((act, idx) => {
        const operatorHtml = act.operator
          ? `<span class="rule-operator">${act.operator}</span>`
          : '';
        const removeBtn = rule.actions.length > 1
          ? `<button class="action-remove" data-rule="${rule.id}" data-idx="${idx}" title="Aktion entfernen">-</button>`
          : '';

        return `
          ${operatorHtml}
          <div class="action-group">
            <select class="rule-action" data-idx="${idx}">
              <option value="">-- Aktion --</option>
              ${actionOptionsHtml}
            </select>
            ${removeBtn}
          </div>
        `;
      }).join('');

      return `
        <div class="rule-item sequence-item" data-id="${rule.id}">
          <div class="rule-action-row">
            <span class="rule-step">${ruleIndex + 1}.</span>
            ${actionsHtml}
            <button class="add-action-btn" data-rule="${rule.id}" title="Aktion hinzufügen">+UND</button>
            <span class="rule-keyword-small">Delay:</span>
            <input type="number" class="rule-delay" value="${rule.delay || 500}" min="0" step="100"> ms
            <button class="rule-delete" onclick="window.removeRule(${rule.id})">X</button>
          </div>
        </div>
      `;
    }

    // Condition mode: WENN ... DANN ...
    const conditionsHtml = rule.conditions.map((cond, idx) => {
      const operatorHtml = cond.operator
        ? `<span class="rule-operator">${cond.operator}</span>`
        : '';
      const removeBtn = rule.conditions.length > 1
        ? `<button class="condition-remove" data-rule="${rule.id}" data-idx="${idx}" title="Bedingung entfernen">-</button>`
        : '';

      return `
        ${operatorHtml}
        <div class="condition-group">
          <select class="rule-condition" data-idx="${idx}">
            <option value="">-- Bedingung --</option>
            ${conditionOptionsHtml}
          </select>
          ${removeBtn}
        </div>
      `;
    }).join('');

    // Multiple actions
    const actionsHtml = rule.actions.map((act, idx) => {
      const operatorHtml = act.operator
        ? `<span class="rule-operator">${act.operator}</span>`
        : '';
      const removeBtn = rule.actions.length > 1
        ? `<button class="action-remove" data-rule="${rule.id}" data-idx="${idx}" title="Aktion entfernen">-</button>`
        : '';

      return `
        ${operatorHtml}
        <div class="action-group">
          <select class="rule-action" data-idx="${idx}">
            <option value="">-- Aktion --</option>
            ${actionOptionsHtml}
          </select>
          ${removeBtn}
        </div>
      `;
    }).join('');

    return `
      <div class="rule-item" data-id="${rule.id}">
        <div class="rule-conditions-row">
          <span class="rule-keyword">WENN</span>
          ${conditionsHtml}
          <div class="add-condition-btns">
            <button class="add-condition-btn" data-rule="${rule.id}" data-op="UND" title="UND-Bedingung hinzufügen">+UND</button>
            <button class="add-condition-btn" data-rule="${rule.id}" data-op="ODER" title="ODER-Bedingung hinzufügen">+ODER</button>
          </div>
        </div>
        <div class="rule-action-row">
          <span class="rule-keyword">DANN</span>
          ${actionsHtml}
          <button class="add-action-btn" data-rule="${rule.id}" title="Aktion hinzufügen">+UND</button>
          <button class="rule-delete" onclick="window.removeRule(${rule.id})">X</button>
        </div>
      </div>
    `;
  }).join('');

  // Restore selected values and add change listeners
  rulesList.querySelectorAll('.rule-item').forEach(item => {
    const id = parseInt(item.dataset.id);
    const rule = rules.find(r => r.id === id);
    if (!rule) return;

    // Setup condition selects
    item.querySelectorAll('.rule-condition').forEach((select, idx) => {
      const cond = rule.conditions[idx];
      if (cond && conditionOptions.some(o => o.value === cond.value)) {
        select.value = cond.value;
      } else if (cond) {
        cond.value = '';
      }

      select.addEventListener('change', (e) => {
        const condIdx = parseInt(e.target.dataset.idx);
        if (rule.conditions[condIdx]) {
          rule.conditions[condIdx].value = e.target.value;
        }
      });
    });

    // Setup action selects (multiple)
    item.querySelectorAll('.rule-action').forEach((select) => {
      const idx = parseInt(select.dataset.idx);
      const act = rule.actions[idx];
      if (act && actionOptions.some(o => o.value === act.value)) {
        select.value = act.value;
      } else if (act) {
        act.value = '';
      }

      select.addEventListener('change', (e) => {
        const actIdx = parseInt(e.target.dataset.idx);
        if (rule.actions[actIdx]) {
          rule.actions[actIdx].value = e.target.value;
        }
      });
    });

    // Add condition buttons
    item.querySelectorAll('.add-condition-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ruleId = parseInt(btn.dataset.rule);
        const operator = btn.dataset.op;
        addConditionToRule(ruleId, operator);
      });
    });

    // Remove condition buttons
    item.querySelectorAll('.condition-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const ruleId = parseInt(btn.dataset.rule);
        const condIdx = parseInt(btn.dataset.idx);
        removeConditionFromRule(ruleId, condIdx);
      });
    });

    // Add action buttons
    item.querySelectorAll('.add-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ruleId = parseInt(btn.dataset.rule);
        addActionToRule(ruleId);
      });
    });

    // Remove action buttons
    item.querySelectorAll('.action-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const ruleId = parseInt(btn.dataset.rule);
        const actIdx = parseInt(btn.dataset.idx);
        removeActionFromRule(ruleId, actIdx);
      });
    });

    // Delay input (sequence mode)
    const delayInput = item.querySelector('.rule-delay');
    if (delayInput) {
      delayInput.addEventListener('change', (e) => {
        rule.delay = parseInt(e.target.value) || 500;
      });
    }
  });
}

// Make removeRule available globally
window.removeRule = removeRule;

// Generate Arduino code
function generateCode() {
  const components = getSelectedComponents();
  const isSequenceMode = components.inputs.length === 0;

  // Helper to check if rule has valid actions
  const hasValidActions = (r) => {
    if (r.actions && r.actions.length > 0) {
      return r.actions.some(a => a.value);
    }
    return r.action; // fallback for old format
  };

  // In sequence mode: rules just need an action
  // In condition mode: rules need at least one condition with value and an action
  const validRules = isSequenceMode
    ? rules.filter(r => hasValidActions(r))
    : rules.filter(r => r.conditions.some(c => c.value) && hasValidActions(r));

  if (components.outputs.length === 0) {
    showToast('warning', 'Keine Komponenten', 'Bitte wähle mindestens eine Ausgabe-Komponente aus, um Code zu generieren.');
    return;
  }

  // Validate: Check for conflicting LED actions (on/off/blink + toggle for same LED)
  for (const rule of validRules) {
    const actions = rule.actions ? rule.actions.map(a => a.value).filter(v => v) : [];
    const ledConflicts = {};

    actions.forEach(action => {
      const toggleMatch = action.match(/^led(\d+)_toggle$/);
      const otherMatch = action.match(/^led(\d+)_(on|off|blink)$/);

      if (toggleMatch) {
        const ledNum = toggleMatch[1];
        if (!ledConflicts[ledNum]) ledConflicts[ledNum] = { toggle: false, other: false };
        ledConflicts[ledNum].toggle = true;
      }
      if (otherMatch) {
        const ledNum = otherMatch[1];
        if (!ledConflicts[ledNum]) ledConflicts[ledNum] = { toggle: false, other: false };
        ledConflicts[ledNum].other = true;
      }
    });

    for (const [ledNum, conflict] of Object.entries(ledConflicts)) {
      if (conflict.toggle && conflict.other) {
        showToast('error', 'Konflikt erkannt', `LED${ledNum} kann nicht gleichzeitig "umschalten" und "an/aus/blinken" haben. Bitte nur eine Option pro LED wählen.`);
        return;
      }
    }
  }

  let code = `// Generierter Arduino-Code
// Arduino Helper - Zeasy Software

`;

  // Pin definitions
  let pinNum = 2;
  let analogPin = 0;
  const pins = {};

  // Output pins
  components.outputs.forEach(out => {
    switch (out.component) {
      case 'led':
        for (let i = 1; i <= out.count; i++) {
          pins[`led${i}`] = pinNum++;
        }
        break;
      case 'rgb-led':
        pins.rgbRed = 9;
        pins.rgbGreen = 10;
        pins.rgbBlue = 11;
        break;
      case 'piezo':
        pins.piezo = 8;
        break;
      case 'relay':
        pins.relay = pinNum++;
        break;
      case 'servo':
        pins.servo = 6;
        break;
    }
  });

  // Input pins
  components.inputs.forEach(inp => {
    switch (inp.component) {
      case 'button':
        for (let i = 1; i <= inp.count; i++) {
          pins[`button${i}`] = pinNum++;
        }
        break;
      case 'potentiometer':
        pins.poti = `A${analogPin++}`;
        break;
      case 'ldr':
        pins.ldr = `A${analogPin++}`;
        break;
      case 'tmp36':
        pins.temp = `A${analogPin++}`;
        break;
      case 'pir':
        pins.pir = pinNum++;
        break;
      case 'ultrasonic':
        pins.trigPin = pinNum++;
        pins.echoPin = pinNum++;
        break;
      case 'joystick':
        pins.joyX = `A${analogPin++}`;
        pins.joyY = `A${analogPin++}`;
        pins.joyButton = pinNum++;
        break;
    }
  });

  // Check if Serial is used
  const usesSerial = validRules.some(r => {
    if (r.actions) {
      return r.actions.some(a => a.value && a.value.startsWith('serial_'));
    }
    return r.action && r.action.startsWith('serial_');
  });

  // Include Servo if needed
  if (pins.servo !== undefined) {
    code += `#include <Servo.h>\n\n`;
  }

  // Pin constants
  code += `// Pin-Definitionen\n`;
  Object.entries(pins).forEach(([name, pin]) => {
    code += `const int ${name.toUpperCase()}_PIN = ${pin};\n`;
  });

  if (pins.servo !== undefined) {
    code += `\nServo myServo;\n`;
  }

  // Helper to get all action values from a rule
  const getActionValues = (r) => {
    if (r.actions) return r.actions.map(a => a.value).filter(v => v);
    return r.action ? [r.action] : [];
  };

  // Check if toggle is used - need state variables
  const usesToggle = validRules.some(r => getActionValues(r).some(a => a.includes('_toggle')));
  const toggleLeds = new Set();
  validRules.forEach(r => {
    getActionValues(r).forEach(action => {
      const match = action.match(/^led(\d+)_toggle$/);
      if (match) toggleLeds.add(match[1]);
    });
  });

  // Check which buttons are used in toggle rules for debouncing
  const toggleButtons = new Set();
  validRules.forEach(r => {
    if (getActionValues(r).some(a => a.includes('_toggle'))) {
      r.conditions.forEach(c => {
        const btnMatch = c.value.match(/^button(\d+)_pressed$/);
        if (btnMatch) toggleButtons.add(btnMatch[1]);
      });
    }
  });

  // State variables for toggle
  if (toggleLeds.size > 0) {
    code += `\n// Zustandsvariablen für Toggle\n`;
    toggleLeds.forEach(num => {
      code += `bool led${num}State = false;\n`;
    });
  }

  // Previous button states for debouncing
  if (toggleButtons.size > 0) {
    code += `\n// Vorherige Tasterzustände (für Entprellung)\n`;
    toggleButtons.forEach(num => {
      code += `bool lastButton${num}State = LOW;\n`;
    });
  }

  // Setup function
  code += `\nvoid setup() {\n`;

  // Serial init if needed
  if (usesSerial) {
    code += `  Serial.begin(9600);\n`;
  }

  Object.entries(pins).forEach(([name, pin]) => {
    if (typeof pin === 'string' && pin.startsWith('A')) return;

    if (name.startsWith('led') || name.startsWith('rgb') || name === 'piezo' || name === 'relay') {
      code += `  pinMode(${name.toUpperCase()}_PIN, OUTPUT);\n`;
    } else if (name.startsWith('button') || name === 'pir' || name === 'joyButton') {
      code += `  pinMode(${name.toUpperCase()}_PIN, INPUT);\n`;
    } else if (name === 'trigPin') {
      code += `  pinMode(TRIGPIN_PIN, OUTPUT);\n`;
    } else if (name === 'echoPin') {
      code += `  pinMode(ECHOPIN_PIN, INPUT);\n`;
    }
  });

  if (pins.servo !== undefined) {
    code += `  myServo.attach(SERVO_PIN);\n`;
  }

  code += `}\n`;

  // Helper function for ultrasonic
  if (pins.trigPin !== undefined) {
    code += `
// Ultraschall-Distanz messen (in cm)
long measureDistance() {
  digitalWrite(TRIGPIN_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGPIN_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGPIN_PIN, LOW);
  long duration = pulseIn(ECHOPIN_PIN, HIGH);
  return duration * 0.034 / 2;
}
`;
  }

  // Loop function
  code += `\nvoid loop() {\n`;

  if (isSequenceMode) {
    // SEQUENCE MODE: Just execute actions in order with delays
    if (validRules.length > 0) {
      code += `  // Sequenz-Ablauf\n`;
      validRules.forEach((rule, index) => {
        // Generate all actions for this step
        getActionValues(rule).forEach(actionValue => {
          const action = generateAction(actionValue);
          code += `  ${action}\n`;
        });
        code += `  delay(${rule.delay || 500});\n`;
        if (index < validRules.length - 1) {
          code += `\n`;
        }
      });
    } else {
      code += `  // Keine Aktionen definiert\n`;
      code += `  delay(100);\n`;
    }
  } else {
    // CONDITION MODE: Read inputs and evaluate rules

    // Read all inputs
    const buttonCount = components.inputs.find(i => i.component === 'button')?.count || 0;
    for (let i = 1; i <= buttonCount; i++) {
      code += `  int button${i}State = digitalRead(BUTTON${i}_PIN);\n`;
    }

    if (pins.ldr !== undefined) {
      code += `  int lightValue = analogRead(LDR_PIN);\n`;
    }
    if (pins.temp !== undefined) {
      code += `  int tempReading = analogRead(TEMP_PIN);\n`;
      code += `  float temperature = (tempReading * 5.0 / 1024.0 - 0.5) * 100;\n`;
    }
    if (pins.poti !== undefined) {
      code += `  int potiValue = analogRead(POTI_PIN);\n`;
    }
    if (pins.pir !== undefined) {
      code += `  int motion = digitalRead(PIR_PIN);\n`;
    }
    if (pins.trigPin !== undefined) {
      code += `  long distance = measureDistance();\n`;
    }
    if (pins.joyX !== undefined) {
      code += `  int joyX = analogRead(JOYX_PIN);\n`;
      code += `  int joyY = analogRead(JOYY_PIN);\n`;
      code += `  int joyButton = digitalRead(JOYBUTTON_PIN);\n`;
    }

    // Separate toggle rules from normal rules
    const toggleRules = validRules.filter(r => getActionValues(r).some(a => a.includes('_toggle')));
    const normalRules = validRules.filter(r => !getActionValues(r).some(a => a.includes('_toggle')));

    // Generate toggle logic first (edge detection)
    if (toggleRules.length > 0) {
      code += `\n  // Toggle-Logik (Flanken-Erkennung)\n`;

      toggleRules.forEach(rule => {
        // Get buttons used in this toggle rule
        const usedButtons = [];
        rule.conditions.forEach(c => {
          const btnMatch = c.value.match(/^button(\d+)_pressed$/);
          if (btnMatch) usedButtons.push(btnMatch[1]);
        });

        if (usedButtons.length > 0) {
          // Generate edge detection condition
          const edgeConditions = usedButtons.map(btnNum =>
            `(button${btnNum}State == HIGH && lastButton${btnNum}State == LOW)`
          ).join(' && ');

          code += `  if (${edgeConditions}) {\n`;

          // Generate all toggle actions and non-toggle actions
          getActionValues(rule).forEach(actionValue => {
            const ledMatch = actionValue.match(/^led(\d+)_toggle$/);
            if (ledMatch) {
              const ledNum = ledMatch[1];
              code += `    led${ledNum}State = !led${ledNum}State;\n`;
              code += `    digitalWrite(LED${ledNum}_PIN, led${ledNum}State ? HIGH : LOW);\n`;
            } else {
              // Non-toggle action (like serial output)
              const action = generateAction(actionValue);
              code += `    ${action}\n`;
            }
          });

          code += `  }\n`;
        }
      });

      // Update last button states
      code += `\n  // Tasterzustände speichern\n`;
      toggleButtons.forEach(num => {
        code += `  lastButton${num}State = button${num}State;\n`;
      });
    }

    // Generate normal rules (non-toggle)
    if (normalRules.length > 0) {
      code += `\n`;

      // Generate if-else chain
      normalRules.forEach((rule, index) => {
        const compoundCondition = generateCompoundCondition(rule.conditions);

        const prefix = index === 0 ? 'if' : 'else if';
        code += `  ${prefix} (${compoundCondition}) {\n`;

        // Generate all actions for this rule
        getActionValues(rule).forEach(actionValue => {
          const action = generateAction(actionValue);
          code += `    ${action}\n`;
        });

        code += `  }\n`;
      });

      // Default else
      code += `  else {\n`;
      code += `    // Standardzustand\n`;
      code += `  }\n`;
    }

    code += `\n  delay(50);\n`;
  }

  code += `}\n`;

  generatedCodeEl.innerHTML = `<code>${escapeHtml(code)}</code>`;
  openIdeBtn.disabled = false;
  window.generatedCode = code;

  // Generate breadboard diagram
  if (window.generateBreadboardDiagram) {
    const diagramContainer = document.getElementById('breadboard-diagram');
    const diagramSVG = window.generateBreadboardDiagram(components, pins);
    diagramContainer.innerHTML = diagramSVG;
  }
}

// Generate compound condition from array of conditions with operators
function generateCompoundCondition(conditions) {
  const validConditions = conditions.filter(c => c.value);
  if (validConditions.length === 0) return 'true';

  let result = '';
  validConditions.forEach((cond, idx) => {
    const condCode = generateCondition(cond.value);

    if (idx === 0) {
      result = condCode;
    } else {
      // Map UND/ODER to && / ||
      const logicOp = cond.operator === 'ODER' ? ' || ' : ' && ';
      result += logicOp + condCode;
    }
  });

  // Wrap in parentheses if multiple conditions for clarity
  if (validConditions.length > 1) {
    result = `(${result})`;
  }

  return result;
}

function generateCondition(condition) {
  // Button conditions: button1_pressed, button2_not_pressed, etc.
  const buttonMatch = condition.match(/^button(\d+)_(pressed|not_pressed)$/);
  if (buttonMatch) {
    const num = buttonMatch[1];
    const state = buttonMatch[2] === 'pressed' ? 'HIGH' : 'LOW';
    return `button${num}State == ${state}`;
  }

  switch (condition) {
    case 'poti_low': return 'potiValue < 307';
    case 'poti_mid': return 'potiValue >= 307 && potiValue <= 716';
    case 'poti_high': return 'potiValue > 716';
    case 'light_low': return 'lightValue < 300';
    case 'light_mid': return 'lightValue >= 300 && lightValue <= 700';
    case 'light_high': return 'lightValue > 700';
    case 'temp_cold': return 'temperature < 18';
    case 'temp_normal': return 'temperature >= 18 && temperature <= 25';
    case 'temp_hot': return 'temperature > 25';
    case 'motion_detected': return 'motion == HIGH';
    case 'motion_none': return 'motion == LOW';
    case 'distance_near': return 'distance < 30';
    case 'distance_mid': return 'distance >= 30 && distance <= 100';
    case 'distance_far': return 'distance > 100';
    case 'joy_left': return 'joyX < 300';
    case 'joy_right': return 'joyX > 700';
    case 'joy_up': return 'joyY < 300';
    case 'joy_down': return 'joyY > 700';
    case 'joy_center': return 'joyX >= 300 && joyX <= 700 && joyY >= 300 && joyY <= 700';
    case 'joy_button': return 'joyButton == LOW';
    default: return 'true';
  }
}

function generateAction(action) {
  // LED actions: led1_on, led2_off, led1_blink, etc.
  const ledMatch = action.match(/^led(\d+)_(on|off|blink)$/);
  if (ledMatch) {
    const num = ledMatch[1];
    const act = ledMatch[2];
    switch (act) {
      case 'on': return `digitalWrite(LED${num}_PIN, HIGH);`;
      case 'off': return `digitalWrite(LED${num}_PIN, LOW);`;
      case 'blink': return `digitalWrite(LED${num}_PIN, HIGH); delay(200); digitalWrite(LED${num}_PIN, LOW); delay(200);`;
    }
  }

  switch (action) {
    case 'rgb_red': return 'analogWrite(RGBRED_PIN, 255); analogWrite(RGBGREEN_PIN, 0); analogWrite(RGBBLUE_PIN, 0);';
    case 'rgb_green': return 'analogWrite(RGBRED_PIN, 0); analogWrite(RGBGREEN_PIN, 255); analogWrite(RGBBLUE_PIN, 0);';
    case 'rgb_blue': return 'analogWrite(RGBRED_PIN, 0); analogWrite(RGBGREEN_PIN, 0); analogWrite(RGBBLUE_PIN, 255);';
    case 'rgb_yellow': return 'analogWrite(RGBRED_PIN, 255); analogWrite(RGBGREEN_PIN, 255); analogWrite(RGBBLUE_PIN, 0);';
    case 'rgb_cyan': return 'analogWrite(RGBRED_PIN, 0); analogWrite(RGBGREEN_PIN, 255); analogWrite(RGBBLUE_PIN, 255);';
    case 'rgb_magenta': return 'analogWrite(RGBRED_PIN, 255); analogWrite(RGBGREEN_PIN, 0); analogWrite(RGBBLUE_PIN, 255);';
    case 'rgb_white': return 'analogWrite(RGBRED_PIN, 255); analogWrite(RGBGREEN_PIN, 255); analogWrite(RGBBLUE_PIN, 255);';
    case 'rgb_off': return 'analogWrite(RGBRED_PIN, 0); analogWrite(RGBGREEN_PIN, 0); analogWrite(RGBBLUE_PIN, 0);';
    case 'piezo_on': return 'tone(PIEZO_PIN, 1000);';
    case 'piezo_off': return 'noTone(PIEZO_PIN);';
    case 'piezo_beep': return 'tone(PIEZO_PIN, 1000, 100);';
    case 'relay_on': return 'digitalWrite(RELAY_PIN, HIGH);';
    case 'relay_off': return 'digitalWrite(RELAY_PIN, LOW);';
    case 'servo_0': return 'myServo.write(0);';
    case 'servo_45': return 'myServo.write(45);';
    case 'servo_90': return 'myServo.write(90);';
    case 'servo_135': return 'myServo.write(135);';
    case 'servo_180': return 'myServo.write(180);';
    // Serial outputs
    case 'serial_temp': return 'Serial.print("Temperatur: "); Serial.print(temperature); Serial.println(" C");';
    case 'serial_light': return 'Serial.print("Lichtwert: "); Serial.println(lightValue);';
    case 'serial_poti': return 'Serial.print("Poti: "); Serial.println(potiValue);';
    case 'serial_distance': return 'Serial.print("Distanz: "); Serial.print(distance); Serial.println(" cm");';
    case 'serial_joystick': return 'Serial.print("Joystick X: "); Serial.print(joyX); Serial.print(" Y: "); Serial.println(joyY);';
    case 'serial_joystick_dir': return 'Serial.print("Richtung: "); if(joyX < 300) Serial.println("Links"); else if(joyX > 700) Serial.println("Rechts"); else if(joyY < 300) Serial.println("Oben"); else if(joyY > 700) Serial.println("Unten"); else Serial.println("Mitte");';
    case 'serial_motion': return 'Serial.print("Bewegung: "); Serial.println(motion == HIGH ? "Ja" : "Nein");';
    default:
      // Serial button outputs: serial_button1, serial_button2, etc.
      const serialBtnMatch = action.match(/^serial_button(\d+)$/);
      if (serialBtnMatch) {
        const num = serialBtnMatch[1];
        return `Serial.print("Taster${num}: "); Serial.println(button${num}State == HIGH ? "Gedrückt" : "Losgelassen");`;
      }
      return '// Keine Aktion';
  }
}

async function openInArduinoIDE() {
  if (!window.generatedCode) return;

  try {
    const filename = `generated_${Date.now()}.ino`;
    generatedFilePath = await invoke('save_generated_code', {
      filename,
      code: window.generatedCode
    });
    await invoke('open_in_arduino_ide', { filePath: generatedFilePath });
  } catch (e) {
    showToast('error', 'Fehler', 'Arduino IDE konnte nicht geöffnet werden: ' + e);
  }
}

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
