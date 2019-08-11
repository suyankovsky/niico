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
            <dd class="releaseHistory">
                <ul>
                    <li v-for="ver in release_history">
                        <template v-if="ver.hasOwnProperty('detail_url') && ver.detail_url !== ''">
                            <a :href="ver.detail_url" target="_blank">
                                v{{ver.version}}（{{ver.date}}）
                            </a>
                        </template>
                        <template v-else>
                            v{{ver.version}}（{{ver.date}}）
                        </template>
                        <ul>
                            <li v-for="point in ver.points">
                                ● {{point}}
                            </li>
                        </ul>
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

        .releaseHistory {
            > ul {
                line-height: 1.6;

                > li {
                    padding: 16px 0;
                    &:not(:first-child) {
                        border-top: solid 1px #333;
                    }

                    ul {
                        margin-left: 16px;

                        li {
                            padding-top: 16px;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import NiicoIcon from 'img/niico/niico_bordered.svg';
    import release_history from 'js/content/map/release-history.js';

    export default {
        components: {
            NiicoIcon,
        },
        data() {
            return {
                release_history,
            };
        },
    }
</script>
