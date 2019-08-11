<template>
    <div class="input-range">
        <div class="background-bar bar"></div>

        <div
            class="current-bar bar"
            :style="{
                height: value_per_max + '%'
            }"
        ></div>

        <div
            class="current_handle"
            :style="[
                {
                    top: value_per_max + '%',
                },
                {
                    display: is_hide_handle ? 'none' : 'inherit',
                },
            ]"
        ></div>
        <input
            type="range"
            orient="vertical"
            :min="min"
            :max="max"
            :step="step"
            v-model="value"
            @change="onEvent"
            @click="onEvent"
            @input="onEvent"
            @mousedown="onEvent"
            @mouseup="onEvent"
            @mousemove="onEvent"
            :class="[{'has-buffered': buffered}]"
            :data-allow-key-event="buffered ? true : false"
        />
    </div>
</template>

<style lang="scss" scoped>
$on_slider_height: 6px;
$off_slider_height: 4px;

$on_handle_size: 14px;
$off_handle_size: 10px;

$aninmate_duration: 0.3s;

.input-range {
    position: relative;
    height: 100%;

    input {
        -webkit-appearance: slider-vertical;
        cursor: pointer;
        opacity: 0;
        background: transparent;
        height: 100%;
        width: $on_handle_size;
        margin: 0;

        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);

        &:focus,
        &:blur {
            outline: 10px solid #ccc;
        }

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            position: relative;
            width: 0;
            height: 0;
            display: block;
        }
    }

    .current_handle {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: $off_handle_size;
        height: $off_handle_size;
        border-radius: 50%;
        background: #2a7df6;
        pointer-events: none;

        transition-property: width, height;
        transition-duration: $aninmate_duration;
    }

    .bar {
        width: $off_slider_height;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        transform: translateX(-50%);
        pointer-events: none;

        transition-property: width;
        transition-duration: $aninmate_duration;
    }

    .background-bar {
        background: #666;
    }

    .current-bar {
        background: #2a7df6;
    }

    &:hover {
        .current_handle {
            width: $on_handle_size;
            height: $on_handle_size;
        }

        .bar {
            width: $on_slider_height;
        }
    }
}
</style>

<script>
export default {
    props: ["value", "max", "min", "step", "is_hide_handle"],
    computed: {
        value_per_max: function() {
            return (this.value / this.max) * 100;
        }
    },
    methods: {
        onEvent: function(e) {
            this.$emit(e.type, e);
        }
    }
};
</script>
