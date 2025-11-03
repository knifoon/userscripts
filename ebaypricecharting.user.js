// ==UserScript==
// @name         PriceCharting Link
// @namespace    http://knifoon.com
// @version      1.11
// @description  Adds a link to pricecharting page if available
// @author       knifoon
// @match        https://www.ebay.com/itm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(async function() {
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    document.addEventListener("DOMContentLoaded", function() {
        console.log('loaded script')
        waitForElm('.x-item-title').then(title => {
            let item = title.querySelector('h1').innerText
            item = item.toLowerCase().replace(/(bgs|psa|cgc|ags)(\s)?\d{1,2}(\.5)?/,'')
            item = item.replace('ultra rare','')
            const wordsToRemove = ["tcg","pokemon","card","pokémon","(nm)","(lp)","(mp)","mp","lp","nm","1999","kids","wb","first","movie","wotc","1st","bgs","cgc","psa",'xy','evolutions','2002','2022','2023','2024','2025','common','sv5a','sv','jp'];
            const filteredString = item
            .split(' ')
            .filter(word => !wordsToRemove.includes(word.toLowerCase()))
            .join(' ')
            console.log(filteredString);

            const extract = filteredString.match(/(.*?)\s#?((?:\w*)\d+)/)
            if (extract){
                let name = extract[1].split(' ').join('+')
                let number = extract[2]
                let promo = item.toLowerCase().includes('promo') ? '+promo':''
                title.insertAdjacentHTML('afterend',`<a href="https://www.pricecharting.com/search-products?q=${name}+${number+promo}&type=prices" target="_blank"><img src="https://www.pricecharting.com/images/logo-pricecharting-new.png" width=80px></a>`)
            }
        })
    })
})();