/*
    ローカルストレージやbackgroundの操作ヘルパー
*/

export default class {
    static getStorage(keys) {
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, items => {
                resolve(items);
            });
        })
    }

    static setStorage(items) {
        return new Promise((resolve) => {
            chrome.storage.local.set(items, () => {
                resolve(true);
            })
        })
    }

    static setBadge(is_niico_off) {
        return chrome.runtime.sendMessage({
            key: is_niico_off ? 'inactivateNiico' : 'activateNiico',
        })
    }

    static addListener(callback) {
        return chrome.runtime.onMessage.addListener(callback);
    }
}
