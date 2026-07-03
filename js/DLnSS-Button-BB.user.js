// ==UserScript==
// @name           DLnSS Button 3.3 | BB
// @namespace      http://tampermonkey.net/
// @version        3.3
// @description    Download/SS+/Status-DL (Updated for new download gate)
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

    const BB_BASE = window.location.origin;
    let lastDownloadTime = 0;
    let minInterval = 1500;

    function waitForSlot() {
        return new Promise(resolve => {
            let now = Date.now();
            let timeSinceLast = now - lastDownloadTime;

            if (timeSinceLast >= minInterval) {
                lastDownloadTime = now;
                resolve();
            } else {
                let waitTime = minInterval - timeSinceLast;
                setTimeout(() => {
                    lastDownloadTime = Date.now();
                    resolve();
                }, waitTime);
            }
        });
    }

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
        dlBtn.innerHTML = ' ⏳ 6';
        dlBtn.style.pointerEvents = 'none';

        fetch(BB_BASE + "/details.php?id=" + torrentId, {
            credentials: 'include'
        })
            .then(response => response.text())
            .then(html => {
                let thanksMatch = html.match(/href="([^"]*say_thanks[^"]*)"/);
                let dlMatch = html.match(/href="(downloadnew\.php\?id=\d+&amp;genid=[^"]*&amp;dltm=[^"]*&amp;dlt=[^"]*&amp;filename=[^"]*)"/);

                if (!dlMatch) {
                    throw new Error('LOCKED');
                }

                let downloadUrl = dlMatch[1].replace(/&amp;/g, '&');
                if (!downloadUrl.startsWith('http')) {
                    downloadUrl = BB_BASE + "/" + downloadUrl;
                }

                let startCountdownAndDownload = () => {
                    let countdown = 6;
                    dlBtn.innerHTML = ' ⏳ ' + countdown;

                    let countdownInterval = setInterval(() => {
                        countdown--;
                        if (countdown > 0) {
                            dlBtn.innerHTML = ' ⏳ ' + countdown;
                        } else {
                            dlBtn.innerHTML = ' ⏳ 0';
                            clearInterval(countdownInterval);
                        }
                    }, 1000);

                    let openDownloadGate = () => {
                        let iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.name = 'bb_gate_' + torrentId;
                        iframe.id = 'bb_iframe_' + torrentId;
                        iframe.dataset.completed = 'false';
                        document.body.appendChild(iframe);
                        iframe.src = downloadUrl;

                        let cleanupInterval = setInterval(() => {
                            let allIframes = document.querySelectorAll('iframe[id^="bb_iframe_"]');
                            allIframes.forEach(f => {
                                if (f.dataset.completed === 'true') {
                                    if (f.parentNode) {
                                        f.parentNode.removeChild(f);
                                    }
                                }
                            });
                            if (!document.querySelector('iframe[id^="bb_iframe_"]')) {
                                clearInterval(cleanupInterval);
                            }
                        }, 5000);

                        let doDownload = () => {
                            try {
                                let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                                let bbDlBtn = iframeDoc.querySelector('a#bbDlBtn');

                                if (bbDlBtn && !bbDlBtn.classList.contains('bb-disabled')) {
                                    bbDlBtn.click();

                                    clearInterval(countdownInterval);
                                    iframe.dataset.completed = 'true';
                                    dlBtn.innerHTML = ' ✔️ ';

                                    setTimeout(() => {
                                        dlBtn.innerHTML = dlBtn.getAttribute('data-original-html');
                                        dlBtn.style.pointerEvents = 'auto';
                                    }, 3000);

                                    setTimeout(() => {
                                        if (iframe.parentNode) {
                                            document.body.removeChild(iframe);
                                        }
                                        if (container && bookmarkBtn) {
                                            checkDownloaded(torrentId, container, bookmarkBtn);
                                        }
                                    }, 3000);

                                    return true;
                                }
                            } catch (err) {
                                console.log('Iframe access error:', err);
                            }
                            return false;
                        };

                        let checkReady = setInterval(() => {
                            if (countdown <= 0) {
                                if (doDownload()) {
                                    clearInterval(checkReady);
                                } else {
                                    setTimeout(() => {
                                        if (!doDownload()) {
                                            clearInterval(checkReady);
                                            iframe.dataset.completed = 'true';
                                            window.open(downloadUrl, '_blank');
                                            clearInterval(countdownInterval);
                                            dlBtn.innerHTML = ' ✔️ ';
                                            setTimeout(() => {
                                                dlBtn.innerHTML = dlBtn.getAttribute('data-original-html');
                                                dlBtn.style.pointerEvents = 'auto';
                                            }, 3000);
                                            setTimeout(() => {
                                                if (iframe.parentNode) {
                                                    document.body.removeChild(iframe);
                                                }
                                            }, 3000);
                                        }
                                    }, 1000);
                                    clearInterval(checkReady);
                                }
                            }
                        }, 200);
                    };

                    openDownloadGate();
                };

                let doThanks = () => {
                    waitForSlot().then(() => {
                        startCountdownAndDownload();
                    });
                };

                if (thanksMatch) {
                    let thanksUrl = thanksMatch[1].replace(/&amp;/g, '&');
                    if (!thanksUrl.startsWith('http')) {
                        thanksUrl = BB_BASE + "/" + thanksUrl;
                    }
                    fetch(thanksUrl, { credentials: 'include' })
                        .then(() => doThanks())
                        .catch(() => doThanks());
                } else {
                    doThanks();
                }
            })
            .catch(err => {
                console.log('Process error:', err);
                dlBtn.innerHTML = ' 🔒 ';
                dlBtn.title = 'ไฟล์นี้ถูก Locked';
                dlBtn.style.pointerEvents = 'none';
            });
    }

    function checkDownloaded(torrentId, container, bookmarkBtn, ssBtn) {
        if (container.querySelector(`.status-check-${torrentId}`)) return;
        fetch(BB_BASE + "/details.php?id=" + torrentId)
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
                    window.open(BB_BASE + "/details.php?id=" + torrentId, '_blank');
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
