<template>
    <div class="niico-body" :style="[{height: player_size.h}]">
        <!--<Controls />-->
        <div
            id="niico-player"
            class="niico-player"
            :style="[{width: player_size.w}, {height: player_size.h}]"
        >
            <Player
                v-for="(video, index) in videos"
                v-show="status.active_video_id == video.id"
                :key="video.id"
                :video="video"
                :video_id="video.id"
            />
        </div>
        <Panels v-if="!is_mini_player_mode" />
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import Controls from "js/content/components/side-controls.vue";
import Player from "js/content/components/player.vue";
import Panels from "js/content/components/panels.vue";

export default {
    components: {
        Controls,
        Player,
        Panels
    },
    methods: {},
    computed: {
        ...mapState({
            videos: state => state.videos.videos,
            status: state => state.status
        }),
        ...mapGetters({
            player_size: "setting/player_size",
            is_mini_player_mode: "status/is_mini_player_mode"
        })
    }
};
</script>

<style lang="scss" scoped>
.niico-body {
    display: flex;
    overflow: hidden;
    height: 100%;
    width: 100%;

    .niico-player {
        flex-shrink: 0;
    }
}
</style>
