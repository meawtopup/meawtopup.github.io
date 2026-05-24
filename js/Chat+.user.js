// ==UserScript==
// @name         Chat+ 1.1 | TDD
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Chat+ Modifyer
// @author       MObyEX
// @include      *://*.torrentdd.*/chat.php*
// @run-at       document-start
// @icon         https://github.com/meawtopup/meawtopup.github.io/blob/main/assets/icon48.png?raw=true
// @grant        none
// @updateURL    https://github.com/meawtopup/meawtopup.github.io/blob/main/js/Chat+.user.js?raw=true
// @downloadURL  https://github.com/meawtopup/meawtopup.github.io/blob/main/js/Chat+.user.js?raw=true
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

    const settings = {
        layout: localStorage.getItem('tdd_layout') || 'Default',
        height: parseInt(localStorage.getItem('tdd_height')) || 500,
        maxLines: parseInt(localStorage.getItem('tdd_maxlines')) || 100,
        userOnline: localStorage.getItem('tdd_useronline') || 'Show',
        quoteBtn: localStorage.getItem('tdd_quotebtn') || 'Default',
        radio: localStorage.getItem('tdd_radio') || 'On'
    };
    function saveSettings() {
        localStorage.setItem('tdd_layout', settings.layout);
        localStorage.setItem('tdd_height', settings.height);
        localStorage.setItem('tdd_maxlines', settings.maxLines);
        localStorage.setItem('tdd_useronline', settings.userOnline);
        localStorage.setItem('tdd_quotebtn', settings.quoteBtn);
        localStorage.setItem('tdd_radio', settings.radio);
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (settings.radio === 'Off' && typeof url === 'string' && url.includes("radio=true")) {
            return;
        }
        return originalOpen.apply(this, arguments);
    };

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

    function initChatImagePopup() {
        const chatScreen = document.querySelector('.chat-screen');
        if (!chatScreen) return;

        chatScreen.addEventListener('click', function (e) {
            const link = e.target.closest('.box-msg span a, .box-msg .text-break-all > span a');
            if (!link) return;

            const url = link.href;
            if (url.match(/\.(jpeg|jpg|gif|png|webp|bmp)(?:\?.*)?$/i)) {
                if (e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
                    e.preventDefault();
                    showSSPopup(url);
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {

        const style = document.createElement('style');
        style.id = 'tdd-custom-css';
        document.head.appendChild(style);

        function applySettingsUI() {
            let css = '';
            const h = settings.height + 'px';
            css += `
                #tdd-settings-menu .input-group { height: 31px !important; }
                #tdd-settings-menu .input-group-text { width: 110px !important; font-size: 12px !important; justify-content: center !important; padding: 0 !important; }
                #tdd-settings-menu .form-control { height: 100% !important; padding: 0 !important; }
            `;

            if (settings.layout === 'Fixed') {
                css += `
                    .chat-screen, .chat-userlist, .tdd-chat-wrapper, .tdd-user-wrapper {
                        height: ${h} !important;
                        max-height: ${h} !important;
                        min-height: ${h} !important;
                        overflow-y: auto !important;
                    }

                    .tdd-chat-wrapper > .slimScrollBar, .tdd-chat-wrapper > .slimScrollRail,
                    .tdd-user-wrapper > .slimScrollBar, .tdd-user-wrapper > .slimScrollRail {
                        display: none !important;
                    }

                    .chat-box, .chat-box-screen, .chat-box-main, .chat-box-list, .card, .card-body {
                        height: auto !important;
                    }

                    .chat-userlist .box-msg-user { display: flex !important; align-items: center !important; padding-left: 10px !important; }
                `;
            }

            if (settings.userOnline === 'Hide') {
                css += `
                    .chat-box-list { display: none !important; }
                    .chat-box { width: 100% !important; max-width: 100% !important; flex: 0 0 100% !important; }
                `;
            }

            if (settings.quoteBtn === 'Expanded') {
                css += `
                    img.btn-copy {
                        width: 10px !important;
                        height: 10px !important;
                        background-color: #e2e2e2;
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        padding: 1px;
                        margin-right: 4px !important;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    img.btn-copy:hover {
                        background-color: #d1d1d1;
                    }
                `;
            }

            css += `
                .tdd-radio-container { background: #ab8ce4; border-radius: 5px; padding: 5px; display: flex; align-items: center; color: #fff; width: 100%; max-width: 220px; height: 34px; }
                .tdd-radio-btn { background: none; border: none; color: white; cursor: pointer; padding: 0 10px; font-size: 16px; width: 35px; }
                .tdd-radio-time { font-size: 11px; font-family: monospace; min-width: 50px; text-align: center; margin-right: 5px; }
                .tdd-radio-volume-container { display: flex; align-items: center; flex-grow: 1; margin-left: 5px; }
                .tdd-radio-vol-slider { -webkit-appearance: none; width: 100%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; cursor: pointer; }
                .tdd-radio-vol-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; }
                .tdd-radio-vol-slider::-moz-range-thumb { width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; border: none; }
                .tdd-mute-btn { background: none; border: none; color: white; cursor: pointer; padding: 0 5px; font-size: 14px; }
            `;

            css += `
                #audio {
                    opacity: 0 !important;
                    pointer-events: none !important;
                    position: absolute !important;
                    height: 0px !important;
                    width: 0px !important;
                    overflow: hidden !important;
                }
            `;

            document.getElementById('tdd-custom-css').innerHTML = css;

            if (settings.radio === 'Off') {
                css += `
                    #audio, #radio,
                    a[href*="request_song_widget.php"],
                    embed[src*="radio"],
                    iframe[src*="radio"] {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }
                `;

                const killRadio = () => {
                    $('#audio, #radio, a[href*="request_song_widget.php"], embed[src*="radio"], iframe[src*="radio"]').each(function () {
                        try { if (this.pause) this.pause(); } catch (e) { }
                        $(this).remove();
                    });
                };

                killRadio();
                setTimeout(killRadio, 1000);
            }
        }

        function forceLayout() {
            if (settings.layout !== 'Fixed') return;
            const h = settings.height + 'px';

            $('.chat-screen').parent('.slimScrollDiv').addClass('tdd-chat-wrapper');
            $('.chat-userlist').parent('.slimScrollDiv').addClass('tdd-user-wrapper');

            $('.chat-screen, .chat-userlist, .tdd-chat-wrapper, .tdd-user-wrapper').css('height', h);
            $('.chat-box, .chat-box-screen, .card, .card-body').css('height', 'auto');
        }

        const overrideRemoveTextChat = () => {
            window.removeTextchat = function () {
                var list = $(".chat-screen .box-msg");
                if (list.length > settings.maxLines) {
                    list.slice(0, list.length - settings.maxLines).remove();
                }
            };

            window.removeTextchat();

            Object.defineProperty(window, 'removeTextchat', {
                writable: false,
                configurable: false
            });
        };

        function buildMenu() {
            const target = $('a.nav-link').filter(function () {
                return $(this).text().trim().includes('Donation');
            }).closest('li.nav-item');
            if (target.length === 0) return;
            const menuHTML = `
            <li class="nav-item dropdown" id="tdd-settings-menu">
                <a class="nav-link" href="#" data-toggle="dropdown">
                    <span>
                    Chat+
                    <b class="fal fa-chevron-down fa-sm"></b>
                    </span>
                </a>
                <div class="dropdown-menu navbar-dropdown" style="min-width: 250px; padding: 15px 10px;">
                    <div class="px-2 py-1">
                        <button id="st-layout" class="btn btn-sm btn-block btn-${settings.layout === 'Default' ? 'secondary' : 'info'}">Chat Layout: ${settings.layout}</button>
                    </div>
                    <div class="px-2 py-1">
                        <div class="input-group input-group-sm">
                            <div class="input-group-prepend"><span class="input-group-text">Layout Height</span></div>
                            <input type="number" id="st-height" class="form-control text-center" value="${settings.height}" min="150" max="4000" ${settings.layout === 'Default' ? 'disabled' : ''}>
                        </div>
                    </div>
                    <div class="px-2 py-1">
                        <div class="input-group input-group-sm">
                            <div class="input-group-prepend"><span class="input-group-text">Max Lines</span></div>
                            <input type="number" id="st-maxlines" class="form-control text-center" value="${settings.maxLines}" min="10" max="1000">
                        </div>
                    </div>
                    <div class="px-2 py-1 mt-2">
                        <button id="st-useronline" class="btn btn-sm btn-block btn-${settings.userOnline === 'Show' ? 'success' : 'secondary'}">User Online: ${settings.userOnline}</button>
                    </div>
                    <div class="px-2 py-1">
                        <button id="st-quotebtn" class="btn btn-sm btn-block btn-${settings.quoteBtn === 'Default' ? 'secondary' : 'primary'}">Quote Button: ${settings.quoteBtn}</button>
                    </div>
                    <div class="px-2 py-1">
                        <button id="st-radio" class="btn btn-sm btn-block btn-${settings.radio === 'On' ? 'success' : 'danger'}">Radio: ${settings.radio}</button>
                    </div>
                    <div class="px-2 py-2" id="st-status" style="display: none;">
                        <button id="st-apply-refresh" class="btn btn-danger btn-sm btn-block" style="font-size: 12px;">
                            Apply changes & Refresh
                        </button>
                    </div>
                </div>
            </li>`;
            target.before(menuHTML);

            $('#tdd-settings-menu .dropdown-menu').on('click', (e) => e.stopPropagation());

            $('#st-layout').click(function () {
                settings.layout = settings.layout === 'Default' ? 'Fixed' : 'Default';
                $(this).text('Chat Layout: ' + settings.layout)
                    .removeClass('btn-secondary btn-info')
                    .addClass(settings.layout === 'Default' ? 'btn-secondary' : 'btn-info');
                $('#st-height').prop('disabled', settings.layout === 'Default');
                saveSettings(); $('#st-status').fadeIn();
            });
            $('#st-height').change(function () {
                let val = parseInt($(this).val());
                const min = 150;
                const max = 4000;

                if (val < min || val > max || isNaN(val)) {
                    alert(`กรุณาระบุความสูงระหว่าง ${min} ถึง ${max} px เท่านั้น!`);
                    $(this).val(settings.height);
                    return;
                }

                settings.height = val;
                saveSettings();
                $('#st-status').fadeIn();
            });

            $('#st-maxlines').change(function () {
                let val = parseInt($(this).val());
                const min = 10;
                const max = 1000;

                if (val < min || val > max || isNaN(val)) {
                    alert(`กรุณาระบุจำนวนบรรทัดระหว่าง ${min} ถึง ${max} บรรทัด!`);
                    $(this).val(settings.maxLines);
                    return;
                }

                settings.maxLines = val;
                saveSettings();
                $('#st-status').fadeIn();
            });
            $('#st-useronline').click(function () {
                settings.userOnline = settings.userOnline === 'Show' ? 'Hide' : 'Show';
                $(this).text('User Online: ' + settings.userOnline)
                    .removeClass('btn-success btn-secondary')
                    .addClass(settings.userOnline === 'Show' ? 'btn-success' : 'btn-secondary');
                saveSettings(); $('#st-status').fadeIn();
            });
            $('#st-quotebtn').click(function () {
                settings.quoteBtn = settings.quoteBtn === 'Default' ? 'Expanded' : 'Default';
                $(this).text('Quote Button: ' + settings.quoteBtn)
                    .removeClass('btn-secondary btn-primary')
                    .addClass(settings.quoteBtn === 'Default' ? 'btn-secondary' : 'btn-primary');
                saveSettings(); $('#st-status').fadeIn();
            });
            $('#st-radio').click(function () {
                settings.radio = settings.radio === 'On' ? 'Off' : 'On';
                $(this).text('Radio: ' + settings.radio)
                    .removeClass('btn-success btn-danger')
                    .addClass(settings.radio === 'On' ? 'btn-success' : 'btn-danger');
                saveSettings(); $('#st-status').fadeIn();
            });
            $('#st-apply-refresh').click(function () {
                $('audio, video').each(function () { this.pause(); this.src = ""; });
                location.reload();
            });
        }

        function setupCustomRadio() {
            if (settings.radio === 'Off') return;

            const $oldAudio = $('#audio');
            if ($oldAudio.length === 0) return;
            try {
                const oldEl = $oldAudio[0];
                oldEl.pause();
                oldEl.muted = true;
            } catch (e) { }

            const audioSrc = $oldAudio.find('source').attr('src') || $oldAudio.attr('src');
            const $parent = $oldAudio.parent();

            const playerHTML = `
                <div class="tdd-radio-container" id="tdd-radio-ui">
                    <audio id="tdd-audio-core"><source src="${audioSrc}" type="audio/mpeg"></audio>
                    <button type="button" class="tdd-radio-btn" id="tdd-play-pause"><i class="fa fa-play"></i></button>
                    <div class="tdd-radio-time" id="tdd-time">00:00</div>
                    <div class="tdd-radio-volume-container">
                        <button type="button" class="tdd-mute-btn" id="tdd-mute"><i class="fa fa-volume-up"></i></button>
                        <input type="range" class="tdd-radio-vol-slider" id="tdd-vol" min="0" max="1" step="0.01" value="0.3">
                    </div>
                </div>
            `;

            $parent.empty().append(playerHTML);

            const audio = document.getElementById('tdd-audio-core');
            const playBtn = $('#tdd-play-pause');
            const timeDisplay = $('#tdd-time');
            const volSlider = $('#tdd-vol');
            const muteBtn = $('#tdd-mute');
            let lastVol = 0.3;

            audio.volume = 0.3;

            playBtn.on('click', function () {
                if (audio.paused) {
                    audio.load();
                    audio.play();
                    $(this).html('<i class="fa fa-stop"></i>');
                } else {
                    audio.pause();
                    $(this).html('<i class="fa fa-play"></i>');
                }
            });

            audio.addEventListener('timeupdate', function () {
                const s = Math.floor(audio.currentTime);
                const hrs = Math.floor(s / 3600);
                const mins = Math.floor((s % 3600) / 60);
                const secs = Math.floor(s % 60);
                let display = (hrs > 0 ? (hrs < 10 ? "0" + hrs : hrs) + ":" : "") +
                    (mins < 10 ? "0" + mins : mins) + ":" +
                    (secs < 10 ? "0" + secs : secs);
                timeDisplay.text(display);
            });

            volSlider.on('input', function () {
                const val = parseFloat($(this).val());
                audio.volume = val;
                if (val > 0) {
                    audio.muted = false;
                    muteBtn.html('<i class="fa fa-volume-up"></i>');
                    lastVol = val;
                } else {
                    muteBtn.html('<i class="fa fa-volume-off"></i>');
                }
            });

            muteBtn.on('click', function () {
                if (audio.volume > 0) {
                    lastVol = audio.volume;
                    audio.volume = 0;
                    volSlider.val(0);
                    $(this).html('<i class="fa fa-volume-off"></i>');
                } else {
                    audio.volume = lastVol;
                    volSlider.val(lastVol);
                    $(this).html('<i class="fa fa-volume-up"></i>');
                }
            });
        }

        applySettingsUI();
        buildMenu();
        initChatImagePopup();
        let radioRetry = 0;
        const checkRadio = setInterval(() => {
            if ($('#audio').length > 0 || radioRetry > 100) {
                setupCustomRadio();
                clearInterval(checkRadio);
            }
            radioRetry++;
        }, 50);
        setTimeout(overrideRemoveTextChat, 800);

        const observer = new MutationObserver(() => {
            forceLayout();
        });

        const body = document.querySelector('body');
        if (body) {
            observer.observe(body, { childList: true, subtree: true });
        }

        forceLayout();
        $(window).on('resize', forceLayout);
    });
})();
