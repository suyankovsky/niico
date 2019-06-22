import $ from 'jquery';
import Createjs from 'createjs';
import Danmaku from 'js/content/lib/flow-comment/danmaku.js';

export default class extends Createjs.Stage {
    constructor(video_id, thread) {
        const canvas_id = 'canvas--' + video_id;

        super(canvas_id);

        this.video_el = document.getElementById(video_id);
        this.canvas_el = document.getElementById(canvas_id);
        this.thread = thread;

        this.danmakuManager = new Danmaku(this);

        this.initializeStageSize();
    }

    readyTpos(current_time) {
        this.children.forEach(layer => {
            layer.update(current_time);
        });
    }

    update(current_time) {
        this.danmakuManager.update();

        this.children.forEach(layer => {
            layer.update(current_time);
        });
        super.update();
    }

    initializeStageSize() {
        const size = this.getPlayerSize();

        const _local = size.video_size;
        this.w = _local.w;
        this.h = _local.h;

        const _stage = size.video_size;
        this.canvas.width = _stage.w;
        this.canvas.height = _stage.h;

        const _canvas = size.device_adjust;
        this.canvas_el.width = _canvas.w;
        this.canvas_el.height = _canvas.h;

        const _style = size.with_unit;
        this.canvas_el.style.width = _style.w;
        this.canvas_el.style.height = _style.h;

        this.scaleX = this.scaleY = devicePixelRatio;
    }

    getPlayerSize() {
        const video_size = {
            w: parseInt($(this.video_el).width()),
            h: parseInt($(this.video_el).height()),
        };

        const with_unit = {
            w: video_size.w + 'px',
            h: video_size.h + 'px',
        };

        // 解像度に合わせて調整する
        const device_adjust = {
            w: video_size.w * devicePixelRatio,
            h: video_size.h * devicePixelRatio,
        };

        return {
            video_size,
            with_unit,
            device_adjust,
        }
    }

    getStageSize() {
        return {
            w: this.w,
            h: this.h,
        }
    }

    resetTiming() {
        this.children.forEach(layer => {
            layer.resetTiming();
        });
    }
}
