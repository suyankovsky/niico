<template>
    <div class="controls">
        <dl @click="reLoadVideo(status.active_video_id)">
            <dt>
                <ReLoadIcon />
            </dt>
            <dd>再読込する</dd>
        </dl>
        <dl @click="openTweet">
            <dt>
                <twitterIcon />
            </dt>
            <dd>ツイートする</dd>
        </dl>
        <dl @click="openNicoVideo">
            <dt>
                <externalLinkIcon />
            </dt>
            <dd>ニコニコ動画で開く（別窓）</dd>
        </dl>

        <hr />

        <template v-if="viewerMylist.length > 1">
            <dl class="mylist">
                <dt @click="addMylist($event)">
                    <addMylistIcon />
                </dt>
                <dd>
                    <NiicoSelect
                        :options="viewer_mylist"
                        :value="selected_mylist_id"
                        v-model="selected_mylist_id"
                    />
                    <div class="button" @click="addMylist">にマイリスト登録</div>
                </dd>
            </dl>
        </template>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ajaxApi from "js/content/lib/ajax-api.ts";

import addMylistIcon from "img/feather/folder-plus.svg";
import twitterIcon from "img/feather/twitter.svg";
import externalLinkIcon from "img/feather/external-link.svg";
import volumeIcon from "img/nicovideo/volume.svg";
import commentIcon from "img/nicovideo/comment.svg";
import ReLoadIcon from "img/feather/rotate-cw.svg";
import NiicoSelect from "js/content/components/common/form/input-select.vue";

export default {
    components: {
        addMylistIcon,
        twitterIcon,
        externalLinkIcon,
        volumeIcon,
        commentIcon,
        ReLoadIcon,
        NiicoSelect
    },
    watch: {},
    computed: {
        ...mapState({
            videos: state => state.videos.items,
            status: state => state.status,
            setting: state => state.setting,
            viewerMylist: state => state.viewerMylist.items
        }),
        ...mapGetters({
            selected_mylist_name: "viewerMylist/selected_mylist_name"
        }),
        selected_mylist_id: {
            get() {
                return this.setting.selected_mylist_id;
            },
            set(e) {
                this.$store.commit("setting/changeSelectedMylistId", e);
            }
        },
        viewer_mylist() {
            const obj = {};
            this.viewerMylist.forEach(item => {
                obj[item.id] = item.name;
            });
            return obj;
        }
    },
    created: function() {},
    methods: {
        ...mapActions({
            reLoadVideo: "videos/reLoadVideo"
        }),
        addMylist: function() {
            const message = `「${this.selected_mylist_name}」にマイリスト登録します。よろしいですか？`;
            if (!window.confirm(message)) return;
            this.$store.dispatch("viewerMylist/addMylist");
        },
        openNicoVideo: function() {
            const video_id = this.status.active_video_id;
            window.open("//www.nicovideo.jp/watch/" + video_id);
        },
        openTweet: function() {
            const video_id = this.status.active_video_id;
            const title = this.videos[video_id].title;

            let hashtags = video_id + ",ニコニコ動画";
            if (this.setting.is_append_hashtag_niico_on_tweet) {
                hashtags += ",niico";
            }

            let href = "https://twitter.com/share?";
            const params = {
                url: "http://nico.ms/" + video_id + "?ref=twitter",
                hashtags: hashtags,
                text: title
            };

            Object.keys(params).forEach(function(key) {
                href +=
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(params[key]) +
                    "&";
            });

            window.open(href);
        }
    }
};
</script>

<style lang="scss" scoped>
.controls {
    width: 40px;
    flex-shrink: 0;
}

hr {
    border-color: #252525;
}

dl {
    position: relative;
    cursor: pointer;

    dt {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
            width: 20px;
            height: 20px;
            transition-property: transform;
            transition-duration: 0.1s;
        }

        .commentIcon,
        .volumeIcon {
            fill: #fff;
            width: 20px;
        }
    }

    dd {
        display: none;

        .volume {
            height: 100%;
            fill: #fff;
        }
    }

    &:hover {
        background: #252525;
        dd {
            display: block;
            position: absolute;
            top: 0;
            left: 40px;
            background: #252525;
            height: 40px;
            line-height: 40px;
            z-index: 9999;
            white-space: nowrap;
            padding: 0 16px;
        }
    }

    &.mylist {
        cursor: inherit;

        .button {
            display: inline-block;
            margin-left: 8px;
        }

        dt,
        .button {
            cursor: pointer;
        }

        .niico-select {
            width: 160px;
        }
    }

    &.mylist dt:hover,
    &:not(.mylist):hover {
        svg {
            transform: scale(1.2);
        }
    }
}
</style>
