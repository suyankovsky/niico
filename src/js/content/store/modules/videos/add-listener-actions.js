import $ from 'jquery';
import ParseVideoId from 'js/content/lib/parse-video-id.js';
import Validate from 'js/content/lib/validate.js';
import misc from 'js/content/lib/misc.js';

export default {
    addOnClickEventListener: ({dispatch, state, rootState, commit}) => {
        $(document).on('click', 'a', function() {
            if(rootState.setting.is_niico_off) return;

            const $this = $(this);

            const seektime = $this.attr('data-seektime');
            if(seektime) {
                misc.updateActiveVideoCurrentTime(seektime);
                return false;
            }

            const is_no_href = !$this.attr('href');
            const is_target_blank =  $this.attr('target') == '_blank';
            if(is_no_href || is_target_blank) return;

            const video_id = ParseVideoId.byAnchor($this);
            if(!video_id) return;

            dispatch('addVideo', video_id);

            return false;
        });
    },
    addOnKeydownEventListener: ({dispatch, state, rootState}) => {
        $(document).on('keydown', e => {
            if(!e || !e.keyCode) return;

            // settingのreturn
            if(rootState.setting.is_niico_off) return;
            if( ! rootState.setting.is_use_shortcut) return;

            // statusのreturn
            if( ! rootState.status.active_video_id) return;
            if(rootState.status.is_window_closed) return;

            // form部品にフォーカスしていたらreturn
            const is_focus_form_parts_tag = Validate.isFormPartsTagName(document.activeElement.tagName);
            if(is_focus_form_parts_tag) {
                // ただし許可されていたら実行する
                const is_allow_key_event = $(document.activeElement).attr('data-allow-key-event');
                if(!is_allow_key_event) return;
            }

            const el = document.getElementById(rootState.status.active_video_id);
            if(!el) return;

            switch(e.keyCode) {
                case 39://right
                    el.currentTime += rootState.setting.moves_seconds || 5;
                    return false;
                case 37://left
                    el.currentTime -= rootState.setting.moves_seconds || 5;
                    return false;
                case 38://up
                    window.niico.$store.dispatch('status/upPlaybackRate');
                    return false;
                case 40://down
                    window.niico.$store.dispatch('status/downPlaybackRate');
                    return false;
                case 32://space
                    el.paused ? el.play() : el.pause();
                    return false;
                default:
                    return;
            }
        });
    },
}
