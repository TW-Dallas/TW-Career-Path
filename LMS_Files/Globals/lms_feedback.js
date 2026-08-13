(function() {
    // Only run if we are in a browser environment
    if (typeof document === 'undefined') return;

    const AUTH_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRM9OqqGMhDmrssDQ3MMEleWEsWbYra9xtuwlJJYLct4WeBA5j15B53Bzcmla54Pcfig/exec';

    // Inject Styles using strictly established brand colors
    const styles = `
        /* Floating Trigger Button */
        #beta-feedback-trigger {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0090e2; /* var(--brand-blue) */
            color: #fefaf6;            /* var(--crust-base) */
            border: 2px solid #005c91;  /* var(--dark-blue) */
            padding: 10px 18px;
            border-radius: 50px;
            font-family: 'OneDotCd-Bold', sans-serif;
            font-size: 0.95rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }

        #beta-feedback-trigger:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,144,226,0.4);
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
            font-family: 'OneDotCd-Bold', sans-serif;
            color: #005c91;
            font-size: 1.25rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .beta-feedback-card p {
            margin: 0 0 16px 0;
            color: #603913;
            font-size: 0.85rem;
            line-height: 1.4;
        }

        .beta-feedback-card label {
            display: block;
            font-family: 'OneDotCd-Bold', sans-serif;
            font-size: 0.85rem;
            color: #472b10;
            margin-bottom: 4px;
        }

        .beta-feedback-card textarea {
            width: 100%;
            height: 100px;
            border: 2px solid #f0decc;
            border-radius: 6px;
            padding: 10px;
            font-family: inherit;
            font-size: 0.9rem;
            box-sizing: border-box;
            resize: vertical;
            outline: none;
            margin-bottom: 16px;
        }

        .beta-feedback-card textarea:focus {
            border-color: #0090e2;
        }

        .beta-feedback-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .beta-btn {
            padding: 8px 18px;
            border-radius: 50px;
            font-family: 'OneDotCd-Bold', sans-serif;
            font-size: 0.9rem;
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
    `;

    // Append CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Build Modal HTML
    const modalHTML = `
        <button id="beta-feedback-trigger">🛠️ Report Issue</button>
        <div id="beta-feedback-modal">
            <div class="beta-feedback-card">
                <h3>🛠️ Feedback / Bug Report</h3>
                <p>Spotted a typo, broken button, or layout issue? Let us know!</p>
                <form id="beta-feedback-form">
                    <label for="beta-feedback-text">Issue Description:</label>
                    <textarea id="beta-feedback-text" placeholder="Describe what went wrong or how to improve this step..." required></textarea>
                    <div class="beta-feedback-actions">
                        <button type="button" class="beta-btn beta-btn-cancel" id="beta-feedback-close">Cancel</button>
                        <button type="submit" class="beta-btn beta-btn-submit" id="beta-feedback-send">Submit Report</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Append Component to Body safely after DOM is loaded
    function initFeedbackUI() {
        if (!document.body) return;
        const container = document.createElement('div');
        container.innerHTML = modalHTML;
        document.body.appendChild(container);

        // Element References
        const trigger = document.getElementById('beta-feedback-trigger');
        const modal = document.getElementById('beta-feedback-modal');
        const closeBtn = document.getElementById('beta-feedback-close');
        const form = document.getElementById('beta-feedback-form');
        const sendBtn = document.getElementById('beta-feedback-send');
        const textArea = document.getElementById('beta-feedback-text');

        if (!trigger || !modal) return;

        // UI Handlers
        trigger.addEventListener('click', () => modal.classList.add('active'));
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // Form Submission Handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedbackText = textArea.value.trim();
            if (!feedbackText) return;

            sendBtn.disabled = true;
            sendBtn.innerText = "Submitting...";

            const id = localStorage.getItem('tw_id') || 'unknown';
            const market = localStorage.getItem('tw_market') || 'unknown';
            const page = window.location.pathname.split('/').pop() || 'Dashboard';
            const currentStepNum = typeof currentStep !== 'undefined' ? ` (Step ${currentStep})` : '';
            const pageLocation = `${page}${currentStepNum}`;

            const url = `${AUTH_SCRIPT_URL}?action=feedback&id=${encodeURIComponent(id)}&market=${encodeURIComponent(market)}&pageUrl=${encodeURIComponent(pageLocation)}&category=${encodeURIComponent('Beta Issue Report')}&comments=${encodeURIComponent(feedbackText)}`;

            fetch(url, { method: 'GET', credentials: 'omit' })
            .then(() => {
                alert('Thank you! Your feedback has been submitted successfully.');
                textArea.value = '';
                modal.classList.remove('active');
            })
            .catch(err => {
                console.error('Feedback Submission Failed:', err);
                alert('Could not submit feedback at this time. Please try again.');
            })
            .finally(() => {
                sendBtn.disabled = false;
                sendBtn.innerText = "Submit Report";
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFeedbackUI);
    } else {
        initFeedbackUI();
    }
})();
