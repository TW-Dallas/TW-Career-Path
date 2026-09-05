(function() {
    // Only run if we are in a browser environment
    if (typeof document === 'undefined') return;

    const AUTH_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRM9OqqGMhDmrssDQ3MMEleWEsWbYra9xtuwlJJYLct4WeBA5j15B53Bzcmla54Pcfig/exec';

    // Rolling buffer of recent Dev Console errors & uncaught exceptions
    const devConsoleErrors = [];
    const maxErrors = 8;

    try {
        const origConsoleError = console.error;
        console.error = function(...args) {
            try {
                const msg = args.map(a => {
                    if (a instanceof Error) return a.stack || a.message;
                    if (typeof a === 'object') {
                        try { return JSON.stringify(a); } catch(_) { return String(a); }
                    }
                    return String(a);
                }).join(' ');
                devConsoleErrors.push(`[${new Date().toLocaleTimeString()}] [console.error] ${msg}`);
                if (devConsoleErrors.length > maxErrors) devConsoleErrors.shift();
            } catch (_) {}
            origConsoleError.apply(console, args);
        };

        window.addEventListener('error', function(e) {
            try {
                const src = e.filename ? e.filename.split('/').pop() : 'unknown';
                const msg = `${e.message || 'Error'} (${src}:${e.lineno || 0}:${e.colno || 0})`;
                devConsoleErrors.push(`[${new Date().toLocaleTimeString()}] [Uncaught Exception] ${msg}`);
                if (devConsoleErrors.length > maxErrors) devConsoleErrors.shift();
            } catch (_) {}
        });

        window.addEventListener('unhandledrejection', function(e) {
            try {
                const reason = e.reason ? (e.reason.stack || e.reason.message || String(e.reason)) : 'Unknown rejection';
                devConsoleErrors.push(`[${new Date().toLocaleTimeString()}] [Unhandled Rejection] ${reason}`);
                if (devConsoleErrors.length > maxErrors) devConsoleErrors.shift();
            } catch (_) {}
        });
    } catch (_) {}

    // Determine Base URL for fonts folder relative to lms_feedback.js location
    let fontsBaseUrl = 'fonts/';
    try {
        const scriptEl = document.querySelector('script[src*="lms_feedback.js"]');
        const scriptSrc = (document.currentScript && document.currentScript.src) || (scriptEl && scriptEl.src) || '';
        if (scriptSrc) {
            fontsBaseUrl = scriptSrc.replace(/\/LMS_Files\/Globals\/lms_feedback\.js.*$/, '/fonts/').replace(/\/Globals\/lms_feedback\.js.*$/, '/fonts/');
            if (!fontsBaseUrl.endsWith('/')) fontsBaseUrl += '/';
        }
    } catch (_) {}

    // Inject Styles using strictly established brand colors and Domino's typography
    const styles = `
        /* Master Domino's Font Declarations for Feedback UI */
        @font-face {
            font-family: 'PizzaPress';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Header%201.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Header 1.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'PizzaPress';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Header%201.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Header 1.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'Header1';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Header%201.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Header 1.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'Subhead1';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Subhead%201.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Subhead 1.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'Compact';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Body%20Compact.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Body Compact.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'OneDotCd-Bold';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Subhead%201.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Subhead 1.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos%20Sans%20Bold.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Bold.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'OneDotCd-Bold';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Bold.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Bold.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'OneDotCd';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Body%20Compact.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Body Compact.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos%20Sans%20Body.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Body.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'OneDotCd';
            src: url('${fontsBaseUrl}Dominos%20Sans%20Body%20Compact.ttf') format('truetype'),
                 url('${fontsBaseUrl}Dominos Sans Body Compact.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
        }

        /* Header-Embedded Trigger Button */
        #beta-feedback-trigger.in-header {
            position: static;
            background-color: rgba(254, 250, 246, 0.15);
            color: #fefaf6;
            border: 1px solid rgba(254, 250, 246, 0.3);
            padding: 0.35rem 0.85rem;
            border-radius: 20px;
            font-family: 'OneDotCd-Bold', 'Subhead1', sans-serif;
            font-size: 0.85rem;
            cursor: pointer;
            box-shadow: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-left: 8px;
            transition: all 0.2s ease;
        }

        #beta-feedback-trigger.in-header:hover {
            background-color: rgba(254, 250, 246, 0.3);
            transform: translateY(-1px);
        }

        /* Floating Fallback Trigger (Docked Right Edge Tab when no header) */
        body:has(#beta-feedback-trigger-custom) #beta-feedback-trigger {
            display: none !important;
        }

        #beta-feedback-trigger:not(.in-header) {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background-color: #0090e2;
            color: #fefaf6;
            border: 2px solid #005c91;
            border-right: none;
            padding: 8px 12px;
            border-radius: 8px 0 0 8px;
            font-family: 'OneDotCd-Bold', 'Subhead1', sans-serif;
            font-size: 0.85rem;
            cursor: pointer;
            box-shadow: -2px 4px 15px rgba(0,0,0,0.25);
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }

        #beta-feedback-trigger:not(.in-header):hover {
            padding-right: 16px;
            background-color: #0077bd;
        }

        /* Feedback Modal Overlay */
        #beta-feedback-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(4px);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
        }

        #beta-feedback-modal.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal Box */
        .beta-feedback-card {
            background-color: #fefaf6; /* var(--crust-base) */
            width: 90%;
            max-width: 480px;
            border-radius: 12px;
            border-top: 6px solid #ff0000; /* var(--brand-red) */
            box-shadow: 0 12px 30px rgba(0,0,0,0.3);
            padding: 24px;
            position: relative;
            transform: translateY(15px);
            transition: transform 0.25s ease;
            box-sizing: border-box;
        }

        #beta-feedback-modal.active .beta-feedback-card {
            transform: translateY(0);
        }

        .beta-feedback-card h3 {
            margin: 0 0 6px 0;
            font-family: 'PizzaPress', 'Header1', 'Arial Black', Impact, sans-serif;
            font-weight: normal;
            letter-spacing: 0.5px;
            color: #005c91;
            font-size: 1.35rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .beta-feedback-card p {
            margin: 0 0 14px 0;
            font-family: 'OneDotCd', 'Compact', sans-serif;
            font-weight: normal;
            color: #603913;
            font-size: 0.95rem;
            line-height: 1.35;
        }

        .beta-feedback-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 8px;
        }
        @media (max-width: 480px) {
            .beta-feedback-grid {
                grid-template-columns: 1fr;
                gap: 8px;
            }
        }

        .beta-feedback-field {
            margin-bottom: 8px;
        }

        .beta-feedback-field label {
            display: block;
            font-family: 'OneDotCd-Bold', 'Subhead1', sans-serif;
            font-weight: normal;
            font-size: 0.85rem;
            color: #005c91;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .beta-feedback-field input {
            width: 100%;
            padding: 8px 10px;
            border: 1.5px solid #c0a588;
            border-radius: 6px;
            font-family: 'OneDotCd', 'Compact', sans-serif;
            font-size: 0.95rem;
            box-sizing: border-box;
            background: #faf2e9;
            color: #472b10;
        }

        .beta-feedback-field input:focus {
            border-color: #0090e2;
            outline: none;
            background: #fff;
        }

        .beta-feedback-card label.text-label {
            display: block;
            font-family: 'OneDotCd-Bold', 'Subhead1', sans-serif;
            font-weight: normal;
            font-size: 0.85rem;
            color: #005c91;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .beta-feedback-card textarea {
            width: 100%;
            height: 90px;
            border: 1.5px solid #c0a588;
            border-radius: 6px;
            padding: 8px 10px;
            font-family: 'OneDotCd', 'Compact', sans-serif;
            font-size: 0.95rem;
            box-sizing: border-box;
            resize: vertical;
            outline: none;
            margin-bottom: 12px;
            background: #faf2e9;
            color: #472b10;
        }

        .beta-feedback-card textarea:focus {
            border-color: #0090e2;
            background: #fff;
        }

        .beta-feedback-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .beta-btn {
            padding: 8px 18px;
            border-radius: 50px;
            font-family: 'OneDotCd-Bold', 'Subhead1', sans-serif;
            font-weight: normal;
            font-size: 0.95rem;
            letter-spacing: 0.5px;
            cursor: pointer;
            border: none;
            transition: 0.2s ease;
        }

        .beta-btn-cancel {
            background-color: transparent;
            color: #603913;
        }

        .beta-btn-cancel:hover {
            background-color: #faf2e9;
        }

        .beta-btn-submit {
            background-color: #ff0000;
            color: #fefaf6;
        }

        .beta-btn-submit:hover {
            background-color: #910000;
        }

        /* Universal Mobile Blocker Overlay */
        #global-mobile-blocker {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(145deg, #005c91 0%, #002e4d 100%);
            z-index: 99999999;
            align-items: center;
            justify-content: center;
            padding: 24px;
            box-sizing: border-box;
            font-family: 'OneDotCd', 'Arial Narrow', sans-serif;
            text-align: center;
        }

        .global-mobile-card {
            background-color: #fefaf6; /* var(--crust-base) */
            border-radius: 14px;
            border-top: 6px solid #ff0000; /* var(--brand-red) */
            border-bottom: 2px solid #f0decc;
            border-left: 1px solid #f0decc;
            border-right: 1px solid #f0decc;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            max-width: 440px;
            width: 100%;
            padding: 30px 22px;
            box-sizing: border-box;
        }

        .global-mobile-card h2 {
            font-family: 'PizzaPress', 'OneDotCd-Bold', sans-serif;
            color: #005c91;
            font-size: 1.65rem;
            margin: 0 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .global-mobile-card .mobile-notice-box {
            background: rgba(255, 0, 0, 0.07);
            border-left: 4px solid #ff0000;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 16px;
            text-align: left;
        }

        .global-mobile-card .mobile-notice-title {
            color: #910000;
            font-family: 'OneDotCd-Bold', sans-serif;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .global-mobile-card .mobile-notice-desc {
            margin: 3px 0 0 0;
            font-size: 0.88rem;
            color: #603913;
            line-height: 1.35;
            font-family: 'OneDotCd', sans-serif;
        }

        .global-mobile-card p {
            font-family: 'OneDotCd', sans-serif;
            font-size: 0.95rem;
            color: #603913;
            line-height: 1.4;
            margin: 0 0 18px 0;
        }
    `;

    // Append CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    function isLmsTrainingPage() {
        const path = (window.location.pathname || '').toLowerCase();

        // 1. Explicitly exempt main landing page, lobbies, and public portals
        if (
            path === '' ||
            path === '/' ||
            path.endsWith('/') ||
            path.endsWith('/index.html') ||
            path.includes('learning_hub') ||
            path.includes('driver_rewards') ||
            path.includes('catering_hub') ||
            path.includes('trainer_portal') ||
            path.includes('trainer_dashboard') ||
            path.includes('do_dashboard') ||
            path.includes('classes') ||
            path.includes('exec_notes')
        ) {
            return false;
        }

        // 2. Strictly enforce mobile blocker ONLY on structured LMS student dashboard, training modules, and POS simulators
        const isModule = path.includes('/modules/') || path.includes('/modules2/') || /module\d+/i.test(path);
        const isPosSim = path.includes('pos_simulator');
        const isLmsDash = path.includes('lms_dashboard');

        return isModule || isPosSim || isLmsDash || document.body.hasAttribute('data-require-laptop');
    }

    const mobileBlockerHTML = isLmsTrainingPage() ? `
        <!-- Global Universal Mobile Blocker -->
        <div id="global-mobile-blocker">
            <div class="global-mobile-card">
                <div style="font-size: 3.2rem; margin-bottom: 6px; user-select: none;">💻</div>
                <h2>Store Laptop Required</h2>
                <div class="mobile-notice-box">
                    <div class="mobile-notice-title">Mobile Devices Not Supported</div>
                    <div class="mobile-notice-desc">
                        Team WOW LMS modules, interactive training videos, menu games, and POS simulators cannot be completed on mobile phones.
                    </div>
                </div>
                <p>
                    Please open this link on your store's computer or training laptop to complete your onboarding.
                </p>
                <div style="font-family: 'OneDotCd-Bold', 'Subhead1', sans-serif; color: #005c91; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
                    🍕 TEAM WOW LEARNING SYSTEM
                </div>
            </div>
        </div>
    ` : '';

    // Build Modal & Mobile Blocker HTML
    const modalHTML = `
        <button id="beta-feedback-trigger">🛠️ Report Issue</button>
        <div id="beta-feedback-modal">
            <div class="beta-feedback-card">
                <!-- FORM VIEW -->
                <div id="beta-feedback-form-view">
                    <h3>🛠️ Report Issue / Support</h3>
                    <p>Found a problem or need help? Let us know!</p>
                    <form id="beta-feedback-form">
                        <div class="beta-feedback-grid">
                            <div class="beta-feedback-field">
                                <label for="beta-feedback-name">Your Name *</label>
                                <input type="text" id="beta-feedback-name" placeholder="Your Name" required>
                            </div>
                            <div class="beta-feedback-field">
                                <label for="beta-feedback-store">Store # *</label>
                                <input type="text" id="beta-feedback-store" placeholder="e.g. 1234" required>
                            </div>
                        </div>
                        <div class="beta-feedback-field">
                            <label for="beta-feedback-email">Email Address *</label>
                            <input type="email" id="beta-feedback-email" placeholder="your.email@example.com" required>
                        </div>
                        <div class="beta-feedback-field">
                            <label for="beta-feedback-text" class="text-label">Issue Description *</label>
                            <textarea id="beta-feedback-text" placeholder="Describe what went wrong or what you need help with..." required></textarea>
                        </div>
                        <div class="beta-feedback-actions">
                            <button type="button" class="beta-btn beta-btn-cancel" id="beta-feedback-close">Cancel</button>
                            <button type="submit" class="beta-btn beta-btn-submit" id="beta-feedback-send">Submit Report</button>
                        </div>
                    </form>
                </div>

                <!-- SUCCESS CONFIRMATION VIEW (Replaces System Alert) -->
                <div id="beta-feedback-success-view" style="display: none; text-align: center; padding: 10px 4px 6px;">
                    <div style="font-size: 3rem; margin-bottom: 8px; user-select: none;">🍕</div>
                    <h3 style="justify-content: center; color: #005c91; font-size: 1.25rem; margin-bottom: 6px;">Report Submitted!</h3>
                    <p style="color: #603913; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.45;">
                        Thank you! Your feedback has been logged and sent directly to the development and support team.
                    </p>
                    <button type="button" class="beta-btn beta-btn-submit" id="beta-feedback-done-btn" style="width: 100%; font-size: 1rem; padding: 10px 0;">Done</button>
                </div>
            </div>
        </div>

        ${mobileBlockerHTML}
    `;

    function checkDeviceSupport() {
        const blocker = document.getElementById('global-mobile-blocker');
        if (!blocker) return;

        // Never block the main page, learning hub, or non-LMS pages
        if (!isLmsTrainingPage()) {
            blocker.style.display = 'none';
            document.body.style.overflow = '';
            return;
        }

        const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 850;
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (isMobileUA || (isSmallScreen && isTouch) || (isSmallScreen && window.innerHeight > window.innerWidth)) {
            blocker.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            blocker.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Append Component to Body safely after DOM is loaded
    function initFeedbackUI() {
        if (!document.body) return;
        const container = document.createElement('div');
        container.innerHTML = modalHTML;
        document.body.appendChild(container);

        checkDeviceSupport();
        window.addEventListener('resize', checkDeviceSupport);
        window.addEventListener('orientationchange', checkDeviceSupport);

        // Element References
        const trigger = document.getElementById('beta-feedback-trigger');
        const modal = document.getElementById('beta-feedback-modal');
        const closeBtn = document.getElementById('beta-feedback-close');
        const doneBtn = document.getElementById('beta-feedback-done-btn');
        const form = document.getElementById('beta-feedback-form');
        const sendBtn = document.getElementById('beta-feedback-send');
        const nameInput = document.getElementById('beta-feedback-name');
        const storeInput = document.getElementById('beta-feedback-store');
        const emailInput = document.getElementById('beta-feedback-email');
        const textArea = document.getElementById('beta-feedback-text');
        const formView = document.getElementById('beta-feedback-form-view');
        const successView = document.getElementById('beta-feedback-success-view');

        if (!trigger || !modal) return;

        function openModal() {
            if (formView) formView.style.display = 'block';
            if (successView) successView.style.display = 'none';

            // Auto-populate contact info from session storage if available
            const storedId = localStorage.getItem('tw_id') || sessionStorage.getItem('tw_id');
            const storedName = localStorage.getItem('tw_name') || sessionStorage.getItem('tw_name');
            const storedStore = localStorage.getItem('tw_store') || sessionStorage.getItem('tw_store');
            const storedEmail = localStorage.getItem('tw_email') || sessionStorage.getItem('tw_email');

            if (nameInput && !nameInput.value && storedName) nameInput.value = storedName;
            if (storeInput && !storeInput.value) {
                if (storedStore) storeInput.value = storedStore;
                else if (storedId && /^\d{4}$/.test(storedId)) storeInput.value = storedId;
            }
            if (emailInput && !emailInput.value && storedEmail) emailInput.value = storedEmail;

            modal.classList.add('active');
            setTimeout(() => {
                if (nameInput && !nameInput.value) nameInput.focus();
                else if (storeInput && !storeInput.value) storeInput.focus();
                else if (emailInput && !emailInput.value) emailInput.focus();
                else if (textArea) textArea.focus();
            }, 150);
        }

        window.openBetaFeedbackModal = openModal;
        window.toggleSupportModal = openModal; // Seamless legacy fallback

        // Support custom trigger placement (e.g. navigation strip or footer)
        const customTrigger = document.getElementById('beta-feedback-trigger-custom');
        if (customTrigger) {
            customTrigger.addEventListener('click', openModal);
            if (trigger) {
                trigger.style.display = 'none';
                trigger.remove();
            }
        } else {
            // Neatly nest trigger into Header left action group only if NOT a hero/lobby header
            const header = document.querySelector('header');
            const isHeroHeader = header && (header.querySelector('.logo-container') || header.querySelector('.tagline'));
            const headerLeft = document.querySelector('header > div:first-child');
            if (headerLeft && !isHeroHeader) {
                trigger.classList.add('in-header');
                headerLeft.appendChild(trigger);
            }
        }

        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                if (formView) formView.style.display = 'block';
                if (successView) successView.style.display = 'none';
                if (textArea) textArea.value = '';
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.innerText = "Submit Report";
                }
            }, 250);
        }

        function showSuccess() {
            if (formView) formView.style.display = 'none';
            if (successView) successView.style.display = 'block';
            if (textArea) textArea.value = '';
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerText = "Submit Report";
            }
        }

        // UI Handlers
        trigger.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        if (doneBtn) doneBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Form Submission Handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedbackText = textArea.value.trim();
            if (!feedbackText) return;

            const nameVal = nameInput ? nameInput.value.trim() : '';
            const storeVal = storeInput ? storeInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';

            sendBtn.disabled = true;
            sendBtn.innerText = "Submitting...";

            const storedId = localStorage.getItem('tw_id') || sessionStorage.getItem('tw_id');
            const id = (storedId && storedId !== 'unknown') ? storedId : (nameVal ? `${nameVal} (Store ${storeVal || 'N/A'})` : 'unknown');
            const market = localStorage.getItem('tw_market') || sessionStorage.getItem('tw_market') || 'unknown';
            
            // Build rich page location
            let pageName = window.location.pathname.split('/').pop() || window.location.href.split('/').pop() || 'Dashboard';
            if (pageName.includes('?')) pageName = pageName.split('?')[0];
            if (pageName.includes('#')) pageName = pageName.split('#')[0];
            if (!pageName) pageName = document.title || 'LMS Page';

            let stepInfo = '';
            if (typeof currentStep !== 'undefined') {
                stepInfo = ` (Step ${currentStep})`;
            } else if (document.getElementById('step-counter')) {
                stepInfo = ` (${document.getElementById('step-counter').innerText.trim()})`;
            }

            const pageLocation = `${pageName}${stepInfo}`.trim();

            let finalComments = feedbackText;
            finalComments = `--- [Reporter Details] ---\nName: ${nameVal || 'N/A'}\nStore: ${storeVal || 'N/A'}\nEmail: ${emailVal || 'N/A'}\n\n` + finalComments;
            if (devConsoleErrors.length > 0) {
                finalComments += "\n\n--- [Auto-Captured Dev Console Errors] ---\n" + devConsoleErrors.join("\n");
            }
            if (finalComments.length > 4000) {
                finalComments = finalComments.substring(0, 4000) + "\n...[truncated]";
            }

            const payload = {
                action: "feedback",
                id: id,
                userId: id,
                name: nameVal,
                storeNumber: storeVal,
                store: storeVal,
                email: emailVal,
                market: market,
                pageUrl: pageLocation,
                page: pageLocation,
                url: pageLocation,
                pageLocation: pageLocation,
                category: "Support & Bug Report",
                comments: finalComments,
                feedback: finalComments
            };

            // Use POST with text/plain & no-cors so Chrome never drops on redirect or CORS preflight
            fetch(AUTH_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            })
            .then(() => {
                showSuccess();
            })
            .catch(err => {
                console.error('Feedback Submission Failed:', err);
                // Fallback attempt with GET query params if POST failed
                const fallbackUrl = `${AUTH_SCRIPT_URL}?action=feedback&id=${encodeURIComponent(id)}&userId=${encodeURIComponent(id)}&name=${encodeURIComponent(nameVal)}&store=${encodeURIComponent(storeVal)}&email=${encodeURIComponent(emailVal)}&market=${encodeURIComponent(market)}&pageUrl=${encodeURIComponent(pageLocation)}&page=${encodeURIComponent(pageLocation)}&category=${encodeURIComponent('Support & Bug Report')}&comments=${encodeURIComponent(finalComments.substring(0, 500))}`;
                const pingImg = new Image();
                pingImg.src = fallbackUrl;
                showSuccess();
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFeedbackUI);
    } else {
        initFeedbackUI();
    }
})();
