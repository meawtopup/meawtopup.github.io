// ==UserScript==
// @name         Click Farm 5.0 | TDDFarm (Fixed Season Loop)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  เฉพาะกดมือ ไม่มีบอทออโต้
// @author       MobyEX
// @include      https://www.torrentdd.*/farm.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentdd.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getHarvestableIDs() {
        return Array.from(document.querySelectorAll('a[onclick*="action=store"]'))
            .map(el => {
                const match = el.getAttribute('onclick').match(/ground=(\d+)/);
                return match ? match[1] : null;
            }).filter(id => id !== null);
    }

    function getPlantableIDs() {
        return Array.from(document.querySelectorAll('button[onclick*="action=seed"]'))
            .map(el => {
                const match = el.getAttribute('onclick').match(/ground=(\d+)/);
                return match ? match[1] : null;
            }).filter(id => id !== null);
    }

    async function processActions(ids, actionType) {
        for (let id of ids) {
            await fetch(`?action=${actionType}&ground=${id}`);
            console.log(`Action: ${actionType} on Plot: ${id} Done.`);
        }
    }

    const cardBody = document.querySelector('.card-body');

    if (cardBody) {
        const container = document.createElement('div');
        container.style = 'margin-bottom: 20px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; width: 100%; border-bottom: 1px solid #eee; padding-bottom: 15px;';

        const hIdsInitial = getHarvestableIDs();
        const pIdsInitial = getPlantableIDs();

        const btnStyle = 'padding: 10px 20px; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;';

        const pBtn = document.createElement('button');
        pBtn.innerHTML = '🌱 ปลูกทั้งหมด';
        pBtn.style = btnStyle + `background: ${pIdsInitial.length > 0 ? '#28a745' : '#dc3545'};`;
        pBtn.onclick = async () => {
            if (pIdsInitial.length === 0) return alert('❌ ไม่มีแปลงว่างให้ปลูก');
            pBtn.disabled = true;
            await processActions(pIdsInitial, 'seed');
            window.location.reload();
        };

        const hBtn = document.createElement('button');
        hBtn.innerHTML = '🌾 เก็บทั้งหมด';
        hBtn.style = btnStyle + `background: ${hIdsInitial.length > 0 ? '#28a745' : '#dc3545'};`;
        hBtn.onclick = async () => {
            if (hIdsInitial.length === 0) return alert('❌ ไม่มีผลผลิตให้เก็บ');
            hBtn.disabled = true;
            await processActions(hIdsInitial, 'store');
            window.location.reload();
        };

        const nBtn = document.createElement('button');
        nBtn.innerHTML = '♻️ เริ่มฤดูกาลใหม่';
        nBtn.style = btnStyle + 'background: #17a2b8;';
        nBtn.onclick = async () => {
            const hIds = getHarvestableIDs();
            const pIds = getPlantableIDs();

            if (hIds.length === 0 && pIds.length === 0) {
                return alert('❌ ไม่พบแปลงที่พร้อมเก็บหรือปลูก');
            }

            nBtn.disabled = true;
            nBtn.innerHTML = '⏳ กำลังทำงาน...';

            if (hIds.length > 0) {
                await processActions(hIds, 'store');
                await new Promise(r => setTimeout(r, 500));
            }

            const allToPlant = [...new Set([...pIds, ...hIds])];
            if (allToPlant.length > 0) {
                await processActions(allToPlant, 'seed');
            }

            window.location.reload();
        };

        container.appendChild(pBtn);
        container.appendChild(hBtn);
        container.appendChild(nBtn);
        cardBody.insertBefore(container, cardBody.firstChild);
    }
})();
