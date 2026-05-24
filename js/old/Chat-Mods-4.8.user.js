// ==UserScript==
// @name          Chat Mods 4.8 | TDDChat
// @namespace     http://tampermonkey.net/
// @version       4.8
// @description   บังคับความสูงแชท, เพิ่มปุ่มซ่อนรายชื่อ, ขยายจำนวนแชทที่แสดง และระบบควบคุมวิทยุ
// @author        MObyEX
// @include      https://www.torrentdd.*/chat.php*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=torrentdd.com
// @grant         none
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

    const MAX_CHAT_MESSAGES = 500; // ขยายจำนวนข้อความแก้ตรงนี้

    try {
        Object.defineProperty(window, 'chat_limit', {
            get: function() { return MAX_CHAT_MESSAGES; },
            set: function(val) { },
            configurable: true
        });
    } catch (e) {
        window.chat_limit = MAX_CHAT_MESSAGES;
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && url.includes("radio=true") && !window.isRadioOnReal) {
            return; 
        }
        return originalOpen.apply(this, arguments);
    };

    const FIXED_HEIGHT = '700px'; // ขยายกรอบแสดงข้อความแก้ตรงนี้
    const RADIO_URL = "https://radio1.ohmi-design.com/8704/;";
    let isRadioOn = false; 

    const style = document.createElement('style');
    style.innerHTML = `
        .chat-screen, .chat-userlist, .main-chat-wrapper, .main-userlist-wrapper {
            height: ${FIXED_HEIGHT} !important;
            max-height: ${FIXED_HEIGHT} !important;
            min-height: ${FIXED_HEIGHT} !important;
            overflow-y: auto !important;
        }
        .main-chat-wrapper > .slimScrollBar,
        .main-chat-wrapper > .slimScrollRail,
        .main-userlist-wrapper > .slimScrollBar,
        .main-userlist-wrapper > .slimScrollRail {
            display: none !important;
        }
        .chat-box-list.hide-column { display: none !important; }
        .chat-box.expand-chat {
            width: 100% !important; max-width: 100% !important; flex: 0 0 100% !important; float: none !important;
        }
        .chat-box-screen { position: relative !important; }
        .emo-outer-wrapper {
            position: absolute !important; bottom: 0px !important; left: 0px !important; right: 0px !important;
            height: 250px !important; z-index: 9999 !important; background: #1a1a1b !important;
            border: 1px solid #444 !important; border-radius: 6px !important;
            box-shadow: 0 -5px 15px rgba(0,0,0,0.5) !important; padding: 10px !important;
        }
        .emo-inner-wrapper, #box-emotion {
            height: 100% !important; max-height: 100% !important; width: 100% !important; overflow-y: auto !important;
        }
        .chat-screen::-webkit-scrollbar, .chat-userlist::-webkit-scrollbar, #box-emotion::-webkit-scrollbar {
            width: 8px;
        }
        .chat-screen::-webkit-scrollbar-thumb, .chat-userlist::-webkit-scrollbar-thumb, #box-emotion::-webkit-scrollbar-thumb {
            background: #555; border-radius: 4px;
        }
        .emo-inner-wrapper > .slimScrollBar, .emo-inner-wrapper > .slimScrollRail { display: none !important; }

        #custom-toggle-btn {
            display: inline-block !important; margin-left: 10px !important; padding: 0px 8px !important;
            font-size: 11px !important; height: 22px !important; line-height: 22px !important;
            border-radius: 3px !important; background-color: #ff4757 !important; color: white !important;
            border: none !important; cursor: pointer !important; vertical-align: middle !important;
        }

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

        .chat-container { height: auto !important; }
        .hd-1 { display: block !important; width: auto !important; }
    `;
    document.head.appendChild(style);

    function initClasses() {
        $('.chat-screen').parent('.slimScrollDiv').addClass('main-chat-wrapper');
        $('.chat-userlist').parent('.slimScrollDiv').addClass('main-userlist-wrapper');
        $('#box-emotion').parent('.slimScrollDiv').addClass('emo-inner-wrapper');
        $('#box-emotion').closest('.p-3').addClass('emo-outer-wrapper');
    }

    function forceLayout() {
        initClasses();
        $('.chat-screen, .chat-userlist, .main-chat-wrapper, .main-userlist-wrapper').css('height', FIXED_HEIGHT);
        $('.chat-box, .chat-box-screen').css('height', 'auto');
        $('.emo-inner-wrapper').css('height', '100%');

        if (typeof window.removeTextchat === 'function' && !window.isOverridden) {
            window.removeTextchat = function() {
                var list = $(".chat-screen .box-msg");
                if (list.length > MAX_CHAT_MESSAGES) {
                    list.slice(0, list.length - MAX_CHAT_MESSAGES).remove();
                }
            };
            window.isOverridden = true;
        }
    }

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
        if (!$('#custom-toggle-btn').length) {
            const target = $('.hd-1');
            if (target.length) {
                const btn = $('<button id="custom-toggle-btn">ซ่อน/แสดง รายชื่อ</button>');
                btn.on('click', function (e) {
                    e.preventDefault();
                    $('.chat-box-list').toggleClass('hide-column');
                    $('.chat-box').toggleClass('expand-chat');
                    forceLayout();
                });
                target.append(btn);
            }
        }

        if (!$('#al-toggle-btn').length) {
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
        forceLayout();
        applyRadioState();
    }

    const observer = new MutationObserver(() => {
        initButtons();
        forceLayout();
    });

    setTimeout(() => {
        setup();
        const body = document.querySelector('body');
        if (body) observer.observe(body, { childList: true, subtree: true });
    }, 500);

    $(window).on('resize', forceLayout);
    $(document).ready(setup);

})();
