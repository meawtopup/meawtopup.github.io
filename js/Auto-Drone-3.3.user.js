// ==UserScript==
// @name         Auto Drone 3.3 | TDD
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Ticket & Farm
// @author       MobyEX
// @include      https://www.torrentdd.*/chat.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentdd.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.location.pathname.includes('/chat.php')) return;

    let autoCheckTimeout = null;
    let ticketCheckTimer = null;
    let ticketCountdownInterval = null;
    let farmCheckTimer = null;
    let farmCountdownTimer = null;
    let isWorking = false;
    let reloadTimer = null;

    const BTN_BASE_STYLE = {
        padding: '3px 8px',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        marginRight: '5px'
    };

    function applyStyle(el, color, extra = {}) {
        if (!el) return;
        Object.assign(el.style, BTN_BASE_STYLE, { background: color }, extra);
    }

    function clearAllTimers() {
        if (autoCheckTimeout) clearTimeout(autoCheckTimeout);
        if (ticketCheckTimer) clearTimeout(ticketCheckTimer);
        if (ticketCountdownInterval) clearInterval(ticketCountdownInterval);
        if (farmCheckTimer) clearTimeout(farmCheckTimer);
        if (reloadTimer) clearInterval(reloadTimer);
        if (farmCountdownTimer) {
            clearInterval(farmCountdownTimer);
            farmCountdownTimer = null;
        }
    }

    async function checkEligibility() {
        try {
            const response = await fetch('ticket.php');
            const html = await response.text();

            const regex = /CN(?:&gt;|>).*?class="text-success ml-2 mr-2">(\d+)<\/span>/s;
            const match = html.match(regex);

            if (match) {
                const count = parseInt(match[1]);
                return count >= 5;
            }
        } catch (e) {
            console.error("❌ Fetch Error:", e);
        }
        return false;
    }

    async function fetchFarmDoc() {
        try {
            const res = await fetch('/farm.php?t=' + Date.now());
            const text = await res.text();
            return new DOMParser().parseFromString(text, 'text/html');
        } catch (e) { return document; }
    }

    function getHarvestableIDs(doc) {
        let ids = [];
        for (let i = 1; i <= 9; i++) {
            if (doc.querySelector(`[onclick*="action=store&ground=${i}"]`)) ids.push(i);
        }
        return ids;
    }

    function getPlantableIDs(doc) {
        let ids = [];
        for (let i = 1; i <= 9; i++) {
            if (doc.querySelector(`[onclick*="action=seed&ground=${i}"]`)) ids.push(i);
        }
        return ids;
    }

    function getBuyableIDs(doc) {
        let ids = [];
        for (let i = 1; i <= 9; i++) {
            if (doc.querySelector(`[onclick*="action=buy&ground=${i}"]`)) ids.push(i);
        }
        return ids;
    }

    async function processActions(ids, actionType) {
        for (let id of ids) {
            await fetch(`/farm.php?action=${actionType}&ground=${id}`);
            await new Promise(r => setTimeout(r, 500));
        }
    }

    function startReloadCountdown(fromSource = 'farm') {
        if (fromSource === 'ticket' && isWorking) return;

        clearAllTimers();
        if (reloadTimer) clearInterval(reloadTimer);

        const container = document.getElementById('tdd-farm-bot-item-content');
        if (!container) { location.reload(); return; }

        let seconds = 10;
        const updateUI = () => {
            container.innerHTML = `<span style="color:#ffeb3b; font-weight:bold;">⚠️ รีโหลดใน ${seconds} (จาก: ${fromSource}) ⚠️</span>`;
            if (seconds <= 0) {
                clearInterval(reloadTimer);
                location.reload();
            }
            seconds--;
        };
        updateUI();
        reloadTimer = setInterval(updateUI, 1000);
    }

    async function initBot() {
        clearAllTimers();
        const oldContainer = document.getElementById('tdd-farm-bot-item');
        if (oldContainer) oldContainer.remove();

        const container = document.createElement('li');
        container.id = 'tdd-farm-bot-item';
        container.className = 'nav-item d-flex align-items-center';

        const content = document.createElement('div');
        content.id = 'tdd-farm-bot-item-content';
        content.style = 'display: flex; align-items: center; gap: 6px; margin-right: 8px; font-size: 12px; color: #fff;';
        container.appendChild(content);

        const tBtn = document.createElement('button');
        const tAutoBtn = document.createElement('button');
        applyStyle(tBtn, '#17a2b8');
        tBtn.innerHTML = '⏳ เตรียมการ...';
        let isTicketAuto = localStorage.getItem('tdTicketAuto') === 'true';

        applyStyle(tAutoBtn, isTicketAuto ? '#ff9800' : '#6c757d');
        tAutoBtn.innerHTML = isTicketAuto ? '🎫 โดรน: เปิด' : '🎫 โดรน: ปิด';
        tAutoBtn.onclick = () => {
            isTicketAuto = !isTicketAuto;
            localStorage.setItem('tdTicketAuto', isTicketAuto);
            applyStyle(tAutoBtn, isTicketAuto ? '#ff9800' : '#6c757d');
            tAutoBtn.innerHTML = isTicketAuto ? '🎫 โดรน: เปิด' : '🎫 โดรน: ปิด';
            if (isTicketAuto) checkTicketStatus();
        };

        tBtn.onclick = () => {
            if (isWorking) return;
            const savedNextCheck = localStorage.getItem('tdNextTicketCheck');
            if (savedNextCheck || ticketCountdownInterval) {
                console.log("Manual Reset: Clearing ticket countdown.");
                localStorage.removeItem('tdNextTicketCheck');
                location.reload();
                return;
            }
            if (tBtn.getAttribute('data-ready') === 'true') collectTicket();
            else checkTicketStatus();
        };

        async function checkTicketStatus() {
            if (ticketCheckTimer) clearTimeout(ticketCheckTimer);
            if (ticketCountdownInterval) clearInterval(ticketCountdownInterval);

            const savedNextCheck = localStorage.getItem('tdNextTicketCheck');
            if (savedNextCheck && Date.now() < parseInt(savedNextCheck)) {
                const diff = parseInt(savedNextCheck) - Date.now();
                const label = diff > 300000 ? "รอเช็ค 3HR ในอีก" : "เตรียมเก็บตั๋ว";
                runTicketCountdown(parseInt(savedNextCheck), label);
                return;
            }

            applyStyle(tBtn, '#17a2b8');
            tBtn.innerHTML = '⏳ กำลังเช็คสถานะ...';
            tBtn.disabled = true;

            try {
                const res = await fetch('/ticket.php');
                const text = await res.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const readyBtn = doc.querySelector('button.get-ticket');
                const infoText = doc.querySelector('.text-danger.f12');

                let already = infoText?.innerText.includes('รับตั๋วสุ่มกาชาไปแล้ว');

                if (already) {
                    tBtn.innerHTML = '🎫 เก็บตั๋วรอบนี้ไปแล้ว';
                    applyStyle(tBtn, '#6c757d');
                    tBtn.disabled = false;
                    await scheduleNextTicketCheck(true);
                }
                else {
                    const isEligible = await checkEligibility();
                    if (isEligible) {
                        let status = readyBtn ? `พร้อมเก็บ ${readyBtn.innerText.match(/(\d+)/)?.[1] || ''} ชิ้น` : 'ไม่มีตั๋วให้เก็บ';
                        tBtn.innerHTML = `🎫 ${status}`;
                        applyStyle(tBtn, readyBtn ? '#28a745' : '#dc3545');
                        tBtn.setAttribute('data-ready', readyBtn ? 'true' : 'false');
                        tBtn.disabled = false;
                        if (readyBtn && isTicketAuto && !isWorking) collectTicket();
                    } else {
                        tBtn.innerHTML = '🎫 เงื่อนไข 3HR ไม่ครบ';
                        applyStyle(tBtn, '#dc3545');
                        tBtn.disabled = false;

                        const nextCheckTime = Date.now() + 900000; 
                        localStorage.setItem('tdNextTicketCheck', nextCheckTime);
                        runTicketCountdown(nextCheckTime, "รอเช็ค 3HR ในอีก");
                    }
                }
            } catch (e) {
                tBtn.innerHTML = '🎫 ข้อผิดพลาด';
                applyStyle(tBtn, '#dc3545');
                tBtn.disabled = false;
            }
        }

        function collectTicket() {
            if (isWorking) return;
            if (!checkEligibility()) {
                isWorking = false;
                checkTicketStatus();
                return;
            }

            isWorking = true;
            tBtn.disabled = true;
            tBtn.innerHTML = '🎫 กำลังเก็บตั๋ว...';

            const safetyTimeout = setTimeout(() => {
                if (isWorking) {
                    isWorking = false;
                    checkTicketStatus();
                    console.log("Ticket safety timeout reached.");
                }
            }, 8000);

            let iframe = document.getElementById('tdd-ticket-iframe') || document.createElement('iframe');
            iframe.id = 'tdd-ticket-iframe';
            iframe.style.display = 'none';
            if (!iframe.parentNode) document.body.appendChild(iframe);

            iframe.onload = () => {
                try {
                    const idoc = iframe.contentDocument || iframe.contentWindow.document;
                    const btn = idoc.querySelector('button.get-ticket');

                    if (btn) {
                        btn.click();
                        localStorage.removeItem('tdNextTicketCheck');
                        setTimeout(() => {
                            clearTimeout(safetyTimeout);
                            isWorking = false;
                            startReloadCountdown('ticket');
                        }, 1500);
                    } else {
                        clearTimeout(safetyTimeout);
                        isWorking = false;
                        checkTicketStatus();
                    }
                } catch (e) {
                    clearTimeout(safetyTimeout);
                    isWorking = false;
                    startReloadCountdown('ticket');
                }
            };
            iframe.src = '/ticket.php';
        }

        function runTicketCountdown(targetTimestamp, label = "รอเช็คตั๋ว") {
            if (ticketCountdownInterval) clearInterval(ticketCountdownInterval);

            ticketCountdownInterval = setInterval(() => {
                const remaining = Math.ceil((targetTimestamp - Date.now()) / 1000);
                if (remaining <= 0) {
                    clearInterval(ticketCountdownInterval);
                    localStorage.removeItem('tdNextTicketCheck'); 
                    checkTicketStatus();
                } else {
                    const m = Math.floor(remaining / 60);
                    const s = remaining % 60;
                    if (label.includes("เตรียม")) {
                        tBtn.innerHTML = `🎫 ${label}: ${remaining}s`;
                        applyStyle(tBtn, '#ff9800');
                    } else {
                        tBtn.innerHTML = `🎫 ${label}: ${m}:${s.toString().padStart(2, '0')}`;
                        applyStyle(tBtn, '#6c757d');
                    }
                }
            }, 1000);
        }

        async function scheduleNextTicketCheck(isAlreadyCollected) {
            if (ticketCheckTimer) clearTimeout(ticketCheckTimer);
            if (ticketCountdownInterval) clearInterval(ticketCountdownInterval);

            if (!isAlreadyCollected) {
                const nextCheckTime = Date.now() + 900000;
                localStorage.setItem('tdNextTicketCheck', nextCheckTime);
                runTicketCountdown(nextCheckTime, "รอเช็ค 3HR ในอีก");
                return;
            }

            const now = new Date();
            let target = new Date(now);

            if (now.getHours() < 12) {
                target.setHours(12, 0, 5, 0);
            } else {
                target.setDate(target.getDate() + 1);
                target.setHours(0, 0, 5, 0);
            }

            const diff = target.getTime() - now.getTime();
            const fiveMinutes = 5 * 60 * 1000;

            if (diff <= fiveMinutes) {
                runTicketCountdown(target.getTime(), "เตรียมเก็บตั๋ว");
            } else {
                const h = target.getHours().toString().padStart(2, '0');
                const m = target.getMinutes().toString().padStart(2, '0');
                tBtn.innerHTML = `🎫 รอบถัดไป ${h}:${m}`;
                applyStyle(tBtn, '#6c757d');

                ticketCheckTimer = setTimeout(() => {
                    scheduleNextTicketCheck(isAlreadyCollected);
                }, diff - fiveMinutes);
            }
        }

        const fStatusBtn = document.createElement('button');
        const fAutoBtn = document.createElement('button');
        let isFarmAuto = localStorage.getItem('tdFarmAuto') === 'true';

        applyStyle(fAutoBtn, isFarmAuto ? '#ff9800' : '#6c757d');
        fAutoBtn.innerHTML = isFarmAuto ? '🌾 โดรน: เปิด' : '🌾 โดรน: ปิด';

        function toggleFarmAuto(state) {
            isFarmAuto = state;
            localStorage.setItem('tdFarmAuto', isFarmAuto);
            applyStyle(fAutoBtn, isFarmAuto ? '#ff9800' : '#6c757d');
            fAutoBtn.innerHTML = isFarmAuto ? '🌾 โดรน: เปิด' : '🌾 โดรน: ปิด';
        }

        fAutoBtn.onclick = async () => {
            if (fAutoBtn.disabled) return;
            if (!isFarmAuto) {
                toggleFarmAuto(true);

                fAutoBtn.disabled = true;
                const doc = await fetchFarmDoc();
                const moneyEl = doc.getElementById('money');
                const currentZen = moneyEl ? parseInt(moneyEl.innerText.replace(/,/g, ''), 10) || 0 : 0;

                if (currentZen < 25000) {
                    alert('❌ Zen ไม่พอ (ต้องมีขั้นต่ำ 25,000 Zen)');
                    toggleFarmAuto(false);
                } else {
                    checkFarmStatus();
                }
                fAutoBtn.disabled = false;
            } else {
                toggleFarmAuto(false);
            }
        };

        fStatusBtn.onclick = () => {
            if (isWorking || fStatusBtn.disabled) return;
            executeFarm();
        };

        async function checkFarmStatus() {
            if (isWorking) {
                fStatusBtn.innerHTML = '⏳ รอคิว (โดรนตั๋วทำงานอยู่)...';
                if (farmCheckTimer) clearTimeout(farmCheckTimer);
                farmCheckTimer = setTimeout(checkFarmStatus, 5000);
                return;
            }

            if (farmCheckTimer) clearTimeout(farmCheckTimer);
            if (farmCountdownTimer) {
                clearInterval(farmCountdownTimer);
                farmCountdownTimer = null;
            }

            fStatusBtn.disabled = true;
            applyStyle(fStatusBtn, '#17a2b8');
            fStatusBtn.innerHTML = '⏳ กำลังเช็คแปลง...';

            try {
                const doc = await fetchFarmDoc();
                const hIds = getHarvestableIDs(doc);
                const pIds = getPlantableIDs(doc);
                const buyIds = getBuyableIDs(doc);

                if (buyIds.length === 9) {
                    fStatusBtn.innerHTML = '🌾 ยังไม่ได้ซื้อแปลงปลูก';
                    applyStyle(fStatusBtn, '#6c757d');
                    fStatusBtn.disabled = true;
                    toggleFarmAuto(false);
                    return;
                }
                let readyToWork = (hIds.length > 0 || pIds.length > 0);

                if (readyToWork && isFarmAuto) {
                    executeFarm();
                } else {
                    (doc);
                }
            } catch (e) {
                fStatusBtn.innerHTML = '🌾 ข้อผิดพลาดเช็คแปลง';
                applyStyle(fStatusBtn, '#dc3545');
                fStatusBtn.disabled = false;
            }
        }

        async function executeFarm() {
            if (isWorking) return;
            isWorking = true;
            fStatusBtn.disabled = true;
            fStatusBtn.innerHTML = '⏳ กำลังทำงาน...';
            applyStyle(fStatusBtn, '#17a2b8');

            try {
                let currentDoc = await fetchFarmDoc();

                let harvestIDs = getHarvestableIDs(currentDoc);
                if (harvestIDs.length > 0) {
                    fStatusBtn.innerHTML = `⏳ กำลังเก็บ ${harvestIDs.length} แปลง...`;
                    await processActions(harvestIDs, 'store');
                    await new Promise(r => setTimeout(r, 1500));
                    currentDoc = await fetchFarmDoc();
                }

                let plantIDs = getPlantableIDs(currentDoc);
                const moneyEl = currentDoc.getElementById('money');
                const currentZen = moneyEl ? parseInt(moneyEl.innerText.replace(/,/g, ''), 10) || 0 : 0;

                if (plantIDs.length > 0) {
                    if (currentZen < 25000) {
                        toggleFarmAuto(false);
                        fStatusBtn.innerHTML = '⚠️ เงินไม่พอปลูก (ปิดออโต้)';
                        applyStyle(fStatusBtn, '#dc3545');
                    } else {
                        fStatusBtn.innerHTML = `⏳ กำลังปลูก ${plantIDs.length} แปลง...`;
                        await processActions(plantIDs, 'seed');
                    }
                }

                fStatusBtn.innerHTML = '🌾 ทำฟาร์มเสร็จสิ้น';
                applyStyle(fStatusBtn, '#28a745');
                isWorking = false;

                startReloadCountdown('farm');

            } catch (err) {
                console.error(err);
                isWorking = false;
                fStatusBtn.disabled = false;
                checkFarmStatus();
            }
        }
        
        function scheduleNextFarmCheck(doc) {
            let maxElapsedSeconds = -1;
            const TARGET_SECONDS = (6 * 3600) + 5;
            const CHECKPOINTS = [18000, 14400, 10800, 7200, 3600, 300]; 

            doc.querySelectorAll('.f10').forEach(el => {
                const m = el.innerText.match(/\((\d+)\s*วัน\)\s*(\d+):(\d+):(\d+)/);
                if (m) {
                    const s = (parseInt(m[1]) * 86400) + (parseInt(m[2]) * 3600) + (parseInt(m[3]) * 60) + parseInt(m[4]);
                    if (s > maxElapsedSeconds) maxElapsedSeconds = s;
                }
            });

            const hIds = getHarvestableIDs(doc);
            const pIds = getPlantableIDs(doc);

            if (hIds.length > 0 || pIds.length > 0 || maxElapsedSeconds >= TARGET_SECONDS) {
                applyStyle(fStatusBtn, '#28a745');
                fStatusBtn.innerHTML = hIds.length > 0 ? `🌾 พร้อมเก็บ ${hIds.length} แปลง` : (pIds.length > 0 ? `🌾 พร้อมปลูก ${pIds.length} แปลง` : `🌾 ผักพร้อมแล้ว`);
                fStatusBtn.disabled = false;
                if (farmCountdownTimer) { clearInterval(farmCountdownTimer); farmCountdownTimer = null; }
                return;
            }

            if (maxElapsedSeconds >= 0) {
                let rem = TARGET_SECONDS - maxElapsedSeconds;
                const targetTime = Date.now() + (rem * 1000);
                
                if (sessionStorage.getItem('farm_prev_rem') === null) {
                    sessionStorage.setItem('farm_prev_rem', rem.toString());
                }

                applyStyle(fStatusBtn, '#6c757d');
                fStatusBtn.disabled = false;

                if (farmCountdownTimer) clearInterval(farmCountdownTimer);
                farmCountdownTimer = setInterval(() => {
                    const currentRem = Math.round((targetTime - Date.now()) / 1000);
                    const prevRem = parseInt(sessionStorage.getItem('farm_prev_rem') || currentRem);
                    
                    for (let cp of CHECKPOINTS) {
                        if (prevRem > cp && currentRem <= cp) {
                            fStatusBtn.innerHTML = `⏳ กำลัง Sync เวลาเซิร์ฟเวอร์...`; 
                            sessionStorage.setItem('farm_prev_rem', currentRem.toString());
                            clearInterval(farmCountdownTimer);
                            checkFarmStatus();
                            return;
                        }
                    }

                    if (currentRem <= -5) {
                        sessionStorage.removeItem('farm_prev_rem');
                        clearInterval(farmCountdownTimer);
                        fStatusBtn.innerHTML = `⏳ กำลังเตรียมเช็คแปลง... (+${Math.abs(currentRem)}s)`;
                        checkFarmStatus();
                        return;
                    }

                    if (currentRem > 0) {
                        const h = Math.floor(currentRem / 3600).toString().padStart(2, '0');
                        const m = Math.floor((currentRem % 3600) / 60).toString().padStart(2, '0');
                        const s = (currentRem % 60).toString().padStart(2, '0');
                        fStatusBtn.innerHTML = `🌾 รอผักโตอีก: ${h}:${m}:${s}`;
                        sessionStorage.setItem('farm_prev_rem', currentRem.toString());
                    } else {
                        fStatusBtn.innerHTML = `⏳ เตรียมเก็บเกี่ยว... (${Math.abs(currentRem)}s)`;
                    }
                }, 1000);
            } else {
                if (farmCheckTimer) clearTimeout(farmCheckTimer);
                if (farmCountdownTimer) clearInterval(farmCountdownTimer);

                fStatusBtn.innerHTML = `⚠️ ไม่พบแปลง/Zen หมด (หยุดทำงาน)`;
                applyStyle(fStatusBtn, '#dc3545');
                fStatusBtn.disabled = false; 
                toggleFarmAuto(false);
            }
        }

        content.appendChild(tBtn);
        content.appendChild(tAutoBtn);
        content.appendChild(fStatusBtn);
        content.appendChild(fAutoBtn);

        const menuToggler = document.querySelector('button.navbar-toggler[data-toggle="minimize"]');
        if (menuToggler) menuToggler.parentNode.insertBefore(container, menuToggler.nextSibling);
        else {
            Object.assign(container.style, { position: 'fixed', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '8px', borderRadius: '8px', zIndex: '9999' });
            document.body.appendChild(container);
        }

        checkTicketStatus();
        checkFarmStatus();
    }

    initBot();
})();
