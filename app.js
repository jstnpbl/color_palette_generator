// =========================
// DOM Elements
// =========================
const paletteTypeSelect = document.getElementById('palette-type');
const baseColorInput = document.getElementById('base-color');
const colorCountInput = document.getElementById('color-count');
const colorCountValue = document.getElementById('color-count-value');
const generateBtn = document.getElementById('generate-btn');
const currentPalette = document.getElementById('current-palette');
const saveBtn = document.getElementById('save-btn');
const clearHistoryBtn = document.getElementById('clear-history');
const historyPalettes = document.getElementById('history-palettes');
const toast = document.getElementById('toast');
const exportBtn = document.getElementById('export-btn');
const copyAllBtn = document.getElementById('copyall-btn');
const exportCodeBtn = document.getElementById('export-code-btn');
const exportCodeType = document.getElementById('export-code-type');
const importBtn = document.getElementById('import-btn');
const importModal = document.getElementById('import-modal');
const shareBtn = document.getElementById('share-btn');
const contrastChecker = document.getElementById('contrast-checker');
const copyAllMode = document.getElementById('copyall-mode');
const livePreviewUI = document.getElementById('live-preview-ui');
const toggleContrastBtn = document.getElementById('toggle-contrast');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// =========================
// State
// =========================
let currentColors = [];
let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
let locked = [];
let editModal = null;

// =========================
// Initialization
// =========================
function init() {
    // Set up event listeners
    colorCountInput.addEventListener('input', () => {
        colorCountValue.textContent = colorCountInput.value;
    });

    generateBtn.addEventListener('click', generatePalette);

    saveBtn.addEventListener('click', saveCurrentPalette);

    clearHistoryBtn.addEventListener('click', clearHistory);

    exportBtn.addEventListener('click', exportCurrentPalette);

    copyAllBtn.addEventListener('click', copyAllColors);

    exportCodeBtn.addEventListener('click', exportCode);

    shareBtn.addEventListener('click', sharePalette);

    importBtn.addEventListener('click', openImportModal);

    toggleContrastBtn.addEventListener('click', toggleContrastChecker);

    // Dark mode toggle
    if (darkModeToggle) {
        setupDarkModeToggle();
    }

    // Load palette from URL if present
    window.addEventListener('DOMContentLoaded', loadPaletteFromURL);

    // Initial render
    generatePalette();
    updateHistoryDisplay();
}
init();

// =========================
// Palette Generation & Display
// =========================
function generatePalette() {
    const paletteType = paletteTypeSelect.value;
    const baseColor = baseColorInput.value;
    const colorCount = parseInt(colorCountInput.value);

    // Adjust locked array if color count changes
    if (locked.length !== colorCount) {
        locked = Array.from({ length: colorCount }, (_, i) => locked[i] || false);
    }

    // Generate only for unlocked slots
    const newColors = generateColors(paletteType, baseColor, colorCount);
    for (let i = 0; i < colorCount; i++) {
        if (!locked[i]) {
            currentColors[i] = newColors[i];
        }
    }
    updatePaletteDisplay(currentPalette, currentColors);
}

function generateColors(type, baseColor, count) {
    const baseHSL = hexToHSL(baseColor);
    let colors = [];

    switch (type) {
        case 'random':
            for (let i = 0; i < count; i++) {
                const h = Math.floor(Math.random() * 360);
                const s = 70 + Math.floor(Math.random() * 30);
                const l = 40 + Math.floor(Math.random() * 40);
                colors.push(hslToHex(h, s, l));
            }
            break;
        case 'monochromatic':
            for (let i = 0; i < count; i++) {
                const s = 40 + Math.floor((i / (count - 1)) * 50);
                const l = 30 + Math.floor((i / (count - 1)) * 50);
                colors.push(hslToHex(baseHSL.h, s, l));
            }
            break;
        case 'analogous':
            const hueRange = 60;
            const startHue = (baseHSL.h - hueRange / 2 + 360) % 360;
            for (let i = 0; i < count; i++) {
                const h = (startHue + (i / (count - 1)) * hueRange) % 360;
                const s = baseHSL.s - 10 + Math.random() * 20;
                const l = baseHSL.l - 10 + Math.random() * 20;
                colors.push(hslToHex(h, s, l));
            }
            break;
        case 'complementary':
            const complementHue = (baseHSL.h + 180) % 360;
            for (let i = 0; i < count; i++) {
                let h;
                if (i < count / 2) {
                    h = baseHSL.h - 15 + (i / (count / 2 - 1)) * 30;
                } else {
                    h = complementHue - 15 + ((i - count / 2) / (count / 2 - 1)) * 30;
                }
                h = (h + 360) % 360;
                const s = 70 + Math.floor(Math.random() * 20);
                const l = 40 + Math.floor(Math.random() * 20);
                colors.push(hslToHex(h, s, l));
            }
            break;
        case 'triadic':
            const triadicHues = [
                baseHSL.h,
                (baseHSL.h + 120) % 360,
                (baseHSL.h + 240) % 360
            ];
            const colorsPerHue = Math.ceil(count / 3);
            for (let i = 0; i < triadicHues.length; i++) {
                for (let j = 0; j < colorsPerHue; j++) {
                    if (colors.length >= count) break;
                    const h = triadicHues[i];
                    const s = 60 + (j / colorsPerHue) * 30;
                    const l = 40 + (j / colorsPerHue) * 30;
                    colors.push(hslToHex(h, s, l));
                }
            }
            break;
        case 'tetradic':
            const tetradicHues = [
                baseHSL.h,
                (baseHSL.h + 90) % 360,
                (baseHSL.h + 180) % 360,
                (baseHSL.h + 270) % 360
            ];
            const colorsPerTetradic = Math.ceil(count / 4);
            for (let i = 0; i < tetradicHues.length; i++) {
                for (let j = 0; j < colorsPerTetradic; j++) {
                    if (colors.length >= count) break;
                    const h = tetradicHues[i];
                    const s = 60 + (j / colorsPerTetradic) * 30;
                    const l = 40 + (j / colorsPerTetradic) * 30;
                    colors.push(hslToHex(h, s, l));
                }
            }
            break;
    }
    return colors;
}

function updatePaletteDisplay(container, colors) {
    container.innerHTML = '';
    if (!Array.isArray(locked) || locked.length !== colors.length) {
        locked = Array(colors.length).fill(false);
    }

    // Drag-and-drop support
    container.setAttribute('draggable', 'false');
    container.ondragover = (e) => e.preventDefault();

    colors.forEach((color, idx) => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color';
        colorElement.style.backgroundColor = color;
        colorElement.setAttribute('draggable', 'true');
        colorElement.dataset.index = idx;

        // Drag events
        colorElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', idx);
            colorElement.classList.add('dragging');
        });
        colorElement.addEventListener('dragend', () => {
            colorElement.classList.remove('dragging');
        });
        colorElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            colorElement.classList.add('drag-over');
        });
        colorElement.addEventListener('dragleave', () => {
            colorElement.classList.remove('drag-over');
        });
        colorElement.addEventListener('drop', (e) => {
            e.preventDefault();
            colorElement.classList.remove('drag-over');
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
            const toIdx = idx;
            if (fromIdx !== toIdx) {
                // Rearrange colors and locked arrays
                const [movedColor] = currentColors.splice(fromIdx, 1);
                currentColors.splice(toIdx, 0, movedColor);
                const [movedLock] = locked.splice(fromIdx, 1);
                locked.splice(toIdx, 0, movedLock);
                updatePaletteDisplay(container, currentColors);
            }
        });

        if (locked[idx]) colorElement.classList.add('locked');

        // Lock icon
        const lockIcon = document.createElement('span');
        lockIcon.className = 'lock-icon';
        lockIcon.title = locked[idx] ? 'Unlock color' : 'Lock color';
        lockIcon.innerHTML = locked[idx] ? '🔒' : '🔓';
        lockIcon.tabIndex = 0;
        lockIcon.setAttribute('aria-label', locked[idx] ? 'Unlock color' : 'Lock color');
        lockIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            locked[idx] = !locked[idx];
            updatePaletteDisplay(container, colors);
        });
        lockIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                locked[idx] = !locked[idx];
                updatePaletteDisplay(container, colors);
            }
        });
        colorElement.appendChild(lockIcon);

        // Edit icon
        const editIcon = document.createElement('span');
        editIcon.className = 'edit-icon';
        editIcon.title = 'Edit color';
        editIcon.innerHTML = '✏️';
        editIcon.tabIndex = 0;
        editIcon.setAttribute('aria-label', 'Edit color');
        editIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(idx, color);
        });
        editIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEditModal(idx, color);
            }
        });
        colorElement.appendChild(editIcon);

        // HEX value
        const hexValue = document.createElement('div');
        hexValue.className = 'color-hex';
        hexValue.textContent = color.toUpperCase();
        colorElement.appendChild(hexValue);

        // Click to copy
        colorElement.addEventListener('click', () => {
            copyToClipboard(color);
            showToast(`${color.toUpperCase()} copied to clipboard`);
        });

        container.appendChild(colorElement);
    });

    updateContrastChecker(colors);
    updateLivePreview(colors);
}

function updateLivePreview(colors) {
    if (!livePreviewUI) return;
    colors.forEach((c, i) => {
        livePreviewUI.style.setProperty(`--color${i + 1}`, c);
    });
    for (let i = colors.length + 1; i <= 5; i++) {
        livePreviewUI.style.setProperty(`--color${i}`, '');
    }
    livePreviewUI.innerHTML = `
        <div class="preview-card">
            <div class="preview-banner">Brand Banner</div>
            <div style="margin-bottom:8px;">This is a card using your palette.</div>
            <button class="preview-btn">Primary Button</button>
        </div>
        <div class="preview-card" style="background:var(--color3);color:var(--color4)">
            <div class="preview-banner" style="background:var(--color2);color:var(--color1)">Alt Banner</div>
            <div>Alternate card style with swapped palette colors.</div>
            <button class="preview-btn" style="background:var(--color5);color:var(--color1)">Accent Button</button>
        </div>
    `;
}

// =========================
// Palette Actions
// =========================
function saveCurrentPalette() {
    if (currentColors.length === 0) {
        showToast('Generate a palette first!');
        return;
    }
    savedPalettes.unshift({
        colors: [...currentColors],
        name: `Palette ${savedPalettes.length + 1}`
    });
    if (savedPalettes.length > 10) savedPalettes.pop();
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    updateHistoryDisplay();
    showToast('Palette saved!');
}

function clearHistory() {
    savedPalettes = [];
    localStorage.removeItem('savedPalettes');
    updateHistoryDisplay();
    showToast('History cleared!');
}

function exportCurrentPalette() {
    if (currentColors.length === 0) {
        showToast('Generate a palette first!');
        return;
    }
    exportPaletteAsPNG(currentColors);
}

function copyAllColors() {
    if (currentColors.length === 0) {
        showToast('Generate a palette first!');
        return;
    }
    let text = '';
    switch (copyAllMode.value) {
        case 'hex':
            text = currentColors.join('\n');
            break;
        case 'rgb':
            text = currentColors.map(hex => hexToRGBString(hex)).join('\n');
            break;
        case 'hsl':
            text = currentColors.map(hex => {
                const hsl = hexToHSL(hex);
                return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            }).join('\n');
            break;
        case 'css':
            text = currentColors.map((c, i) => `--color${i + 1}: ${c};`).join('\n');
            text = `:root {\n${text.split('\n').map(l => '  ' + l).join('\n')}\n}`;
            break;
    }
    copyToClipboard(text);
    showToast(`All ${copyAllMode.value.toUpperCase()} codes copied!`);
}

function exportCode() {
    if (!currentColors.length) {
        showToast('Generate a palette first!');
        return;
    }
    let code = '';
    switch (exportCodeType.value) {
        case 'css':
            code = currentColors.map((c, i) => `--color${i + 1}: ${c};`).join('\n');
            code = `:root {\n${code.split('\n').map(l => '  ' + l).join('\n')}\n}`;
            break;
        case 'json':
            code = JSON.stringify(currentColors, null, 2);
            break;
        case 'tailwind':
            code = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${currentColors.map((c, i) => `        color${i + 1}: '${c}'`).join(',\n')}\n      }\n    }\n  }\n}`;
            break;
    }
    copyToClipboard(code);
    showToast('Exported code copied!');
}

function sharePalette() {
    if (!currentColors.length) {
        showToast('Generate a palette first!');
        return;
    }
    const paletteString = currentColors.map(c => c.replace('#', '')).join('-');
    const url = `${location.origin}${location.pathname}?palette=${paletteString}`;
    copyToClipboard(url);
    showToast('Shareable link copied!');
}

// =========================
// History Display
// =========================
function updateHistoryDisplay() {
    historyPalettes.innerHTML = '';
    if (savedPalettes.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No saved palettes yet.';
        historyPalettes.appendChild(emptyMsg);
        return;
    }
    savedPalettes.forEach((palette, index) => {
        const paletteElement = document.createElement('div');
        paletteElement.className = 'history-palette';

        palette.colors.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = 'history-color';
            colorElement.style.backgroundColor = color;
            paletteElement.appendChild(colorElement);
        });

        // Palette name
        let name = palette.name || `Palette ${index + 1}`;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'palette-name';
        nameSpan.textContent = name;
        paletteElement.appendChild(nameSpan);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'history-palette-actions';

        // Rename button
        const renameBtn = document.createElement('button');
        renameBtn.className = 'rename-btn';
        renameBtn.textContent = 'Rename';
        renameBtn.onclick = (e) => {
            e.stopPropagation();
            const newName = prompt('Enter palette name:', name);
            if (newName && newName.trim()) {
                palette.name = newName.trim();
                localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
                updateHistoryDisplay();
            }
        };
        actions.appendChild(renameBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('Delete this palette?')) {
                savedPalettes.splice(index, 1);
                localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
                updateHistoryDisplay();
            }
        };
        actions.appendChild(deleteBtn);

        paletteElement.appendChild(actions);

        // Click to load palette
        paletteElement.addEventListener('click', () => {
            currentColors = [...palette.colors];
            locked = Array(currentColors.length).fill(false);
            updatePaletteDisplay(currentPalette, currentColors);
            showToast('Palette loaded!');
        });

        historyPalettes.appendChild(paletteElement);
    });
}

// =========================
// Modals
// =========================
function openEditModal(idx, color) {
    closeEditModal();
    const hsl = hexToHSL(color);

    editModal = document.createElement('div');
    editModal.className = 'edit-modal';

    editModal.innerHTML = `
        <div class="edit-modal-content">
            <h3>Edit Color</h3>
            <label>HEX: <input type="text" id="edit-hex" value="${color.toUpperCase()}" maxlength="7" /></label>
            <label>Hue: <input type="range" id="edit-hue" min="0" max="360" value="${hsl.h}"> <span id="edit-hue-val">${hsl.h}</span></label>
            <label>Saturation: <input type="range" id="edit-sat" min="0" max="100" value="${hsl.s}"> <span id="edit-sat-val">${hsl.s}</span></label>
            <label>Lightness: <input type="range" id="edit-light" min="0" max="100" value="${hsl.l}"> <span id="edit-light-val">${hsl.l}</span></label>
            <div class="edit-modal-actions">
                <button id="edit-save">Save</button>
                <button id="edit-cancel">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(editModal);

    // Update preview values
    const hueInput = editModal.querySelector('#edit-hue');
    const satInput = editModal.querySelector('#edit-sat');
    const lightInput = editModal.querySelector('#edit-light');
    const hexInput = editModal.querySelector('#edit-hex');
    const hueVal = editModal.querySelector('#edit-hue-val');
    const satVal = editModal.querySelector('#edit-sat-val');
    const lightVal = editModal.querySelector('#edit-light-val');

    function updateHexFromHSL() {
        const hex = hslToHex(hueInput.value, satInput.value, lightInput.value);
        hexInput.value = hex.toUpperCase();
    }

    function updateHSLFromHex() {
        const hex = hexInput.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            const hsl = hexToHSL(hex);
            hueInput.value = hsl.h;
            satInput.value = hsl.s;
            lightInput.value = hsl.l;
            hueVal.textContent = hsl.h;
            satVal.textContent = hsl.s;
            lightVal.textContent = hsl.l;
        }
    }

    hueInput.addEventListener('input', () => {
        hueVal.textContent = hueInput.value;
        updateHexFromHSL();
    });
    satInput.addEventListener('input', () => {
        satVal.textContent = satInput.value;
        updateHexFromHSL();
    });
    lightInput.addEventListener('input', () => {
        lightVal.textContent = lightInput.value;
        updateHexFromHSL();
    });
    hexInput.addEventListener('input', updateHSLFromHex);

    editModal.querySelector('#edit-save').addEventListener('click', () => {
        const newHex = hexInput.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
            currentColors[idx] = newHex;
            updatePaletteDisplay(currentPalette, currentColors);
            closeEditModal();
        } else {
            alert('Invalid HEX code.');
        }
    });
    editModal.querySelector('#edit-cancel').addEventListener('click', closeEditModal);

    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
}

function closeEditModal() {
    if (editModal) {
        document.body.removeChild(editModal);
        editModal = null;
    }
}

function openImportModal() {
    importModal.style.display = 'flex';
    importModal.innerHTML = `
        <div class="import-modal-content">
            <h3>Import Palette</h3>
            <p>Paste HEX codes (comma, space, or newline separated) or a JSON array of HEX codes:</p>
            <textarea id="import-text" placeholder="#4caf50, #ff9800, #2196f3"></textarea>
            <div class="import-modal-actions">
                <button id="import-confirm">Import</button>
                <button id="import-cancel">Cancel</button>
            </div>
        </div>
    `;
    document.getElementById('import-cancel').onclick = closeImportModal;
    document.getElementById('import-confirm').onclick = () => {
        const val = document.getElementById('import-text').value.trim();
        let arr = [];
        try {
            if (val.startsWith('[')) {
                arr = JSON.parse(val);
            } else {
                arr = val.split(/[\s,]+/).filter(Boolean);
            }
            arr = arr.map(c => c.trim().replace(/^#?/, '#').toLowerCase());
            if (arr.every(c => /^#[0-9a-f]{6}$/i.test(c)) && arr.length >= 3 && arr.length <= 10) {
                currentColors = arr;
                locked = Array(arr.length).fill(false);
                updatePaletteDisplay(currentPalette, currentColors);
                closeImportModal();
                showToast('Palette imported!');
            } else {
                alert('Please provide 3-10 valid HEX codes.');
            }
        } catch {
            alert('Invalid input. Please check your HEX codes or JSON.');
        }
    };
    importModal.onclick = (e) => {
        if (e.target === importModal) closeImportModal();
    };
}
function closeImportModal() {
    importModal.style.display = 'none';
    importModal.innerHTML = '';
}

// =========================
// Contrast Checker
// =========================
function updateContrastChecker(colors) {
    if (!contrastChecker) return;
    if (!colors || colors.length < 2) {
        contrastChecker.innerHTML = '';
        return;
    }
    let html = '<strong>Contrast Checker (AA, text on text):</strong><br>';
    for (let i = 0; i < colors.length - 1; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            const ratio = getContrastRatio(colors[i], colors[j]);
            const pass = ratio >= 4.5;
            html += `
                <div class="contrast-row">
                    <span class="contrast-sample" style="background:${colors[i]};color:${colors[j]}">A</span>
                    <span class="contrast-sample" style="background:${colors[j]};color:${colors[i]}">A</span>
                    <span>${colors[i].toUpperCase()} / ${colors[j].toUpperCase()}</span>
                    <span>${ratio.toFixed(2)}:1</span>
                    <span class="${pass ? 'contrast-pass' : 'contrast-fail'}">${pass ? 'PASS' : 'FAIL'}</span>
                </div>
            `;
        }
    }
    contrastChecker.innerHTML = html;
}

function toggleContrastChecker() {
    const expanded = toggleContrastBtn.getAttribute('aria-expanded') === 'true';
    contrastChecker.style.display = expanded ? 'none' : 'block';
    toggleContrastBtn.setAttribute('aria-expanded', !expanded);
    toggleContrastBtn.textContent = expanded ? 'Show Contrast Checker' : 'Hide Contrast Checker';
}

// =========================
// Dark Mode
// =========================
function setupDarkModeToggle() {
    // Load preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.setAttribute('aria-pressed', 'true');
        darkModeToggle.textContent = '☀️ Light Mode';
    } else {
        darkModeToggle.setAttribute('aria-pressed', 'false');
        darkModeToggle.textContent = '🌙 Dark Mode';
    }

    darkModeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
}

// =========================
// Palette from URL
// =========================
function loadPaletteFromURL() {
    const params = new URLSearchParams(window.location.search);
    const paletteParam = params.get('palette');
    if (paletteParam) {
        const arr = paletteParam.split('-').map(c => '#' + c);
        if (arr.every(c => /^#[0-9a-f]{6}$/i.test(c)) && arr.length >= 3 && arr.length <= 10) {
            currentColors = arr;
            locked = Array(arr.length).fill(false);
            updatePaletteDisplay(currentPalette, currentColors);
            showToast('Palette loaded from link!');
        }
    }
}

// =========================
// Utilities
// =========================
function hexToHSL(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showToast(message) {
    toast.textContent = message;
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
    }, 2000);
}

function exportPaletteAsPNG(colors) {
    const width = 500;
    const height = 100;
    const colorWidth = width / colors.length;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(i * colorWidth, 0, colorWidth, height);
        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 4;
        ctx.fillText(color.toUpperCase(), (i + 0.5) * colorWidth, height - 10);
        ctx.shadowBlur = 0;
    });
    canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.download = 'palette.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    });
}

function hexToRGBString(hex) {
    const r = parseInt(hex.substr(1,2),16);
    const g = parseInt(hex.substr(3,2),16);
    const b = parseInt(hex.substr(5,2),16);
    return `rgb(${r}, ${g}, ${b})`;
}

function getContrastRatio(hex1, hex2) {
    function luminance(hex) {
        let rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
        rgb = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
    const lum1 = luminance(hex1);
    const lum2 = luminance(hex2);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}