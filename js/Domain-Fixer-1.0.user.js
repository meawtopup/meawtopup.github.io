// ==UserScript==
// @name         TorrentDD Domain Fixer 1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  เปลี่ยนลิงก์หรือข้อความ .com ให้เป็น .net ภายในหน้าเว็บ
// @author       MObyEX
// @match        *://*.torrentdd.net/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=torrentdd.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function replaceDomains() {
        const links = document.querySelectorAll('a[href*="torrentdd.com"]');
        links.forEach(link => {
            link.href = link.href.replace('torrentdd.com', 'torrentdd.net');
        });

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('torrentdd.com')) {
                node.textContent = node.textContent.replace(/torrentdd\.com/g, 'torrentdd.net');
            }
        }
    }

    replaceDomains();

    const observer = new MutationObserver((mutations) => {
        replaceDomains();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
