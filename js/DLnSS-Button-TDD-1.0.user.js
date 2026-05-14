// ==UserScript==
// @name           DLnSS Button 1.0 | TDD
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    Download/SS+/Status-DL for TorrentDD
// @author         MObyEX
// @include      *://*.torrentdd.*/browse.php*
// @include      *://*.torrentdd.*/browse18.php*
// @include      *://*.torrentdd.*/details.php*
// @icon           https://github.com/meawtopup/meawtopup.github.io/blob/main/assets/icon48.png?raw=true
// @grant          none
// ==/UserScript==

(function () {
    'use strict';

    function showSSPopup(imgUrl) {
        let overlay = document.createElement('div');
        overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center; cursor:pointer;';
        let container = document.createElement('div');
        container.style = 'position:relative; background:#fff; padding:5px; border-radius:5px; max-height:95vh; max-width:95vw; box-shadow:0 0 20px rgba(0,0,0,0.5); cursor:default; overflow:hidden; display:flex; flex-direction:column; align-items:center;';
        let img = document.createElement('img');
        img.src = imgUrl;
        img.style = 'height:auto; max-height:82vh; width:auto; max-width:90vw; display:block; border-radius:3px; object-fit:contain;';
        let closeBtn = document.createElement('div');
        closeBtn.innerHTML = 'CLOSE';
        closeBtn.style = 'margin-top:10px; margin-bottom:5px; padding:0 20px; background:#ff4444; color:#fff; text-align:center; line-height:26px; font-size:12px; font-weight:bold; cursor:pointer; border-radius:3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);';
        closeBtn.onclick = () => document.body.removeChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) document.body.removeChild(overlay); };
        container.appendChild(img);
        container.appendChild(closeBtn);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
    }

    function markAsDownloaded(targetNode, torrentId) {
        if (targetNode.parentNode.querySelector(`.status-check-${torrentId}`)) return;
        const statusIcon = document.createElement('span');
        statusIcon.innerHTML = '<i class="fal fa-check"></i>';
        statusIcon.className = `status-check-${torrentId}`;
        statusIcon.title = 'คุณเคยดาวน์โหลดไฟล์นี้แล้ว';
        statusIcon.style = 'display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 22px; background-color: #fb9678; float: right !important; color: #ffffff !important; border-radius: .25rem; font-size: .95rem; border: none; margin-right: 2px; cursor: pointer; margin-bottom: 0; box-sizing: border-box;';
        targetNode.parentNode.insertBefore(statusIcon, targetNode.nextSibling);
    }

    const ssButtons = document.querySelectorAll('a.box-poster');

    ssButtons.forEach(ssBtn => {
        const imgUrl = ssBtn.getAttribute('href');
        const newSsBtn = ssBtn.cloneNode(true);
        ssBtn.parentNode.replaceChild(newSsBtn, ssBtn);
        ssBtn = newSsBtn;

        ssBtn.removeAttribute('target');
        ssBtn.onclick = (e) => {
            if (e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
                e.preventDefault();
                showSSPopup(imgUrl);
            }
        };

        const container = ssBtn.closest('tr') || ssBtn.parentElement;
        const detailLink = container.querySelector('a[href*="details.php?id="]');
        let torrentId = null;

        if (detailLink) {
            const match = detailLink.href.match(/id=(\d+)/);
            if (match) torrentId = match[1];
        } else if (window.location.pathname.includes('details.php')) {
            const urlParams = new URLSearchParams(window.location.search);
            torrentId = urlParams.get('id');
        }

        if (!torrentId) return;

        const dlBtn = container.querySelector('button[onclick*="download.php/"]');

        if (dlBtn) {
            const title = dlBtn.getAttribute('data-original-title') || '';
            if (title.match(/\d+/)) {
                markAsDownloaded(ssBtn, torrentId);
            }
            dlBtn.addEventListener('click', () => {
                setTimeout(() => markAsDownloaded(ssBtn, torrentId), 500);
            });

        } else {
            const newDlBtn = document.createElement('button');
            newDlBtn.type = 'button';
            newDlBtn.className = 'badge float-right text-white ml-ic-1';
            newDlBtn.style.cssText = `
                background-color: #57c7d4;
                color: #ffffff;
                border-radius: .25rem;
                font-size: .75rem;
                padding: .25rem 0.375rem;
                border: 1px solid #57c7d4;
                margin-left: 2px;
                cursor: pointer;
                display: inline-block;
                vertical-align: baseline;
                line-height: 1;
            `;
            newDlBtn.innerHTML = '<i class="fal fa-download fa-lg"></i>';
            const parentCell = ssBtn.parentElement;
            parentCell.insertBefore(newDlBtn, parentCell.firstChild);
            newDlBtn.addEventListener('click', () => {
                setTimeout(() => markAsDownloaded(ssBtn, torrentId), 500);
            });

            fetch(`/details.php?id=${torrentId}`)
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const realDlBtnDetail = doc.querySelector('button[class*="btn-inverse-success"]') || doc.querySelector('button[onclick*="download.php/"]');
                    if (realDlBtnDetail) {
                        newDlBtn.setAttribute('onclick', realDlBtnDetail.getAttribute('onclick'));
                        const detailTitle = realDlBtnDetail.getAttribute('data-original-title') || realDlBtnDetail.getAttribute('title') || '';
                        if (detailTitle.match(/\d+/)) {
                            markAsDownloaded(ssBtn, torrentId);
                        }
                    } else {
                        newDlBtn.style.backgroundColor = '#cccccc';
                        newDlBtn.style.borderColor = '#cccccc';
                        newDlBtn.style.cursor = 'not-allowed';
                        newDlBtn.title = 'ไม่สามารถดาวน์โหลดได้';
                    }
                }).catch(err => console.log('Fetch error:', err));
        }
    });
})();
