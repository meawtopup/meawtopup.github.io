// ==UserScript==
// @name         TorrentDD Domain Fixer 1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  เปลี่ยนลิงก์หรือข้อความให้ตรงกับโดเมนที่ใช้
// @author       MObyEX
// @match        *://*.torrentdd.net/*
// @match        *://*.torrentdd.com/*
// @icon          https://github.com/meawtopup/meawtopup.github.io/blob/main/assets/icon48.png?raw=true
// @grant        none
// @updateURL    https://github.com/meawtopup/meawtopup.github.io/blob/main/js/Domain-Fixer.user.js?raw=true
// @downloadURL  https://github.com/meawtopup/meawtopup.github.io/blob/main/js/Domain-Fixer.user.js?raw=true
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const isNet = location.hostname.endsWith('.net');
    const isCom = location.hostname.endsWith('.com');
    if (!isNet && !isCom) return;
    const fromDomain = isNet ? 'torrentdd.com' : 'torrentdd.net';
    const toDomain   = isNet ? 'torrentdd.net' : 'torrentdd.com';
    const fromRegex  = new RegExp(fromDomain.replace(/\./g, '\\.'), 'g');

    function replaceDomains() {
        const links = document.querySelectorAll(`a[href*="${fromDomain}"]`);
        links.forEach(link => {
            link.href = link.href.replace(fromRegex, toDomain);
        });

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.textContent.includes(fromDomain)) {
                node.textContent = node.textContent.replace(fromRegex, toDomain);
            }
        }
    }

    replaceDomains();

    const observer = new MutationObserver(() => {
        replaceDomains();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
