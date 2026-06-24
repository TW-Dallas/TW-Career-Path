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
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transition: transform 0.2s, background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #beta-feedback-trigger:hover {
            background-color: #005c91; /* var(--dark-blue) */
            transform: scale(1.05);
        }

        /* Modal Overlay Wrapper */
        #beta-feedback-modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 92, 145, 0.4); /* var(--dark-blue) with opacity */
            z-index: 10001;
            align-items: center;
            justify-content: center;
            font-family: 'OneDotCd', sans-serif;
        }

        /* Form Container */
        .beta-form-card {
            background-color: #fefaf6; /* var(--crust-base) */
            border: 3px solid #f0decc;  /* var(--crust-med) */
            border-radius: 12px;
            width: 90%;
            max-width: 450px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            box-sizing: border-box;
            position: relative;
        }

        .beta-form-title {
            font-family: 'OneDotCd-Bold', sans-serif;
            color: #005c91; /* var(--dark-blue) */
            font-size: 1.4rem;
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 2px solid #ff0000; /* var(--brand-red) */
            padding-bottom: 5px;
            text-transform: uppercase;
        }

        .beta-form-label {
            display: block;
            font-family: 'OneDotCd-Bold', sans-serif;
            color: #603913; /* var(--crust-deep) */
            margin-bottom: 5px;
            margin-top: 15px;
            font-size: 0.95rem;
        }

        .beta-form-select, .beta-form-textarea {
            width: 100%;
            box-sizing: border-box;
            background-color: #faf2e9; /* var(--crust-light) */
            border: 2px solid #f0decc;    /* var(--crust-med) */
            border-radius: 6px;
            padding: 10px;
            font-family: 'OneDotCd', sans-serif;
            color: #472b10; /* var(--crust-burnt) */
            font-size: 1rem;
        }

        .beta-form-select:focus, .beta-form-textarea:focus {
            outline: none;
            border-color: #0090e2; /* var(--brand-blue) */
        }

        .beta-form-row {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .beta-btn {
            padding: 10px 20px;
            border-radius: 50px;
            font-family: 'OneDotCd-Bold', sans-serif;
            font-size: 1rem;
            cursor: pointer;
            border: none;
            transition: opacity 0.2s;
        }
        .beta-btn:hover { opacity: 0.9; }

        .beta-btn-cancel {
            background-color: transparent;
            color: #0090e2; /* var(--brand-blue) */
            border: 2px solid #0090e2;
        }

        .beta-btn-submit {
            background-color: #0090e2; /* var(--brand-blue) */
            color: #fefaf6;
        }
    `;

    // Append Styles to Head
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Create and Inject the HTML DOM elements once the page loads
    document.addEventListener("DOMContentLoaded", function() {
        // Trigger Button
        const trigger = document.createElement('button');
        trigger.id = 'beta-feedback-trigger';
        trigger.innerHTML = `🛠️ <span>Report Issue</span>`;
        document.body.appendChild(trigger);

        // Modal Form Container
        const modal = document.createElement('div');
        modal.id = 'beta-feedback-modal';
        modal.innerHTML = `
            <div class="beta-form-card">
                <h3 class="beta-form-title">🛠️ Report Beta Issue</h3>
                
                <label class="beta-form-label">Issue Category</label>
                <select id="beta-category" class="beta-form-select">
                    <option value="Bug / Functionality">Bug (Something is broken)</option>
                    <option value="Content Typo">Content Typo / Spelling</option>
                    <option value="Formatting / Layout">Formatting / Layout Shift</option>
                    <option value="Suggestion">General Suggestion</option>
                </select>

                <label class="beta-form-label">Describe the Issue</label>
                <textarea id="beta-comments" class="beta-form-textarea" rows="4" placeholder="Be as specific as possible..."></textarea>

                <div class="beta-form-row">
                    <button id="beta-cancel" class="beta-btn beta-btn-cancel">Cancel</button>
                    <button id="beta-submit" class="beta-btn beta-btn-submit">Submit Report</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // --- INTERACTION LOGIC ---
        trigger.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.getElementById('beta-comments').value = '';
        };

        document.getElementById('beta-cancel').addEventListener('click', closeModal);

        document.getElementById('beta-submit').addEventListener('click', function() {
            const category = document.getElementById('beta-category').value;
            const comments = document.getElementById('beta-comments').value.trim();
            const submitBtn = document.getElementById('beta-submit');

            if (!comments) {
                alert("Please add a description before submitting.");
                return;
            }

            submitBtn.innerText = "Sending...";
            submitBtn.style.pointerEvents = "none";

            // Grab browser memory state
            const id = localStorage.getItem('tw_id') || 'unknown';
            const market = localStorage.getItem('tw_market') || 'unknown';
            const pageUrl = window.location.pathname.split('/').pop() || 'unknown';

            // Compile the query payload URL
            const url = `${AUTH_SCRIPT_URL}?action=feedback&market=${market}&id=${id}&pageUrl=${encodeURIComponent(pageUrl)}&category=${encodeURIComponent(category)}&comments=${encodeURIComponent(comments)}`;

            fetch(url, { method: 'GET', credentials: 'omit' })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        alert("Thank you! Your issue has been logged directly to the spreadsheet.");
                        closeModal();
                    } else {
                        alert("Failed to submit feedback. Check connection.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Submission error. Please notify your trainer.");
                })
                .finally(() => {
                    submitBtn.innerText = "Submit Report";
                    submitBtn.style.pointerEvents = "auto";
                });
        });
    });
})();