'use strict';

$('body').prepend(`
    <div id="niico" :class="['niico', {'isLoggedIn': status.isLoggedIn}, {'isPlayerActive': status.isPlayerActive}, {'isBottomFit': settings.isBottomFit}, {'niico--full': settings.windowMode==='full' && status.isPlayerActive}, {'niico--mini': settings.windowMode==='mini' && status.isPlayerActive}]">
        <div :class="['niicoPlayerContainer', {'isActive': status.isPlayerActive === true && status.isLoggedIn === true}]">
            <div class="niicoHeader">
                <div class="headerTabBar">
                    <div class="windowActions">
                        <div class="action close" @click="changeWindowType('close')"></div>
                        <div class="action mini" @click="changeWindowType('mini')"></div>
                        <div class="action full" @click="changeWindowType('full')"></div>
                    </div><!-- .windowActions -->
                    <div id="windowTabs" class="windowTabs" data-js-mousewheel data-js-autoScrollWindowTab="parent">
                        <div
                            v-for="(video, videoId, index) in videos"
                            v-if="!video.isClosed"
                            :class="['windowTab', { 'is-active': video.isActive }, 'windowTab--'+videoId]"
                            :id="'windowTab--'+videoId">
                            <div class="tabInner">
                                <div class="tabMain">
                                    <div class="icon"></div>
                                    <div class="title" @click="videosCtrl().activate(videoId)" :title="video.title">
                                        <div class="text" v-if="video.title && !video.niicoError">{{video.title}}</div>
                                        <div class="text" v-if="!video.title && !video.niicoError">読み込み中...</div>
                                        <div class="text" v-if="video.niicoError">エラー</div>
                                    </div>
                                    <div class="close" @click="videosCtrl().close(videoId)">×</div>
                                </div>
                                <div :class="['progress', 'progress--'+videoId]" @click="videosCtrl().activate(videoId)">
                                    <div class="buffered">
                                        <div
                                            class="range"
                                            v-for="range in video.ranges"
                                            :style="[{left: range.left+'%'}, {width: range.width+'%'}]"
                                            ></div>
                                    </div>
                                    <div class="currentTime"
                                        :style="{left: video.currentTimePerDuration+'%'}"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div><!-- .tabs -->
                </div><!-- .headerTabBar -->

                <div class="headerStatusBar">
                    <div class="statusBarActions">
                        <a :href="'watch/'+status.activeVideoId" :data-reload="status.activeVideoId" v-if="status.activeVideoId">再読込</a>
                    </div>
                    <div class="videoStatuses" data-js-mousewheel>
                        <dl title="テンキーの↑↓押すと再生速度を変えられるよ">
                            <dt>再生速度</dt>
                            <dd v-if="status.activeVideoId">x{{videos[status.activeVideoId].playbackRate}}</dd>
                        </dl>
                        <dl>
                            <dt>コメ速度</dt>
                            <dd v-if="status.activeVideoId">
                                <input type="range" min ="0" max="1.99" step="0.01" id="commentRate" v-model="settings.commentRate" style="width: 50px;">
                            </dd>
                        </dl>
                        <dl>
                            <dt>コメ透過</dt>
                            <dd v-if="status.activeVideoId">
                                <input type="range" min ="0" max="1" step="0.01" v-model="settings.commentOpacity" style="width: 50px;">
                            </dd>
                        </dl>
                        <dl>
                            <dt>音量</dt>
                            <dd v-if="status.activeVideoId">
                                <input type="range" min ="0" max="1" step="0.01" v-model="settings.volume" style="width: 50px;">
                            </dd>
                        </dl>
                        <dl>
                            <dt>再生</dt>
                            <dd v-if="status.activeVideoId && videos[status.activeVideoId].count">{{videos[status.activeVideoId].count.view}}</dd>
                        </dl>
                        <dl>
                            <dt>コメ</dt>
                            <dd v-if="status.activeVideoId && videos[status.activeVideoId].count">{{videos[status.activeVideoId].count.comment}}</dd>
                        </dl>
                        <dl>
                            <dt>マイ</dt>
                            <dd v-if="status.activeVideoId && videos[status.activeVideoId].count">{{videos[status.activeVideoId].count.mylist}}</dd>
                        </dl>
                        <dl>
                            <dt>投稿日時</dt>
                            <dd v-if="status.activeVideoId">{{videos[status.activeVideoId].postedDateTime}}</dd>
                        </dl>
                        <dl>
                            <dt>投稿者</dt>
                            <dd v-if="videos[status.activeVideoId] && videos[status.activeVideoId].user && !videos[status.activeVideoId].user.isPrivate">
                                <a :href="'http://www.nicovideo.jp/user/'+videos[status.activeVideoId].user.id" target="_blank">{{videos[status.activeVideoId].user.nickname}}</a>
                            </dd>
                            <dd v-if="videos[status.activeVideoId] && videos[status.activeVideoId].user && videos[status.activeVideoId].user.isPrivate">
                                {{videos[status.activeVideoId].user.nickname}}
                            </dd>
                            <dd v-if="videos[status.activeVideoId] && videos[status.activeVideoId].channel">
                                <a :href="'http://ch.nicovideo.jp/'+videos[status.activeVideoId].channel.globalId" target="_blank">{{videos[status.activeVideoId].channel.name}}</a>
                            </dd>
                        </dl>
                        <dl>
                            <dt>動画ID</dt>
                            <dd v-if="status.activeVideoId"><a :href="'http://www.nicovideo.jp/watch/'+status.activeVideoId" target="_blank">{{status.activeVideoId}}</a></dd>
                        </dl>
                    </div>
                    <div class="statusBarActions" v-if="status.activeVideoId">
                        <a :href="'http://www.nicovideo.jp/watch/'+status.activeVideoId" target="_blank">別窓</a>
                        <a v-if="tweetHref()" :href="tweetHref()" target="_blank">ツイート</a>
                    </div>
                </div>
            </div><!-- niicoHeader -->

            <div class="niicoBody">
                <div class="players">
                    <div class="player" v-for="(video, videoId, index) in videos" v-show="status.activeVideoId===videoId">
                        <video
                            :poster="video.thumbnailURL"
                            v-if="video && video.smileInfo && video.smileInfo.url && !video.niicoError"
                            v-show="!video.isClosed"
                            v-bind:src="video.smileInfo.url"
                            v-bind:id="videoId"
                            @timeupdate="videosEvents().timeupdate($event, videoId)"
                            @progress="videosEvents().progress($event, videoId)"
                            @play="videosEvents().progress($event, videoId);videosEvents().playStart(videoId)"
                            @pause="videosEvents().pause(videoId)"
                            @ended="videosEvents().loop($event, videoId)"
                            @error="videosEvents().error($event, videoId)"
                            @loadedmetadata="videosEvents().loadedmetadata($event, videoId)"
                            @click="videosEvents().togglePlay($event)"
                            controls
                            preload="auto">
                        </video>
                        <div class="notReady" v-else>
                            <div class="error" v-if="video.niicoError">
                                <p class="summary">{{video.niicoError.summary}}</p>
                                <div v-if="video.niicoError.type == 'AJAX'">
                                    <p>【ステータスコード】{{video.niicoError.status}}</p>

                                    <p v-if="video.niicoError.status=='403'">アクセスが禁止されています。<br />有料動画、コミュ限などあなたに視聴権限がないかもです。</p>
                                    <p v-else-if="video.niicoError.status=='404'">存在しないっぽいです。<br />リンクのURL間違えてるかもです。</p>
                                    <p v-else-if="video.niicoError.status=='500' || video.niicoError.status=='503'">
                                        サーバーエラーです。ニコ動が調子が悪いのかも？<br />
                                        <a href="https://twitter.com/nico_nico_talk" target="_blank">公式Twitter</a>あたりで情報が出てるかも。<br />
                                        もしかしたら短時間にアクセスしすぎてる可能性も微粒子レベルで存在している・・・？
                                    </p>
                                    <p v-else>想定していないエラーです。起きてないエラーまではよくわかなんないから文章書くのも大変でね・・・。</p>
                                </div>
                                <div v-else-if="video.niicoError.type == 'EVENT'">
                                    <p>【エラーコード】{{video.niicoError.code}}</p>

                                    <p v-if="video.niicoError.code == 1">読み込みが中断されました。<br/ >再読込するか、watchページに行ってみてください。</p>
                                    <p v-else-if="video.niicoError.code == 2">ネットワークエラーです。<br/ >回線の状況を確認して再読込するか、watchページに行ってみてください。</p>
                                    <p v-else-if="video.niicoError.code == 3">デコードに失敗したっぽいです。<br/ >再読込するか、watchページに行ってみてください。</p>
                                    <p v-else-if="video.niicoError.code == 4">ブラウザがフォーマットをサポートしていません。<br />古い動画だとよく起きます。再読込では再生できないかも。</p>
                                    <p v-else>開発者が想定してなかったエラーです。エラーコードと動画IDを報告してもらえると対応できるかも。</p>
                                </div>
                                <div v-else-if="video.niicoError.type == 'COULD_NOT_GET_URL'">
                                    <p>未購入の有料動画など、視聴権限がない可能性が高いです。<br />watchページに行って確かめてみてください。</p>
                                </div>
                            </div>
                            <p v-else>動画のURLを読み込み中...</p>
                            <p><a :href="'http://www.nicovideo.jp/watch/' + videoId" target="_blank">watchページで見る</a></p>
                        </div>
                        <div  class="flowComments" :style="[{'opacity': settings.commentOpacity}]">
                            <canvas :id="videoId+'-flow-comment'"></canvas>
                        </div>
                    </div>
                </div><!-- .videos -->

                <div class="info">
                    <div class="infoTabs" data-js-mousewheel>
                        <div :class="['infoTab', { 'is-active': settings.activeInfo==='videoOutlines' }]" @click="activateInfo('videoOutlines')">動画情報<span v-if="!status.activeVideoId || !videos[status.activeVideoId].title">...</span></div>
                        <div :class="['infoTab', { 'is-active': settings.activeInfo==='videoComments' }]" @click="activateInfo('videoComments')">コメント<span v-if="!status.activeVideoId || !videos[status.activeVideoId].comments">...</span></div>
                        <div v-if="videos[status.activeVideoId]" :class="['infoTab', { 'is-active': settings.activeInfo==='contributorVideos' }]" @click="activateInfo('contributorVideos')">
                            投稿者動画 (<span v-if="videos[status.activeVideoId] && videos[status.activeVideoId].contributorVideos">{{videos[status.activeVideoId].contributorVideos.length}}<span v-if="videos[status.activeVideoId].contributorVideos.length === 100">+</span></span><span v-if="!videos[status.activeVideoId] || !videos[status.activeVideoId].contributorVideos">...</span>)
                        </div>
                        <div :class="['infoTab', { 'is-active': settings.activeInfo==='videoHistory' }]" @click="activateInfo('videoHistory')">
                            視聴履歴（<span v-if="videoHistory.length">{{videoHistory.length}}<span v-if="videoHistory.length === 30">+</span></span><span v-if="!videoHistory.length">...</span>）
                        </div>
                        <div :class="['infoTab', { 'is-active': settings.activeInfo==='niicoSettings' }]" @click="activateInfo('niicoSettings')">設定</div>
                        <div :class="['infoTab', { 'is-active': settings.activeInfo==='niicoLogs' }]" @click="activateInfo('niicoLogs')">ログ</div>
                    </div><!-- .infoTabs -->
                    <div class="infoBody">
                        <div class="videoComments" v-show="settings.activeInfo=='videoComments'">
                            <div class="lines" v-for="(video, videoId, index) in videos" v-show="video.isActive">
                                <div class="line heading">
                                        <div class="param content">コメント</div>
                                        <div class="param pos">再生時間</div>
                                        <div class="param posted">書込時刻</div>
                                        <div class="param no">コメ番</div>
                                        <div class="param command">コマンド</div>
                                </div>
                                <div class="line" v-for="(comment) in video.comments">
                                    <div class="param content">{{comment.content}}</div>
                                    <div class="param pos"><a href="#" :data-seektime="comment.vpos | formatTime" class="seekTime">{{comment.vpos | formatTime}}</a></div>
                                    <div class="param posted">{{comment.date | formartDate}}</div>
                                    <div class="param no">{{comment.no}}</div>
                                    <div class="param command">{{comment.mail}}</div>
                                </div>
                            </div>
                        </div><!-- .comments -->

                        <div class="videoOutlines" v-show="settings.activeInfo=='videoOutlines'">
                            <div v-for="(video, videoId, index) in videos" v-show="videoId == status.activeVideoId">
                                <div class="title">{{video.title}}</div>
                                <div class="tags">
                                    <div v-for="(tag) in video.tags" :class="['tag', {'isDictionaryExists': tag.isDictionaryExists}]">
                                        <a class="tagSearch" :href="'http://www.nicovideo.jp/tag/'+tag.name">{{tag.name}}</a>
                                        <a class="dictionary" :href="'http://dic.nicovideo.jp/a/'+tag.name" target="_blank">
                                            <span v-if="tag.isDictionaryExists">百</span>
                                            <span v-if="!tag.isDictionaryExists">？</span>
                                        </a>
                                    </div>
                                </div>
                                <div v-html="video.description"></div>
                            </div>
                        </div><!-- .informations -->

                        <div class="contributorVideos video-list-container" v-show="settings.activeInfo=='contributorVideos'">
                            <div v-if="videos[status.activeVideoId] && videos[status.activeVideoId].contributorVideos && videos[status.activeVideoId].contributorVideos.length > 0" class="video-list-container">
                                <video-list
                                    v-for="(video, videoId, index) in videos[status.activeVideoId].contributorVideos"
                                    v-bind:video="video"
                                    v-bind:index="index"
                                    v-bind:key="videoId"
                                ></video-list>
                            </div>
                            <div v-if="videos[status.activeVideoId] && videos[status.activeVideoId].contributorVideos && videos[status.activeVideoId].contributorVideos.length === 0">
                                この投稿者は投稿動画が非公開みたいです。
                            </div>
                            <div v-if="videos[status.activeVideoId] && videos[status.activeVideoId].user && videos[status.activeVideoId].user.isPrivate">
                                投稿者情報を非公開にしているのでアクセスできんです。
                            </div>
                        </div>

                        <div class="niicoSettings" v-show="settings.activeInfo=='niicoSettings'">
                            <div>
                                <label>
                                    <input type="checkbox" v-model="settings.isOpenNewTab"> 動画リンク以外を（Chromeの）新しいタブで開く
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" v-model="settings.isLoop"> 動画をループ再生する
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" v-model="settings.isIncludeNiicoHashTagInTweet"> ツイートに#niicoを含める
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" v-model="settings.isBottomFit"> 画面下に表示する
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" v-model="settings.isNiicoOff">   niicoをオフにする
                                </label>
                            </div>
                            <div v-if="development.isDev">
                                <label>
                                    <input type="checkbox" v-model="settings.isBeforeunload"> ページ内遷移時にアラートで確認する
                                </label>
                            </div>

                        </div>

                        <div class="videoHistory" v-show="settings.activeInfo=='videoHistory'">
                            <div v-if="videoHistory" class="video-list-container">
                                <video-list
                                    v-for="(video, videoId, index) in videoHistory"
                                    v-bind:video="video"
                                    v-bind:index="index"
                                    v-bind:key="videoId"
                                ></video-list>
                            </div>
                            <div v-if="!videoHistory.length">
                                視聴履歴がありません。
                            </div>
                        </div>

                        <div class="niicoLogs"  v-show="settings.activeInfo=='niicoLogs'">
                            <ul>
                                <li v-for="(log) in logs" :class="['log', {'error': log.status==='error'}]">
                                    <div v-html="log.message"></div>
                                </li>
                            </ul>
                        </div><!-- .logs -->
                    </div><!-- .infoBody -->
                </div><!-- .info -->
            </div><!-- .niicoBody -->
        </div><!-- .isLoggedIn -->
        <div class="niicoMessage">
            <div v-show="status.isLoggedIn && status.isPlayerActive !== true">
                <div class="niicoMessageText">
                    niico待機中。動画のリンクをクリックして起動してください。
                </div>
                <div class="niicoButtons">
                    <div class="niicoButton"><label><input type="checkbox" v-model="settings.isNiicoOff"> niicoをオフにする</label></div>
                    <div class="niicoButton" v-if="settings.windowMode==='mini'" @click="initMiniWindowPosition">ミニウィンドウの位置を初期化する</div>
                    <div class="niicoButton" v-if="status.pageVideoId"><a :href="'http://www.nicovideo.jp/watch/'+status.pageVideoId">niicoを起動する</a></div>
                </div>
            </div>
            <div v-show="status.isLoggedIn !== true">niicoはログインしないと使えないです。ログインしてください。</div>
        </div>
    </div>

`);
