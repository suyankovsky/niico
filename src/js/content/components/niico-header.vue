<template>
    <div class="niico-header">
        <template v-if="is_mini_player_mode">
            <div class="miniPlayerModeHeader">
                <div class="iconButton" @click="requestDefaultScreenMode">
                    <MaximizeIcon />
                </div>
                <div class="handle" @mousedown="moveStartMiniPlayer">
                    <HandleIcon />
                </div>
                <div
                    class="iconButton"
                    @click="toggleIsShowNiicoFloatWindow"
                    data-js-id="toggleNiicoFloatWindowButton"
                >
                    <SettingsIcon viewBox="0 0 24 24" />
                </div>
                <div class="iconButton" @click="closeWindow()">
                    <closeIcon class="icon-close" viewBox="0 0 24 24" />
                </div>
            </div>
        </template>
        <template v-else>
            <ul class="tabs">
                <Tab v-for="video in videos" :key="video.id" :video="video" :video_id="video.id" />
            </ul>
            <div
                class="iconButton"
                @click="toggleIsShowNiicoFloatWindow"
                data-js-id="toggleNiicoFloatWindowButton"
            >
                <SettingsIcon viewBox="0 0 24 24" />
            </div>
            <div class="iconButton" @click="closeWindow()">
                <closeIcon class="icon-close" viewBox="0 0 24 24" />
            </div>
        </template>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import MoveMiniPlayer from "js/content/mixins/move-mini-player.ts";
import Tab from "js/content/components/tab.vue";

import closeIcon from "img/feather/x.svg";
import HandleIcon from "img/feather/menu.svg";
import MaximizeIcon from "img/feather/maximize-2.svg";
import SettingsIcon from "img/feather/settings.svg";

export default {
    components: {
        Tab,
        closeIcon,
        HandleIcon,
        MaximizeIcon,
        SettingsIcon
    },
    computed: {
        ...mapState({
            videos: state => state.videos.videos,
            status: state => state.status
        }),
        ...mapGetters({
            is_mini_player_mode: "status/is_mini_player_mode"
        })
    },
    methods: mapActions({
        closeWindow: "status/closeWindow",
        ...mapMutations({
            toggleIsShowNiicoFloatWindow: "status/toggleIsShowNiicoFloatWindow"
        }),
        ...mapActions({
            requestDefaultScreenMode: "status/requestDefaultScreenMode"
        }),
        moveStartMiniPlayer() {
            document.addEventListener("mousemove", this.syncPosition);
            document.addEventListener("mouseup", this.moveEndMiniPlayer);
        },
        moveEndMiniPlayer() {
            document.removeEventListener("mousemove", this.syncPosition);
            document.removeEventListener("mouseup", this.moveEndMiniPlayer);
        },
        syncPosition($e, e) {
            this.$store.commit("status/changeMiniPlayerPosition", {
                x: e.movementX,
                y: e.movementY
            });
        }
    })
};
</script>

<style lang="scss" scoped>
$w: 56px;
$h: $w / 16 * 9;
$light_gray: #444;

.niico-header {
    display: flex;
    align-items: flex-end;
    font-size: 12px;
    line-height: 1.4;
    height: 40px;
    border-bottom: solid 4px #444;
}

.miniPlayerModeHeader {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    svg {
        width: 24px;
        height: 24px;
    }
    .handle {
        flex-grow: 1;
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        cursor: move;
    }
    .minimize {
        svg {
            padding: 4px;
            overflow: visible;
        }
    }
}

.iconButton {
    color: #777;
    cursor: pointer;
    width: 40px;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-shrink: 0;

    svg {
        width: 24px;
        height: 24px;
    }

    &:hover {
        color: #fff;
    }
}

.tabs {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
}
</style>
