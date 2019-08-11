<template>
    <div class="panel">
        <template
            v-if="cannot_render_uploader_reason.code <= 0"
        >{{cannot_render_uploader_reason.message}}</template>
        <template v-else>
            <section class="uploaderCardSection">
                <div class="icon">
                    <a :href="uploader.href" target="_blank">
                        <img :src="uploader.icon_src" />
                    </a>
                </div>
                <div class="details">
                    <div class="name">
                        <a class="ownerName" :href="uploader.href" target="_blank">{{uploader.name}}</a>
                    </div>
                    <div class="status">
                        <template v-if="uploader.is_channel">
                            <dl>
                                <dt>チャンネル</dt>
                            </dl>
                        </template>
                        <template v-else>
                            <dl>
                                <dt>投稿動画：</dt>
                                <dd>
                                    <template v-if="!uploader.is_user_my_video_public">非公開</template>
                                    <template v-else>{{uploader.posted_video_all_count|loadCheck}}件</template>
                                </dd>
                            </dl>
                            <dl>
                                <dt>マイリス：</dt>
                                <dd>
                                    <template v-if="!uploader.is_user_open_list_public">非公開</template>
                                    <template v-else>{{public_mylist_keys.length|loadCheck}}件</template>
                                </dd>
                            </dl>
                        </template>
                    </div>
                </div>
            </section>

            <section class="selecterSection">
                <select v-model="active_list_id">
                    <option value>投稿動画（{{uploader.posted_video_all_count|loadCheck}}）</option>
                    <optgroup label="公開マイリスト" v-if="public_mylist_keys.length > 0">
                        <template v-for="(item) in public_mylist_keys">
                            <option
                                :value="item.id"
                                :key="item.id"
                            >{{item.name}}（{{item.count|loadCheck}}）</option>
                        </template>
                    </optgroup>
                </select>
            </section>

            <section class="selectedVideoListSection">
                <template v-if="selected_video_list_detail.code > 0">
                    <div class="meta">{{selected_video_list_detail.count}}件</div>

                    <div class="container">
                        <VideoListGroup :list="selected_video_list_detail.content" />
                    </div>

                    <div
                        class="more"
                        v-if="active_list_id == '' && !uploader.posted_video_is_loaded_all"
                    >
                        <div class="button button--center" @click="pushPostedVideo(uploader)">もっと見る</div>
                    </div>
                </template>
                <template v-else>{{selected_video_list_detail.content}}</template>
            </section>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    padding: 16px;
    height: 100%;
    overflow-y: auto;

    a {
        text-decoration: underline;
    }

    section {
        margin: 16px 0;

        &:first-child {
            margin-top: 0;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}

.selecterSection {
    border-bottom: solid 1px #252525;
    padding-bottom: 16px;

    select {
        font-size: 14px;
    }
}

.selectedVideoListSection {
    .meta {
        margin-bottom: 16px;
        display: flex;

        .count {
            margin-right: 12px;
            min-width: 40px;
        }
        .query {
            flex-grow: 1;

            input {
                width: 100%;
                box-sizing: border-box;
            }
        }
        .jump {
            margin-left: 16px;
        }
    }

    .list {
        display: flex;
        flex-flow: column;
    }
}

.uploaderCardSection {
    display: flex;

    a {
        display: inline;
    }

    .icon {
        width: 48px;
        height: 48px;
        border-radius: 100%;
        flex-shrink: 0;
        margin-right: 12px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .details {
        flex-grow: 1;
        display: flex;
        flex-flow: column;
        justify-content: center;
        line-height: 1.4;

        .name {
            font-size: 16px;
            margin-bottom: 2px;
        }
        .status {
            display: flex;
            font-size: 11px;

            dl {
                display: flex;
                margin-right: 12px;

                dt {
                    color: #999;
                }
            }
        }
    }
}
</style>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import VideoListGroup from "js/content/components/common/video-list-group.vue";

export default {
    components: {
        VideoListGroup
    },
    computed: {
        ...mapState({
            videos: state => state.videos.items,
            video: state => state.videos.items[state.status.active_video_id],
            status: state => state.status,
            setting: state => state.setting,
            uploaders: state => state.uploaders.items
        }),
        ...mapGetters({
            uploader: "uploaders/uploader",
            selected_video_list_detail: "uploaders/selected_video_list_detail",
            posted_video_list: "uploaders/posted_video_list",
            public_mylist_keys: "uploaders/public_mylist_keys",
            cannot_render_uploader_reason:
                "uploaders/cannot_render_uploader_reason"
        }),
        active_list_id: {
            get() {
                return this.$store.getters["uploaders/active_list_id"];
            },
            set(list_id) {
                this.setActiveListId({
                    uploader_id: this.uploader.id,
                    list_id
                });
                this.addPublicMylist(list_id);
            }
        }
    },
    watch: {
        video: function(video) {
            this.addUploader();
        }
    },
    filters: {
        loadCheck: num => {
            if (num == undefined) return "...";
            return num;
        }
    },
    mounted() {
        this.addUploader();
    },
    methods: {
        ...mapMutations({
            setActiveListId: "uploaders/setActiveListId"
        }),
        ...mapActions({
            addPublicMylist: "publicMylist/addPublicMylist",
            addUploader: "uploaders/addUploader",
            pushPostedVideo: "uploaders/pushPostedVideo"
        })
    }
};
</script>
