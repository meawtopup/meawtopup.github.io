// ==UserScript==
// @name          DLnSS Button 1.0 | BB
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   ปุ่ม Download & SS Popup
// @author        MObyEX
// @match         https://bearbit.org/viewno18sbx.php*
// @match         https://bearbit.org/viewbrsb.php*
// @match         https://bearbit.org/details.php*
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

    function showSSPopup(imgUrl) {
        let overlay = document.createElement('div');
        overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center; cursor:pointer;';

        let container = document.createElement('div');
        container.style = 'position:relative; background:#fff; padding:5px; padding-bottom:35px; border-radius:5px; max-height:800px; box-shadow:0 0 20px rgba(0,0,0,0.5); cursor:default;';

        let img = document.createElement('img');
        img.src = imgUrl;
        img.style = 'height:auto; max-height:760px; width:auto; display:block; border-radius:3px;';

        let closeBtn = document.createElement('div');
        closeBtn.innerHTML = 'CLOSE';
        closeBtn.style = 'position:absolute; bottom:5px; left:50%; transform:translateX(-50%); padding:0 15px; background:#ff4444; color:#fff; text-align:center; line-height:22px; font-size:11px; font-weight:bold; cursor:pointer; border-radius:3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);';

        closeBtn.onclick = () => document.body.removeChild(overlay);
        overlay.onclick = (e) => { if(e.target === overlay) document.body.removeChild(overlay); };

        container.appendChild(img);
        container.appendChild(closeBtn);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
    }

    function processDownload(torrentId, dlBtn) {
        dlBtn.innerHTML = ' ⏳ ';
        let iframe = document.createElement('iframe');
        iframe.src = "https://bearbit.org/details.php?id=" + torrentId;
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        iframe.onload = function() {
            try {
                let iframeDoc = iframe.contentWindow.document;
                let thanksBtn = iframeDoc.querySelector('td#saythanks a[onclick*="say_thanks"]');
                if (thanksBtn) {
                    thanksBtn.click();
                    dlBtn.style.color = "#28a745";
                }
                setTimeout(() => {
                    let downloadLink = iframeDoc.querySelector('a[href^="downloadnew.php"]');
                    if (downloadLink) {
                        window.location.href = "https://bearbit.org/" + downloadLink.getAttribute('href');
                        dlBtn.innerHTML = ' ✅ ';
                    } else {
                        window.location.href = `https://bearbit.org/downloadnew.php?id=${torrentId}`;
                    }
                    setTimeout(() => {
                        if (iframe.parentNode) document.body.removeChild(iframe);
                        dlBtn.innerHTML = dlBtn.getAttribute('data-original-html');
                        dlBtn.style.color = dlBtn.getAttribute('data-original-color') || "";
                    }, 1500);
                }, 300);
            } catch (err) { window.location.href = "https://bearbit.org/details.php?id=" + torrentId; }
        };
    }

    const isBrowsePage = window.location.pathname.includes('viewno18sbx.php') || window.location.pathname.includes('viewbrsb.php');

    if (isBrowsePage) {
        const bookmarkBtns = document.querySelectorAll('a[id^="bookmark-btn-"]');
        bookmarkBtns.forEach(btn => {
            const torrentId = btn.id.replace('bookmark-btn-', '');
            const parent = btn.parentNode;

            const dlBtn = document.createElement('a');
            dlBtn.innerHTML = ' 📥 ';
            dlBtn.setAttribute('data-original-html', ' 📥 ');
            dlBtn.style = 'cursor:pointer; margin-right:5px; text-decoration:none; font-size:14px;';
            dlBtn.onclick = (e) => { e.preventDefault(); processDownload(torrentId, dlBtn); };
            parent.insertBefore(dlBtn, btn);

            const ssBtn = document.createElement('a');
            ssBtn.innerHTML = ' 🖼️ ';
            ssBtn.style = 'cursor:pointer; margin-right:5px; text-decoration:none; font-size:14px;';

            ssBtn.onclick = function(e) {
                e.preventDefault();
                ssBtn.innerHTML = ' ⏳ ';

                fetch(`https://bearbit.org/details.php?id=${torrentId}`)
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');

                        const tds = Array.from(doc.querySelectorAll('td.rowhead'));
                        const ssTitleTd = tds.find(td => td.innerText.includes('ScreenShot'));

                        if (ssTitleTd) {
                            const targetTd = ssTitleTd.nextElementSibling;
                            const imgLink = targetTd ? targetTd.querySelector('a[href]') : null;

                            if (imgLink) {
                                showSSPopup(imgLink.getAttribute('href'));
                            } else {
                                alert("ไม่พบลิงก์ในแถว ScreenShot");
                            }
                        } else {
                            alert("ไม่พบหัวข้อ ScreenShot ในหน้านี้");
                        }
                        ssBtn.innerHTML = ' 🖼️ ';
                    })
                    .catch(() => {
                        alert("Error loading image");
                        ssBtn.innerHTML = ' 🖼️ ';
                    });
            };
            parent.insertBefore(ssBtn, btn);
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
                    container.style = 'text-align: center; margin-top: 5px;';
                    const dlBtnDetail = document.createElement('a');
                    const text = '📥<br>DL-Now';
                    dlBtnDetail.innerHTML = text;
                    dlBtnDetail.setAttribute('data-original-html', text);
                    dlBtnDetail.setAttribute('data-original-color', 'blue');
                    dlBtnDetail.style = 'cursor:pointer; text-decoration:none; font-size:12px; color: blue; font-weight: bold; display: block; border: 1px solid #ccc; padding: 2px; border-radius: 4px; background: #f9f9f9;';
                    dlBtnDetail.onclick = (e) => { e.preventDefault(); processDownload(torrentId, dlBtnDetail); };
                    container.appendChild(dlBtnDetail);
                    td.appendChild(container);
                }
            });
        }
    }
})();
