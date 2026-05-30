import { scrambleBase64 } from '../utils/scramble';

export const generateGalleryHtml = (config) => {
  const { title, password, watermarkText, watermarkOpacity, images } = config;

  // Process images
  const processedImages = images.map((img, index) => {
    // scramble if password exists
    const scrambledData = scrambleBase64(img.data, password);
    return {
      id: index,
      name: img.name,
      data: scrambledData
    };
  });

  const hasPassword = !!password;
  // Calculate simple password verification hash (sum of char codes)
  let passwordHash = 0;
  if (hasPassword) {
    for (let i = 0; i < password.length; i++) {
      passwordHash += password.charCodeAt(i);
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Client Proofing Gallery</title>
  <style>
    :root {
      --bg-primary: #0b0f19;
      --bg-secondary: #131c2e;
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --danger: #ef4444;
      --success: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-drag: none;
    }

    body {
      background-color: var(--bg-primary);
      color: var(--text-main);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow-x: hidden;
      min-height: 100vh;
    }

    /* Print protection */
    @media print {
      body {
        display: none !important;
      }
    }

    /* Blur Security Overlay */
    #security-blur {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 15, 25, 0.95);
      backdrop-filter: blur(40px);
      z-index: 99999;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }

    #security-blur h2 {
      font-size: 2rem;
      color: var(--danger);
      margin-bottom: 1rem;
    }

    #security-blur p {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    #security-blur button {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 9999px;
      cursor: pointer;
      transition: background 0.2s;
    }

    #security-blur button:hover {
      background: var(--accent-hover);
    }

    /* Password Lock Screen */
    #lock-screen {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%);
      z-index: 9999;
      display: ${hasPassword ? 'flex' : 'none'};
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .lock-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 2.5rem;
      width: 100%;
      max-width: 440px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .lock-icon {
      width: 64px;
      height: 64px;
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
      font-size: 1.75rem;
    }

    .lock-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .lock-subtitle {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .input-group {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .lock-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem 1.25rem;
      border-radius: 12px;
      color: white;
      font-size: 1.1rem;
      text-align: center;
      outline: none;
      transition: all 0.2s;
    }

    .lock-input:focus {
      border-color: var(--accent);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }

    .lock-btn {
      width: 100%;
      background: var(--accent);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .lock-btn:hover {
      background: var(--accent-hover);
    }

    .shake {
      animation: shakeEffect 0.4s ease-in-out;
    }

    @keyframes shakeEffect {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }

    /* Gallery Main Layout */
    .app-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 8rem 1.5rem;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
    }

    header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(to right, #ffffff, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    header p {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    /* Grid Layout */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.75rem;
    }

    .image-card {
      background: var(--bg-secondary);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      overflow: hidden;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .image-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .image-card.selected {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent), 0 8px 24px rgba(59, 130, 246, 0.25);
    }

    .image-wrapper {
      position: relative;
      aspect-ratio: 3/2;
      overflow: hidden;
      background: #090d16;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .gallery-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    /* Watermark stylesheet overlays */
    .watermark {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transform: rotate(-25deg);
      font-size: 1.75rem;
      font-weight: 900;
      color: rgba(255, 255, 255, ${watermarkOpacity / 100});
      text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
      letter-spacing: 2px;
      white-space: nowrap;
      user-select: none;
      z-index: 2;
    }

    /* Action Overlays */
    .card-actions {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      left: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 5;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .image-card:hover .card-actions,
    .image-card.selected .card-actions {
      opacity: 1;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(11, 15, 25, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: white;
      color: black;
      transform: scale(1.1);
    }

    .select-indicator {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(11, 15, 25, 0.6);
      border: 2px solid white;
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: transparent;
      transition: all 0.2s;
    }

    .image-card.selected .select-indicator {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
    }

    .image-info {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.03);
    }

    .image-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-main);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 75%;
    }

    .rotation-badge {
      font-size: 0.75rem;
      background: rgba(255,255,255,0.05);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      color: var(--text-muted);
      display: none;
      align-items: center;
      gap: 3px;
    }

    .image-card[data-rotate="90"] .rotation-badge,
    .image-card[data-rotate="180"] .rotation-badge,
    .image-card[data-rotate="270"] .rotation-badge {
      display: flex;
    }

    /* Floating Status Footer */
    .status-bar {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(19, 28, 46, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      padding: 0.75rem 2rem;
      display: flex;
      align-items: center;
      gap: 2.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      z-index: 100;
      max-width: 90vw;
    }

    .status-count {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .status-count span b {
      color: var(--accent);
    }

    .submit-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.75rem 1.75rem;
      font-weight: 600;
      font-size: 0.95rem;
      border-radius: 9999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .submit-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    /* Lightbox Modal */
    #lightbox {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(6, 9, 15, 0.98);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
    }

    .lightbox-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      font-size: 2rem;
      color: white;
      cursor: pointer;
      z-index: 1010;
      transition: transform 0.2s;
    }

    .lightbox-close:hover {
      transform: scale(1.1);
    }

    .lightbox-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2.5rem;
      color: white;
      cursor: pointer;
      z-index: 1010;
      opacity: 0.5;
      transition: opacity 0.2s, transform 0.2s;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.03);
      border-radius: 50%;
    }

    .lightbox-arrow:hover {
      opacity: 1;
      background: rgba(255,255,255,0.08);
    }

    .lightbox-prev { left: 2rem; }
    .lightbox-next { right: 2rem; }

    .lightbox-content {
      max-width: 85vw;
      max-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    #lightbox-image {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      transition: transform 0.3s ease;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }

    .lightbox-actions {
      position: absolute;
      bottom: -4.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 1.5rem;
      align-items: center;
      z-index: 1010;
      background: rgba(19, 28, 46, 0.7);
      backdrop-filter: blur(12px);
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Submit Modal */
    #submit-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(6, 9, 15, 0.8);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-card {
      background: var(--bg-secondary);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 2.25rem;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }

    .modal-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .modal-card p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
      text-align: left;
    }

    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.85rem 1rem;
      border-radius: 10px;
      color: white;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s;
    }

    .form-input:focus {
      border-color: var(--accent);
      background: rgba(255, 255, 255, 0.07);
    }

    .form-textarea {
      resize: none;
      height: 90px;
      font-family: inherit;
    }

    .modal-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-secondary {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.05);
      color: white;
      padding: 0.85rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.08);
    }

    .btn-primary {
      flex: 1;
      background: var(--accent);
      border: none;
      color: white;
      padding: 0.85rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: var(--accent-hover);
    }
  </style>
</head>
<body>

  <!-- Security Screen Blur -->
  <div id="security-blur">
    <h2>🔒 Security Mode Active</h2>
    <p>Viewing suspended temporarily for safety. Please click below to resume.</p>
    <button onclick="resumeViewing()">Resume Proofing</button>
  </div>

  <!-- Password Lock -->
  <div id="lock-screen">
    <div class="lock-card" id="lock-card">
      <div class="lock-icon">🔒</div>
      <h2 class="lock-title">Password Required</h2>
      <p class="lock-subtitle">Please enter the security password provided by the photographer to view your proofing gallery.</p>
      <div class="input-group">
        <input type="password" id="password-input" class="lock-input" placeholder="Enter Password" onkeydown="if(event.key === 'Enter') checkPassword()">
      </div>
      <button class="lock-btn" onclick="checkPassword()">Unlock Gallery</button>
    </div>
  </div>

  <!-- Main App View -->
  <div class="app-container" id="main-content" style="${hasPassword ? 'display: none;' : ''}">
    <header>
      <h1>${title}</h1>
      <p>Select your favorite images, rotate if needed, and submit when finished.</p>
    </header>

    <div class="gallery-grid" id="gallery-grid"></div>
  </div>

  <!-- Floating Status Footer -->
  <div class="status-bar" id="status-bar" style="${hasPassword ? 'display: none;' : ''}">
    <div class="status-count">
      <span>Total: <b id="total-count">0</b></span>
      <span>Selected: <b id="selected-count">0</b></span>
      <span>Unselected: <b id="unselected-count">0</b></span>
    </div>
    <button class="submit-btn" onclick="openSubmitModal()">
      Submit Selection
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </div>

  <!-- Lightbox Modal -->
  <div id="lightbox">
    <div class="lightbox-close" onclick="closeLightbox()">✕</div>
    <div class="lightbox-arrow lightbox-prev" onclick="prevImage()">‹</div>
    <div class="lightbox-arrow lightbox-next" onclick="nextImage()">›</div>
    <div class="lightbox-content">
      <img id="lightbox-image" src="" alt="Lightbox image" />
      <div class="lightbox-actions">
        <button class="icon-btn" onclick="toggleLightboxSelection()" style="width: auto; height: auto; padding: 0.5rem 1.25rem; border-radius: 9999px; display: flex; align-items: center; gap: 6px;">
          <span id="lightbox-select-text">Select</span>
        </button>
        <button class="icon-btn" onclick="rotateLightboxImage()">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Submit Modal -->
  <div id="submit-modal">
    <div class="modal-card">
      <h3>Submit Your Selection</h3>
      <p>Confirm your selections and optional feedback. We'll generate a secure file for your photographer.</p>
      
      <div class="form-group">
        <label class="form-label">Your Name</label>
        <input type="text" id="client-name" class="form-input" placeholder="e.g., Sophia & Liam">
      </div>

      <div class="form-group">
        <label class="form-label">Notes / Instructions</label>
        <textarea id="client-notes" class="form-input form-textarea" placeholder="Any specific editing preferences, colors, crop requests, etc..."></textarea>
      </div>

      <div class="modal-buttons">
        <button class="btn-secondary" onclick="closeSubmitModal()">Cancel</button>
        <button class="btn-primary" onclick="submitSelections()">Download Selections</button>
      </div>
    </div>
  </div>

  <!-- Script block containing data and actions -->
  <script>
    // Decrypt Base64 shifted alphabet
    function descrambleBase64(base64Str, password) {
      if (!password) return base64Str;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      let shift = 0;
      for (let i = 0; i < password.length; i++) {
        shift += password.charCodeAt(i);
      }
      shift = shift % 64 || 1;

      let descrambled = '';
      for (let i = 0; i < base64Str.length; i++) {
        const char = base64Str[i];
        const idx = chars.indexOf(char);
        if (idx === -1) {
          descrambled += char;
        } else {
          // Unshift
          const unshiftedIdx = (idx - shift + 65) % 65;
          descrambled += chars[unshiftedIdx];
        }
      }
      return descrambled;
    }

    const HAS_PASSWORD = ${hasPassword};
    const PASSWORD_HASH = ${passwordHash};
    const WATERMARK_TEXT = "${watermarkText || ''}";
    
    // Core state
    const RAW_IMAGES = ${JSON.stringify(processedImages)};
    let decryptedImages = [];
    const selections = {}; // id -> { selected: boolean, rotate: 0|90|180|270 }
    let currentLightboxIndex = -1;

    // Load initial selections state
    RAW_IMAGES.forEach(img => {
      selections[img.id] = { selected: false, rotate: 0 };
    });

    // Verify Password on enter
    function checkPassword() {
      const input = document.getElementById('password-input').value;
      
      // Calculate simple hash
      let inputHash = 0;
      for (let i = 0; i < input.length; i++) {
        inputHash += input.charCodeAt(i);
      }

      if (inputHash === PASSWORD_HASH) {
        // Unlock
        decryptAllImages(input);
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('status-bar').style.display = 'flex';
        renderGrid();
      } else {
        const card = document.getElementById('lock-card');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 400);
      }
    }

    // Decrypt source logic
    function decryptAllImages(pwd) {
      decryptedImages = RAW_IMAGES.map(img => {
        const descrambledSrc = descrambleBase64(img.data, pwd);
        return {
          id: img.id,
          name: img.name,
          src: descrambledSrc
        };
      });
    }

    if (!HAS_PASSWORD) {
      // If no password, copy sources directly
      decryptedImages = RAW_IMAGES.map(img => ({
        id: img.id,
        name: img.name,
        src: img.data
      }));
      renderGrid();
    }

    // Render Grid Cards
    function renderGrid() {
      const grid = document.getElementById('gallery-grid');
      grid.innerHTML = '';

      decryptedImages.forEach(img => {
        const selState = selections[img.id];
        const card = document.createElement('div');
        card.className = 'image-card' + (selState.selected ? ' selected' : '');
        card.id = 'card-' + img.id;
        card.setAttribute('data-rotate', selState.rotate);

        // Build HTML
        card.innerHTML = \`
          <div class="image-wrapper" onclick="openLightbox(\${img.id})">
            <img src="\${img.src}" class="gallery-image" id="img-el-\${img.id}" style="transform: rotate(\${selState.rotate}deg);">
            \${WATERMARK_TEXT ? \`<div class="watermark">\${WATERMARK_TEXT}</div>\` : ''}
            
          	<div class="card-actions">
          		<div class="select-indicator" onclick="event.stopPropagation(); toggleSelect(\${img.id})">
          			<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
          		</div>
          		<div class="icon-btn" onclick="event.stopPropagation(); rotateCard(\${img.id})">
          			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          		</div>
          	</div>
          </div>
          <div class="image-info">
            <div class="image-name" title="\${img.name}">\${img.name}</div>
            <div class="rotation-badge">
              <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span id="rotation-text-\${img.id}">\${selState.rotate}°</span>
            </div>
          </div>
        \`;

        grid.appendChild(card);
      });

      updateCounters();
    }

    // Toggle Select
    function toggleSelect(id) {
      selections[id].selected = !selections[id].selected;
      
      // Update DOM
      const card = document.getElementById('card-' + id);
      if (selections[id].selected) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
      
      updateCounters();
    }

    // Rotate clockwise 90deg
    function rotateCard(id) {
      const current = selections[id].rotate;
      const next = (current + 90) % 360;
      selections[id].rotate = next;

      // Update visually
      const card = document.getElementById('card-' + id);
      const img = document.getElementById('img-el-' + id);
      card.setAttribute('data-rotate', next);
      img.style.transform = \`rotate(\${next}deg)\`;

      // Update badge
      const badgeText = document.getElementById('rotation-text-' + id);
      if (badgeText) badgeText.innerText = next + '°';
    }

    // Update floating stats
    function updateCounters() {
      const total = decryptedImages.length;
      let selected = 0;
      
      decryptedImages.forEach(img => {
        if (selections[img.id].selected) selected++;
      });

      const unselected = total - selected;

      document.getElementById('total-count').innerText = total;
      document.getElementById('selected-count').innerText = selected;
      document.getElementById('unselected-count').innerText = unselected;
    }

    // Lightbox Controls
    function openLightbox(id) {
      const index = decryptedImages.findIndex(img => img.id === id);
      if (index === -1) return;
      currentLightboxIndex = index;
      
      const img = decryptedImages[index];
      const selState = selections[img.id];

      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-image');
      
      lightboxImg.src = img.src;
      lightboxImg.style.transform = \`rotate(\${selState.rotate}deg)\`;
      
      updateLightboxBtn(img.id);

      lightbox.style.display = 'flex';
    }

    // Close Lightbox
    function closeLightbox() {
      document.getElementById('lightbox').style.display = 'none';
      renderGrid(); // Sync grid with any rotation or selection changes in lightbox
    }

    function updateLightboxBtn(id) {
      const isSelected = selections[id].selected;
      const btnText = document.getElementById('lightbox-select-text');
      btnText.innerText = isSelected ? '✓ Selected' : 'Select';
      btnText.parentElement.style.background = isSelected ? 'var(--success)' : 'rgba(11, 15, 25, 0.75)';
    }

    function toggleLightboxSelection() {
      if (currentLightboxIndex === -1) return;
      const img = decryptedImages[currentLightboxIndex];
      toggleSelect(img.id);
      updateLightboxBtn(img.id);
    }

    function rotateLightboxImage() {
      if (currentLightboxIndex === -1) return;
      const img = decryptedImages[currentLightboxIndex];
      rotateCard(img.id);

      // Apply visually in lightbox
      const lightboxImg = document.getElementById('lightbox-image');
      lightboxImg.style.transform = \`rotate(\${selections[img.id].rotate}deg)\`;
    }

    function prevImage() {
      if (currentLightboxIndex > 0) {
        openLightbox(decryptedImages[currentLightboxIndex - 1].id);
      } else {
        openLightbox(decryptedImages[decryptedImages.length - 1].id);
      }
    }

    function nextImage() {
      if (currentLightboxIndex < decryptedImages.length - 1) {
        openLightbox(decryptedImages[currentLightboxIndex + 1].id);
      } else {
        openLightbox(decryptedImages[0].id);
      }
    }

    // Modal forms
    function openSubmitModal() {
      document.getElementById('submit-modal').style.display = 'flex';
    }

    function closeSubmitModal() {
      document.getElementById('submit-modal').style.display = 'none';
    }

    function submitSelections() {
      const name = document.getElementById('client-name').value.trim() || 'Client';
      const notes = document.getElementById('client-notes').value.trim();

      const outputData = {
        galleryTitle: "${title}",
        clientName: name,
        clientNotes: notes,
        submissionDate: new Date().toISOString(),
        totalImages: decryptedImages.length,
        selectedCount: 0,
        selections: []
      };

      decryptedImages.forEach(img => {
        const item = selections[img.id];
        if (item.selected) {
          outputData.selectedCount++;
        }
        outputData.selections.push({
          fileName: img.name,
          selected: item.selected,
          rotation: item.rotate
        });
      });

      // Compile JSON
      const jsonStr = JSON.stringify(outputData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = name.replace(/\\s+/g, '_') + '_gallery_selections.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      closeSubmitModal();
      alert('Selections successfully downloaded! Please email/send this JSON file back to your photographer.');
    }

    // Anti-screenshot keyboard handler
    window.addEventListener('keydown', e => {
      // Intercept PrintScreen
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText(''); // Wipe clipboard
        alert('Screenshots are disabled for proofing security.');
      }
      
      // Block F12, Ctrl+Shift+I (Common developer modes)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault();
        alert('Developer Tools are disabled.');
      }

      // Block Ctrl+S, Ctrl+P
      if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
      }

      // Lightbox navigation
      if (document.getElementById('lightbox').style.display === 'flex') {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') closeLightbox();
      }
    });

    // Disable standard dragging & context menu
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());

    // Tab blur security logic
    window.addEventListener('blur', () => {
      document.getElementById('security-blur').style.display = 'flex';
    });

    function resumeViewing() {
      document.getElementById('security-blur').style.display = 'none';
    }
  </script>
</body>
</html>`;
};
