// ==UserScript==
// @name         Radio 2.0 | TDDRadio
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  ควบคุมวิทยุแบบสลับสถานะเพื่อความเสถียร
// @author       MObyEX
// @include      https://www.torrentdd.*/chat.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentdd.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && url.includes("radio=true") && !window.isRadioOnReal) {
            return; 
        }
        return originalOpen.apply(this, arguments);
    };

    const RADIO_URL = "https://radio1.ohmi-design.com/8704/;";
    let isRadioOn = false; 
    window.isRadioOnReal = false;

    const style = document.createElement('style');
    style.innerHTML = `
        #audio {
            display: none !important;
            width: 300px !important;
            height: 30px !important;
            vertical-align: middle !important;
            margin-right: 5px !important;
            border-radius: 4px;
        }
        #al-toggle-btn {
            display: inline-block !important;
            vertical-align: middle !important;
            height: 30px !important; 
            line-height: 1 !important;
        }
    `;
    document.head.appendChild(style);

    function applyRadioState() {
        const radioVideo = document.getElementById('audio');
        const radioStatus = document.getElementById('radio');
        const requestBtn = document.querySelector('a[href*="request_song_widget.php"]');
        const toggleBtn = document.getElementById('al-toggle-btn');

        if (!radioVideo || !toggleBtn) return;

        if (isRadioOn) {
            window.isRadioOnReal = true;
            radioVideo.style.setProperty('display', 'inline-block', 'important'); 
            if (radioStatus) radioStatus.style.display = 'block';
            if (requestBtn) requestBtn.style.display = 'inline-block';
            toggleBtn.innerHTML = '📻 ปิดวิทยุ';
            toggleBtn.className = 'btn btn-danger btn-sm ml-1';

            if (!radioVideo.src || radioVideo.src.includes('about:blank') || radioVideo.src === window.location.href) {
                radioVideo.src = RADIO_URL + "?t=" + Date.now();
                radioVideo.load();
                radioVideo.play().catch(() => { });
            }
        } else {
            window.isRadioOnReal = false;
            radioVideo.pause();
            radioVideo.src = "";
            radioVideo.load();
            radioVideo.style.setProperty('display', 'none', 'important'); 
            if (radioStatus) radioStatus.style.display = 'none';
            if (requestBtn) requestBtn.style.display = 'none';
            toggleBtn.innerHTML = '📻 เปิดวิทยุ';
            toggleBtn.className = 'btn btn-secondary btn-sm ml-1';
        }
    }

    function initButtons() {
        if (!document.getElementById('al-toggle-btn')) {
            const radioVideo = document.getElementById('audio');
            if (radioVideo) {
                const btn = document.createElement('button');
                btn.id = 'al-toggle-btn';
                btn.type = 'button';
                btn.onclick = (e) => {
                    e.preventDefault();
                    isRadioOn = !isRadioOn;
                    applyRadioState();
                };
                radioVideo.parentNode.insertBefore(btn, radioVideo.nextSibling);
                applyRadioState(); 
            }
        }
    }

    function setup() {
        initButtons();
    }

    const observer = new MutationObserver(() => {
        initButtons();
    });

    setTimeout(() => {
        setup();
        const body = document.querySelector('body');
        if (body) observer.observe(body, { childList: true, subtree: true });
    }, 500); 

})();
