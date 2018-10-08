'use strict';

class FlowCommentsController {
    constructor(videoId, comments) {
        let video = document.getElementById(videoId);
        let canvas = document.getElementById(videoId + '-flow-comment');
        let context = canvas.getContext("2d");
        let rate = 3;

        if(!video) return;

        this.animate = () => {
            this.flushComments(video, comments, canvas, context, rate);
            this.id = requestAnimationFrame(this.animate); // 入れ子にして継続する
        };

        // よくわからんがうまくはじまらないときがあるのでとりあえず実行
        this.id = requestAnimationFrame(this.animate);
    }

    // コメントのFPSをあげる
    start() {
        cancelAnimationFrame(this.id); // たぶん大丈夫だが念の為前の処理を止めておく
        this.id = requestAnimationFrame(this.animate);
    }

    // コメントのFPSをあげる処理を止める
    // よくわからんがこれがないと負荷がヤバイし、なんならこれがあってもまだヤバイ
    stop() {
        cancelAnimationFrame(this.id);
    }

    // canvasを描画する
    // 負荷高そうなので簡素化したい＆表示位置計算が雑なので改善の余地がヤバイ
    flushComments(video, comments, canvas, context, rate) {
        let currentTime = video.currentTime;
        let w = $(video).width();
        let h = w / 16 * 9;
        let weight;

        let rateElem = document.getElementById('commentRate');
        if(rateElem && rateElem.value) {
            rate *= 2 - rateElem.value;;
        }

        weight = 'bold ';

        canvas.width = w;
        canvas.height = h;
        context.font = weight + (w/25)+'px "游ゴシック体", "Hiragino Kaku Gothic ProN",sans-serif';
        context.clearRect( 0, 0, w, h );

        context.shadowColor = "#000";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 10;
        context.lineWidth = 2;
        context.strokeStyle='#000';
        context.fillStyle = "white";

        let ue_base = 0;
        let shita_base = 0;

        for(let i=0;i<comments.length;i++){

            if( currentTime - rate < comments[i].vpos && comments[i].vpos < currentTime + rate) {
                let left = (w / 2) - (comments[i].vpos - currentTime) * -(w/rate) - (w/2);
                let top = ( comments[i].tpos * (h - (w/25)) + w/30 );

                let command = this.commandParse(comments[i].mail);

                if(command.color) {
                    context.fillStyle = command.color;
                } else {
                    context.fillStyle = 'white';
                }

                let size = w/25;
                if(command.size) {
                    if(command.size == 'big') {
                        size *= 1.5;
                    } else if(command.size == 'small') {
                        size *= 0.8;
                    }
                    context.font = weight + size+'px "游ゴシック体", "Hiragino Kaku Gothic ProN",sans-serif';
                } else {
                    context.font = weight + (w/25)+'px "游ゴシック体", "Hiragino Kaku Gothic ProN",sans-serif';
                }

                if(command.position) {
                    let textWidth = context.measureText(comments[i].content).width;
                    let textHeight = size;
                    left = (w - textWidth) / 2;

                    if(command.position=='ue') {
                        ue_base += textHeight;
                        if(ue_base > h) {
                            ue_base = 0;
                        }
                        top = ue_base;
                    } else {
                        shita_base += textHeight;
                        if(top < textHeight) {
                            shita_base = textHeight;
                        }
                        top = h - shita_base + textHeight;
                        if(top > h) {
                            top = h - textHeight;
                        }
                        if(top==h) {
                            top -= 5;
                        }
                    }

                    if(currentTime - rate < comments[i].vpos && comments[i].vpos < currentTime) {
                        context.strokeText(comments[i].content, left ,comments[i].tpos - (w/25) );
                        context.fillText(comments[i].content, left , top );
                    }
                } else {
                    // position指定があったらタイミングはかるので
                    context.strokeText(comments[i].content, left ,comments[i].tpos - (w/25) );
                    context.fillText(comments[i].content, left , top );
                }
            }
        }
    }

    commandParse(c) {
        if(!c) return true;

        let obj = {};

        let color = c.match(/white|red|pink|orange|yellow|green|cyan|blue|purple|black/);
        if(color) {
            obj['color'] = color[0];
        }

        let position = c.match(/ue|shita/);
        if(position) {
            obj['position'] = position[0];
        }

        let size = c.match(/midium|small|big/);
        if(size) {
            obj['size'] = size[0];
        }

        return obj;
    }
}
