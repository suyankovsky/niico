/*
    コメントアニメーションを補助する
*/
import $ from 'jquery';
import Createjs from 'createjs';
import Stage from 'js/content/lib/flow-comment/stage.ts';
import Layer from 'js/content/lib/flow-comment/layer.ts';
import Comment from 'js/content/lib/flow-comment/comment.ts'

export default class {
    constructor(video_id, thread, window_mode) {
        if (!video_id || !thread) return false;

        // Set Elements
        this.video_id = video_id;
        this.video_el = document.getElementById(this.video_id);
        //this.canvas_el = document.getElementById(this.video_id);

        // Initialize Properties
        this.current_time = this.video_el.currentTime || 0;
        this.window_mode = window_mode;

        // Set Thread
        this.thread = thread.map(c => new Comment(c, video_id)).sort((a, b) => {
            if (a.vpos < b.vpos) return -1;
            if (a.vpos > b.vpos) return 1;
            return 0;
        })
        this.layers_of_thread = {
            flow: this.thread.filter(c => !c.position),
            ue: this.thread.filter(c => c.position === 'ue'),
            shita: this.thread.filter(c => c.position === 'shita'),
        };

        this.stage = new Stage(video_id);
        this.stage.addChild(
            new Layer(this.layers_of_thread.flow),
            new Layer(this.layers_of_thread.ue),
            new Layer(this.layers_of_thread.shita),
        );
    }

    onResizePlayer() {
        this.stage.initializeStageSize();
    }

    readyTpos() {
        const duration = this.video_el.duration * 10;
        const ready_stage = new Stage('niico-ready-tpos');
        ready_stage.addChild(
            new Layer(this.layers_of_thread.flow),
            new Layer(this.layers_of_thread.ue),
            new Layer(this.layers_of_thread.shita),
        );

        let i = 0;
        for (i; i < duration; i++) {
            ready_stage.readyTpos(i);
        }
    }

    flushRect() {
        if (this.current_time === this.video_el.currentTime) return;

        this.current_time = this.video_el.currentTime;
        this.stage.update(this.current_time);
    }

    resetTiming() {
        this.stage.resetTiming();
    }
}
