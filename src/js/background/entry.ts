/// <reference types="chrome"/>
import Badge from 'js/background/badge.ts';
import AjaxApi from 'js/background/ajax-executer.ts';

Badge.initialzeNiico();
Badge.addClickExtentionIconEventListener();

// content_scriptからmessageを受け取ったら処理する
chrome.runtime.onMessage.addListener(
    (message, sender, callback) => {
        switch (message.key) {
            case 'inactivateNiico':
                Badge.inactivateNiico();
                break;
            case 'activateNiico':
                Badge.activateNiico();
                break;
            case 'ajaxRequest':
                AjaxApi.ajaxExecute(message.params, message.request_id, sender);
                break;
        }
    }
);
