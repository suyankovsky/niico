export default {
    UNKNOWN: '動画のステータスがヘンです。バグかも。',
    MEDIA_ERR_ABORTED: '動画の読み込みが中断されました。',
    MEDIA_ERR_NETWORK: 'ネットワークエラーが発生しました。',
    MEDIA_ERR_DECODE: '動画のデコードに失敗しました。',
    MEDIA_ERR_SRC_NOT_SUPPORTED: 'ブラウザがサポートしていない動画フォーマットです。ニコニコ動画でなら視聴できるかも。',
    PARSE_ERR_FAILED_LOAD_VIDEO: '動画の情報取得に失敗しました。',
    PARSE_ERR_NO_VIDEO_URL: `
        動画URLの取得に失敗しました。
        削除済み動画・非公開動画・コミュニティ専用動画など
        あなたが視聴できない動画の可能性があります。
    `,
    CONTEXT_ERR_ENCRYPTED_VIDEO: '暗号化された動画です。niico非対応のため視聴できません。ごめんなさい。ニコニコ動画で視聴してください。',
    CONTEXT_ERR_NEED_PAYMENT: '未購入の有料動画のため視聴権限がありません。購入すると視聴できるようになります。',
    CONTEXT_ERR_NEED_JOIN_CHANNEL: 'チャンネル会員専用動画のため視聴権限がありません。チャンネル入会すると視聴できるようになります。',
}
