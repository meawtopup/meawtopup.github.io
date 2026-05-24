// ==UserScript==
// @name         Auto Drone 4.3.7 | TDD
// @namespace    http://tampermonkey.net/
// @version      4.3.7
// @description  ticket + farm
// @author       MobyEX
// @include      *://*.torrentdd.*/chat.php*
// @icon         https://github.com/meawtopup/meawtopup.github.io/blob/main/assets/icon48.png?raw=true
// @grant        none
// @updateURL    https://github.com/meawtopup/meawtopup.github.io/blob/main/js/Auto-Drone.user.js?raw=true
// @downloadURL  https://github.com/meawtopup/meawtopup.github.io/blob/main/js/Auto-Drone.user.js?raw=true
// ==/UserScript==

(function () {
    'use strict';

    const STATE = {
        ticket: {
            interval: null,
            isWorking: false,
            autoMode: localStorage.getItem('tdd_ticket_auto') === 'true'
        },
        farm: {
            interval: null,
            isWorking: false,
            autoMode: localStorage.getItem('tdd_farm_auto') === 'true'
        }
    };

    let myUserId = null;

    const UI = {
        container: null,
        tStatus: null, tBtn: null, tAutoBtn: null,
        fStatus: null, fBtn: null, fAutoBtn: null
    };

    function initUI() {
        const old = document.getElementById('tdd-bot-container');
        if (old) old.remove();

        const container = document.createElement('div');
        container.id = 'tdd-bot-container';
        Object.assign(container.style, {
            display: 'inline-flex',
            gap: '5px',
            alignItems: 'center',
            fontSize: '11px',
            color: '#fff',
            marginLeft: '0px',
            verticalAlign: 'middle',
            whiteSpace: 'nowrap'
        });

        UI.tStatus = createStatusBadge('🎫: ⏳กำลังเช็คตั๋ว');
        UI.tBtn = createBtn('🎫รอเช็คสถานะ', '#6c757d', true, manualCollectTicket);
        UI.tAutoBtn = createBtn(`🎫โดรน: ${STATE.ticket.autoMode ? 'เปิด' : 'ปิด'}`, STATE.ticket.autoMode ? '#ff9800' : '#6c757d', false, toggleTicketAuto);
        UI.fStatus = createStatusBadge('🌾: ⏳กำลังเช็คฟาร์ม');
        UI.fBtn = createBtn('🌾รอเช็คสถานะ', '#6c757d', true, manualCollectFarm);
        UI.fAutoBtn = createBtn(`🌾โดรน: ${STATE.farm.autoMode ? 'เปิด' : 'ปิด'}`, STATE.farm.autoMode ? '#ff9800' : '#6c757d', false, toggleFarmAuto);

        container.append(
            UI.tStatus, UI.tBtn, UI.tAutoBtn,
            createSpan(' | '),
            UI.fStatus, UI.fBtn, UI.fAutoBtn
        );

        const menuToggler = document.querySelector('button.navbar-toggler[data-toggle="minimize"]');
        if (menuToggler) {
            menuToggler.parentNode.insertBefore(container, menuToggler.nextSibling);
        } else {
            Object.assign(container.style, { position: 'fixed', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '5px 10px', borderRadius: '4px', zIndex: '9999' });
            document.body.appendChild(container);
        }
    }

    function createStatusBadge(text) {
        const el = document.createElement('span');
        el.innerText = text;
        Object.assign(el.style, {
            padding: '3px 8px',
            fontSize: '11px',
            color: '#ffffff',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            height: '23px',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginRight: '0px'
        });
        return el;
    }

    function createSpan(text) {
        const el = document.createElement('span');
        el.innerText = text;
        el.style.marginRight = '0px';
        el.style.color = 'rgba(255, 255, 255, 0.5)';
        return el;
    }

    function createBtn(text, bgColor, disabled, onClick) {
        const el = document.createElement('button');
        el.innerText = text;
        el.disabled = disabled;
        el.onclick = onClick;
        Object.assign(el.style, {
            padding: '3px 8px', 
            fontSize: '11px', 
            color: 'white',
            background: bgColor, 
            border: 'none', 
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer', 
            marginRight: '0px',
            whiteSpace: 'nowrap',
            flexShrink: 0
        });
        return el;
    }

    function updateBtn(el, text, bgColor, disabled) {
        el.innerText = text;
        el.style.background = bgColor;
        el.disabled = disabled;
        el.style.cursor = disabled ? 'not-allowed' : 'pointer';
    }

    async function getUserId() {
        if (myUserId) return myUserId;
        const html = document.body.innerHTML;
        const match = html.match(/userdetails\.php\?id=(\d+)/);
        if (match) {
            myUserId = match[1];
            return myUserId;
        }
        try {
            const res = await fetch('/');
            const text = await res.text();
            const m = text.match(/userdetails\.php\?id=(\d+)/);
            if (m) myUserId = m[1];
        } catch (e) { console.error('Get UserID failed', e); }
        return myUserId;
    }

    function parseSeedTimeSeconds(timeStr) {
        if (!timeStr) return 0;
        let total = 0;
        const dMatch = timeStr.match(/(\d+)d/);
        if (dMatch) total += parseInt(dMatch[1]) * 86400;
        const tMatch = timeStr.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (tMatch) {
            total += parseInt(tMatch[1]) * 3600 + parseInt(tMatch[2]) * 60 + parseInt(tMatch[3]);
        } else {
            const t2Match = timeStr.match(/(\d{2}):(\d{2})/);
            if (t2Match) total += parseInt(t2Match[1]) * 60 + parseInt(t2Match[2]);
        }
        return total;
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function clearTicketTimers() {
        if (STATE.ticket.interval) {
            clearInterval(STATE.ticket.interval);
            clearTimeout(STATE.ticket.interval);
            STATE.ticket.interval = null;
        }
    }

    function clearFarmTimers() {
        if (STATE.farm.interval) {
            clearInterval(STATE.farm.interval);
            clearTimeout(STATE.farm.interval);
            STATE.farm.interval = null;
        }
    }

    function toggleTicketAuto() {
        STATE.ticket.autoMode = !STATE.ticket.autoMode;
        localStorage.setItem('tdd_ticket_auto', STATE.ticket.autoMode);
        updateBtn(UI.tAutoBtn, `🎫โดรน: ${STATE.ticket.autoMode ? 'เปิด' : 'ปิด'}`, STATE.ticket.autoMode ? '#ff9800' : '#6c757d', false);
        if (STATE.ticket.autoMode) checkTicketLoop();
    }

    async function manualCollectTicket() {
        if (STATE.ticket.isWorking || UI.tBtn.disabled) return;
        STATE.ticket.isWorking = true;
        updateBtn(UI.tBtn, '⏳กำลังเก็บ...', '#17a2b8', true);
        await executeTicketCollection();
    }

    async function checkTicketLoop() {
        if (STATE.ticket.isWorking) return;
        clearTicketTimers();
        UI.tStatus.innerText = '🎫: ⏳กำลังเช็คตั๋ว';
        updateBtn(UI.tBtn, '🎫พร้อมใช้งาน', '#6c757d', true);

        try {
            const res = await fetch('/ticket.php');
            const rawText = await res.text();
            const html = new DOMParser().parseFromString(rawText, 'text/html');
            const hrMatch = rawText.match(/CN(?:&gt;|>).*?class="text-success ml-2 mr-2">(\d+)<\/span>/s);
            const hrCount = hrMatch ? parseInt(hrMatch[1]) : 0;

            if (hrCount < 5) {
                const uid = await getUserId();
                if (uid) {
                    const peerRes = await fetch(`/mypeers.php?userid=${uid}`);
                    const peerDoc = await textToDoc(peerRes);
                    const rows = peerDoc.querySelectorAll('tbody tr');
                    if (rows.length >= 6) {
                        const col = rows[5].querySelectorAll('td')[6];
                        if (col) {
                            const isOver3Hr = col.innerHTML.includes('CN>3HR') || col.innerHTML.includes('CN&gt;3HR');
                            if (!isOver3Hr) {
                                const timeText = col.innerText.trim();
                                const seededSec = parseSeedTimeSeconds(timeText);
                                const neededSec = 10800 - seededSec;
                                if (neededSec > 0) {
                                    startTicketCountdown(neededSec, '❌3HR');
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            const infoText = html.querySelector('.text-danger.f12');
            if (infoText && infoText.innerText.includes('รับตั๋วสุ่มกาชาไปแล้ว')) {
                calcNextRoundTime();
                return;
            }

            const historyRows = html.querySelectorAll('.table-responsive table tbody tr');
            if (historyRows.length > 1) {
                const timeStr = historyRows[1].querySelectorAll('td')[2]?.innerText.trim();
                if (timeStr) {
                    const lastTime = new Date(timeStr.replace(/-/g, '/')).getTime();
                    const now = Date.now();
                    const cooldownMs = 3 * 60 * 60 * 1000;
                    if (now < lastTime + cooldownMs) {
                        startTicketCountdown(Math.ceil((lastTime + cooldownMs - now) / 1000), '❌Cooldown');
                        return;
                    }
                }
            }

            UI.tStatus.innerText = '🎫: ✔️ตั๋วพร้อมเก็บ';
            updateBtn(UI.tBtn, '🎫เก็บตั๋ว', '#28a745', false);

            if (STATE.ticket.autoMode) {
                await manualCollectTicket();
            }

        } catch (e) {
            console.error("Ticket Check Error", e);
            UI.tStatus.innerText = '🎫: ❌พบข้อผิดพลาด';
            clearTicketTimers();
            STATE.ticket.interval = setTimeout(checkTicketLoop, 60000);
        }
    }

    function calcNextRoundTime() {
        clearTicketTimers();
        const now = new Date();
        let target = new Date(now);
        if (now.getHours() < 12) {
            target.setHours(12, 0, 5, 0);
        } else {
            target.setDate(target.getDate() + 1);
            target.setHours(0, 0, 5, 0);
        }

        const h = target.getHours().toString().padStart(2, '0');
        const m = target.getMinutes().toString().padStart(2, '0');
        UI.tStatus.innerText = `🎫: ❌รอบถัดไป ${h}:${m}`;
        updateBtn(UI.tBtn, '🎫พร้อมใช้งาน', '#6c757d', true);

        const diffMs = target.getTime() - Date.now();
        STATE.ticket.interval = setTimeout(checkTicketLoop, diffMs);
    }

    function startTicketCountdown(seconds, prefix) {
        clearTicketTimers();
        updateBtn(UI.tBtn, '🎫พร้อมใช้งาน', '#6c757d', true);
        const targetEndTime = Date.now() + (seconds * 1000);
        const tick = () => {
            const rem = Math.ceil((targetEndTime - Date.now()) / 1000);
            if (rem <= 0) {
                clearTicketTimers();
                checkTicketLoop();
                return;
            }
            UI.tStatus.innerText = `🎫: ${prefix}: ${formatTime(rem)}`;
        };
        tick();
        STATE.ticket.interval = setInterval(tick, 1000);
    }

    async function executeTicketCollection() {
    try {
        await fetch('/ticket.php?mod=get-ticket');
        console.log('เก็บตั๋วแล้ว รอ Server อัปเดต...');
        await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
        console.error('Error executing ticket', e);
    }

    STATE.ticket.isWorking = false;
    checkTicketLoop();
}

    function toggleFarmAuto() {
        STATE.farm.autoMode = !STATE.farm.autoMode;
        localStorage.setItem('tdd_farm_auto', STATE.farm.autoMode);
        updateBtn(UI.fAutoBtn, `🌾โดรน: ${STATE.farm.autoMode ? 'เปิด' : 'ปิด'}`, STATE.farm.autoMode ? '#ff9800' : '#6c757d', false);
        if (STATE.farm.autoMode) checkFarmLoop();
    }

    async function manualCollectFarm() {
        if (STATE.farm.isWorking || UI.fBtn.disabled) return;
        STATE.farm.isWorking = true;
        updateBtn(UI.fBtn, '⏳กำลังจัดการ...', '#17a2b8', true);
        await executeFarmCollection();
    }

    async function checkFarmLoop() {
        if (STATE.farm.isWorking) return;
        clearFarmTimers();
        UI.fStatus.innerText = '🌾: ⏳กำลังเช็คฟาร์ม';
        updateBtn(UI.fBtn, '🌾เก็บผัก', '#6c757d', true);

        try {
            const res = await fetch(`/farm.php?t=${Date.now()}`);
            const doc = await textToDoc(res);
            const moneyEl = doc.getElementById('money');
            const currentZen = moneyEl ? parseInt(moneyEl.innerText.replace(/,/g, ''), 10) || 0 : 0;
            const hIds = [];
            const pIds = [];
            const remainingTimes = [];
            const TARGET = 6 * 3600;

            for (let i = 1; i <= 9; i++) {
                if (doc.querySelector(`[onclick*="action=store&ground=${i}"]`)) hIds.push(i);
                if (doc.querySelector(`[onclick*="action=seed&ground=${i}"]`)) pIds.push(i);
            }

            doc.querySelectorAll('.f10').forEach(el => {
                const m = el.innerText.match(/\((\d+)\s*วัน\)\s*(\d+):(\d+):(\d+)/);
                if (m) {
                    const elapsed = (parseInt(m[1]) * 86400) + (parseInt(m[2]) * 3600) + (parseInt(m[3]) * 60) + parseInt(m[4]);
                    const remaining = TARGET - elapsed;
                    if (remaining > 0) remainingTimes.push(remaining);
                }
            });

            const minRemaining = remainingTimes.length > 0 ? Math.min(...remainingTimes) : 0;
            let statusParts = [];
            if (hIds.length > 0) statusParts.push(`✔️พร้อมเก็บ ${hIds.length}`);
            if (minRemaining > 0) statusParts.push(`❌รอโตอีก ${formatTime(minRemaining)}`);
            
            UI.fStatus.innerText = statusParts.length > 0 ? `🌾: ${statusParts.join('/')}` : '🌾: พร้อมใช้งาน';

            const canHarvest = hIds.length > 0;
            const canPlant = hIds.length === 0 && pIds.length > 0 && currentZen >= 25000;
            const btnEnabled = canHarvest || canPlant;
            
            let btnText = '🌾พร้อมใช้งาน';
            let btnColor = '#6c757d';

            if (canHarvest) {
                btnText = '🌾เก็บผัก';
                btnColor = '#28a745';
            } else if (canPlant) {
                btnText = '🌾ปลูกผัก';
                btnColor = '#28a745';
            }

            updateBtn(UI.fBtn, btnText, btnColor, !btnEnabled);

            if (STATE.farm.autoMode && hIds.length > 0) {
                await manualCollectFarm();
                return;
            }

            if (minRemaining > 0) {
                startFarmCountdown(minRemaining);
            } else if (hIds.length === 0 && pIds.length > 0 && currentZen < 25000) {
                UI.fStatus.innerText = '🌾: ❌เงินไม่พอปลูก';
                if (STATE.farm.autoMode) {
                    STATE.farm.autoMode = false;
                    localStorage.setItem('tdd_farm_auto', 'false');
                    updateBtn(UI.fAutoBtn, `🌾โดรน: ปิด`, '#6c757d', false);
                }
            }

        } catch (e) {
            console.error("Farm Check Error", e);
            UI.fStatus.innerText = '🌾: ❌พบข้อผิดพลาด';
            clearFarmTimers();
            STATE.farm.interval = setTimeout(checkFarmLoop, 60000);
        }
    }

    function startFarmCountdown(seconds) {
        clearFarmTimers();
        const targetEndTime = Date.now() + (seconds * 1000);

        const tick = () => {
            const rem = Math.ceil((targetEndTime - Date.now()) / 1000);
            if (rem <= 0) {
                clearFarmTimers();
                checkFarmLoop();
                return;
            }
            
            const currentStatus = UI.fStatus.innerText;
            const hasHarvest = currentStatus.includes('✔️พร้อมเก็บ');
            const timeStr = formatTime(rem);
            
            if (hasHarvest) {
                const harvestPart = currentStatus.split('/')[0];
                UI.fStatus.innerText = `${harvestPart}/❌รอโตอีก ${timeStr}`;
            } else {
                UI.fStatus.innerText = `🌾: ❌รอโตอีก ${timeStr}`;
            }
        };
        tick();
        STATE.farm.interval = setInterval(tick, 1000);
    }

    async function executeFarmCollection() {
        try {
            let doc = await textToDoc(await fetch(`/farm.php?t=${Date.now()}`));
            let hIds = [], pIds = [];

            for (let i = 1; i <= 9; i++) {
                if (doc.querySelector(`[onclick*="action=store&ground=${i}"]`)) hIds.push(i);
            }
            for (let id of hIds) {
                await fetch(`/farm.php?action=store&ground=${id}`);
                await new Promise(r => setTimeout(r, 400));
            }

            doc = await textToDoc(await fetch(`/farm.php?t=${Date.now()}`));
            const moneyEl = doc.getElementById('money');
            const currentZen = moneyEl ? parseInt(moneyEl.innerText.replace(/,/g, ''), 10) || 0 : 0;

            if (currentZen >= 25000) {
                for (let i = 1; i <= 9; i++) {
                    if (doc.querySelector(`[onclick*="action=seed&ground=${i}"]`)) pIds.push(i);
                }
                for (let id of pIds) {
                    await fetch(`/farm.php?action=seed&ground=${id}`);
                    await new Promise(r => setTimeout(r, 400));
                }
            }

        } catch (e) { console.error('Error executing farm', e); }

        STATE.farm.isWorking = false;
        checkFarmLoop();
    }

    async function textToDoc(res) {
        const text = await res.text();
        return new DOMParser().parseFromString(text, 'text/html');
    }

    initUI();
    setTimeout(() => {
        checkTicketLoop();
        checkFarmLoop();
    }, 1000);

})();
