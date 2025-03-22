// ==UserScript==
// @name         FuckYouNamuwiki
// @version      1.0.0
// @author       green1052
// @match        https://namu.wiki/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

function removeAd() {
    const result = [];

    for (const element of document.querySelectorAll(`span:has(> img[src^="data:image/svg+xml;"] + img[src^="//i.namu.wiki/i/"])`)) {
        if (Array.from(element.attributes).filter((attr) => attr.name.startsWith("data-v-")).length === 2) result.push(element);
    }

    for (const element of result) {
        let parent = element;
        let found = false;

        for (let i = 0; i < 10; i++) {
            parent = parent.parentElement;

            if (
                parent.tagName === "DIV" &&
                (
                    parent.getAttribute("style")?.startsWith("margin 0;") ||
                    parent.getAttribute("style")?.startsWith("color: rgba(")
                )
            ) {
                found = true;
                break;
            }
        }

        if (found) {
            parent.remove();
            break;
        }
    }
}

function removeAd2() {
    for (const element of document.querySelectorAll(`span + div:has(span)`)) {
        if (element.textContent !== "광고") continue;

        let parent = element;
        let found = false;

        for (let i = 0; i < 10; i++) {
            parent = parent.parentElement;
            if (parent.tagName === "DIV" && parent.getAttribute("style")?.startsWith("color: rgba(")) {
                found = true;
                break;
            }
        }

        if (found) {
            parent.remove();
            break;
        }
    }
}

unsafeWindow.history.pushState = new Proxy(unsafeWindow.history.pushState, {
    apply(target, thisArg, argArray) {
        setTimeout(() => {
            removeAd();
            removeAd2();
        }, 1000);

        return target.apply(thisArg, argArray);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        removeAd();
        removeAd2();
    }, 1000);
});