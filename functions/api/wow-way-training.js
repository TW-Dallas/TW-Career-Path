/**
 * Cloudflare Pages Function: /api/wow-way-training
 * Edge API backed by Cloudflare D1 (tw-team-data)
 * Handles:
 *  - GET/POST action=login (Sub-50ms learner auth & progress hydration)
 *  - GET/POST action=update (Atomic module progress & session checkpoint upsert)
 *  - GET/POST action=verifyTrainerPin (Role-based trainer PIN validation)
 *  - GET/POST action=feedback (Central support ticket logging with GAS notification bridge)
 *  - GET action=getTickets (Ticket inspection)
 *  - POST action=resolveTicket (Ticket resolution)
 */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRM9OqqGMhDmrssDQ3MMEleWEsWbYra9xtuwlJJYLct4WeBA5j15B53Bzcmla54Pcfig/exec";

function corsHeaders(cacheSecs = 0) {
    const h = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json;charset=utf-8"
    };
    if (cacheSecs > 0) {
        h["Cache-Control"] = `public, max-age=${cacheSecs}, s-maxage=${cacheSecs}`;
    } else {
        h["Cache-Control"] = "no-store";
    }
    return h;
}

export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
    return handleRequest(context, 'GET');
}

export async function onRequestPost(context) {
    return handleRequest(context, 'POST');
}

async function handleRequest(context, method) {
    const { request, env } = context;
    const url = new URL(request.url);
    const headers = corsHeaders();

    let params = {};
    for (const [key, val] of url.searchParams.entries()) {
        params[key] = val;
    }

    if (method === 'POST') {
        const contentType = request.headers.get('content-type') || '';
        try {
            if (contentType.includes('application/json')) {
                const body = await request.json();
                params = { ...params, ...body };
            } else if (contentType.includes('application/x-www-form-urlencoded')) {
                const formData = await request.formData();
                for (const [key, val] of formData.entries()) {
                    params[key] = val;
                }
            } else {
                const text = await request.text();
                if (text) {
                    try {
                        const parsed = JSON.parse(text);
                        params = { ...params, ...parsed };
                    } catch (_) { }
                }
            }
        } catch (_) { }
    }

    const action = (params.action || 'login').trim();
    const db = env.DB;

    if (!db) {
        return new Response(JSON.stringify({
            success: false,
            error: "Database binding DB not found in environment."
        }), { status: 500, headers });
    }

    try {
        // ====================================================================
        // ROUTE 1: LEARNER AUTH & STATE HYDRATION (action=login)
        // ====================================================================
        if (action === 'login' || action === 'auth') {
            const inputMarket = (params.market || 'all').trim();
            const inputId = (params.id || '').trim().toLowerCase();
            const inputPass = (params.password || '').trim();

            if (!inputId || !inputPass) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "ID and password are required."
                }), { status: 400, headers });
            }

            // Executive Master Override
            if (inputId === 'admin' || inputId === 'exec' || inputPass === 'TW2026!exec' || inputPass === '9999' || inputPass === 'admin') {
                return new Response(JSON.stringify({
                    success: true,
                    firstName: "Executive",
                    lastName: "Reviewer",
                    store: "Corporate HQ",
                    role: "Executive",
                    progress: "Day 1 Mod 5",
                    completed: ["day 1 mod 1", "day 1 mod 2", "day 1 mod 3", "day 1 mod 4", "day 1 mod 5"],
                    inProgress: {}
                }), { status: 200, headers });
            }

            // Lookup learner in employees table
            const empRes = await db.prepare(`
                SELECT * FROM employees 
                WHERE LOWER(id) = ? AND (LOWER(market) = ? OR LOWER(market) = 'all markets' OR market = 'All' OR ? = 'all' OR ? = '')
                LIMIT 1
            `).bind(inputId, inputMarket.toLowerCase(), inputMarket.toLowerCase(), inputMarket.toLowerCase()).first();

            if (!empRes || String(empRes.password || '').trim().toLowerCase() !== inputPass.toLowerCase()) {
                // Fallback to legacy Apps Script in case user exists in Google Sheets
                try {
                    const fallbackUrl = `${APPS_SCRIPT_URL}?action=login&market=${encodeURIComponent(inputMarket)}&id=${encodeURIComponent(inputId)}&password=${encodeURIComponent(inputPass)}`;
                    const fbRes = await fetch(fallbackUrl);
                    if (fbRes.ok) {
                        const fbData = await fbRes.json();
                        if (fbData && fbData.success) {
                            return new Response(JSON.stringify(fbData), { status: 200, headers });
                        }
                    }
                } catch (_) { }

                if (!empRes) {
                    // Check if inputId belongs to a manager/trainer in trainer_credentials
                    try {
                        const trainerCheck = await db.prepare(`
                            SELECT * FROM trainer_credentials 
                            WHERE (LOWER(trainer_id) = ? OR LOWER(trainer_name) = ? OR (email != '' AND LOWER(email) = ?))
                              AND is_active = 1
                            LIMIT 1
                        `).bind(inputId, inputId, inputId).first();

                        if (trainerCheck) {
                            const cleanInputPass = inputPass.replace(/\D/g, '').trim();
                            const cleanTrainerPin = String(trainerCheck.trainer_pin || '').replace(/\D/g, '').trim();

                            // Trainer / Leadership Curriculum Preview Authentication
                            if (cleanInputPass && cleanInputPass === cleanTrainerPin) {
                                const isAboveStore = !!(
                                    trainerCheck.is_do || 
                                    trainerCheck.is_exec || 
                                    trainerCheck.is_admin || 
                                    trainerCheck.role === 'Executive' || 
                                    trainerCheck.role === 'Director of Ops' || 
                                    trainerCheck.role === 'Supervisor' || 
                                    trainerCheck.role === 'Training Director' || 
                                    trainerCheck.role === 'Market Leader' || 
                                    trainerCheck.store_num === 'Above-Store' || 
                                    trainerCheck.store_num === 'Exec' || 
                                    trainerCheck.store_num === 'DO'
                                );

                                const nameParts = (trainerCheck.trainer_name || 'Trainer').trim().split(' ');
                                const firstName = nameParts[0] || 'Trainer';
                                const lastName = nameParts.slice(1).join(' ');

                                return new Response(JSON.stringify({
                                    success: true,
                                    isTrainerPreview: true,
                                    isExec: isAboveStore,
                                    isAdmin: isAboveStore && !!trainerCheck.is_admin,
                                    isAboveStore: isAboveStore,
                                    firstName: firstName,
                                    lastName: lastName,
                                    store: trainerCheck.store_num || (isAboveStore ? 'Above-Store' : 'Store'),
                                    role: trainerCheck.role || (isAboveStore ? 'Executive' : 'Trainer'),
                                    authLevel: isAboveStore ? (trainerCheck.role || 'Executive Review') : 'Store Trainer',
                                    progress: isAboveStore ? 'Master Access' : 'Day 1 Mod 1',
                                    completed: isAboveStore 
                                        ? ["day 1 mod 1", "day 1 mod 2", "day 1 mod 3", "day 1 mod 4", "day 1 mod 5"] 
                                        : [],
                                    inProgress: {}
                                }), { status: 200, headers });
                            }

                            if (cleanInputPass && cleanInputPass !== cleanTrainerPin) {
                                return new Response(JSON.stringify({
                                    success: false,
                                    error: `Incorrect 4-digit PIN. Please enter your valid 4-digit Trainer PIN in the Password field.`
                                }), { status: 401, headers });
                            }

                            return new Response(JSON.stringify({
                                success: false,
                                isTrainerAccount: true,
                                error: `To access Course Preview Mode, enter your 4-digit ID and your 4-digit Trainer PIN in the Password box.`
                            }), { status: 401, headers });
                        }
                    } catch (_) {}

                    return new Response(JSON.stringify({
                        success: false,
                        error: "User ID not found for this market. New hires: please verify your Market & Employee ID with your General Manager."
                    }), { status: 401, headers });
                }

                return new Response(JSON.stringify({
                    success: false,
                    error: "Incorrect password."
                }), { status: 401, headers });
            }

            // Hydrate completed modules
            const compRows = await db.prepare(`
                SELECT module_id FROM lms_module_tracking 
                WHERE employee_id = ? AND status = 'Completed'
            `).bind(inputId).all();

            const completed = (compRows.results || []).map(r => String(r.module_id || '').toLowerCase().trim());

            // Hydrate in-progress session states
            const inProgRows = await db.prepare(`
                SELECT module_id, session_state FROM lms_module_tracking 
                WHERE employee_id = ? AND status = 'In Progress'
            `).bind(inputId).all();

            const inProgress = {};
            (inProgRows.results || []).forEach(r => {
                const modKey = String(r.module_id || '').toLowerCase().trim();
                let stateObj = {};
                try {
                    stateObj = JSON.parse(r.session_state || '{}');
                } catch (_) { }
                inProgress[modKey] = stateObj;
            });

            const role = empRes.role || empRes.authorization_level || empRes.auth_level || 'CSR';
            const authLevel = empRes.authorization_level || empRes.auth_level || empRes.role || '';
            const isExec = !!(empRes.is_exec || (role && (role.toLowerCase().includes('exec') || role.toLowerCase().includes('corp') || role.toLowerCase().includes('director') || role.toLowerCase().includes('vp') || role.toLowerCase().includes('owner') || role.toLowerCase().includes('leadership') || role.toLowerCase() === 'do')));
            const isAdmin = !!(empRes.is_admin || (role && role.toLowerCase().includes('admin')));

            return new Response(JSON.stringify({
                success: true,
                firstName: empRes.first_name || '',
                lastName: empRes.last_name || '',
                store: empRes.store_num || '',
                role: role,
                authLevel: authLevel,
                isExec: isExec,
                isAdmin: isAdmin,
                progress: empRes.progress || 'Day 1 Mod 1',
                completed: completed,
                inProgress: inProgress
            }), { status: 200, headers });
        }

        // ====================================================================
        // ROUTE 2: PROGRESS UPDATE & CHECKPOINT UPSERT (action=update / saveProgress)
        // ====================================================================
        if (action === 'update' || action === 'saveProgress' || action === 'saveGameScore') {
            const empId = (params.id || params.employeeId || params.userId || '').trim().toLowerCase();
            const market = (params.market || 'Dallas').trim();
            const moduleId = (params.module || params.moduleId || '').trim();
            const status = (params.status || 'In Progress').trim();
            const timeSpent = parseInt(params.timeSpent || params.time_spent || 0, 10) || 0;
            const score = params.score !== undefined && params.score !== null ? parseInt(params.score, 10) : null;
            const grade = (params.grade || '').trim();
            const mistakes = parseInt(params.mistakes || 0, 10) || 0;
            const trainerPin = (params.trainerPin || params.trainer_pin || '').trim();

            // Map generic gameNumber + score payload if present
            if (params.gameNumber) {
                const gNum = parseInt(params.gameNumber, 10);
                if (gNum === 1 && !params.game1Score) params.game1Score = params.score;
                if (gNum === 2 && !params.game2Score) params.game2Score = params.score;
                if (gNum === 3 && !params.game3Score) params.game3Score = params.score;
                if (gNum === 4 && !params.game4Score) params.game4Score = params.score;
            }

            const game1 = parseInt(params.game1Score || params.game_1_score || 0, 10) || 0;
            const game2 = parseInt(params.game2Score || params.game_2_score || 0, 10) || 0;
            const game3 = parseInt(params.game3Score || params.game_3_score || 0, 10) || 0;
            const game4 = parseInt(params.game4Score || params.game_4_score || 0, 10) || 0;
            const arcadeTotal = parseInt(params.arcadeTotal || params.arcade_total || 0, 10) || 0;

            let sessionStateStr = '{}';
            if (params.answers) {
                if (typeof params.answers === 'string') {
                    sessionStateStr = params.answers;
                } else {
                    sessionStateStr = JSON.stringify(params.answers);
                }
            }

            if (!empId || !moduleId) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Missing employee ID or module ID."
                }), { status: 400, headers });
            }

            // Extract Day number from module string (e.g. "Day 1 Mod 2" -> 1)
            let dayNum = 1;
            const dayMatch = moduleId.match(/day\s*(\d+)/i);
            if (dayMatch) {
                dayNum = parseInt(dayMatch[1], 10) || 1;
            }

            // If this is a Trainer / Leadership preview session, return calculated scores without polluting learner DB!
            try {
                const isTrainerSession = await db.prepare("SELECT 1 FROM trainer_credentials WHERE LOWER(trainer_id) = ? AND is_active = 1 LIMIT 1").bind(empId).first();
                if (isTrainerSession) {
                    return new Response(JSON.stringify({
                        success: true,
                        previewMode: true,
                        message: "Preview score calculated (learner tracking unchanged).",
                        moduleId,
                        score,
                        grade,
                        game1Score: game1,
                        game2Score: game2,
                        game3Score: game3,
                        game4Score: game4,
                        arcadeTotal: arcadeTotal
                    }), { status: 200, headers });
                }
            } catch (_) {}

            // Upsert into lms_module_tracking (Preserving High-Water Mark: 'Completed' cannot be downgraded)
            await db.prepare(`
                INSERT INTO lms_module_tracking (
                    market, employee_id, module_id, day, status, time_spent, score, grade, mistakes,
                    game_1_score, game_2_score, game_3_score, game_4_score, arcade_total, trainer_pin,
                    session_state, last_updated
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(market, employee_id, module_id) DO UPDATE SET
                    status = CASE WHEN lms_module_tracking.status = 'Completed' THEN 'Completed' ELSE excluded.status END,
                    time_spent = lms_module_tracking.time_spent + excluded.time_spent,
                    score = COALESCE(excluded.score, lms_module_tracking.score),
                    grade = CASE WHEN excluded.grade != '' THEN excluded.grade ELSE lms_module_tracking.grade END,
                    mistakes = CASE WHEN excluded.mistakes > 0 THEN excluded.mistakes ELSE lms_module_tracking.mistakes END,
                    game_1_score = CASE WHEN excluded.game_1_score > 0 THEN excluded.game_1_score ELSE lms_module_tracking.game_1_score END,
                    game_2_score = CASE WHEN excluded.game_2_score > 0 THEN excluded.game_2_score ELSE lms_module_tracking.game_2_score END,
                    game_3_score = CASE WHEN excluded.game_3_score > 0 THEN excluded.game_3_score ELSE lms_module_tracking.game_3_score END,
                    game_4_score = CASE WHEN excluded.game_4_score > 0 THEN excluded.game_4_score ELSE lms_module_tracking.game_4_score END,
                    arcade_total = CASE WHEN excluded.arcade_total > 0 THEN excluded.arcade_total ELSE lms_module_tracking.arcade_total END,
                    trainer_pin = CASE WHEN excluded.trainer_pin != '' THEN excluded.trainer_pin ELSE lms_module_tracking.trainer_pin END,
                    session_state = CASE WHEN excluded.session_state != '{}' THEN excluded.session_state ELSE lms_module_tracking.session_state END,
                    last_updated = CURRENT_TIMESTAMP
            `).bind(
                market, empId, moduleId, dayNum, status, timeSpent, score, grade, mistakes,
                game1, game2, game3, game4, arcadeTotal, trainerPin, sessionStateStr
            ).run();

            // If module was completed, advance employee's progress
            if (status.toLowerCase() === 'completed') {
                await db.prepare(`
                    UPDATE employees 
                    SET progress = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE LOWER(id) = ?
                `).bind(moduleId, empId).run();
            }

            return new Response(JSON.stringify({
                success: true,
                message: `${moduleId} progress recorded in Cloudflare D1.`
            }), { status: 200, headers });
        }

        // ====================================================================
        // ROUTE 2B: LEARNER PROGRESS & MODULE STATUS LOOKUP (action=getProgress / getLearnerStatus)
        // ====================================================================
        if (action === 'getProgress' || action === 'getLearnerStatus') {
            const empId = (params.id || params.employeeId || '').trim().toLowerCase();
            const moduleId = (params.module || params.moduleId || '').trim();

            if (!empId) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Employee ID is required."
                }), { status: 400, headers });
            }

            // Executive bypass
            if (empId === 'admin' || empId === 'exec') {
                return new Response(JSON.stringify({
                    success: true,
                    status: 'Completed',
                    isCompleted: true,
                    score: 100,
                    grade: 'A',
                    timeSpent: 0
                }), { status: 200, headers });
            }

            let query = `SELECT * FROM lms_module_tracking WHERE LOWER(employee_id) = ?`;
            const binds = [empId];
            if (moduleId) {
                query += ` AND LOWER(module_id) = ?`;
                binds.push(moduleId.toLowerCase());
            }
            query += ` ORDER BY last_updated DESC`;

            const trackingRows = await db.prepare(query).bind(...binds).all();
            const records = trackingRows.results || [];
            const activeRecord = records.length > 0 ? records[0] : null;

            // Also check employee's main profile progress
            const empProfile = await db.prepare(`
                SELECT id, first_name, last_name, progress, role, store_num, market 
                FROM employees 
                WHERE LOWER(id) = ? LIMIT 1
            `).bind(empId).first();

            const isCompleted = (activeRecord && String(activeRecord.status || '').toLowerCase() === 'completed') ||
                (empProfile && String(empProfile.progress || '').toLowerCase().includes(moduleId.toLowerCase()));

            let sessionState = {};
            if (activeRecord && activeRecord.session_state) {
                try {
                    sessionState = JSON.parse(activeRecord.session_state);
                } catch (_) {}
            }

            return new Response(JSON.stringify({
                success: true,
                isCompleted: !!isCompleted,
                status: activeRecord ? activeRecord.status : 'Not Started',
                sessionState: sessionState,
                currentStage: sessionState.currentStage !== undefined ? sessionState.currentStage : null,
                currentStep: sessionState.currentStep !== undefined ? sessionState.currentStep : null,
                record: activeRecord,
                records: records,
                employee: empProfile
            }), { status: 200, headers });
        }

        // ====================================================================
        // ROUTE 2C: GENERATE LEARNER CREDENTIALS (action=generateLearnerCredentials / registerLearner)
        // ====================================================================
        if (action === 'generateLearnerCredentials' || action === 'registerLearner') {
            const firstName = (params.firstName || params.first || '').trim();
            const lastName = (params.lastName || params.last || '').trim();
            const email = (params.email || '').trim();
            const store = (params.store || params.storeNum || '').trim();
            const market = (params.market || '').trim().toLowerCase();
            const role = (params.role || '').trim();

            if (!firstName || !lastName) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "First and Last Name are required."
                }), { status: 400, headers });
            }

            if (!email || !email.includes('@')) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "A valid email address is required to receive login credentials."
                }), { status: 400, headers });
            }

            if (!store) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Store number is required."
                }), { status: 400, headers });
            }

            if (!market) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please select a Market."
                }), { status: 400, headers });
            }

            if (!role) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please select a Position / Role."
                }), { status: 400, headers });
            }

            // Bridge to Google Apps Script to write to Google Sheets and dispatch welcome email
            let gasResult = null;
            try {
                const gasUrl = `${APPS_SCRIPT_URL}?action=generateLearnerCredentials&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&store=${encodeURIComponent(store)}&market=${encodeURIComponent(market)}&role=${encodeURIComponent(role)}`;
                const gasRes = await fetch(gasUrl);
                if (gasRes.ok) {
                    gasResult = await gasRes.json();
                }
            } catch (bridgeErr) {
                console.error("GAS bridge error:", bridgeErr);
            }

            if (gasResult && gasResult.success && gasResult.id) {
                // Upsert directly into Cloudflare D1 employees table for instant sub-50ms login
                try {
                    await db.prepare(`
                        INSERT INTO employees (id, password, first_name, last_name, store_num, market, role, progress, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, 'Day 1 Mod 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        ON CONFLICT(id) DO UPDATE SET
                            password = excluded.password,
                            first_name = excluded.first_name,
                            last_name = excluded.last_name,
                            store_num = excluded.store_num,
                            market = excluded.market,
                            role = excluded.role,
                            updated_at = CURRENT_TIMESTAMP
                    `).bind(
                        gasResult.id.toLowerCase(),
                        gasResult.password,
                        gasResult.firstName || firstName,
                        gasResult.lastName || lastName,
                        gasResult.store || store,
                        gasResult.market || market,
                        role
                    ).run();
                } catch (d1Err) {
                    console.error("D1 employee upsert error:", d1Err);
                }

                return new Response(JSON.stringify(gasResult), { status: 200, headers });
            }

            if (gasResult && !gasResult.success) {
                return new Response(JSON.stringify(gasResult), { status: 400, headers });
            }

            return new Response(JSON.stringify({
                success: false,
                error: "Unable to complete credential generation at this time. Please try again or contact training support."
            }), { status: 502, headers });
        }

        // ====================================================================
        // ROUTE 3: TRAINER PIN VERIFICATION (action=verifyTrainerPin / verifyPin)
        // ====================================================================
        if (action === 'verifyTrainerPin' || action === 'verifyPin') {
            const rawPin = (params.pin || '').trim();
            const cleanPin = rawPin.replace(/\D/g, '');
            const moduleName = (params.module || '').trim();
            const isMitCheck = moduleName.toLowerCase().includes('mit') ||
                (params.portal && String(params.portal).toLowerCase() === 'mit') ||
                (params.program && String(params.program).toLowerCase() === 'mit');

            if (!cleanPin) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please enter your 4-digit PIN."
                }), { status: 400, headers });
            }

            // Guard against legacy retirement PIN 1234
            if (cleanPin === '1234') {
                return new Response(JSON.stringify({
                    success: false,
                    isLegacyPin: true,
                    error: "The generic legacy PIN (1234) has been retired. Trainers must register and use their own personal Trainer PIN credentials."
                }), { status: 400, headers });
            }

            // Executive bypass
            if (cleanPin === '9999' || cleanPin === 'admin' || cleanPin === 'exec') {
                try {
                    await db.prepare(`
                        INSERT INTO credential_usage_logs (trainer_id, trainer_name, store_num, portal, action, metadata, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    `).bind('exec-bypass', 'Executive Bypass', 'Corporate HQ', isMitCheck ? 'MIT Trainer Portal' : 'Wow Way Training', moduleName ? `Module Unlock: ${moduleName}` : 'Executive Master Unlock', JSON.stringify({ module: moduleName, traineeName: params.traineeName || '' })).run();
                } catch (_) {}
                return new Response(JSON.stringify({
                    success: true,
                    trainerName: "Executive Bypass",
                    trainerStore: "Corporate HQ",
                    trainerMarket: "All Markets",
                    role: "Executive",
                    isWowWayTrainer: 1,
                    isMitTrainer: 1,
                    isGm: 1,
                    isDo: 1,
                    isAdmin: 1,
                    isExec: 1
                }), { status: 200, headers });
            }

            let trainer = await db.prepare(`
                SELECT * FROM trainer_credentials 
                WHERE trainer_pin = ? AND is_active = 1 
                LIMIT 1
            `).bind(cleanPin).first();

            // Fallback to legacy Apps Script / Google Sheets if not found in D1
            if (!trainer) {
                try {
                    const fallbackUrl = `${APPS_SCRIPT_URL}?action=verifyTrainerPin&pin=${encodeURIComponent(cleanPin)}&traineeId=${encodeURIComponent(params.traineeId || '')}&traineeName=${encodeURIComponent(params.traineeName || '')}&traineeMarket=${encodeURIComponent(params.traineeMarket || '')}&traineeStore=${encodeURIComponent(params.traineeStore || '')}&module=${encodeURIComponent(moduleName)}&elapsedTime=${encodeURIComponent(params.elapsedTime || '')}&activeTime=${encodeURIComponent(params.activeTime || '')}&mod4Score=${encodeURIComponent(params.mod4Score || '')}&startTime=${encodeURIComponent(params.startTime || '')}&endTime=${encodeURIComponent(params.endTime || '')}&userAgent=${encodeURIComponent(params.userAgent || '')}`;
                    const fbRes = await fetch(fallbackUrl);
                    if (fbRes.ok) {
                        const fbData = await fbRes.json();
                        if (fbData && fbData.success) {
                            return new Response(JSON.stringify(fbData), { status: 200, headers });
                        }
                    }
                } catch (fbErr) {
                    console.error("Apps Script fallback error:", fbErr);
                }

                return new Response(JSON.stringify({
                    success: false,
                    error: "Trainer PIN not found in database. Please register your PIN or verify entry."
                }), { status: 404, headers });
            }

            // Check authorization level
            if (isMitCheck) {
                const hasMitAuth = !!(trainer.is_mit_trainer || trainer.is_do || trainer.is_exec || trainer.is_admin);
                if (!hasMitAuth) {
                    return new Response(JSON.stringify({
                        success: false,
                        isMitUnauthorized: true,
                        error: "Your Trainer PIN is active, but your profile has not yet been authorized for the MIT Leadership Portal. Please contact Mike Jacobs to enable access."
                    }), { status: 403, headers });
                }
            } else {
                // Standard Wow Way Trainer check (Day 1-3 modules: Trainers, GMs, DOs, Execs, Admins)
                const hasTrainingAuth = !!(trainer.is_wow_way_trainer || trainer.is_gm || trainer.is_do || trainer.is_exec || trainer.is_admin);
                if (!hasTrainingAuth) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: "Your Trainer PIN is active, but is not approved for training module certification."
                    }), { status: 403, headers });
                }
            }

            // Log credential usage to Cloudflare D1
            try {
                const actionLabel = moduleName ? `Module Unlock: ${moduleName}` : (params.action_type || (isMitCheck ? 'MIT Portal Session Unlock' : 'Trainer Verification'));
                const metaObj = {
                    traineeId: params.traineeId || '',
                    traineeName: params.traineeName || '',
                    traineeStore: params.traineeStore || '',
                    module: moduleName || '',
                    elapsedTime: params.elapsedTime || ''
                };
                await db.prepare(`
                    INSERT INTO credential_usage_logs (trainer_id, trainer_name, store_num, portal, action, metadata, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                `).bind(
                    trainer.trainer_id || cleanPin,
                    trainer.trainer_name || 'Trainer',
                    trainer.store_num || '',
                    isMitCheck ? 'MIT Trainer Portal' : 'Wow Way Training',
                    actionLabel,
                    JSON.stringify(metaObj)
                ).run();
            } catch (logErr) {
                console.error("Usage log error in D1:", logErr);
            }

            // Asynchronously dispatch legacy audit log & final cert email to Google Apps Script
            if (context && typeof context.waitUntil === 'function') {
                context.waitUntil((async () => {
                    try {
                        const auditUrl = `${APPS_SCRIPT_URL}?action=verifyTrainerPin&pin=${encodeURIComponent(cleanPin)}&traineeId=${encodeURIComponent(params.traineeId || '')}&traineeName=${encodeURIComponent(params.traineeName || '')}&traineeMarket=${encodeURIComponent(params.traineeMarket || '')}&traineeStore=${encodeURIComponent(params.traineeStore || '')}&module=${encodeURIComponent(moduleName)}&elapsedTime=${encodeURIComponent(params.elapsedTime || '')}&activeTime=${encodeURIComponent(params.activeTime || '')}&mod4Score=${encodeURIComponent(params.mod4Score || '')}&startTime=${encodeURIComponent(params.startTime || '')}&endTime=${encodeURIComponent(params.endTime || '')}&userAgent=${encodeURIComponent(params.userAgent || '')}`;
                        await fetch(auditUrl);
                    } catch (_) { }
                })());
            }

            return new Response(JSON.stringify({
                success: true,
                trainerName: trainer.trainer_name,
                trainerStore: trainer.store_num,
                trainerMarket: trainer.market,
                role: trainer.role,
                isWowWayTrainer: trainer.is_wow_way_trainer,
                isMitTrainer: trainer.is_mit_trainer,
                isGm: trainer.is_gm,
                isDo: trainer.is_do,
                isAdmin: trainer.is_admin,
                isExec: trainer.is_exec
            }), { status: 200, headers });
        }

        // ====================================================================
        // ROUTE 3B: REGISTER / UPDATE TRAINER PIN (action=registerTrainerPin)
        // ====================================================================
        if (action === 'registerTrainerPin' || action === 'registerPin') {
            const trainerName = (params.name || params.trainerName || params.fullName || '').trim();
            const trainerId = (params.id || params.trainerId || params.employeeId || params.pulseId || '').trim();
            const rawPin = (params.pin || params.trainerPin || '').trim();
            const cleanPin = rawPin.replace(/\D/g, '');
            const rawStoreNum = (params.store || params.storeNum || '').trim();
            const rawMarket = (params.market || '').trim();
            const email = (params.email || '').trim();
            const phone = (params.phone || '').trim();
            const isAboveStore = !!params.isAboveStore || params.accountType === 'above' || rawStoreNum.toLowerCase() === 'above-store' || rawStoreNum.toLowerCase() === 'do';
            const requestedRole = (params.role || (isAboveStore ? 'Director of Ops' : 'Trainer')).trim();

            let reqMarket = "Dallas";
            const lowMarket = rawMarket.toLowerCase();
            if (lowMarket === "denver") reqMarket = "Denver";
            else if (lowMarket === "el paso" || lowMarket === "elpaso") reqMarket = "El Paso";
            else if (lowMarket === "la" || lowMarket === "los angeles") reqMarket = "LA";
            else if (lowMarket === "all markets" || lowMarket === "all" || lowMarket === "corporate") reqMarket = "All Markets";
            else if (rawMarket) reqMarket = rawMarket;

            if (!rawMarket) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please select a Market."
                }), { status: 400, headers });
            }

            if (!trainerName) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please enter your full name."
                }), { status: 400, headers });
            }

            if (!trainerId && !email) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please enter your Employee ID / Pulse ID."
                }), { status: 400, headers });
            }

            if (!cleanPin || cleanPin.length !== 4) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "PIN must be exactly 4 digits."
                }), { status: 400, headers });
            }

            const FORBIDDEN_PINS = new Set([
                "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999",
                "1234", "4321", "2580", "0852", "1357", "2468", "9876", "6789"
            ]);
            if (FORBIDDEN_PINS.has(cleanPin)) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "That PIN is too simple and easily guessed. Please choose a more secure 4-digit PIN."
                }), { status: 400, headers });
            }

            const cleanStoreNum = isAboveStore ? 'Above-Store' : rawStoreNum.replace(/\D/g, '').trim();
            if (!isAboveStore && !cleanStoreNum) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please enter your Store #."
                }), { status: 400, headers });
            }

            const effectiveId = trainerId || email;

            // Check if this user already has an existing account (by effectiveId or email)
            const existingUserById = await db.prepare(`
                SELECT * FROM trainer_credentials WHERE LOWER(trainer_id) = LOWER(?) LIMIT 1
            `).bind(effectiveId).first();

            const existingUserByEmail = email ? await db.prepare(`
                SELECT * FROM trainer_credentials WHERE LOWER(email) = LOWER(?) LIMIT 1
            `).bind(email).first() : null;

            const existingUser = existingUserById || existingUserByEmail;

            // Check if this PIN is already registered to a DIFFERENT trainer
            const existingPin = await db.prepare(`
                SELECT trainer_id, trainer_name, email FROM trainer_credentials 
                WHERE trainer_pin = ?
                LIMIT 1
            `).bind(cleanPin).first();

            if (existingPin) {
                const isSameUser = 
                    (existingPin.trainer_id.toLowerCase() === effectiveId.toLowerCase()) ||
                    (email && existingPin.email && existingPin.email.toLowerCase() === email.toLowerCase()) ||
                    (email && existingPin.trainer_id.toLowerCase() === email.toLowerCase()) ||
                    (existingUser && existingPin.trainer_id.toLowerCase() === existingUser.trainer_id.toLowerCase());

                if (!isSameUser) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: "This 4-digit PIN is already claimed by another team member. Please choose a unique 4-digit PIN."
                    }), { status: 409, headers });
                }
            }

            let position = String(params.position || params.role || requestedRole || '').trim();
            if (/general\s*manager/i.test(position)) position = 'General Manager';
            else if (/assistant\s*manager/i.test(position)) position = 'Assistant Manager';
            else if (/manager\s*in\s*training|mit/i.test(position)) position = 'Manager in Training';
            else if (/director\s*of\s*ops|do/i.test(position)) position = 'Director of Ops';
            else if (/admin/i.test(position)) position = 'Admin';
            else if (/exec/i.test(position)) position = 'Executive';
            else position = 'Other';

            const isAutoApprove = ['General Manager', 'Director of Ops', 'Admin', 'Executive'].includes(position);
            const assignedRole = position;
            const isMitApproved = (position === 'Director of Ops' || position === 'Executive' || position === 'Admin') ? 1 : 0;
            const isDo = (position === 'Director of Ops') ? 1 : (existingUser ? existingUser.is_do : 0);
            const isExec = (position === 'Executive') ? 1 : (existingUser ? existingUser.is_exec : 0);
            const isAdmin = (position === 'Admin') ? 1 : (existingUser ? existingUser.is_admin : 0);
            const isGm = (position === 'General Manager') ? 1 : (existingUser ? existingUser.is_gm : 0);
            const isAct = isAutoApprove ? 1 : (existingUser ? existingUser.is_active : 0);
            const isWw = isAutoApprove ? 1 : (existingUser ? existingUser.is_wow_way_trainer : 0);
            const regNote = isAutoApprove ? `Self-Registered (${assignedRole}) - Auto-Approved` : `Self-Registered (${assignedRole}) - Pending Authorization`;

            if (existingUser) {
                // If there's a duplicate old email-keyed row separate from effectiveId row, clean it up
                if (existingUserByEmail && existingUserById && existingUserByEmail.trainer_id.toLowerCase() !== existingUserById.trainer_id.toLowerCase()) {
                    await db.prepare(`DELETE FROM trainer_credentials WHERE trainer_id = ?`).bind(existingUserByEmail.trainer_id).run();
                }

                const targetRowId = existingUserById ? existingUserById.trainer_id : existingUserByEmail.trainer_id;

                await db.prepare(`
                    UPDATE trainer_credentials SET
                        trainer_id = ?,
                        trainer_name = ?,
                        trainer_pin = ?,
                        store_num = ?,
                        market = ?,
                        email = COALESCE(NULLIF(?, ''), email),
                        phone = COALESCE(NULLIF(?, ''), phone),
                        role = ?,
                        is_wow_way_trainer = ?,
                        is_mit_trainer = ?,
                        is_gm = ?,
                        is_do = ?,
                        is_admin = ?,
                        is_exec = ?,
                        is_active = ?,
                        notes = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE trainer_id = ?
                `).bind(
                    effectiveId, trainerName, cleanPin, cleanStoreNum, reqMarket,
                    email, phone, assignedRole, isWw, isMitApproved, isGm, isDo, isAdmin, isExec,
                    isAct, regNote, targetRowId
                ).run();
            } else {
                await db.prepare(`
                    INSERT INTO trainer_credentials (
                        trainer_id, trainer_name, trainer_pin, store_num, market,
                        email, phone, role, is_wow_way_trainer, is_mit_trainer,
                        is_gm, is_do, is_admin, is_exec, is_active, notes, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `).bind(
                    effectiveId, trainerName, cleanPin, cleanStoreNum, reqMarket,
                    email, phone, assignedRole, isWw, isMitApproved, isGm, isDo, isAdmin, isExec, isAct, regNote
                ).run();
            }

            // Notify Mike via Apps Script proxy
            if (context && typeof context.waitUntil === 'function') {
                context.waitUntil((async () => {
                    try {
                        const alertUrl = `${APPS_SCRIPT_URL}?action=sendTrainerPinRequestEmail&trainerName=${encodeURIComponent(trainerName)}&pulseId=${encodeURIComponent(effectiveId)}&storeNum=${encodeURIComponent(cleanStoreNum)}&market=${encodeURIComponent(reqMarket)}&pin=${encodeURIComponent(cleanPin)}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(assignedRole)}&isAboveStore=${isAboveStore ? 'true' : 'false'}`;
                        await fetch(alertUrl);
                    } catch (_) {}
                })());
            }

            if (!isAutoApprove) {
                return new Response(JSON.stringify({
                    success: true,
                    isPending: true,
                    message: "Registration submitted! Your account is awaiting authorization from the Wow Way development team.",
                    trainerName,
                    trainerId: effectiveId,
                    storeNum: cleanStoreNum,
                    market: reqMarket,
                    role: assignedRole,
                    isWowWayTrainer: 0,
                    isAboveStore
                }), { status: 200, headers });
            }

            return new Response(JSON.stringify({
                success: true,
                isPending: false,
                message: isAboveStore 
                    ? `Above-Store credentials registered for ${trainerName}! PIN ${cleanPin} is active.`
                    : `Trainer PIN (${cleanPin}) registered successfully!`,
                trainerName,
                trainerId: effectiveId,
                storeNum: cleanStoreNum,
                market: reqMarket,
                role: assignedRole,
                isWowWayTrainer: 1,
                isAboveStore
            }), { status: 200, headers });
        }

        // ====================================================================
        // ROUTE 3B: TRAINER PIN RECOVERY (action=recoverTrainerPin / forgotPin)
        // ====================================================================
        if (action === 'recoverTrainerPin' || action === 'forgotPin') {
            const query = (params.query || params.id || params.email || params.name || '').trim();
            if (!query) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Please enter your Pulse Employee ID, Email, or Full Name."
                }), { status: 400, headers });
            }

            // Forward to Apps Script so existing email dispatch triggers
            if (context && typeof context.waitUntil === 'function') {
                context.waitUntil(
                    fetch(`${APPS_SCRIPT_URL}?action=recoverTrainerPin&query=${encodeURIComponent(query)}`).catch(() => {})
                );
            }

            // Look up in Cloudflare D1
            const trainer = await db.prepare(`
                SELECT trainer_id, trainer_name, trainer_pin, store_num, market, email 
                FROM trainer_credentials 
                WHERE LOWER(trainer_id) = ? OR LOWER(email) = ? OR LOWER(trainer_name) = ?
                LIMIT 1
            `).bind(query.toLowerCase(), query.toLowerCase(), query.toLowerCase()).first();

            if (trainer) {
                // Record pending PIN reset request in D1 for Mike's Admin Hub review
                try {
                    await db.prepare(`
                        INSERT INTO credential_reset_requests (trainer_id, trainer_name, email, store_num, status, created_at)
                        VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
                    `).bind(
                        trainer.trainer_id || query,
                        trainer.trainer_name || 'Trainer',
                        trainer.email || '',
                        trainer.store_num || ''
                    ).run();
                } catch (recErr) {
                    console.error("Reset request log error:", recErr);
                }

                let maskedEmail = trainer.email || '';
                if (maskedEmail && maskedEmail.includes('@')) {
                    const parts = maskedEmail.split('@');
                    maskedEmail = (parts[0].length <= 2 ? parts[0][0] + '***' : parts[0][0] + '***' + parts[0].slice(-1)) + '@' + parts[1];
                }
                return new Response(JSON.stringify({
                    success: true,
                    message: maskedEmail 
                        ? `Your PIN recovery details have been dispatched to ${maskedEmail}.`
                        : "Your PIN recovery details have been dispatched to your store email.",
                    maskedEmail: maskedEmail
                }), { status: 200, headers });
            }

            // Fallback to Apps Script if trainer only exists in legacy Google Sheet
            try {
                const fbRes = await fetch(`${APPS_SCRIPT_URL}?action=recoverTrainerPin&query=${encodeURIComponent(query)}`);
                const fbData = await fbRes.json();
                return new Response(JSON.stringify(fbData), { status: 200, headers });
            } catch (_) {
                return new Response(JSON.stringify({
                    success: false,
                    error: `No registered trainer record found matching "${query}". Please verify your Pulse ID or register a new PIN.`
                }), { status: 404, headers });
            }
        }

        // ====================================================================
        // ROUTE 4: SUPPORT TICKETS & FEEDBACK (action=feedback)
        // ====================================================================
        if (action === 'feedback') {
            const ticketId = params.ticketId || `WOW-${Math.floor(1000 + Math.random() * 9000)}`;
            const market = (params.market || 'unknown').trim();
            const reporterName = (params.name || 'Anonymous').trim();
            const storeNum = (params.store || 'N/A').trim();
            const email = (params.email || '').trim();
            const employeeId = (params.employeeId || '').trim();
            const locationPage = (params.pageLocation || params.page || 'unknown').trim();
            const category = (params.category || 'Support & Bug Report').trim();
            const comments = (params.comments || '').trim();

            await db.prepare(`
                INSERT INTO lms_support_tickets (
                    ticket_id, market, reporter_name, store_num, email,
                    employee_id, location_page, category, comments, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open', CURRENT_TIMESTAMP)
            `).bind(ticketId, market, reporterName, storeNum, email, employeeId, locationPage, category, comments).run();

            // Asynchronously dispatch to Apps Script so Gmail confirmation & admin alerts trigger
            context.waitUntil(
                fetch(APPS_SCRIPT_URL + '?action=feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'feedback',
                        ticketId,
                        name: reporterName,
                        store: storeNum,
                        email,
                        employeeId,
                        market,
                        pageLocation,
                        category,
                        comments
                    })
                }).catch(() => { })
            );

            return new Response(JSON.stringify({
                success: true,
                ticketId: ticketId,
                message: "Ticket recorded in D1 and queued for dispatch."
            }), { status: 200, headers });
        }

        // ====================================================================
        // ROUTE 5: PULL TICKETS (action=getTickets)
        // ====================================================================
        if (action === 'getTickets') {
            const limit = parseInt(params.limit || 15, 10);
            const statusFilter = (params.status || '').trim();

            let query = "SELECT * FROM lms_support_tickets";
            const bindings = [];

            if (statusFilter) {
                query += " WHERE status = ?";
                bindings.push(statusFilter);
            }
            query += " ORDER BY created_at DESC LIMIT ?";
            bindings.push(limit);

            const { results } = await db.prepare(query).bind(...bindings).all();

            return new Response(JSON.stringify({
                success: true,
                count: results ? results.length : 0,
                tickets: results || []
            }), { status: 200, headers });
        }

        // Unknown action fallback
        return new Response(JSON.stringify({
            success: false,
            error: `Action '${action}' is not supported.`
        }), { status: 400, headers });

    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            error: err.message || "Internal server error"
        }), { status: 500, headers });
    }
}
