<template>
    <div
        id="niico"
        :class="[{'is_miniPlayerMode': is_mini_player_mode}]"
        :style="[{'left': player_position.x + 'px'}, {'top': player_position.y + 'px'}]"
    >
        <template v-if="is_niico_shown">
            <NiicoHeader></niicoHeader>
            <NiicoBody></niicoBody>
            <NiicoFloatWindow />
            <NiicoInformation />
        </template>
    </div>
</template>

<script>
    import $ from 'jquery';
    import {mapState, mapGetters} from 'vuex';
    import ChromeHelper from 'js/content/lib/chrome-helper.ts';

    import NiicoHeader from 'js/content/components/niico-header.vue';
    import NiicoBody from 'js/content/components/niico-body.vue';
    import NiicoInformation from 'js/content/components/niico-information.vue';
    import NiicoFloatWindow from 'js/content/components/niico-float-window.vue';

    export default {
        components: {
            NiicoHeader,
            NiicoBody,
            NiicoInformation,
            NiicoFloatWindow,
        },
        computed: {
            ...mapState({
                setting: state => state.setting,
                status: state => state.status,
            }),
            ...mapGetters({
                is_niico_shown: 'status/is_niico_shown',
                player_size: 'setting/player_size',
                player_position: 'status/player_position',
                is_mini_player_mode: 'status/is_mini_player_mode',
            }),
            niico_height() {
                const header_height = 40;
                const player_height = parseInt(this.player_size.h);
                return header_height + player_height;
            },
        },
        created() {
            // ローカルストレージを読み込み、Vueに反映
            this.$store.dispatch('setting/loadStorageSetting');

            // 動画リンクのクリックイベントを仕込む
            this.$store.dispatch('videos/addOnClickEventListener');

            // 拡張アイコンのクリックイベントを仕込む
            this.$store.dispatch('setting/addListenerOnClickExtensionIcon');

            // キーボードの押下イベントを仕込む
            this.$store.dispatch('videos/addOnKeydownEventListener');

            // ウィンドウサイズに応じて動画サイズを計算する
            this.$store.dispatch('status/addOnRisizeWindowSizeEventListener');
        },
        mounted() {
            $('#niico-loading-bar').addClass('is_complete').fadeOut(1500);
        },
        watch: {
            // 変更を監視し、storageに都度保存する
            'setting': {
                handler: function (new_val, old_val) {
                    ChromeHelper.setStorage(new_val);
                },
                deep: true,
            },
            'is_niico_shown': function(new_val, old_val) {
                this.adjustBodyMarginTop();
                this.adjustScrollTop(new_val, old_val);
            },
            'player_size.h' : function(h) {
                this.adjustBodyMarginTop();
            },
            'status.window_mode': function(new_val, old_val) {
                this.adjustBodyMarginTop();
                this.adjustScrollTop(new_val, old_val);
            },
        },
        methods: {
            // niicoの起動で隠れてしまう部分をスクロールできるように余白を挿入する
            adjustBodyMarginTop() {
                let size = 0;
                if(this.is_niico_shown) {
                    size = this.niico_height;
                }
                if(this.is_mini_player_mode) {
                    size = 0;
                }
                document.body.style.cssText += `margin-top: ${size}px !important;`;
            },
            // adjustBodyMarginTopで追加した余白分、スクロール量を調整してガタつかないようにする
            adjustScrollTop(new_val, old_val) {
                if(new_val == old_val) return;
                const is_niico_shown = new_val;

                const scroll_el = document.scrollingElement;

                if(is_niico_shown && old_val == 'mini-player') {
                    scroll_el.scrollTop = scroll_el.scrollTop + this.niico_height;
                } else {
                    scroll_el.scrollTop = scroll_el.scrollTop - this.niico_height;
                }

            }
        },
    }
</script>

<style lang="scss">
    #niico {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        color: #fff;
        background: #111;
        overflow: hidden;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .6);

        text-align: left;// コモンズ用

        &.is_miniPlayerMode {
            right: inherit;
        }
    }

    // CSSリセット。カスケーディングのため詳細度を下げている。
    [id="niico"] {
        span,
        div,
        ul,
        li,
        dl,
        dt,
        dd,
        a,
        video,
        dl,
        dt,
        dd,
        p,
        svg {
            display: block;
            margin: 0;
            padding: 0;
            border: 0;
            outline: 0;
            font-size: 14px;
            line-height: 1.4;
            vertical-align: baseline;
            -webkit-margin-start: 0;
            text-decoration: none;
            color: inherit;
            background: transparent;
            box-sizing: border-box;
            word-break:break-all;
            font: inherit;
            font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
        }
        ul {
            list-style: none;
        }

        span {
            display: inline-block;
        }

        a:hover {
            text-decoration: underline;
        }

        fieldset {
            margin: 0;
            padding: 0;
            border: 0;
        }

        var {
            font-style: normal;
        }

        .button {
            font-size: 14px;
            line-height: 1;
            background: #2a7df6;
            display: flex;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            align-items: center;
            line-height: 1.2;

            .icon {
                width: 14px;
                height: 14px;
                margin-right: 6px;
                flex-shrink: 0;

                svg {
                    width: 100%;
                    height: 100%;
                }
            }

            &:hover {
                //opacity: .8;
                background: #336bc3;
            }

            &--center {
                text-align: center;
                justify-content: center;
            }
        }

        // v-html下だと何故かスコープ外になって効かないのでここに書く
        .panel .description {
            line-height: 1.5;
            font-size: 14px;

            a {
                color: #2a7df6;
                display: inline;
            }
            span {
                display: inline;
            }
        }

        svg {
            width: 16px;
            height: 16px;
            max-width: 100%;
            max-height: 100%;
        }
    }


</style>
