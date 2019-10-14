import $ from 'jquery';
import Createjs from '@createjs/easeljs';
import Danmaku from 'js/content/lib/flow-comment/danmaku.ts';
import Comment from 'js/content/lib/flow-comment/comment';

export default class extends Createjs.Stage {
    video_el: HTMLVideoElement;
    canvas_el: HTMLVideoElement;
    thread: Comment[];
    danmakuManager: Danmaku;
    children!: any[];
    canvas: {
        width: number;
        height: number;
    };
    w: number;
    h: number;
    scaleX: number;
    scaleY: number;
    addChild!: void;

    constructor(video_id, thread) {
        const canvas_id = 'canvas--' + video_id;

        super(canvas_id);

        this.video_el = <HTMLVideoElement>document.getElementById(video_id);
        this.canvas_el = <HTMLVideoElement>document.getElementById(canvas_id);
        this.thread = thread;
        this.canvas = {
            width: 0,
            height: 0,
        };
        this.w = 0;
        this.h = 0;
        this.scaleX = 0;
        this.scaleY = 0;

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
            w: $(this.video_el).width() || 0,
            h: $(this.video_el).height() || 0,
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

    addChild(...params) {
        super.addChild(...params);
    }
}
