'use strict';

let vm = new Vue({
    el: '#niico',
    data: _consts.dafaultVueData,
    computed: {

    },
    filters: {

        formartDate: function(unixtime) {
            return _utils.format.date(unixtime * 1000);
        },
        formatTime: function(sec) {
            return _utils.format.time(Math.floor(sec));
        }

    },
    watch: {
        settings: {
            handler: function(obj) {
                chrome.storage.local.set(obj);

            },
            deep: true,
        },
        'settings.windowMode': function(mode) {
            // プレイヤーアクティブな状態でミニモード押下したとき
            if(mode=='mini' && this.status.isPlayerActive) {
                this.draggableCtrl().activate();
            } else {
                this.draggableCtrl().inactivate();
            }

            this.outsideControl();

            this.autoScrollWindowTab();
        },
        'status.isPlayerActive': function(isPlayerActive) {
            // アクティブになって、アクティブになる前のモードがminiだったとき
            if(isPlayerActive && this.settings.windowMode === 'mini') {
                this.draggableCtrl().activate();
            }

            if(isPlayerActive) {
                this.outsideControl();
            } else {
                $('body').css('margin-top', 0);
            }

            this.autoScrollWindowTab();
        },
        'settings.volume': function(volume) {
            this.videosEvents().changeVolume();
        },
        'status.activeVideoId': function(newValue, oldValue) {
            if(!oldValue) {
                this.logsCtrl().addLog('動画切替：'+newValue+'を開いた');
            } else if( !newValue) {
                this.logsCtrl().addLog('動画切替：'+oldValue+'を閉じた');
            } else if( newValue && oldValue) {
                this.logsCtrl().addLog('動画切替：'+oldValue+'->'+newValue);
            }

            $('video').each(function(){
                $(this).get(0).pause();
            })

            if(oldValue && this.videos[oldValue]) {
                this.$set(this.videos[oldValue], 'isActive', false);
            }

            if(newValue && this.videos[newValue]) {
                this.$set(this.videos[newValue], 'isActive', true);

                let $target = $('#'+newValue);
                if($target.length) {
                    $target.get(0).play();
                }

                this.fetch(newValue);
            }

            if(newValue) {
                this.autoScrollWindowTab();
            }
        },
        'settings.isBeforeunload': function() {
            if(this.settings.isBeforeunload) {
                this.beforeunloadCtrl().on();
            } else {
                this.beforeunloadCtrl().off();
            }
        },
    },
    methods: {

        niicoCtrl: function() {
            let _this = this;
            return {

                launch: function() {
                    _this.status.isPlayerActive = true;

                    if(_this.status.activeVideoId && _this.videos[_this.status.activeVideoId].src) {
                        let video = document.getElementById(_this.status.activeVideoId);
                        video.play();
                    }
                },

                close() {
                    let video = document.getElementById(_this.status.activeVideoId);
                    if(video) {
                        video.pause();
                    }
                    _this.status.isPlayerActive = false;
                },

            }
        },

        // videosを操作する
        videosCtrl: function() {
            let _this = this;
            return {

                // 動画を追加する
                // ajax処理が長引く場合を考慮し、読み込み中表示にするためとりあえず呼ばれる
                add: function(videoId) {
                    _this.videosCtrl().attr(videoId, {});
                    _this.videosCtrl().activate(videoId);
                },

                // 動画をアクティブにする
                activate: function(videoId) {
                    _this.status.activeVideoId = videoId;
                    _this.videosCtrl().attr(videoId, {
                        isClosed: false,
                    })

                    if(!_this.status.isPlayerActive) {
                        _this.niicoCtrl().launch();
                    }
                },

                // 再読込する
                // DOMを再描画するため、一旦空にしてあげる
                initialize: function(videoId, currentTime) {
                    if(!currentTime) {
                        currentTime = 0;
                    }

                    _this.$set(_this.videos, videoId, {
                        currentTime: currentTime,
                        isActive: true,
                    });
                },

                // 動画を閉じる
                close: function(videoId) {
                    _this.videosCtrl().attr(videoId, {
                        isClosed: true,
                    });
                    // this.$delete(this.videos, videoId);をしようと思ったが、
                    // 再生中のタブより前の動画を削除すると、
                    // 以降のDOMが再描画されてしまい、再生状態も初期化されてしまうので
                    // こんな面倒なことをしている。

                    // コメント処理を止める
                    _this.videos[videoId].flowCommentsController.stop();

                    let isPlayingVideo = videoId === _this.status.activeVideoId ? true : false;
                    let hasVideos = _this.videosCtrl().countNotClosed() > 0 ? true : false;

                    if( isPlayingVideo && hasVideos ){
                        for(let key in _this.videos) {
                            _this.videosCtrl().activate(key);
                            break;
                        }
                    }

                    if( !hasVideos ) {
                        _this.status.activeVideoId = '';
                        _this.niicoCtrl().close();
                    }

                    _this.$forceUpdate();
                },

                // isClosed===trueでない動画の数を返す
                countNotClosed() {
                    let count = 0;
                    for(let videoId in _this.videos) {
                        if(!_this.videos[videoId].hasOwnProperty('isClosed') || _this.videos[videoId].isClosed !== true) {
                            count++;
                        }
                    }
                    return count;
                },

                // 動画のプロパティを追加する
                attr: function(videoId, object) {
                    // idをkeyにしたかった関係でvideosはobjectになっており
                    // そのまま$setすると上書きされちゃうので色々する

                    let tmp = _this.videos[videoId] || {};
                    let isAutoScroll = false;

                    for(let key in object) {
                        tmp[key] = object[key];
                        if(key == 'title') {
                            isAutoScroll = true;
                        }
                    }

                    _this.$set(_this.videos, videoId, tmp);

                    if(isAutoScroll) {
                        _this.autoScrollWindowTab();
                    }

                },

                // 全動画をコンソールに表示
                allVideosData: function() {
                    _this.logsCtrl().consoleObject('allVideosData', _this.videos);
                },

            }
        },

        // videos.{videoId}を操作する
        videosEvents: function() {
            let _this = this;
            return {

                seekTime: function(time) {
                    if(!time) return;
                    let videoId = _this.status.activeVideoId;
                    let video = document.getElementById(videoId);

                    if(!time.match(/^[0-9:]+$/)) return false;
                    if(!video) return false;

                    let timeArray = time.split(':');
                    timeArray = timeArray.reverse();

                    let sec = 0;
                    for(let i=0;i<timeArray.length;i++) {
                        sec += timeArray[i] * (60 ** i);
                    }

                    video.currentTime = sec;
                },

                // 音量を変える
                changeVolume: function(videoId) {
                    let volume = _this.settings.volume;

                    if(videoId) {
                        let video = document.getElementById(videoId);
                        video.volume = volume;
                    } else {
                        let videos = document.getElementsByTagName('video');

                        if(!videos || !videos.length ) return true;

                        for(let i=0;i<videos.length;i++) {
                            videos[i].volume = volume;
                        }
                    }
                },

                // クリックで再生・停止をトグル
                togglePlay: function(e) {
                    let video = e.currentTarget;
                    video.paused ? video.play() : video.pause();
                },

                // 再生されたら
                playStart: function(videoId) {
                    let ctrl = _this.videos[videoId].flowCommentsController;
                    if(ctrl) {
                        ctrl.start(); // コメントのFPSをあげる
                    }
                },

                // 一時停止したら
                pause: function(videoId) {
                    let ctrl = _this.videos[videoId].flowCommentsController;
                    if(ctrl) {
                        ctrl.stop(); // コメントのFPSをあげる処理を止める
                    }
                },

                loadedmetadata: function(e, videoId) {
                    let video = document.getElementById(videoId);
                    _this.videos[videoId].duration = video.duration;

                    if(_this.videos[videoId].currentTime > 0) {
                        video.currentTime = _this.videos[videoId].currentTime;
                    }

                    if(_this.status.activeVideoId == videoId){
                        video.play();
                        _this.videosEvents().changeVolume();
                    }
                },

                // 再生位置計算
                timeupdate: function(e, videoId) {
                    let video = document.getElementById(videoId);
                    if(!video) return false;

                    _this.videosCtrl().attr(videoId, {
                        currentTime: video.currentTime,
                        currentTimePerDuration: video.currentTime / video.duration * 100,
                    });
                    _this.$forceUpdate();
                },

                // TimeRange計算
                progress: function(e, videoId) {
                    let video = document.getElementById(videoId);
                    let target = 'progress'
                    let duration;
                    try {
                        let duration = video.duration;
                        let bf = video.buffered;
                        let currentTimePerDuration = video.currentTime / duration * 100;

                        let ranges = [];

                        for(let i = 0;i<bf.length;i++) {
                            let start = bf.start(i);
                            let end = bf.end(i);
                            let left =  start ? (start / duration * 100) : 0;
                            let width = ( (end - start) /duration * 100);
                            ranges.push({
                                left: left,
                                width: width,
                            });
                        }
                        _this.videosCtrl().attr(videoId, {
                            ranges: ranges,
                        });
                        _this.$forceUpdate();

                    } catch(e) {
                        _this.logsCtrl().addLog('バッファ計算で例外が発生しました。', 'error');
                        _this.logsCtrl().consoleObject('Progress Error', e);
                    }
                },

                loop: function(e, videoId) {
                    if(_this.settings.isLoop) {
                        e.currentTarget.play();
                    }
                },

                // errorイベントが発火されたとき
                error: function(e, videoId) {
                    let video = document.getElementById(videoId);

                    _this.logsCtrl().videoError({
                        videoId: videoId,
                        summary: videoId + 'の再生中にエラーが発生しました。',
                        error: e,
                        type: 'EVENT',

                        code: video.error.code,
                    });
                },

            }
        },

        // ミニウィンドウのドラッグ管理
        draggableCtrl: function() {
            let _this = this;
            return {

                // #niicoをドラッグできる状態にする
                activate: function() {
                    let $elem = $('#niico');

                    chrome.storage.local.get(['top', 'left'], position => {

                        // ストレージに保存された値を取得する
                        // 画面外に出ると収集つかないのでリミッタを一応つけとく
                        let top = position.top < window.innerHeight ? position.top : 0;
                        let left = position.left < window.innerWidth ? position.left : 0;

                        // 初期位置を指定した上でドラッグ出来るようにする
                        $elem.css({
                            top: top,
                            left: left,
                        }).draggable({
                            handle: '.niicoHeader',
                            disabled: false,
                            containment: 'window',  // ウィンドウサイズの外に出ないようにする
                            stop: (event, ui) => {
                                // ドラッグしたらストレージに保存する
                                chrome.storage.local.set({
                                    top: ui.position.top,
                                    left: ui.position.left,
                                });
                            },
                        });

                    })
                },

                // #niicoをドラッグできない状態にして初期化しておく
                inactivate: function() {
                    let $elem = $('#niico');
                    $elem.draggable({
                        disabled: true,
                    }).css({
                        top: '',
                        left: '',
                        right: '',
                        bottom: '',
                        position: '',
                    });
                },
            }

        },

        logsCtrl: function() {
            let _this = this;
            return {

                console: function(output, status) {
                    let development = _this.development;

                    if(!development.isDev) {
                        return;
                    }

                    if(status == 'error') {
                        console.error('niico error: ' + output);
                    } else if(status == 'info') {
                        console.info(output);
                    } else {
                        console.log(output);
                    }
                },

                consoleObject: function(key, value) {
                    if(!key || !value) return;

                    let output = {
                        key: key,
                        value: value,
                    };

                    if(_this.development.isObjectConsole) {
                        _this.logsCtrl().console(output);
                    }
                },

                addLog: function(message, status = 'default') {
                    if(!message) return;

                    _this.logs.push({
                        status: status,
                        message: message.replace(/\n/g, '<br />'),
                        timestamp: (new Date()).getTime(),
                    });

                    if(_this.development.isLogConsole) {
                        _this.logsCtrl().console(message, status);
                    }
                },

                // 動画の再生に関わるエラー
                videoError : function(obj) {
                    _this.videosCtrl().attr(obj.videoId, {
                        niicoError: obj,
                    });
                    _this.logsCtrl().addLog(obj.summary, 'error');
                },

            }
        },

        beforeunloadCtrl: function() {
            let _this = this;
            return {
                on: function() {
                    $(window).on('beforeunload', function(event) {return '';});
                },
                off: function() {
                    $(window).off('beforeunload');
                },
            }
        },

        // たまに読み込みできなくなるので一応watchをgetする
        fetch: function(videoId) {
            $.ajax({
                type: 'GET',
                url: _consts.base_url.nicovideo + 'watch/' + videoId,
            })
        },

        // アクティブなウィンドウタブまでスクロールする
        autoScrollWindowTab: function() {
            let videoId = this.status.activeVideoId;

            let parent = document.getElementById('windowTabs');
            let child = document.getElementById('windowTab--' + videoId);

            if(!parent || !child) {
                return false;
            }

            let c = child.getBoundingClientRect();
            let p = parent.getBoundingClientRect();
            p.scrollWidth = parent.scrollWidth;
            p.scrollLeft = parent.scrollLeft;

            let isOverFlowRight = p.width < c.right;
            let isOverFlowLeft = c.left < 88;

            let isOverFlow = false;
            let mov = 0;

            if(isOverFlowRight) {
                mov = p.scrollLeft + c.left + 88;
                isOverFlow = true;
            }

            if(isOverFlowLeft) {
                mov = p.scrollLeft + c.left - 88;
                isOverFlow = true;
            }

            if(isOverFlow) {
                $('#windowTabs').animate({
                    scrollLeft: mov,
                }, 200);
            }
        },

        outsideControl: function(mode) {
            let p = $('body').hasClass('nofix') ? 435 : 400;
            // 標準ウィンドウのときにウィンドウとdocument上部が被らないようにする
            $('body').css('margin-top', this.settings.windowMode === 'default' ? p : '');

            if(!this.status.isPlayerActive) return true;

            // フルウィンドウのときスクロールをなくす
            $('html').css('overflow', this.settings.windowMode === 'full' ? 'hidden': '');
        },

        // 画面外に出ちゃった場合用
        initMiniWindowPosition: function() {
            chrome.storage.local.set({
                top: '',
                left: '',
            });
        },

        isActiveInfoTab: function(string) {
            return this.settings.activeInfo == string ? true: false
        },

        // 指定の情報タブをアクティブにする
        activateInfo: function(infoTabName) {
            let infoTabsListKeys = []
            for(let key in _consts.infoTabsList) {
                infoTabsListKeys.push(key);
            }
            if(infoTabsListKeys.indexOf(infoTabName) >= 0) {
                this.settings.activeInfo = infoTabName;
            }
        },

        changeWindowType(type) {
            if(type==='close') {
                this.niicoCtrl().close();
            } else if(type===this.settings.windowMode) {
                this.settings.windowMode = 'default';
            } else if(type==='mini') {
                this.settings.windowMode = 'mini';
            } else if(type==='full') {
                this.settings.windowMode = 'full';
            }
        },

        // ツイート用のリンク生成
        tweetHref: function() {
            let videoId = this.status.activeVideoId;
            let title = this.videos[videoId].title;
            let isIncludeNiicoHashTagInTweet = this.settings.isIncludeNiicoHashTagInTweet;

            if(!videoId || !title) return false;

            let hashtags = videoId + ',ニコニコ動画';
            if(isIncludeNiicoHashTagInTweet) {
                hashtags += ',niico';
            }

            let href = "https://twitter.com/share?";
            let params = {
                url: 'http://nico.ms/' + videoId + '?ref=twitter',
                hashtags: hashtags,
                text: title,
            }

            Object.keys(params).forEach(function (key) {
                href += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
            });

            return href;
        },

    }
});

let niico = new Niico(vm);
