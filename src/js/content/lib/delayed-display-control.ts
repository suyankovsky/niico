import $ from 'jquery';

export default class {
    constructor({
        container_target,
        move_target,
        leave_target,
        over_target,
        milliseconds,
        classname,
    }) {
        this.target = {
            $container: $(container_target),
            $move: $(move_target),
            $leave: $(leave_target),
            $over: $(over_target),
        }
        this.milliseconds = milliseconds || 3000;
        this.classname = classname || 'is-active';
        this.timer = undefined;

        this.target.$move.on('mousemove', () => this.onMousemove());
        this.target.$leave.on('mouseleave', () => this.onMouseleave());
        this.target.$over.on('mouseover', () => this.onMouseover());
    }

    onMousemove() {
        this.addClass();
        this.setRemoveTimer();
    }
    onMouseleave() {
        this.removeClass();
        this.clearRemoveTimer();
    }
    onMouseover() {
        this.addClass();
        this.clearRemoveTimer();
    }

    setRemoveTimer() {
        this.clearRemoveTimer();

        this.timer = setTimeout(() => this.removeClass(), this.milliseconds);
    }
    clearRemoveTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    addClass() {
        this.target.$container.addClass(this.classname);
    }
    removeClass() {
        this.target.$container.removeClass(this.classname);
    }
}
