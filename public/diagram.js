// Breadboard Diagram Generator
// Generates SVG breadboard diagrams based on selected components

// Constants for layout
const LAYOUT = {
  width: 900,
  height: 550,
  arduino: { x: 10, y: 180, width: 180, height: 280 },
  breadboard: { x: 220, y: 80, width: 650, height: 380 },
};

// Breadboard configuration
const BB = {
  x: 220,
  y: 80,
  holeSpacing: 18,  // Space between holes
  colStart: 30,     // X offset for first column
  cols: 30,         // Number of columns
  // Row Y positions relative to breadboard Y
  rows: {
    powerPlus: 25,
    powerMinus: 43,
    a: 75, b: 93, c: 111, d: 129, e: 147,
    // Gap at 165-195
    f: 210, g: 228, h: 246, i: 264, j: 282,
    gndPlus: 315,
    gndMinus: 333,
  }
};

// Get hole position on breadboard
function hole(col, row) {
  const rowY = BB.rows[row] || 0;
  return {
    x: BB.x + BB.colStart + (col - 1) * BB.holeSpacing,
    y: BB.y + rowY
  };
}

// Arduino pin positions
function arduinoPin(pin) {
  const pinStr = String(pin);
  const x = LAYOUT.arduino.x;
  const y = LAYOUT.arduino.y;

  // Power pins (left side)
  if (pinStr === '5V') {
    return { x: x + 9, y: y + 55 };
  }
  if (pinStr === '3.3V' || pinStr === '3V3') {
    return { x: x + 9, y: y + 65 };
  }
  if (pinStr === 'GND') {
    return { x: x + 9, y: y + 85 };
  }

  // Analog pins (left side)
  if (pinStr.startsWith('A')) {
    const pinNum = parseInt(pinStr.replace('A', ''));
    return { x: x + 9, y: y + 200 + pinNum * 10 };
  }

  // Digital pins (right side)
  const pinNum = parseInt(pinStr);
  return { x: x + 171, y: y + 35 + pinNum * 10 + (pinNum >= 8 ? 5 : 0) };
}

// Wire colors
const COLORS = {
  red: '#e74c3c',
  blue: '#3498db',
  green: '#27ae60',
  yellow: '#f1c40f',
  orange: '#e67e22',
  purple: '#9b59b6',
  cyan: '#1abc9c',
  pink: '#fd79a8',
  vcc: '#ff0000',
  gnd: '#000000',
};

const SIGNAL_COLORS = [COLORS.blue, COLORS.green, COLORS.yellow, COLORS.orange, COLORS.purple, COLORS.cyan, COLORS.pink];
let colorIndex = 0;
function nextColor() {
  return SIGNAL_COLORS[colorIndex++ % SIGNAL_COLORS.length];
}

// Generate wire SVG
function wire(x1, y1, x2, y2, color) {
  // Curved wire for longer distances
  const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
  if (dist > 100) {
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - 20;
    return `<path d="M${x1},${y1} Q${midX},${midY} ${x2},${y2}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  }
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
}

// Short jumper wire (straight)
function jumper(x1, y1, x2, y2, color) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
}

// Component pin marker (shows where pin goes into breadboard)
function pinMarker(x, y, label, side = 'right') {
  const textX = side === 'right' ? x + 10 : x - 10;
  const anchor = side === 'right' ? 'start' : 'end';
  return `
    <circle cx="${x}" cy="${y}" r="4" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/>
    <text x="${textX}" y="${y + 4}" font-size="10" fill="#333" text-anchor="${anchor}" font-family="Arial, sans-serif" font-weight="bold">${label}</text>
  `;
}

// Generate Arduino SVG
function generateArduino() {
  const x = LAYOUT.arduino.x;
  const y = LAYOUT.arduino.y;

  return `
    <g class="arduino">
      <rect x="${x}" y="${y}" width="180" height="280" rx="8" fill="#007acc" stroke="#005a9e" stroke-width="2"/>
      <rect x="${x+60}" y="${y-5}" width="40" height="25" rx="3" fill="#444"/>
      <rect x="${x+10}" y="${y+260}" width="35" height="25" rx="3" fill="#333"/>
      <circle cx="${x+30}" cy="${y+30}" r="8" fill="#d32f2f"/>
      <rect x="${x+50}" y="${y+100}" width="80" height="60" rx="2" fill="#333"/>
      <text x="${x+90}" y="${y+135}" text-anchor="middle" font-size="7" fill="#888">ATmega328P</text>

      <!-- Digital pins -->
      <rect x="${x+165}" y="${y+25}" width="12" height="160" fill="#222" rx="1"/>
      ${[...Array(14)].map((_, i) => `
        <circle cx="${x+171}" cy="${y+35+i*10+(i>=8?5:0)}" r="3" fill="#ffd700"/>
        <text x="${x+160}" y="${y+39+i*10+(i>=8?5:0)}" text-anchor="end" font-size="9" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">${i}</text>
      `).join('')}

      <!-- Analog pins -->
      <rect x="${x+3}" y="${y+190}" width="12" height="75" fill="#222" rx="1"/>
      ${[...Array(6)].map((_, i) => `
        <circle cx="${x+9}" cy="${y+200+i*10}" r="3" fill="#ffd700"/>
        <text x="${x+20}" y="${y+204+i*10}" font-size="9" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">A${i}</text>
      `).join('')}

      <!-- Power pins -->
      <rect x="${x+3}" y="${y+45}" width="12" height="60" fill="#222" rx="1"/>
      <circle cx="${x+9}" cy="${y+55}" r="3" fill="#ff0000"/>
      <text x="${x+20}" y="${y+59}" font-size="9" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">5V</text>
      <circle cx="${x+9}" cy="${y+65}" r="3" fill="#ff6600"/>
      <text x="${x+20}" y="${y+69}" font-size="9" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">3.3V</text>
      <circle cx="${x+9}" cy="${y+85}" r="3" fill="#000" stroke="#fff" stroke-width="0.5"/>
      <text x="${x+20}" y="${y+89}" font-size="9" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">GND</text>

      <text x="${x+90}" y="${y+250}" text-anchor="middle" font-size="14" font-weight="bold" fill="#fff" font-family="Arial, sans-serif">Arduino UNO</text>
    </g>
  `;
}

// Generate Breadboard SVG
function generateBreadboard() {
  const x = BB.x;
  const y = BB.y;
  const w = 600;
  const h = 360;

  let holes = '';

  // Power rails top
  for (let col = 1; col <= BB.cols; col++) {
    const hx = hole(col, 'powerPlus').x;
    holes += `<circle cx="${hx}" cy="${y + BB.rows.powerPlus}" r="2.5" fill="#333"/>`;
    holes += `<circle cx="${hx}" cy="${y + BB.rows.powerMinus}" r="2.5" fill="#333"/>`;
  }

  // Main rows a-e
  for (const row of ['a','b','c','d','e']) {
    for (let col = 1; col <= BB.cols; col++) {
      const h = hole(col, row);
      holes += `<circle cx="${h.x}" cy="${h.y}" r="2.5" fill="#333"/>`;
    }
  }

  // Main rows f-j
  for (const row of ['f','g','h','i','j']) {
    for (let col = 1; col <= BB.cols; col++) {
      const h = hole(col, row);
      holes += `<circle cx="${h.x}" cy="${h.y}" r="2.5" fill="#333"/>`;
    }
  }

  // Power rails bottom
  for (let col = 1; col <= BB.cols; col++) {
    const hx = hole(col, 'gndPlus').x;
    holes += `<circle cx="${hx}" cy="${y + BB.rows.gndPlus}" r="2.5" fill="#333"/>`;
    holes += `<circle cx="${hx}" cy="${y + BB.rows.gndMinus}" r="2.5" fill="#333"/>`;
  }

  return `
    <g class="breadboard">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#e8e8e8" stroke="#ccc" stroke-width="2"/>

      <!-- Power rail lines -->
      <line x1="${x+20}" y1="${y+BB.rows.powerPlus}" x2="${x+w-20}" y2="${y+BB.rows.powerPlus}" stroke="#ff0000" stroke-width="1.5" opacity="0.4"/>
      <line x1="${x+20}" y1="${y+BB.rows.powerMinus}" x2="${x+w-20}" y2="${y+BB.rows.powerMinus}" stroke="#0066ff" stroke-width="1.5" opacity="0.4"/>
      <line x1="${x+20}" y1="${y+BB.rows.gndPlus}" x2="${x+w-20}" y2="${y+BB.rows.gndPlus}" stroke="#ff0000" stroke-width="1.5" opacity="0.4"/>
      <line x1="${x+20}" y1="${y+BB.rows.gndMinus}" x2="${x+w-20}" y2="${y+BB.rows.gndMinus}" stroke="#0066ff" stroke-width="1.5" opacity="0.4"/>

      <!-- Center divider -->
      <rect x="${x+10}" y="${y+175}" width="${w-20}" height="25" fill="#d0d0d0" rx="2"/>

      <!-- Row labels (with white outline for contrast) -->
      <text x="${x+12}" y="${y+BB.rows.a+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">a</text>
      <text x="${x+12}" y="${y+BB.rows.b+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">b</text>
      <text x="${x+12}" y="${y+BB.rows.c+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">c</text>
      <text x="${x+12}" y="${y+BB.rows.d+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">d</text>
      <text x="${x+12}" y="${y+BB.rows.e+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">e</text>
      <text x="${x+12}" y="${y+BB.rows.f+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">f</text>
      <text x="${x+12}" y="${y+BB.rows.g+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">g</text>
      <text x="${x+12}" y="${y+BB.rows.h+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">h</text>
      <text x="${x+12}" y="${y+BB.rows.i+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">i</text>
      <text x="${x+12}" y="${y+BB.rows.j+4}" font-size="11" fill="#333" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">j</text>

      <!-- Column numbers (with white outline for contrast) -->
      ${[1,5,10,15,20,25,30].map(n => `<text x="${hole(n,'a').x}" y="${y+65}" font-size="10" fill="#333" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" stroke="#fff" stroke-width="3" paint-order="stroke">${n}</text>`).join('')}

      <!-- Power labels (with white outline for contrast) -->
      <text x="${x+8}" y="${y+BB.rows.powerPlus+4}" font-size="12" fill="#c00" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">+</text>
      <text x="${x+8}" y="${y+BB.rows.powerMinus+4}" font-size="12" fill="#00a" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">−</text>
      <text x="${x+8}" y="${y+BB.rows.gndPlus+4}" font-size="12" fill="#c00" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">+</text>
      <text x="${x+8}" y="${y+BB.rows.gndMinus+4}" font-size="12" fill="#00a" font-family="Arial, sans-serif" font-weight="bold" stroke="#fff" stroke-width="3" paint-order="stroke">−</text>

      ${holes}
    </g>
  `;
}

// Component renderers with pin positions
const COMPONENTS = {
  // LED: 2 pins, anode (+) longer, cathode (-) shorter
  // Place vertically spanning 2 columns
  led: (col, color = '#ff0000') => {
    const anode = hole(col, 'c');      // + pin
    const cathode = hole(col + 1, 'c'); // - pin
    return {
      svg: `
        <g class="component led">
          <ellipse cx="${anode.x + 9}" cy="${anode.y - 18}" rx="7" ry="10" fill="${color}" opacity="0.9"/>
          <ellipse cx="${anode.x + 9}" cy="${anode.y - 20}" rx="4" ry="5" fill="#fff" opacity="0.3"/>
          <line x1="${anode.x}" y1="${anode.y - 8}" x2="${anode.x}" y2="${anode.y}" stroke="#999" stroke-width="2"/>
          <line x1="${cathode.x}" y1="${cathode.y - 8}" x2="${cathode.x}" y2="${cathode.y}" stroke="#999" stroke-width="2"/>
          <text x="${anode.x + 9}" y="${anode.y - 32}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">LED</text>
          ${pinMarker(anode.x, anode.y, '+', 'left')}
          ${pinMarker(cathode.x, cathode.y, '−', 'right')}
        </g>
      `,
      pins: { anode: { col, row: 'c' }, cathode: { col: col + 1, row: 'c' } }
    };
  },

  // Resistor: spans multiple columns horizontally
  resistor: (col1, col2, row, value = '220Ω') => {
    const p1 = hole(col1, row);
    const p2 = hole(col2, row);
    return {
      svg: `
        <g class="component resistor">
          <line x1="${p1.x}" y1="${p1.y}" x2="${p1.x + 5}" y2="${p1.y}" stroke="#999" stroke-width="2"/>
          <rect x="${p1.x + 5}" y="${p1.y - 5}" width="${p2.x - p1.x - 10}" height="10" fill="#d4a574" stroke="#8b6914" rx="2"/>
          <line x1="${p2.x - 5}" y1="${p2.y}" x2="${p2.x}" y2="${p2.y}" stroke="#999" stroke-width="2"/>
          <text x="${(p1.x + p2.x) / 2}" y="${p1.y - 10}" text-anchor="middle" font-size="10" fill="#222" font-family="Arial, sans-serif" font-weight="bold">${value}</text>
        </g>
      `,
      pins: { p1: { col: col1, row }, p2: { col: col2, row } }
    };
  },

  // Button: spans across the center gap (e to f)
  button: (col) => {
    const pin1 = hole(col, 'e');     // Top left
    const pin2 = hole(col + 1, 'e'); // Top right
    const pin3 = hole(col, 'f');     // Bottom left
    const pin4 = hole(col + 1, 'f'); // Bottom right
    const cx = (pin1.x + pin2.x) / 2;
    const cy = (pin1.y + pin3.y) / 2;
    return {
      svg: `
        <g class="component button">
          <rect x="${cx - 12}" y="${cy - 12}" width="24" height="24" fill="#333" stroke="#222" rx="3"/>
          <circle cx="${cx}" cy="${cy}" r="7" fill="#666"/>
          <line x1="${pin1.x}" y1="${pin1.y}" x2="${pin1.x}" y2="${cy - 12}" stroke="#999" stroke-width="2"/>
          <line x1="${pin2.x}" y1="${pin2.y}" x2="${pin2.x}" y2="${cy - 12}" stroke="#999" stroke-width="2"/>
          <line x1="${pin3.x}" y1="${pin3.y}" x2="${pin3.x}" y2="${cy + 12}" stroke="#999" stroke-width="2"/>
          <line x1="${pin4.x}" y1="${pin4.y}" x2="${pin4.x}" y2="${cy + 12}" stroke="#999" stroke-width="2"/>
          <text x="${cx}" y="${cy - 20}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">BTN</text>
        </g>
      `,
      // Pins: top-left and bottom-left connected when pressed, top-right and bottom-right connected
      // Left side pins (1,3) are always connected, right side pins (2,4) are always connected
      // Pressing connects left to right
      pins: {
        in1: { col, row: 'e' },
        in2: { col: col + 1, row: 'e' },
        out1: { col, row: 'f' },
        out2: { col: col + 1, row: 'f' }
      }
    };
  },

  // Potentiometer: 3 pins in a row
  potentiometer: (col) => {
    const p1 = hole(col, 'g');     // VCC
    const p2 = hole(col + 1, 'g'); // Wiper (output)
    const p3 = hole(col + 2, 'g'); // GND
    const cx = p2.x;
    const cy = p2.y - 20;
    return {
      svg: `
        <g class="component potentiometer">
          <rect x="${cx - 18}" y="${cy - 8}" width="36" height="16" fill="#1a5276" stroke="#154360" rx="2"/>
          <circle cx="${cx}" cy="${cy}" r="10" fill="#2471a3"/>
          <line x1="${cx}" y1="${cy - 6}" x2="${cx}" y2="${cy - 12}" stroke="#fff" stroke-width="2"/>
          <line x1="${p1.x}" y1="${p1.y}" x2="${p1.x}" y2="${cy + 8}" stroke="#999" stroke-width="2"/>
          <line x1="${p2.x}" y1="${p2.y}" x2="${p2.x}" y2="${cy + 8}" stroke="#999" stroke-width="2"/>
          <line x1="${p3.x}" y1="${p3.y}" x2="${p3.x}" y2="${cy + 8}" stroke="#999" stroke-width="2"/>
          <text x="${cx}" y="${cy - 18}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">POT</text>
          ${pinMarker(p1.x, p1.y, 'VCC', 'left')}
          ${pinMarker(p2.x, p2.y, 'OUT', 'left')}
          ${pinMarker(p3.x, p3.y, 'GND', 'right')}
        </g>
      `,
      pins: { vcc: { col, row: 'g' }, out: { col: col + 1, row: 'g' }, gnd: { col: col + 2, row: 'g' } }
    };
  },

  // LDR: 2 pins
  ldr: (col) => {
    const p1 = hole(col, 'c');
    const p2 = hole(col + 1, 'c');
    const cx = (p1.x + p2.x) / 2;
    return {
      svg: `
        <g class="component ldr">
          <circle cx="${cx}" cy="${p1.y - 18}" r="10" fill="#8b4513" stroke="#5d3a1a"/>
          <path d="M${cx-5},${p1.y-22} Q${cx},${p1.y-28} ${cx+5},${p1.y-22}" stroke="#cd853f" stroke-width="2" fill="none"/>
          <path d="M${cx-5},${p1.y-16} Q${cx},${p1.y-22} ${cx+5},${p1.y-16}" stroke="#cd853f" stroke-width="2" fill="none"/>
          <line x1="${p1.x}" y1="${p1.y}" x2="${p1.x}" y2="${p1.y - 8}" stroke="#999" stroke-width="2"/>
          <line x1="${p2.x}" y1="${p2.y}" x2="${p2.x}" y2="${p2.y - 8}" stroke="#999" stroke-width="2"/>
          <text x="${cx}" y="${p1.y - 35}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">LDR</text>
        </g>
      `,
      pins: { p1: { col, row: 'c' }, p2: { col: col + 1, row: 'c' } }
    };
  },

  // TMP36: 3 pins (VCC, OUT, GND)
  tmp36: (col) => {
    const p1 = hole(col, 'c');     // VCC
    const p2 = hole(col + 1, 'c'); // OUT
    const p3 = hole(col + 2, 'c'); // GND
    const cx = p2.x;
    return {
      svg: `
        <g class="component tmp36">
          <path d="M${cx-10},${p2.y-10} L${cx+10},${p2.y-10} L${cx+7},${p2.y-35} L${cx-7},${p2.y-35} Z" fill="#1a1a1a" stroke="#333"/>
          <text x="${cx}" y="${p2.y-20}" text-anchor="middle" font-size="9" font-family="Arial, sans-serif" font-weight="bold" fill="#888">TMP36</text>
          <line x1="${p1.x}" y1="${p1.y}" x2="${p1.x}" y2="${p1.y-10}" stroke="#999" stroke-width="2"/>
          <line x1="${p2.x}" y1="${p2.y}" x2="${p2.x}" y2="${p2.y-10}" stroke="#999" stroke-width="2"/>
          <line x1="${p3.x}" y1="${p3.y}" x2="${p3.x}" y2="${p3.y-10}" stroke="#999" stroke-width="2"/>
          ${pinMarker(p1.x, p1.y, 'V', 'left')}
          ${pinMarker(p2.x, p2.y, 'O', 'left')}
          ${pinMarker(p3.x, p3.y, 'G', 'right')}
        </g>
      `,
      pins: { vcc: { col, row: 'c' }, out: { col: col + 1, row: 'c' }, gnd: { col: col + 2, row: 'c' } }
    };
  },

  // Piezo buzzer
  piezo: (col) => {
    const p1 = hole(col, 'c');
    const p2 = hole(col + 2, 'c');
    const cx = (p1.x + p2.x) / 2;
    return {
      svg: `
        <g class="component piezo">
          <circle cx="${cx}" cy="${p1.y - 22}" r="15" fill="#1a1a1a" stroke="#333"/>
          <circle cx="${cx}" cy="${p1.y - 22}" r="10" fill="#c0c0c0"/>
          <circle cx="${cx}" cy="${p1.y - 22}" r="3" fill="#ffd700"/>
          <line x1="${p1.x}" y1="${p1.y}" x2="${p1.x}" y2="${p1.y - 7}" stroke="#ff0000" stroke-width="2"/>
          <line x1="${p2.x}" y1="${p2.y}" x2="${p2.x}" y2="${p2.y - 7}" stroke="#000" stroke-width="2"/>
          <text x="${cx}" y="${p1.y - 42}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">PIEZO</text>
          ${pinMarker(p1.x, p1.y, '+', 'left')}
          ${pinMarker(p2.x, p2.y, '−', 'right')}
        </g>
      `,
      pins: { plus: { col, row: 'c' }, minus: { col: col + 2, row: 'c' } }
    };
  },

  // Servo motor (placed above breadboard, wires go to power rail)
  servo: (col) => {
    const signalHole = hole(col, 'a');
    const vccHole = hole(col + 1, 'powerPlus');
    const gndHole = hole(col + 2, 'powerMinus');
    const cx = signalHole.x + 18;
    const cy = BB.y - 30;
    return {
      svg: `
        <g class="component servo">
          <rect x="${cx - 20}" y="${cy - 15}" width="40" height="30" fill="#2c3e50" stroke="#1a252f" rx="3"/>
          <rect x="${cx - 8}" y="${cy - 22}" width="16" height="10" fill="#34495e" rx="2"/>
          <circle cx="${cx}" cy="${cy - 17}" r="5" fill="#f39c12"/>
          <line x1="${cx - 10}" y1="${cy + 15}" x2="${signalHole.x}" y2="${signalHole.y}" stroke="#ff8c00" stroke-width="2"/>
          <line x1="${cx}" y1="${cy + 15}" x2="${vccHole.x}" y2="${vccHole.y}" stroke="#ff0000" stroke-width="2"/>
          <line x1="${cx + 10}" y1="${cy + 15}" x2="${gndHole.x}" y2="${gndHole.y}" stroke="#8b4513" stroke-width="2"/>
          <text x="${cx}" y="${cy - 28}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">SERVO</text>
          <text x="${cx - 10}" y="${cy + 25}" font-size="9" font-family="Arial, sans-serif" font-weight="bold" fill="#ff8c00">SIG</text>
          <text x="${cx}" y="${cy + 25}" font-size="9" font-family="Arial, sans-serif" font-weight="bold" fill="#f00">5V</text>
          <text x="${cx + 10}" y="${cy + 25}" font-size="9" font-family="Arial, sans-serif" font-weight="bold" fill="#8b4513">GND</text>
        </g>
      `,
      pins: { signal: { col, row: 'a' }, vcc: 'powerPlus', gnd: 'powerMinus' },
      signalCol: col
    };
  },

  // PIR sensor (placed above breadboard)
  pir: (col) => {
    const vccHole = hole(col, 'powerPlus');
    const sigHole = hole(col + 1, 'a');
    const gndHole = hole(col + 2, 'powerMinus');
    const cx = sigHole.x;
    const cy = BB.y - 35;
    return {
      svg: `
        <g class="component pir">
          <circle cx="${cx}" cy="${cy}" r="18" fill="#f5f5dc" stroke="#ccc"/>
          <circle cx="${cx}" cy="${cy}" r="12" fill="#e8e8e8"/>
          <rect x="${cx - 12}" y="${cy + 15}" width="24" height="10" fill="#228b22" rx="2"/>
          <line x1="${cx - 8}" y1="${cy + 25}" x2="${vccHole.x}" y2="${vccHole.y}" stroke="#ff0000" stroke-width="2"/>
          <line x1="${cx}" y1="${cy + 25}" x2="${sigHole.x}" y2="${sigHole.y}" stroke="#ff8c00" stroke-width="2"/>
          <line x1="${cx + 8}" y1="${cy + 25}" x2="${gndHole.x}" y2="${gndHole.y}" stroke="#000" stroke-width="2"/>
          <text x="${cx}" y="${cy - 22}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">PIR</text>
        </g>
      `,
      pins: { vcc: 'powerPlus', signal: { col: col + 1, row: 'a' }, gnd: 'powerMinus' },
      signalCol: col + 1
    };
  },

  // Ultrasonic HC-SR04
  ultrasonic: (col) => {
    const vccHole = hole(col, 'powerPlus');
    const trigHole = hole(col + 1, 'a');
    const echoHole = hole(col + 2, 'a');
    const gndHole = hole(col + 3, 'powerMinus');
    const cx = (trigHole.x + echoHole.x) / 2;
    const cy = BB.y - 30;
    return {
      svg: `
        <g class="component ultrasonic">
          <rect x="${cx - 28}" y="${cy - 15}" width="56" height="25" fill="#0066cc" stroke="#004999" rx="2"/>
          <circle cx="${cx - 12}" cy="${cy - 5}" r="8" fill="#c0c0c0"/>
          <circle cx="${cx + 12}" cy="${cy - 5}" r="8" fill="#c0c0c0"/>
          <line x1="${cx - 21}" y1="${cy + 10}" x2="${vccHole.x}" y2="${vccHole.y}" stroke="#ff0000" stroke-width="2"/>
          <line x1="${cx - 7}" y1="${cy + 10}" x2="${trigHole.x}" y2="${trigHole.y}" stroke="#f39c12" stroke-width="2"/>
          <line x1="${cx + 7}" y1="${cy + 10}" x2="${echoHole.x}" y2="${echoHole.y}" stroke="#3498db" stroke-width="2"/>
          <line x1="${cx + 21}" y1="${cy + 10}" x2="${gndHole.x}" y2="${gndHole.y}" stroke="#000" stroke-width="2"/>
          <text x="${cx}" y="${cy - 20}" text-anchor="middle" font-size="10" fill="#222" font-family="Arial, sans-serif" font-weight="bold">HC-SR04</text>
          <text x="${cx - 21}" y="${cy + 20}" font-size="8" font-family="Arial, sans-serif" font-weight="bold" fill="#f00">VCC</text>
          <text x="${cx - 7}" y="${cy + 20}" font-size="8" font-family="Arial, sans-serif" font-weight="bold" fill="#f39c12">TRIG</text>
          <text x="${cx + 7}" y="${cy + 20}" font-size="8" font-family="Arial, sans-serif" font-weight="bold" fill="#3498db">ECHO</text>
          <text x="${cx + 21}" y="${cy + 20}" font-size="8" font-family="Arial, sans-serif" font-weight="bold" fill="#000">GND</text>
        </g>
      `,
      pins: { vcc: 'powerPlus', trig: { col: col + 1, row: 'a' }, echo: { col: col + 2, row: 'a' }, gnd: 'powerMinus' },
      trigCol: col + 1,
      echoCol: col + 2
    };
  },

  // Joystick module
  joystick: (col) => {
    const gndHole = hole(col, 'powerMinus');
    const vccHole = hole(col + 1, 'powerPlus');
    const vrxHole = hole(col + 2, 'a');
    const vryHole = hole(col + 3, 'a');
    const swHole = hole(col + 4, 'a');
    const cx = (vrxHole.x + vryHole.x) / 2;
    const cy = BB.y - 40;
    return {
      svg: `
        <g class="component joystick">
          <rect x="${cx - 30}" y="${cy - 20}" width="60" height="40" fill="#2e7d32" stroke="#1b5e20" rx="3"/>
          <circle cx="${cx}" cy="${cy}" r="14" fill="#333"/>
          <circle cx="${cx}" cy="${cy}" r="8" fill="#555"/>
          <circle cx="${cx}" cy="${cy}" r="4" fill="#777"/>
          <line x1="${cx - 24}" y1="${cy + 20}" x2="${gndHole.x}" y2="${gndHole.y}" stroke="#000" stroke-width="2"/>
          <line x1="${cx - 12}" y1="${cy + 20}" x2="${vccHole.x}" y2="${vccHole.y}" stroke="#ff0000" stroke-width="2"/>
          <line x1="${cx}" y1="${cy + 20}" x2="${vrxHole.x}" y2="${vrxHole.y}" stroke="#e74c3c" stroke-width="2"/>
          <line x1="${cx + 12}" y1="${cy + 20}" x2="${vryHole.x}" y2="${vryHole.y}" stroke="#2ecc71" stroke-width="2"/>
          <line x1="${cx + 24}" y1="${cy + 20}" x2="${swHole.x}" y2="${swHole.y}" stroke="#9b59b6" stroke-width="2"/>
          <text x="${cx}" y="${cy - 25}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">JOYSTICK</text>
        </g>
      `,
      pins: {
        gnd: 'powerMinus',
        vcc: 'powerPlus',
        vrx: { col: col + 2, row: 'a' },
        vry: { col: col + 3, row: 'a' },
        sw: { col: col + 4, row: 'a' }
      },
      vrxCol: col + 2,
      vryCol: col + 3,
      swCol: col + 4
    };
  },

  // Relay module
  relay: (col) => {
    const sigHole = hole(col, 'c');
    const vccHole = hole(col + 1, 'c');
    const gndHole = hole(col + 2, 'c');
    const cx = vccHole.x;
    return {
      svg: `
        <g class="component relay">
          <rect x="${cx - 22}" y="${sigHole.y - 40}" width="44" height="35" fill="#1a237e" stroke="#0d1442" rx="2"/>
          <rect x="${cx - 15}" y="${sigHole.y - 35}" width="30" height="20" fill="#283593" rx="1"/>
          <text x="${cx}" y="${sigHole.y - 23}" text-anchor="middle" font-size="10" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">RELAY</text>
          <line x1="${sigHole.x}" y1="${sigHole.y}" x2="${sigHole.x}" y2="${sigHole.y - 5}" stroke="#999" stroke-width="2"/>
          <line x1="${vccHole.x}" y1="${vccHole.y}" x2="${vccHole.x}" y2="${vccHole.y - 5}" stroke="#999" stroke-width="2"/>
          <line x1="${gndHole.x}" y1="${gndHole.y}" x2="${gndHole.x}" y2="${gndHole.y - 5}" stroke="#999" stroke-width="2"/>
          ${pinMarker(sigHole.x, sigHole.y, 'S', 'left')}
          ${pinMarker(vccHole.x, vccHole.y, '+', 'left')}
          ${pinMarker(gndHole.x, gndHole.y, '−', 'right')}
        </g>
      `,
      pins: { signal: { col, row: 'c' }, vcc: { col: col + 1, row: 'c' }, gnd: { col: col + 2, row: 'c' } }
    };
  },

  // RGB LED (common cathode) - 4 pins
  rgbled: (col) => {
    const rPin = hole(col, 'c');
    const gndPin = hole(col + 1, 'c');
    const gPin = hole(col + 2, 'c');
    const bPin = hole(col + 3, 'c');
    const cx = (gndPin.x + gPin.x) / 2;
    return {
      svg: `
        <g class="component rgb-led">
          <ellipse cx="${cx}" cy="${rPin.y - 22}" rx="12" ry="14" fill="#fff" opacity="0.9" stroke="#ccc"/>
          <ellipse cx="${cx - 4}" cy="${rPin.y - 24}" rx="3" ry="4" fill="#ff0000" opacity="0.6"/>
          <ellipse cx="${cx}" cy="${rPin.y - 18}" rx="3" ry="4" fill="#00ff00" opacity="0.6"/>
          <ellipse cx="${cx + 4}" cy="${rPin.y - 24}" rx="3" ry="4" fill="#0000ff" opacity="0.6"/>
          <line x1="${rPin.x}" y1="${rPin.y}" x2="${rPin.x}" y2="${rPin.y - 8}" stroke="#ff0000" stroke-width="2"/>
          <line x1="${gndPin.x}" y1="${gndPin.y}" x2="${gndPin.x}" y2="${gndPin.y - 8}" stroke="#000" stroke-width="2"/>
          <line x1="${gPin.x}" y1="${gPin.y}" x2="${gPin.x}" y2="${gPin.y - 8}" stroke="#00ff00" stroke-width="2"/>
          <line x1="${bPin.x}" y1="${bPin.y}" x2="${bPin.x}" y2="${bPin.y - 8}" stroke="#0000ff" stroke-width="2"/>
          <text x="${cx}" y="${rPin.y - 40}" text-anchor="middle" font-size="11" fill="#222" font-family="Arial, sans-serif" font-weight="bold">RGB</text>
          ${pinMarker(rPin.x, rPin.y, 'R', 'left')}
          ${pinMarker(gndPin.x, gndPin.y, 'GND', 'left')}
          ${pinMarker(gPin.x, gPin.y, 'G', 'right')}
          ${pinMarker(bPin.x, bPin.y, 'B', 'right')}
        </g>
      `,
      pins: {
        r: { col, row: 'c' },
        gnd: { col: col + 1, row: 'c' },
        g: { col: col + 2, row: 'c' },
        b: { col: col + 3, row: 'c' }
      }
    };
  },
};

// Main diagram generator
function generateBreadboardDiagram(components, pins) {
  const svgParts = [];
  const wires = [];
  colorIndex = 0;

  // Arduino and breadboard
  svgParts.push(generateArduino());
  svgParts.push(generateBreadboard());

  // Power connections
  const arduino5V = arduinoPin('5V');
  const arduinoGND = { x: LAYOUT.arduino.x + 9, y: LAYOUT.arduino.y + 85 };

  // 5V to top + rail
  wires.push(wire(arduino5V.x, arduino5V.y, hole(1, 'powerPlus').x, hole(1, 'powerPlus').y, COLORS.vcc));
  // GND to top - rail
  wires.push(wire(arduinoGND.x, arduinoGND.y, hole(2, 'powerMinus').x, hole(2, 'powerMinus').y, COLORS.gnd));
  // Connect top and bottom rails
  wires.push(jumper(hole(28, 'powerPlus').x, hole(28, 'powerPlus').y, hole(28, 'gndPlus').x, hole(28, 'gndPlus').y, COLORS.vcc));
  wires.push(jumper(hole(29, 'powerMinus').x, hole(29, 'powerMinus').y, hole(29, 'gndMinus').x, hole(29, 'gndMinus').y, COLORS.gnd));

  let currentCol = 3;

  // Place output components
  components.outputs.forEach(comp => {
    const count = comp.count || 1;
    for (let i = 0; i < count; i++) {
      const col = currentCol;
      const signalColor = nextColor();

      switch (comp.component) {
        case 'led': {
          const pinNum = pins[`led${i + 1}`];
          const ledColors = ['#ff0000', '#00ff00', '#ffff00', '#0088ff', '#ff8800'];

          // Resistor from col to col+2 in row e (connects internally to LED in row c, same column)
          const res = COMPONENTS.resistor(col, col + 2, 'e', '220Ω');
          svgParts.push(res.svg);

          // LED anode at col+2 row c, cathode at col+3 row c
          // col+2 row c and col+2 row e are internally connected (same column, rows a-e)
          const led = COMPONENTS.led(col + 2, ledColors[i % ledColors.length]);
          svgParts.push(led.svg);

          // Visual indicator: internal breadboard connection (col+2 connects rows c and e)
          svgParts.push(`<line x1="${hole(col + 2, 'c').x}" y1="${hole(col + 2, 'c').y}" x2="${hole(col + 2, 'e').x}" y2="${hole(col + 2, 'e').y}" stroke="#4a4a6a" stroke-width="4" stroke-dasharray="2,2" opacity="0.5"/>`);

          // Wire: Arduino → col row e (resistor input)
          const ap = arduinoPin(pinNum);
          wires.push(wire(ap.x, ap.y, hole(col, 'e').x, hole(col, 'e').y, signalColor));

          // Wire: LED cathode (col+3 row c) to GND rail
          const cathodeCol = col + 3;
          wires.push(jumper(hole(cathodeCol, 'c').x, hole(cathodeCol, 'c').y, hole(cathodeCol, 'gndMinus').x, hole(cathodeCol, 'gndMinus').y, COLORS.gnd));

          currentCol += 5;
          break;
        }

        case 'rgb-led': {
          // RGB LED + 3 resistors
          const rPin = pins.rgbRed;
          const gPin = pins.rgbGreen;
          const bPin = pins.rgbBlue;

          // 3 resistors
          svgParts.push(COMPONENTS.resistor(col, col + 2, 'b', '220Ω').svg);
          svgParts.push(COMPONENTS.resistor(col + 4, col + 6, 'b', '220Ω').svg);
          svgParts.push(COMPONENTS.resistor(col + 7, col + 9, 'b', '220Ω').svg);

          // RGB LED at cols 2,3,6,9 row c (simplified positioning)
          const rgb = COMPONENTS.rgbled(col + 2);
          svgParts.push(rgb.svg);

          // Wires from Arduino to resistors
          wires.push(wire(arduinoPin(rPin).x, arduinoPin(rPin).y, hole(col, 'b').x, hole(col, 'b').y, '#ff0000'));
          wires.push(wire(arduinoPin(gPin).x, arduinoPin(gPin).y, hole(col + 4, 'b').x, hole(col + 4, 'b').y, '#00ff00'));
          wires.push(wire(arduinoPin(bPin).x, arduinoPin(bPin).y, hole(col + 7, 'b').x, hole(col + 7, 'b').y, '#0000ff'));

          // GND connection
          wires.push(jumper(hole(col + 3, 'c').x, hole(col + 3, 'c').y, hole(col + 3, 'gndMinus').x, hole(col + 3, 'gndMinus').y, COLORS.gnd));

          currentCol += 11;
          break;
        }

        case 'piezo': {
          const pinNum = pins.piezo;
          const piezo = COMPONENTS.piezo(col);
          svgParts.push(piezo.svg);

          // Signal wire
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col, 'c').x, hole(col, 'c').y, signalColor));
          // GND wire
          wires.push(jumper(hole(col + 2, 'c').x, hole(col + 2, 'c').y, hole(col + 2, 'gndMinus').x, hole(col + 2, 'gndMinus').y, COLORS.gnd));

          currentCol += 4;
          break;
        }

        case 'servo': {
          const pinNum = pins.servo;
          const servo = COMPONENTS.servo(col);
          svgParts.push(servo.svg);

          // Signal wire from Arduino to row a
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col, 'a').x, hole(col, 'a').y, signalColor));

          currentCol += 5;
          break;
        }

        case 'relay': {
          const pinNum = pins.relay;
          const relay = COMPONENTS.relay(col);
          svgParts.push(relay.svg);

          // Signal
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col, 'c').x, hole(col, 'c').y, signalColor));
          // VCC
          wires.push(jumper(hole(col + 1, 'c').x, hole(col + 1, 'c').y, hole(col + 1, 'powerPlus').x, hole(col + 1, 'powerPlus').y, COLORS.vcc));
          // GND
          wires.push(jumper(hole(col + 2, 'c').x, hole(col + 2, 'c').y, hole(col + 2, 'gndMinus').x, hole(col + 2, 'gndMinus').y, COLORS.gnd));

          currentCol += 4;
          break;
        }
      }
    }
  });

  currentCol += 2; // Gap between outputs and inputs

  // Place input components
  components.inputs.forEach(comp => {
    const count = comp.count || 1;
    for (let i = 0; i < count; i++) {
      const col = currentCol;
      const signalColor = nextColor();

      switch (comp.component) {
        case 'button': {
          const pinNum = pins[`button${i + 1}`];
          const btn = COMPONENTS.button(col);
          svgParts.push(btn.svg);

          // Pull-down resistor from col+1 row g (same column as button output) to col+3 row g
          svgParts.push(COMPONENTS.resistor(col + 1, col + 3, 'g', '10kΩ').svg);

          // 1. VCC (5V) to button left side (col, row e) - via power rail
          wires.push(jumper(hole(col, 'e').x, hole(col, 'e').y, hole(col, 'powerPlus').x, hole(col, 'powerPlus').y, COLORS.vcc));

          // 2. Arduino digital pin to button output (col+1, row f)
          // Rows f-j are internally connected, so col+1 row f connects to col+1 row g (resistor start)
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col + 1, 'f').x, hole(col + 1, 'f').y, signalColor));

          // Visual indicator: internal breadboard connection (col+1 connects rows f and g)
          svgParts.push(`<line x1="${hole(col + 1, 'f').x}" y1="${hole(col + 1, 'f').y}" x2="${hole(col + 1, 'g').x}" y2="${hole(col + 1, 'g').y}" stroke="#4a4a6a" stroke-width="4" stroke-dasharray="2,2" opacity="0.5"/>`);

          // 3. Resistor end (col+3, g) to GND rail
          wires.push(jumper(hole(col + 3, 'g').x, hole(col + 3, 'g').y, hole(col + 3, 'gndMinus').x, hole(col + 3, 'gndMinus').y, COLORS.gnd));

          currentCol += 5;
          break;
        }

        case 'potentiometer': {
          const pinNum = pins.poti;
          const pot = COMPONENTS.potentiometer(col);
          svgParts.push(pot.svg);

          // VCC to left pin
          wires.push(jumper(hole(col, 'g').x, hole(col, 'g').y, hole(col, 'gndPlus').x, hole(col, 'gndPlus').y, COLORS.vcc));
          // Signal from middle pin to Arduino
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col + 1, 'g').x, hole(col + 1, 'g').y, signalColor));
          // GND to right pin
          wires.push(jumper(hole(col + 2, 'g').x, hole(col + 2, 'g').y, hole(col + 2, 'gndMinus').x, hole(col + 2, 'gndMinus').y, COLORS.gnd));

          currentCol += 4;
          break;
        }

        case 'ldr': {
          const pinNum = pins.ldr;
          const ldr = COMPONENTS.ldr(col);
          svgParts.push(ldr.svg);

          // Voltage divider: VCC → LDR → junction → 10k → GND
          // 10k resistor in row g
          svgParts.push(COMPONENTS.resistor(col, col + 2, 'g', '10kΩ').svg);

          // VCC to LDR
          wires.push(jumper(hole(col, 'c').x, hole(col, 'c').y, hole(col, 'powerPlus').x, hole(col, 'powerPlus').y, COLORS.vcc));

          // Junction (col+1 where LDR and resistor meet) to Arduino
          // LDR pin 2 is at col+1, row c. Resistor starts at col, row g.
          // Need to connect col+1 row c to col row g via a wire
          wires.push(jumper(hole(col + 1, 'c').x, hole(col + 1, 'c').y, hole(col + 1, 'f').x, hole(col + 1, 'f').y, signalColor)); // over gap
          wires.push(jumper(hole(col + 1, 'f').x, hole(col + 1, 'f').y, hole(col, 'g').x, hole(col, 'g').y, signalColor)); // to resistor start

          // Arduino to junction
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col + 1, 'f').x, hole(col + 1, 'f').y, signalColor));

          // Resistor end to GND
          wires.push(jumper(hole(col + 2, 'g').x, hole(col + 2, 'g').y, hole(col + 2, 'gndMinus').x, hole(col + 2, 'gndMinus').y, COLORS.gnd));

          currentCol += 4;
          break;
        }

        case 'tmp36': {
          const pinNum = pins.temp;
          const tmp = COMPONENTS.tmp36(col);
          svgParts.push(tmp.svg);

          // VCC
          wires.push(jumper(hole(col, 'c').x, hole(col, 'c').y, hole(col, 'powerPlus').x, hole(col, 'powerPlus').y, COLORS.vcc));
          // Signal
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col + 1, 'c').x, hole(col + 1, 'c').y, signalColor));
          // GND
          wires.push(jumper(hole(col + 2, 'c').x, hole(col + 2, 'c').y, hole(col + 2, 'gndMinus').x, hole(col + 2, 'gndMinus').y, COLORS.gnd));

          currentCol += 4;
          break;
        }

        case 'pir': {
          const pinNum = pins.pir;
          const pir = COMPONENTS.pir(col);
          svgParts.push(pir.svg);

          // Signal wire
          wires.push(wire(arduinoPin(pinNum).x, arduinoPin(pinNum).y, hole(col + 1, 'a').x, hole(col + 1, 'a').y, signalColor));

          currentCol += 4;
          break;
        }

        case 'ultrasonic': {
          const trigPin = pins.trigPin;
          const echoPin = pins.echoPin;
          const us = COMPONENTS.ultrasonic(col);
          svgParts.push(us.svg);

          // Trig and Echo wires
          wires.push(wire(arduinoPin(trigPin).x, arduinoPin(trigPin).y, hole(col + 1, 'a').x, hole(col + 1, 'a').y, '#f39c12'));
          wires.push(wire(arduinoPin(echoPin).x, arduinoPin(echoPin).y, hole(col + 2, 'a').x, hole(col + 2, 'a').y, '#3498db'));

          currentCol += 5;
          break;
        }

        case 'joystick': {
          const xPin = pins.joyX;
          const yPin = pins.joyY;
          const btnPin = pins.joyButton;
          const joy = COMPONENTS.joystick(col);
          svgParts.push(joy.svg);

          // Signal wires
          wires.push(wire(arduinoPin(xPin).x, arduinoPin(xPin).y, hole(col + 2, 'a').x, hole(col + 2, 'a').y, '#e74c3c'));
          wires.push(wire(arduinoPin(yPin).x, arduinoPin(yPin).y, hole(col + 3, 'a').x, hole(col + 3, 'a').y, '#2ecc71'));
          wires.push(wire(arduinoPin(btnPin).x, arduinoPin(btnPin).y, hole(col + 4, 'a').x, hole(col + 4, 'a').y, '#9b59b6'));

          currentCol += 6;
          break;
        }
      }
    }
  });

  // Combine SVG
  return `
    <svg viewBox="0 0 ${LAYOUT.width} ${LAYOUT.height}" class="breadboard-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect x="0" y="0" width="${LAYOUT.width}" height="${LAYOUT.height}" fill="#1a1a2e"/>
      ${svgParts.join('')}
      <g class="wires">${wires.join('')}</g>
    </svg>
  `;
}

window.generateBreadboardDiagram = generateBreadboardDiagram;
