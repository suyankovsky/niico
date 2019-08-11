<template>
    <div class="panel">
        <dl>
            <dt>Debug</dt>
            <dd>
                <button @click="consoleThis">console.log(this)</button>
            </dd>
            <dd>
                <button @click="consoleStore">console.log(this.$store)</button>
            </dd>
            <dd>
                <button @click="consoleState">console.log(this.$store.state)</button>
            </dd>
        </dl>
        <dl>
            <dt>Status</dt>
            <dd>{{status}}</dd>
        </dl>
        <dl>
            <dt>Setting</dt>
            <dd>{{setting}}</dd>
        </dl>
        <dl>
            <dt>Videos</dt>
            <dd>
                <template v-for="(video, video_id) in videos">
                    <button @click="consoleVideo(video_id)" :key="video_id">{{video_id}}</button>
                </template>
            </dd>
        </dl>
        <dl>
            <dt>Comments</dt>
            <dd>
                <template v-for="(comment, comment_id) in comments">
                    <button @click="consoleComment(comment_id)" :key="comment_id">{{comment_id}}</button>
                </template>
            </dd>
        </dl>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    height: 100%;
    overflow-y: auto;
    padding: 16px;
}

dl {
    dt {
        font-size: 1.2em;
    }

    dd {
        padding: 8px 8px 8px 16px;
    }
}

button {
    display: block;
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
    components: {},
    computed: mapState({
        videos: state => state.videos.items,
        comments: state => state.comments.items,
        status: state => state.status,
        setting: state => state.setting,
        uploaders: state => state.uploaders.items,
        viewerMylist: state => state.viewerMylist,
        publicMylist: state => state.publicMylist.items,
        nicorepo: state => state.nicorepo.items
    }),
    methods: {
        consoleThis: function() {
            console.log(this);
        },
        consoleStore() {
            console.log(this.$store);
        },
        consoleState() {
            console.log(this.$store.state);
        },
        consoleVideo: function(video_id) {
            console.log({
                video: this.videos[video_id]
            });
        },
        consoleComment: function(comment_id) {
            console.log({
                comment: this.comments[comment_id]
            });
        }
    }
};
</script>
