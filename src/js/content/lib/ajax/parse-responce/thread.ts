export default function (responce) {
    return responce.filter(comment => {
        return comment && comment.chat && comment.chat.content;
    }).map(comment => {
        comment.chat.vpos = comment.chat.vpos / 100; // 秒にする
        return comment.chat;
    }).sort((a, b) => {
        if (a.vpos < b.vpos) return -1;
        if (a.vpos > b.vpos) return 1;
        return 0;
    });
}
