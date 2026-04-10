// ==UserScript==
// @name         Auto Drone 2.6 | TDD
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Fixed Ticket Manual Click & Added Safety Reset
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
    let farmRetryCount = 0;

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
        if (farmCountdownTimer) {
            clearInterval(farmCountdownTimer);
            farmCountdownTimer = null;
        }
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
            container.innerHTML = `<span style="color:#ffeb3b; font-weight:bold;">⚠️ รีโหลดใน ${seconds} (จาก:${fromSource}) ⚠️</span>`;
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
            if (isWorking || tBtn.disabled) return;
            if (tBtn.getAttribute('data-ready') === 'true') collectTicket();
            else checkTicketStatus();
        };

        async function checkTicketStatus() {
            if (ticketCheckTimer) clearTimeout(ticketCheckTimer);
            if (ticketCountdownInterval) clearInterval(ticketCountdownInterval);
            applyStyle(tBtn, '#17a2b8');
            tBtn.innerHTML = '⏳ กำลังเช็คตั๋ว...';
            tBtn.disabled = true;

            try {
                const res = await fetch('/ticket.php');
                const text = await res.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const readyBtn = doc.querySelector('button.get-ticket');
                const infoText = doc.querySelector('.text-danger.f12');
                let status = 'ไม่มีตั๋วให้เก็บ', canCollect = false, already = false;

                if (readyBtn) {
                    const match = readyBtn.innerText.match(/(\d+)/);
                    canCollect = true;
                    status = `มีตั๋วพร้อม ${match ? match[1] : ''} ชิ้น`;
                } else if (infoText && infoText.innerText.includes('รับตั๋วสุ่มกาชาไปแล้ว')) {
                    already = true;
                    status = 'เก็บตั๋วไปแล้ว';
                }

                tBtn.innerHTML = `🎫 ${status}`;
                applyStyle(tBtn, canCollect ? '#28a745' : (already ? '#6c757d' : '#dc3545'));
                tBtn.setAttribute('data-ready', canCollect ? 'true' : 'false');
                tBtn.disabled = false;

                if (canCollect && isTicketAuto && !isWorking) collectTicket();
                else if (!canCollect) scheduleNextTicketCheck();
            } catch (e) {
                tBtn.innerHTML = '🎫 ข้อผิดพลาด';
                applyStyle(tBtn, '#dc3545');
                tBtn.disabled = false;
            }
        }

        function collectTicket() {
            if (isWorking) return;

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

        function scheduleNextTicketCheck() {
            if (ticketCheckTimer) clearTimeout(ticketCheckTimer);
            if (ticketCountdownInterval) clearInterval(ticketCountdownInterval);

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

            if (diff <= 0) {
                checkTicketStatus();
            }
            else if (diff <= fiveMinutes) {
                let lastSec = Math.ceil(diff / 1000);

                ticketCountdownInterval = setInterval(() => {
                    const currentNow = new Date();
                    const currentDiff = target.getTime() - currentNow.getTime();
                    const sec = Math.ceil(currentDiff / 1000);

                    if (sec <= 0) {
                        clearInterval(ticketCountdownInterval);
                        checkTicketStatus();
                    } else {
                        tBtn.innerHTML = `🎫 เตรียมเก็บตั๋ว: ${sec}s`;
                        applyStyle(tBtn, '#ff9800');
                    }
                }, 1000);
            }
            else {
                const h = target.getHours().toString().padStart(2, '0');
                const m = target.getMinutes().toString().padStart(2, '0');
                tBtn.innerHTML = `🎫 รอบถัดไป ${h}:${m}`;
                applyStyle(tBtn, '#6c757d');

                ticketCheckTimer = setTimeout(scheduleNextTicketCheck, diff - fiveMinutes);
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
                let readyToWork = (hIds.length > 0 || pIds.length > 0);

                if (readyToWork && isFarmAuto) {
                    executeFarm();
                } else {
                    scheduleNextFarmCheck(doc);
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

                setTimeout(() => {
                    checkFarmStatus();
                }, 3000);

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
                if (farmCountdownTimer) {
                    clearInterval(farmCountdownTimer);
                    farmCountdownTimer = null;
                }
                return;
            }

            if (maxElapsedSeconds >= 0) {
                let rem = TARGET_SECONDS - maxElapsedSeconds;
                const targetTime = Date.now() + (rem * 1000);
                let nextHourBoundary = Math.floor((rem - 1) / 3600) * 3600;

                applyStyle(fStatusBtn, '#6c757d');
                fStatusBtn.disabled = false;

                if (farmCountdownTimer) clearInterval(farmCountdownTimer);
                farmCountdownTimer = setInterval(() => {
                    const currentRem = Math.round((targetTime - Date.now()) / 1000);
                    if (currentRem <= -10 || (currentRem > 0 && currentRem <= nextHourBoundary)) {
                        clearInterval(farmCountdownTimer);
                        checkFarmStatus();
                        return;
                    }
                    if (currentRem > 0) {
                        const h = Math.floor(currentRem / 3600).toString().padStart(2, '0');
                        const m = Math.floor((currentRem % 3600) / 60).toString().padStart(2, '0');
                        const s = (currentRem % 60).toString().padStart(2, '0');
                        fStatusBtn.innerHTML = `🌾 รอผักโตอีก: ${h}:${m}:${s}`;
                    } else {
                        fStatusBtn.innerHTML = `⏳ กำลังเตรียมเช็คแปลง... (+${Math.abs(currentRem)}s)`;
                    }
                }, 1000);
            } else {
                if (farmCheckTimer) clearTimeout(farmCheckTimer);
                farmCheckTimer = setTimeout(checkFarmStatus, 10000);
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
