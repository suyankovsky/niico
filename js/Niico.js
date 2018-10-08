'use strict';

class Niico {
    constructor(vm) {
        this.vm = vm;

        this.loadStorageSettings();
        this.ajaxHistory();

        if(this.isLoggedIn()) {
            this.vm.status.isLoggedIn = true;
            this.monitorClickVideo();
            this.monitorMousewheel();
            this.monitorKeyDownEvents();
            this.watchPageAction();
        } else {
            this.vm.status.isLoggedIn = false;
            this.vm.logsCtrl().addLog('ログインしてください', 'error');
        }
    }

    watchPageAction() {
        if(this.vm.settings.isNiicoOff) return;
        if(!_utils.check.isWatchPage()) return;

        let videoId = _utils.parseVideoId.byPathname();
        if(videoId) {
            this.vm.status.pageVideoId = videoId;
        }
    }

    // chrome.storage.localの設定を読み込む
    loadStorageSettings() {
        let keys = [];
        for(let key in _consts.dafaultVueData.settings) {
            keys.push(key);
        }
        chrome.storage.local.get(keys, items => {
            for(let key in this.vm.settings) {
                if(items[key] !== undefined){
                    this.vm.settings[key] = items[key];
                }
            }
        })
    }

    // ログインしてるかどうか
    // もちょっと良い実装がある気がするが通信したくない...
    isLoggedIn() {
        return $('#siteHeaderNotification').attr('data-nico-userid') ? true : false;
    }

    monitorMousewheel() {
        $('[data-js-mousewheel]', document).mousewheel(function(event, mov) {
            $(this).scrollLeft( $(this).scrollLeft() - mov * _consts.horizonScrollSpeed );
            return false;
        });
    }

    // aクリックイベントを監視、有効なリンクならいろいろする
    monitorClickVideo() {

        // 再読込
        $(document).on('click', '[data-reload]', (e) => {
            let $target = $(e.currentTarget);
            let videoId = $target.attr('data-reload');
            let isValidVideoId = videoId.match(_consts.re.validVideoId) ? true : false;

            if(isValidVideoId) {
                let video = document.getElementById(videoId);
                let currentTime = video.currentTime;
                this.vm.videosCtrl().initialize(videoId, currentTime);
                this.ajaxWatchPage(videoId);
            }

            return false;
        });

        // 実行
        $(document).on('click', 'a', (e) => {
            let $target = $(e.currentTarget);
            let href = $target.attr('href');
            let videoId = '';

            let isTargetBlank = $target.attr('target')==='_blank' ? true : false;
            let isOpenNewTab = this.vm.settings.isOpenNewTab;
            let isNiicoOff = this.vm.settings.isNiicoOff;
            let isValidHref = _utils.check.isValidHref(href);
            let isWatchURI = _utils.check.isWatchURI(href);
            let isNicoAdURI = _utils.check.isNicoAdURI(href);
            let isSeekTime = $target.attr('data-seekTime') ? true : false;
            let isPlayerActive = this.vm.status.isPlayerActive ? true : false;

            // シーク
            if(isSeekTime) {
                let seekTime = $target.attr('data-seekTime');
                if(!seekTime) return;
                this.vm.videosEvents().seekTime( seekTime );
                return false;
            }

            // return trueするやつを先に返す
            if( isNiicoOff || isTargetBlank || !isValidHref) return true;

            // videoIdの取得を試みる
            if( isWatchURI ){
                videoId = _utils.parseVideoId.byString(href);
            } else if( isNicoAdURI ) {
                videoId = _utils.parseVideoId.byNicoAdAnchor($target);
            }

            // videoIdが取得できなかったら新しいタブで開く
            if( !videoId && isOpenNewTab && isPlayerActive){
                this.vm.logsCtrl().addLog('クリック検知したけど対象URLではないです。hrefは→'+href, 'info');
                window.open(href, '_blank');
                return false;
            }

            // すでに同じ動画を開いていたらajaxとかしない
            for(let key in this.vm.videos) {
                if( videoId === key ) {
                    this.vm.videosCtrl().activate(videoId);
                    return false;
                }
            }

            // videoIdが取得できたら実行する
            if( videoId ) {
                this.vm.videosCtrl().add(videoId);
                this.ajaxWatchPage(videoId);
                return false;
            }
        });

        // clickイベントを設定したら準備できたことにしようかなと
        this.vm.logsCtrl().addLog('niico準備できたよ。', 'info');
    }

    // watchページにアクセスして色々する
    ajaxWatchPage(videoId) {
        this.vm.logsCtrl().addLog('動画 "'+videoId+'"のwatchページを読み込みます...');
        $.ajax({
            type: 'GET',
            url: _consts.base_url.nicovideo + 'watch/' + videoId,
            dataType: 'text',
        }).then(
            data => {
                this.vm.logsCtrl().addLog('動画 "'+videoId+'"のwatchページの読み込み完了');

                // 各種dataをjsonに変換
                let api_data = JSON.parse($(data).filter('#js-initial-watch-data').attr('data-api-data'));
                this.vm.logsCtrl().consoleObject('ajaxWatchPage', api_data);

                // コメント取得用のパラメータをセット
                let params = {
                    thread_id: api_data.thread.ids.default,
                    user_id: api_data.viewer.id,
                    userkey: api_data.context.userkey,
                    l: api_data.video.duration,
                }

                // vmに格納するデータを整形する
                let video = api_data.video;

                if(video.smileInfo.url == '') {
                    this.vm.logsCtrl().videoError({
                        videoId: videoId,
                        summary: videoId + 'のURLが取得できませんでした。',
                        error: video,
                        type: 'COULD_NOT_GET_URL',
                    });
                }

                video.tags = api_data.tags;
                video.playbackRate = 1;
                video.count = {
                    view: _utils.format.number(api_data.video.viewCount),
                    comment: _utils.format.number(api_data.thread.commentCount),
                    mylist: _utils.format.number(api_data.video.mylistCount),
                };

                // チャンネル動画かどうかで色々処理を変える
                if( api_data.channel ) {
                    video.channel = api_data.channel;
                    params.thread_id = api_data.video.dmcInfo.thread.thread_id;
                    params.optional_thread_id = api_data.video.dmcInfo.thread.optional_thread_id;
                    this.ajaxThreadKey(videoId, params);
                    this.ajaxChannelVideo(videoId, api_data.channel.id);
                } else {

                    this.ajaxComments(videoId, params);
                    if(api_data.owner) {
                        video.user = {
                            id: api_data.owner.id,
                            nickname: api_data.owner.nickname,
                        };
                        this.ajaxUserVideo(videoId, api_data.video.user.id);
                    } else {
                        video.user = {
                            isPrivate: true,
                            id: null,
                            nickname: '非公開ユーザー',
                        };
                    }
                }

                // シークのためのJSがある場合、関数がなくてエラーになるので消しておく
                video.description = (video.description).replace(/onclick=\"seekNicoPlayer\(\'\#[0-9:]+\'\); return false;\"/g, '');

                // 動画情報を格納してアクティブにする
                this.vm.videosCtrl().attr(videoId, api_data.video);
                this.vm.videosCtrl().activate(videoId);
            },
            error => {
                this.vm.logsCtrl().videoError({
                    videoId: videoId,
                    type: 'AJAX',
                    error: error,
                    status: error.status,

                    summary: videoId+'のwatchページの読み込みに失敗しました。',
                });
            },
        )
    }

    ajaxUser(videoId, user_id) {
        this.vm.logsCtrl().addLog('ユーザー "'+user_id+'"の情報を取得しています...');
        $.ajax({
            type: 'get',
            url: _consts.base_url.getUserInfo + user_id,
            dataType: 'text'
        }).then(
            data => {
                this.vm.logsCtrl().consoleObject('ajaxUser', data);
                let $info = $($.parseXML(data));

                let user = {
                    nickname: $info.find('nickname').text(),
                    icon_url: $info.find('thumbnail_url').text(),
                    id: user_id,
                };

                this.vm.videosCtrl().attr(videoId, {
                    user: user,
                });

                this.vm.logsCtrl().addLog('ユーザー "'+user_id+'"の情報取得完了');
            },
            error => {
                this.vm.logsCtrl().addLog('ユーザー "'+user_id+'"の情報取得に失敗', 'error');
            }
        );
    }

    ajaxChannelVideo(videoId, channel_id) {
        this.vm.logsCtrl().addLog('チャンネル "'+channel_id+'"の投稿動画を取得しています...');
        $.ajax({
            type: 'get',
            url: _consts.base_url.channel[0] + 'ch'+ channel_id + _consts.base_url.channel[1],
            dataType: 'text'
        }).then(
            data => {
                let $data = $($.parseXML(data));
                let hasVideos = $data.find('item').length > 0 ? true : false;
                let videos = [];
                if(hasVideos) {
                    $data.find('item').each(function(){
                        let raw_this= String(this.innerHTML);
                        let src = raw_this.match(_consts.re.channel.parseVideoThumbnailSrc)[0];
                        let duration = raw_this.match(_consts.re.channel.parseVideoDuration)[1];
                        let posted = raw_this.match(_consts.re.channel.parseVideoPosted)[1];

                        videos.push({
                            video_id: ($('link', this).text()).match(_consts.re.parseVideoId)[0],
                            title: $('title', this).text(),
                            view: null,
                            comment: null,
                            mylist: null,
                            thumbnail_url: src,
                            duration: duration,
                            posted: _utils.format.channelDate(posted),
                        });
                    })
                }

                this.vm.videosCtrl().attr(videoId, {
                    contributorVideos: videos,
                });

                this.vm.logsCtrl().consoleObject('ajaxChannelVideo', videos);
                this.vm.logsCtrl().addLog('チャンネル "'+channel_id+'"の投稿動画取得完了');
            },
            error => {
                this.vm.logsCtrl().addLog('チャンネル "'+channel_id+'"の投稿動画取得に失敗', 'error');
            }
        );
    }

    ajaxUserVideo(videoId, user_id) {
        this.vm.logsCtrl().addLog('ユーザー "'+user_id+'"の投稿動画を取得しています...');
        $.ajax({
            type: 'get',
            url: _consts.base_url.getUserVideo + user_id,
            dataType: 'text'
        }).then(
            data => {
                this.vm.logsCtrl().consoleObject('ajaxVideoInfo', data);
                let $data = $($.parseXML(data));
                let isPrivate = $data.find('total_count').text() === 0 ? true : false;
                let videos = [];
                if(!isPrivate) {
                    $data.find('video_info').each(function(){
                        videos.push({
                            video_id: $(this).find('video > id').text(),
                            title: $(this).find('title').text(),
                            view: _utils.format.number($(this).find('view_counter').text()),
                            comment: _utils.format.number($(this).find('num_res').text()),
                            mylist: _utils.format.number($(this).find('mylist_counter').text()),
                            thumbnail_url: $(this).find('thumbnail_url').text(),
                            duration: _utils.format.time($(this).find('length_in_seconds').text()),
                            posted: _utils.format.date($(this).find('upload_time').text()),
                        });
                    })
                }

                this.vm.videosCtrl().attr(videoId, {
                    contributorVideos: videos,
                });

                this.vm.logsCtrl().addLog('ユーザー "'+user_id+'"の投稿動画取得完了');
            },
            error => {
                this.vm.logsCtrl().addLog('ユーザー "'+user_id+'"の投稿動画取得に失敗', 'error');
            }
        );
    }

    // コメント取得APIへのリクエストパラメータを生成する
    generateAjaxCommentsRequestParams(videoId, params, flparams) {
        // チャンネル動画用
        if( flparams && flparams.threadkey && flparams.force_184) {
            return JSON.stringify([
                {"ping":{"content":"rs:0"}},
                {"ping":{"content":"ps:0"}},
                {
                    "thread":{
                        "thread":params.optional_thread_id,
                        "version":"20090904",
                        "fork":0,
                        "language":0,
                        "user_id":params.user_id,
                        "with_global":1,
                        "scores":1,
                        "nicoru":0,
                        "userkey":params.userkey
                    }
                },{
                    "ping":{"content":"pf:0"}},
                    {"ping":{"content":"ps:1"}},
                    {
                        "thread_leaves":{
                            "thread":params.optional_thread_id,
                            "language":0,
                            "user_id":params.user_id,
                            "content":"0-"+Math.ceil(params.l / 60)+":100,100",
                            "scores":1,
                            "nicoru":0,
                            "userkey":params.userkey
                        }
                    },
                    {"ping":{"content":"pf:1"}},
                    {"ping":{"content":"ps:2"}},
                    {
                        "thread":{
                            "thread":params.thread_id,
                            "version":"20090904",
                            "fork":0,
                            "language":0,
                            "user_id":params.user_id,
                            "force_184":flparams.force_184,
                            "with_global":1,
                            "scores":1,
                            "nicoru":0,
                            "threadkey":flparams.threadkey
                        }
                    },
                    {"ping":{"content":"pf:2"}},
                    {"ping":{"content":"ps:3"}},
                    {
                        "thread_leaves":{
                            "thread":params.thread_id,
                            "language":0,
                            "user_id":params.user_id,
                            "content":"0-"+Math.ceil(params.l / 60)+":100,100",
                            "scores":1,
                            "nicoru":0,
                            "force_184":flparams.force_184,
                            "threadkey":flparams.threadkey
                        }
                    },
                    {"ping":{"content":"pf:3"}},
                    {"ping":{"content":"rf:0"}
                }
            ]);
        }

        // 通常動画
        return JSON.stringify([
            {"ping":{"content":"rs:0"}},
            {"ping":{"content":"ps:0"}},
            {
                "thread":{
                    "thread":params.thread_id,
                    "version":"20090904",
                    "fork":0,
                    "language":0,
                    "user_id":params.user_id,
                    "with_global":1,
                    "scores":1,
                    "nicoru":0,
                    "userkey":params.userkey
                }
            },
            {"ping":{"content":"pf:0"}},
            {"ping":{"content":"ps:1"}},
            {
                "thread_leaves":{
                    "thread":params.thread_id,
                    "language":0,
                    "user_id":params.user_id,
                    "content":"0-"+Math.ceil(params.l / 60)+":100,1000",
                    "scores":1,
                    "nicoru":0,
                    "userkey":params.userkey
                }
            },
            {"ping":{"content":"pf:1"}},
            {"ping":{"content":"rf:0"}}
        ]);
    }

    // コメントAPIから取得したデータからコメント以外を削ぎ落とす
    scrapeOffNonCommentsFromRawData(data) {
        let comments = [];

        // dataをまわしてコメントだけpush
        for(let value of data) {
            let comment = value.chat;
            if(comment) {
                comment.vpos = comment.vpos / 100;  // いろいろ面倒なので秒に直しとく
                comment.tpos = Math.random();
                if(comment.content) {
                    comments.push(comment);
                }
            }
        }

        // コメント時間順にソートする
        comments.sort(function(a, b) {
            if(a.vpos<b.vpos) return -1;
            if(a.vpos>b.vpos) return 1;
            return 0;
        })

        return comments;
    }

    // チャンネル動画コメント取得用のAPIを叩く
    ajaxThreadKey(videoId, params) {
        this.vm.logsCtrl().addLog('チャンネル動画 "'+videoId+'"のコメントを取得する準備をしています...');

        $.ajax({
            type: 'GET',
            url: _consts.base_url.getThreadKey + params.thread_id,
        }).then(
            data => {
                this.ajaxComments(videoId, params, _utils.parseAPI.getflv(data));
            },
            error => {
                this.vm.logsCtrl().addLog('チャンネル動画 "'+videoId+'"のコメント取得に失敗', 'error');
            },
        );
    }

    // 動画のコメントを取得してvm.videos[videoId].commentsに格納
    ajaxComments(videoId, params, flparams) {
        if(flparams) {
            this.vm.logsCtrl().addLog('チャンネル動画 "'+videoId+'"のコメントを取得しています...');
        } else {
            this.vm.logsCtrl().addLog('動画 "'+videoId+'"のコメントを取得しています...');
        }

        $.ajax({
            type: 'POST',
            url: _consts.base_url.getComment,
            data: this.generateAjaxCommentsRequestParams(videoId, params, flparams),
            dataType: 'json',
            contentType: 'application/json'
        }).then(
            data => {
                this.vm.logsCtrl().consoleObject('ajaxComments', data);

                if(flparams) {
                    this.vm.logsCtrl().addLog('チャンネル動画 "'+videoId+'"のコメント取得完了');
                } else {
                    this.vm.logsCtrl().addLog('動画 "'+videoId+'"のコメントを取得取得完了');
                }

                let comments = this.scrapeOffNonCommentsFromRawData(data);
                this.vm.videosCtrl().attr(videoId, {
                    comments: comments
                });

                this.vm.logsCtrl().consoleObject('scrapeOffNonCommentsFromRawData', comments);

                this.vm.videosCtrl().attr(videoId, {
                    flowCommentsController: new FlowCommentsController(videoId, comments)
                })
            },
            error => {
                if(flparams) {
                    this.vm.logsCtrl().addLog('チャンネル動画 "'+videoId+'"のコメント取得に失敗', 'error');
                } else {
                    this.vm.logsCtrl().addLog('動画 "'+videoId+'"のコメント取得に失敗', 'error');
                }
            },
        );
    }

    // 視聴履歴を取得
    ajaxHistory() {
        this.vm.logsCtrl().addLog('視聴履歴を取得しています...');

        $.ajax({
            type: 'GET',
            url: _consts.base_url.getHistory,
            dataType: 'json',
        }).then(
            data => {
                this.vm.logsCtrl().consoleObject('ajaxHistory', data);
                this.vm.logsCtrl().addLog('視聴履歴の取得完了');

                for(let i=0;i<data.history.length;i++) {
                    this.vm.videoHistory.push(data.history[i]);
                }
            },
            error => {
                this.vm.logsCtrl().addLog('視聴履歴の取得に失敗', 'error');
            },
        );
    }

    ajaxMylist() {
        $.ajax({
            type: 'GET',
            url: 'http://www.nicovideo.jp/api/deflist/list',
            dataType: 'json',
        }).then(
            data => {
                this.vm.logsCtrl().consoleObject('ajaxMylist', data);
            }
        );
    }

    monitorKeyDownEvents() {
        $(document).on('keydown', (e) => {
            if(document.activeElement.tagName=='INPUT') return true;

            try {
                let videoId = this.vm.status.activeVideoId;
                let video = document.getElementById(videoId);

                switch(e.keyCode) {
                    case 39://→
                        video.currentTime += 5;
                        return false;
                        break;

                    case 37://←
                        video.currentTime -= 5;
                        return false;
                        break;

                    case 38://↑
                        video.playbackRate += 0.25;
                        this.vm.videosCtrl().attr(videoId, {
                            playbackRate: video.playbackRate,
                        });
                        this.vm.$forceUpdate();
                        return false;
                        break;

                    case 40://↓
                        if(video.playbackRate !== 0.25 ) {
                            video.playbackRate -= 0.25;
                        }
                        this.vm.videosCtrl().attr(videoId, {
                            playbackRate: video.playbackRate,
                        });
                        this.vm.$forceUpdate();
                        return false;
                        break;

                    case 32:
                        video.paused ? video.play() : video.pause();
                        return false;
                        break;
                }
            } catch(e) {
                this.vm.logsCtrl().addLog('キーイベントの処理に失敗したかもです', 'error');
                this.vm.logsCtrl().consoleObject('keyDownEvents', e);
            }
        })

    }
}
