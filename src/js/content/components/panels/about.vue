<template>
    <div class="panel">
        <h1>niicoについて</h1>

        <dl>
            <dt>概要</dt>
            <dd>
                <p>
                    ニコニコ動画でランキングや検索結果をザッピングするためのChrome拡張機能です。
                    ニコニコ動画上で、動画のリンクをクリックするとプレイヤーが起動します。
                </p>
                <p>
                    早寝ハヤオが開発しています。機能の要望や感想があれば下記リンク先からどうぞ。Twitterがありがたいです。
                </p>
            </dd>
        </dl>

        <dl>
            <dt>関連情報</dt>
            <dd>
                <ul>
                    <li>
                        <a href="https://chrome.google.com/webstore/detail/niico/bffmccpcnbnapodnocknbfhbibipaibn/related" target="_blank">
                            Chrome ウェブストア
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com/suyankovsky" target="_blank">
                            Twitter
                        </a>
                    <li>
                        <a href="https://ch.nicovideo.jp/suyankovsky" target="_blank">
                            ブロマガ
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/suyankovsky/niico" target="_blank">
                            GitHub
                        </a>
                    </li>
                </ul>
            </dd>
        </dl>

        <dl>
            <dt>niicoちゃん</dt>
            <dd>
                <div class="niico-chan"><NiicoIcon/></div>
            </dd>
        </dl>

        <dl>
            <dt>リリース履歴</dt>
            <dd>
                <ul>
                    <li>
                        <a href="https://ch.nicovideo.jp/article/ar1681485" target="_blank">
                        v.1.0(2018/10/8)
                        </a>
                        : 初回リリース。
                    </li>
                    <li>
                        <a href="https://ch.nicovideo.jp/article/ar1681485" target="_blank">
                            v.2.0(2019/6/23)
                        </a>
                        : コードベースを書き直したリリース。
                    </li>
                    <li>
                        v.2.1(2019/7/28)
                        : 反転機能を追加。デザインの微修正。
                    </li>
                </ul>
            </dd>
        </dl>
    </div>
</template>

<style lang="scss" scoped>
    .panel {
        height: 100%;
        overflow-y: auto;
        padding: 16px;

        h1 {
            color: #666;
            font-size: 24px;
        }

        dl {
            margin-top: 24px;
            dt {
                font-size: 18px;
            }

            dd {
                margin: 16px;

                a {
                    display: inline;
                    color: #2a7df6;
                }
            }
        }

        .niico-chan {
            svg {
                width: 100px;
                height: 100px;
            }
        }
    }
</style>

<script>
    import NiicoIcon from 'img/niico/niico_bordered.svg';
    export default {
        components: {
            NiicoIcon,
        },
        computed: {
        },
        filters: {
        },
        methods: {
        },
    }
</script>
