// まったくこんな型だという保証はないが、浅い階層だけ調査した

export interface RawWatchApiData {
    ad: any;
    channel: RawChannel | null;// チャンネル動画だとnullじゃなくなる
    commentComposite: {} | null;
    communinty: RawCommunity | null;// コミュ限のみRawCommuinty。出身動画でもnullだった。
    context: any;
    dataLayer: any;//何のデータかわからなかった
    lead: any;//ニコニコ内の特集のPR枠っぽい？
    liveTopics: any;
    mainCommunninty: any;//いろんなコミュ動画試したら何か入ることは確認できなかった。出身コミュかと思ったが違った。
    maintenance: any;//booleanっぽいが未確認
    owner: RawUser | null;// 非公開ユーザーだとnull
    player: any;
    playlist: any;
    series: any;
    tags: RawTag[];
    thread: RawThread;
    video: RawVideo;
    viewer: RawViewer;
    watchRecommendationRecipe: string;
}

interface RawVideo {
    backCommentType: null
    badges: null
    channelId: null
    description: string;
    dmcInfo: { encryption: boolean, thread: { optional_thread_id: number } } | null
    duration: number;
    height: null
    id: string;//smプレフィックスつき
    isAdult: boolean
    isCommentExpired: boolean
    isCommonsTreeExists: null
    isCommunityMemberOnly: string;
    isDeleted: boolean
    isMonetized: boolean
    isNicowari: null
    isNoBanner: null
    isNoIchiba: boolean
    isNoNGS: null
    isOfficial: boolean
    isOfficialAnime: null
    isPublic: boolean
    isPublishedNicoscript: any
    isR18: boolean
    isTranslated: boolean
    isWide: string;
    largeThumbnailURL: string;
    mainCommunityId: any
    movieType: "mp4" | any
    mylistCount: number;
    originalDescription: string;
    originalPostedDateTime: any
    originalTitle: string;
    postedDateTime: string;//"2016/07/22 06:00:00"
    smileInfo: {
        url: string;
        isSlowLine: boolean,
        currentQualityId: string,
        qualityIds: []
    }
    thumbnailURL: string;
    title: string;
    translation: boolean
    translator: any
    viewCount: number;
    width: any;
}
interface RawViewer {
    age: number | null;
    id: number;// 非ログだと0
    isBicentennial: boolean;
    isHtrzm: boolean;
    isPostLocked: boolean;
    isPremium: boolean;
    isTwitterConnection: boolean;
    nickname: string;//非ログでも空文字が入ってた
    nicosid: string;//非ログでもなんかついてた
    prefecture: number | null;
    sex: number | null;
}
interface RawThread {
    commentCount: number;
    hasOwnerThread: any;
    ids: {
        default: number | null,
        nicos: number | null,
        community: number | null,
    };
    mymemoryLanguage: any;
    serverUrl: string;
    subServerUrl: string;
}
interface RawTag {
    id: number;
    isCategory: boolean;
    isCategoryCandidate: boolean;
    isDictionaryExists: boolean;
    isLocked: boolean;
    isRepresentedTag: boolean;
    name: string
}
interface RawChannel {
    channelPrice: number | null;
    favoriteToken: string;
    favoriteTokenTime: Date;
    global_id: string;//chプレフィックスつき
    id: number;
    isFavorited: boolean;
    isFirstMonthFree: boolean;
    name: string;
    ngList: [];
    threadType: number;
}
interface RawCommunity {
    global_id: string;// coプレフィックスつき
    id: number;
    name: string;
    threadType: number;
}
interface RawUser {
    channelInfo: null;
    iconURL: string;
    id: number;
    isUserMyVideoPublic: boolean;
    isUserOpenListPublic: boolean;
    isUserVideoPublic: boolean;
    nickname: string;
    nicoliveInfo: any;
}
