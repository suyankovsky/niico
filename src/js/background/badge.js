export default class {
    static activateNiico() {
        chrome.browserAction.setBadgeText({text:'ON'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#39A0FF'});
    }

    static inactivateNiico() {
        chrome.browserAction.setBadgeText({text:'OFF'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#ccc'});
    }

    static initialzeNiico() {
        chrome.browserAction.setBadgeText({text:'...'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#ccc'});
    }

    static addClickExtentionIconEventListener() {
        // アイコンをクリックしたらcontent_scriptに送信
        chrome.browserAction.onClicked.addListener(function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    key: 'toggleNiico',
                });
            });
        })
    }
}
