export default {
    "manifest_version": 2,
    "name": "niico",
    "version": "*****更新履歴を元に書き換えられる*****",
    "description": "ニコニコ動画で動画をザッピングできるプレイヤーが立ち上がるChrome拡張機能。動画リンクをクリックすると起動します。ランキングや検索結果は勿論、コミュニティなどニコニコ動画のサブドメイン下ならどこでも起動します。",
    "permissions": [
        "http://*/*",
        "https://*/*",
        "storage",
        "tabs"
    ],
    "icons": {
        "16": "dist/img/icon/16.png",
        "48": "dist/img/icon/48.png",
        "128": "dist/img/icon/128.png"
    },
    "browser_action": {
        "default_icon": {
            "16": "dist/img/icon/16.png",
            "48": "dist/img/icon/48.png",
            "128": "dist/img/icon/128.png"
        }
    },
    "content_scripts": [
        {
            "matches": [
                "*://*.nicovideo.jp/**"
            ],
            "css": [
                "dist/style.css"
            ],
            "js": [
                "dist/content.js"
            ]
        }
    ],
    "background": {
        "scripts": ["dist/background.js"],
        "persistent": false
    },
    "web_accessible_resources": [
        "*.png"
    ]
}
