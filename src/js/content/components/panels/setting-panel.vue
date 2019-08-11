<template>
    <div
     class="panel"
     :class="['panel', {'panel--is_show-help' : is_show_setting_help}]"
    >
        <section>
            <h1>
                <span class="icon"><VideoIcon /></span>
                <span class="text">動画</span>
            </h1>
            <main>
                <dl>
                    <dt>
                        <span>早送り/巻き戻し</span>
                        <var>{{video.current_time|formatTime}}</var>
                    </dt>
                    <dd>
                        <div class="buttons">
                            <div class="button" @click="seekBackward">
                                <span class="icon"><SeekBackward /></span>
                                <span>{{moves_seconds}}秒巻き戻し</span>
                            </div>
                            <div class="button" @click="seekForward">
                                <span class="icon"><SeekForward /></span>
                                <span>{{moves_seconds}}秒早送り</span>
                            </div>
                        </div>
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            早送りまたは巻き戻しします。「←」「→」キーでも操作できます。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>早送り/巻き戻し秒数</span>
                        <var>{{moves_seconds}}秒</var>
                    </dt>
                    <dd>
                        <InputHorizontalRange
                            :max="60"
                            :min="1"
                            :step="1"
                            :value="moves_seconds"
                            v-model="moves_seconds"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            早送りまたは巻き戻しする秒数を指定します。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>再生速度</span>
                        <var>x{{status.playbackRate|playbackRateFormat}}</var>
                    </dt>
                    <dd>
                        <InputHorizontalRange
                            :max="4"
                            :min="0.01"
                            :step="0.01"
                            :value="playback_rate"
                            v-model="playback_rate"
                            :is_hide_handle="true"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            再生速度を上下します。「↑」「↓」キーでも操作できます。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>動画の表示サイズ</span>
                        <var>幅{{player_size.w}}, 高さ{{player_size.h}}</var>
                    </dt>
                    <dd>
                        <InputHorizontalRange
                            :max="1920"
                            :min="320"
                            :step="1"
                            :value="player_width"
                            v-model="player_width"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            ミニプレイヤーモードにしたときの動画の幅を指定します。
                            この幅を基準に高さを算出します。
                            ブラウザの有効サイズを超える設定は反映されません。
                            ちなみにミニプレイヤーモードは拡張機能アイコンでniicoのオンオフを切り替えると位置がリセットされます。
                            ちなみにデフォルト値の512pxは昔標準だったサイズ。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>音量</span>
                        <var>{{volume|toPercentage}}%</var>
                    </dt>
                    <dd>
                        <InputHorizontalRange
                            :max="1"
                            :min="0"
                            :step="0.01"
                            :value="volume"
                            v-model="volume"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            音量です。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="volume_is_mute"
                            :label="'音声をミュートにする'"
                            v-model="volume_is_mute"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            ミュートです。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="is_default_player_controller"
                            :label="'Chrome標準の動画プレイヤーを使う'"
                            v-model="is_default_player_controller"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            動画にマウスオーバーした際に表示されるコントローラを、Chromeのデフォルトにします。代わりにniicoのコントローラは非表示にします。
                            オンにしてもなんかクリックが位置ずれしてる感じがするけど、フルスクリーンにすると戻ります（謎）。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        再生終了時の処理
                    </dt>
                    <dd>
                        <NiicoSelect
                            :options="do_on_ended_map"
                            :value="do_on_ended"
                            v-model="do_on_ended"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            <template v-if="do_on_ended == 'none'">
                                現在視聴中の動画の再生が終わっても何もせず停止します。
                            </template>
                            <template v-else-if="do_on_ended == 'is_loop'">
                                現在視聴中の動画をループ再生します。
                            </template>
                            <template v-else-if="do_on_ended == 'is_next_video'">
                                niicoで開いている次のタブの動画を再生します。
                                もし他に開いている動画がない場合は、現在視聴中の動画をループ再生します。
                            </template>
                        </div>
                    </dd>
                </dl>
            </main>
        </section>

        <section>
            <h1>
                <span class="icon"><CommentIcon /></span>
                <span class="text">コメント</span>
            </h1>
            <main>
                <dl>
                    <dt>
                        <span>最大行数</span>
                        <var>{{comment_max_line_num/11|toPercentage}}%（{{comment_max_line_num}}行）</var>
                    </dt>
                    <dd>
                        <InputHorizontalRange
                            :max="55"
                            :min="2"
                            :step="1"
                            :value="comment_max_line_num"
                            v-model="comment_max_line_num"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            この行数に収まるようにコメントのテキストサイズが計算されます。
                            大きくするとテキストサイズは小さくなります。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>コメントを流す所要時間</span>
                        <var>{{flow_duration_seconds|toPercentage}}%（{{flow_duration_seconds*4}}秒）</var>
                    </dt>
                    <dd>
                        <InputHorizontalRange
                            :max="2"
                            :min="0"
                            :step="0.01"
                            :value="flow_duration_seconds"
                            v-model="flow_duration_seconds"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            コメントが右端から流れ始めてから左端に消えるまでの時間の設定で、100%では4秒です。
                            200%で8秒になり、流れる速度が遅くなります。
                            衝突判定のタイミングの関係で変更すると変な動きになるときがある。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>不透明度</span>
                        <var>{{comment_opacity|toPercentage}}%</var>
                    </dt>
                    <dd>
                        <InputHorizontalRange
                            :max="1"
                            :step="0.01"
                            :value="comment_opacity"
                            v-model="comment_opacity"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            コメントを透明にします。0%で見えなくなります。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="comment_is_mute"
                            :label="'コメントを表示しない'"
                            v-model="comment_is_mute"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            コメントを非表示にします。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="comment_is_auto_scroll"
                            :label="'自動スクロールする'"
                            v-model="comment_is_auto_scroll"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            コメントパネルのコメントを自動でスクロールします。
                            コメント数が多いとカクついちゃうの辛い。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="is_compute_tpos_in_advance"
                            :label="'座標計算を最初にまとめて行う'"
                            v-model="is_compute_tpos_in_advance"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            コメントのサイズとタイミングから衝突判定を行い、
                            コメント同士が被らないようにする処理をしているのですが、
                            これが重たいので、再生開始直後にまとめて計算する設定です。
                            よかれと思って用意したが、カクついて全然だめだったので非推奨。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="is_always_danmaku_mode"
                            :label="'常に弾幕モードで再生する'"
                            v-model="is_always_danmaku_mode"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            画面に収まりきらないコメントを、別のコメントに被せてすべて表示させます。
                            オフにした場合、一定のコメント数を超えた場合のみ弾幕モードになります。
                            ちなみにニコ動本家は弾幕モードになるとy座標が乱数になるらしい。そのうち再現するかもしれない。
                        </div>
                    </dd>
                </dl>
            </main>
        </section>
        <section>
            <h1>
                <span class="icon"><PanelIcon /></span>
                <span class="text">パネル</span>
            </h1>
            <main>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="is_show_debug_panel"
                            :label="'デバッグパネルを表示する'"
                            v-model="is_show_debug_panel"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            デバッグパネルをパネルメニューに表示します。
                            デバッグパネルからは各種変数の確認やコンソール出力ができます。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="is_show_log_panel"
                            :label="'ログパネルを表示する'"
                            v-model="is_show_log_panel"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            ログパネルをパネルメニューに表示します。
                            あんまりログ出力設定してなくて参考にならなかったのでデフォは非表示。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        動画情報パネル
                    </dt>
                    <dd>
                        <NiicoCheckbox
                            :value="is_horizontal_scroll"
                            :label="'タグを水平スクロールさせる'"
                            v-model="is_horizontal_scroll"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            動画情報パネルで動画タグを横スクロールさせます。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        設定と操作パネル
                    </dt>
                    <dd>
                        <NiicoCheckbox
                            :value="is_show_setting_help"
                            :label="'補足説明を表示する'"
                            v-model="is_show_setting_help"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            この設定パネルの補足説明を表示します。
                            こんな風に細かい説明が長いと思ったらオフにしてください。
                        </div>
                    </dd>
                </dl>
            </main>
        </section>
        <section>
            <h1>
                <span class="icon"><SettingsIcon /></span>
                <span class="text">その他</span>
            </h1>
            <main>
                <dl>
                    <dt>
                        マイリスト登録の追加先
                    </dt>
                    <dd>
                        <NiicoSelect
                            :options="viewer_mylist"
                            :value="selected_mylist_id"
                            v-model="selected_mylist_id"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            サイドコントローラのマイリスト登録の追加先を指定します。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="is_append_hashtag_niico_on_tweet"
                            :label="'ツイートに「#niico」を含む'"
                            v-model="is_append_hashtag_niico_on_tweet"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            サイドコントローラからツイートする内容にハッシュタグ「#niico」を含めます。含めてほしいです。
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dd>
                        <NiicoCheckbox
                            :value="is_use_shortcut"
                            :label="'ショートカットキーを使う'"
                            v-model="is_use_shortcut"
                        />
                    </dd>
                    <dd class="help">
                        <div class="icon"><HelpCircleIcon /></div>
                        <div class="description">
                            「↑」「↓」キーで動画の再生スピードを操作します。
                            「←」で巻き戻し、「→」で早送りができます。
                        </div>
                    </dd>
                </dl>
            </main>
        </section>
        <div class="button button--center" @click="initialize">
            <span>すべて初期状態に戻す</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .panel {
        padding: 16px;
        position: relative;
        height: 100%;
        overflow-y: auto;

        svg:not(.feather) {
            fill: #fff;
        }

        section {
            background: #191919;
            padding: 16px 16px 4px;
            margin: 0 0 16px;
            border-radius: 8px;

            h1 {
                margin: 0 0 16px;
                display: flex;
                align-items: center;

                .icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                }

                .text {
                    font-size: 16px;
                }
            }

            main {
                dl {
                    border-top: solid 1px #252525;
                    padding: 16px 8px;

                    dt {
                        color: #999;
                        font-size: 12px;
                        flex-grow: 1;
                        padding: 0;
                        margin-bottom: 4px;
                        display: flex;
                        justify-content: space-between;

                        span {

                        }

                        var {
                            color: #fff;
                        }
                    }

                    dd {
                        flex-grow: 1;
                        display: flex;
                        align-items: center;

                        .slider {
                            flex-grow: 1;
                        }
                        .value {
                            width: 60px;
                            text-align: right;
                            font-size: 14px;
                        }

                        .buttons {
                            display: flex;
                            flex-grow: 1;

                            .button {
                                margin: 8px 8px 0 0;
                            }
                        }
                    }

                    .help {
                        display: none;
                    }
                }
            }
        }

        &--is_show-help {
            section {
                main {
                    dl {
                        .help {
                            display: flex;
                            align-items: flex-start;
                            margin: 8px 0 0 0;

                            .icon {
                                width: 12px;
                                height: 12px;
                                flex-shrink: 0;
                                margin-top: 4px;
                                color: #666;
                            }
                            .description {
                                font-size: 12px;
                                color: #666;
                                margin-left: 8px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import {mapState, mapActions, mapGetters, mapMutations} from 'vuex';
    import do_on_ended_map from 'js/content/map/do_on_ended.ts';
    import FormatHelper from 'js/content/lib/format-helper.ts';

    import InputHorizontalRange from 'js/content/components/common/form/input-range-horizontal.vue';
    import NiicoSelect from 'js/content/components/common/form/input-select.vue';
    import NiicoCheckbox from 'js/content/components/common/form/input-checkbox.vue';

    import HelpCircleIcon from 'img/feather/help-circle.svg';
    import VideoIcon from 'img/feather/film.svg';
    import CommentIcon from 'img/nicovideo/comment.svg';
    import SettingsIcon from 'img/feather/settings.svg';
    import SeekBackward from 'img/feather/skip-back.svg';
    import SeekForward from 'img/feather/skip-forward.svg';
    import UpPlayBackRateIcon from 'img/feather/chevrons-up.svg';
    import DownPlayBackRateIcon from 'img/feather/chevrons-down.svg';
    import PanelIcon from 'img/feather/sidebar.svg';

    import ModelsMixins from 'js/content/mixins/form-models.ts';

    export default {
        components: {
            InputHorizontalRange,
            HelpCircleIcon,
            VideoIcon,
            CommentIcon,
            NiicoSelect,
            NiicoCheckbox,
            SettingsIcon,
            SeekBackward,
            SeekForward,
            UpPlayBackRateIcon,
            DownPlayBackRateIcon,
            PanelIcon,
        },
        computed: {
            ...mapState({
                videos: state => state.videos.items,
                video: state => state.videos.items[state.status.active_video_id],
                status: state => state.status,
                setting: state => state.setting,
                viewerMylist: state => state.viewerMylist.items,
            }),
            ...mapGetters({
                player_size: 'setting/player_size',
            }),
            ...ModelsMixins,
        },
        filters: {
            toPercentage: num => {
                return Math.round(num * 100);
            },
            playbackRateFormat: function(rate) {
                return Number(rate).toFixed(2);
            },
            formatTime: function(time) {
                return FormatHelper.convertSecondsToPlayTime(time);
            },
        },
        methods: {
            ...mapActions({
                upPlaybackRate: 'status/upPlaybackRate',
                downPlaybackRate: 'status/downPlaybackRate',
            }),
            initialize() {
                this.$store.commit('setting/initialize');
                this.$store.commit('status/initialize');
            },
            seekBackward() {
                if(!this.video_el) return;
                this.video_el.currentTime -= this.setting.moves_seconds || 5;
            },
            seekForward() {
                if(!this.video_el) return;
                this.video_el.currentTime += this.setting.moves_seconds || 5;
            },
        },
        data() {
            return {
                do_on_ended_map,
            }
        },
    }
</script>
