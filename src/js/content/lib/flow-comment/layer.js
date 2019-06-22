import Createjs from 'createjs';

// コマンドに応じてレイヤー化
export default class extends Createjs.Container {
    constructor(thread) {
        super();

        this.thread = thread;
    }

    update(current_time) {
        const current_thread = this.thread.filter(c => {
            if(c.isFlushTarget(current_time)) {
                if(!c.stage) {
                    this.addChild(c);
                }
                return true;
            } else {
                if(c.stage) {
                    this.removeChild(c);
                }
                return false;
            }
        });

        current_thread.forEach(c => {
            c.update(current_time);
        });
    }

    resetTiming() {
        this.thread.forEach(c => {
            c.resetTiming();
        });
    }
}
