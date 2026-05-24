// ==UserScript==
// @name           DLnSS Button 3.2 | BB
// @namespace      http://tampermonkey.net/
// @version        3.2
// @description    Download/SS+/Status-DL
// @author         MObyEX
// @include        *://bearbit.*/viewno18sbx.php*
// @include        *://bearbit.*/viewbrsb.php*
// @include        *://bearbit.*/details.php*
// @icon           https://github.com/meawtopup/meawtopup.github.io/blob/main/assets/iconbb48.png?raw=true
// @grant          none
// @updateURL    https://github.com/meawtopup/meawtopup.github.io/blob/main/js/DLnSS-Button-BB.user.js?raw=true
// @downloadURL  https://github.com/meawtopup/meawtopup.github.io/blob/main/js/DLnSS-Button-BB.user.js?raw=true
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

    function processDownload(torrentId, dlBtn, container, bookmarkBtn) {
        dlBtn.innerHTML = ' ⏳ ';
        let iframe = document.createElement('iframe');
        iframe.src = "https://bearbit.org/details.php?id=" + torrentId;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        iframe.onload = function () {
            try {
                let iframeDoc = iframe.contentWindow.document;
                let thanksBtn = iframeDoc.querySelector('td#saythanks a[onclick*="say_thanks"]');
                if (thanksBtn) {
                    thanksBtn.click();
                }
                setTimeout(() => {
                    let downloadLink = iframeDoc.querySelector('a[href^="downloadnew.php"]');
                    if (downloadLink) {
                        window.location.href = "https://bearbit.org/" + downloadLink.getAttribute('href');
                        dlBtn.innerHTML = ' ✔️ ';
                    } else {
                        window.location.href = `https://bearbit.org/downloadnew.php?id=${torrentId}`;
                    }
                    setTimeout(() => {
                        if (iframe.parentNode) document.body.removeChild(iframe);
                        dlBtn.innerHTML = dlBtn.getAttribute('data-original-html');
                        if (container && bookmarkBtn) checkDownloaded(torrentId, container, bookmarkBtn);
                    }, 1500);
                }, 300);
            } catch (err) { window.location.href = "https://bearbit.org/details.php?id=" + torrentId; }
        };
    }

    function checkDownloaded(torrentId, container, bookmarkBtn, ssBtn) {
        if (container.querySelector(`.status-check-${torrentId}`)) return;
        fetch(`https://bearbit.org/details.php?id=${torrentId}`)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                let decoder = new TextDecoder('tis-620');
                let html = decoder.decode(buffer);
                if (html.includes('(ได้รับไปแล้ว)')) {
                    const statusIcon = document.createElement('span');
                    statusIcon.innerHTML = '✔️';
                    statusIcon.className = `status-check-${torrentId}`;
                    statusIcon.title = 'คุณเคยดาวน์โหลดไฟล์นี้แล้ว';
                    statusIcon.style = 'display: inline-flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #fff; border-radius: 20px; padding: 0 12px; color: #fff; text-decoration: none; font-size: 11px; font-weight: bold; margin-right: 8px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05); height: 26px; vertical-align: middle; box-sizing: border-box; line-height: 1;';
                    container.insertBefore(statusIcon, bookmarkBtn);
                }
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const ssTitleTd = Array.from(doc.querySelectorAll('td.rowhead')).find(td => td.innerText.includes('ScreenShot'));
                const imgUrl = ssTitleTd?.nextElementSibling?.querySelector('a[href]')?.getAttribute('href');
                if (imgUrl && ssBtn) {
                    ssBtn.href = imgUrl;
                }
            })
            .catch(err => console.log('Status check error:', err));
    }

    const isBrowsePage = window.location.pathname.includes('viewno18sbx.php') || window.location.pathname.includes('viewbrsb.php');

    if (isBrowsePage) {
        const actionContainers = document.querySelectorAll('.bb-file-actions');

        actionContainers.forEach(container => {
            const bookmarkBtn = container.querySelector('a[id^="bookmark-btn-"]');
            if (!bookmarkBtn) return;
            const torrentId = bookmarkBtn.id.replace('bookmark-btn-', '');
            container.style = 'display: flex; align-items: center; flex-wrap: wrap; gap: 0; margin-top: 5px; min-height: 26px;';
            container.innerHTML = '';
            container.appendChild(bookmarkBtn);

            const dlBtn = document.createElement('a');
            dlBtn.innerHTML = 'DL-Now';
            dlBtn.setAttribute('data-original-html', dlBtn.innerHTML);
            dlBtn.style = 'display: inline-flex; align-items: center; justify-content: center; background: #62ce89; border: 1px solid #62ce89; border-radius: 20px; padding: 0 12px; color: #fff; text-decoration: none; font-size: 11px; font-weight: bold; margin-right: 8px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05); height: 26px; vertical-align: middle; box-sizing: border-box; line-height: 1;';

            dlBtn.onclick = (e) => {
                e.preventDefault();
                processDownload(torrentId, dlBtn, container, bookmarkBtn);
            };

            const ssBtn = document.createElement('a');
            ssBtn.innerHTML = 'Screenshot';
            ssBtn.target = '_blank';
            ssBtn.style = 'display: inline-flex; align-items: center; justify-content: center; background: #487dee; border: 1px solid #487dee; border-radius: 20px; padding: 0 12px; color: #fff; text-decoration: none; font-size: 11px; font-weight: bold; margin-right: 8px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05); height: 26px; vertical-align: middle; box-sizing: border-box; line-height: 1;';

            const handleSSClick = (e) => {
                const isLeftClick = e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.metaKey;
                if (!isLeftClick) return;

                e.preventDefault();

                if (ssBtn.href && ssBtn.href !== window.location.href) {
                    showSSPopup(ssBtn.href);
                } else {
                    window.open(`https://bearbit.org/details.php?id=${torrentId}`, '_blank');
                }
            };

            ssBtn.addEventListener('click', handleSSClick);
            container.insertBefore(dlBtn, bookmarkBtn);
            container.insertBefore(ssBtn, bookmarkBtn);
            checkDownloaded(torrentId, container, bookmarkBtn, ssBtn);
        });
    }

    if (window.location.pathname.includes('details.php')) {
        const urlParams = new URLSearchParams(window.location.search);
        const torrentId = urlParams.get('id');
        if (torrentId && !window.location.search.includes('action=')) {
            const tdElements = document.querySelectorAll('td.rowhead');
            tdElements.forEach(td => {
                if (td.innerText.trim() === "Download") {
                    const container = document.createElement('div');
                    container.style = 'text-align: right; margin-top: 5px; width: 100%;';
                    const dlBtnDetail = document.createElement('a');
                    const text = 'DL-Now';
                    dlBtnDetail.innerHTML = text;
                    dlBtnDetail.setAttribute('data-original-html', text);
                    dlBtnDetail.style = 'display: inline-flex; align-items: center; justify-content: center; background: #62ce89; border: 1px solid #62ce89; border-radius: 20px; padding: 0 12px; color: #fff; text-decoration: none; font-size: 11px; font-weight: bold; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05); height: 26px; vertical-align: middle; box-sizing: border-box; line-height: 1; white-space: nowrap;';
                    dlBtnDetail.onclick = (e) => { e.preventDefault(); processDownload(torrentId, dlBtnDetail, null, null); };
                    container.appendChild(dlBtnDetail);
                    td.appendChild(container);
                }
            });
        }
    }
})();
