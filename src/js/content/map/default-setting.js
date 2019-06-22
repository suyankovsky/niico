export default {
    // niicoをオフにする
    is_niico_off: false,

    // 現在みているパネルID
    // panel_map
    active_panel_id: 'VideoDetailPanel',

    // 再生終了後にすること
    // do_on_ended_map
    do_on_ended: 'is_next_video',

    // ショートカットキーを使う
    is_use_shortcut: true,

    // 音量
    volume: 1,
    volume_is_mute: false,

    // コメント不透明度
    comment_opacity: 1,
    comment_is_mute: false,

    // コメントの最大行数
    comment_max_line_num: 11,

    // 常に弾幕モードにする
    is_always_danmaku_mode: true,

    // コメントが流れる秒数
    flow_duration_seconds: 1,

    // コメントの当たり判定を事前に行う
    is_compute_tpos_in_advance: false,

    selected_mylist_id: 'default',

    // 早送り、巻き戻しで動かす秒数
    moves_seconds: 5,

    // 設定パネルでヘルプを表示する
    is_show_setting_help: false,

    // コメントソート順
    comment_sort_by: 'date_asc',

    // 動画に合わせて自動スクロールする
    comment_is_auto_scroll: false,

    // タグをスクロールする
    is_horizontal_scroll: false,

    // ツイートにハッシュタグ「#niico」を追加する
    is_append_hashtag_niico_on_tweet: true,

    // Chromeデフォルトの再生コントローラを使う
    is_default_player_controller: false,

    // デバッグパネルを表示する
    is_show_debug_panel: false,

    // ログパネルを表示する
    is_show_log_panel: false,

    player_width: 512,
    is_auto_player_width: true,
};
