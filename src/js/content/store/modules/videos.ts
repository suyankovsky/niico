import state from 'js/content/store/modules/videos/state.ts';
import getters from 'js/content/store/modules/videos/getters.ts';
import mutations from 'js/content/store/modules/videos/mutations.ts';
import crud_actions from 'js/content/store/modules/videos/crud-actions.ts';
import event_actions from 'js/content/store/modules/videos/event-actions.ts';
import add_listener_actions from 'js/content/store/modules/videos/add-listener-actions.ts';
import mixin_actions from 'js/content/store/modules/videos/mixin-actions.ts';

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions: {
        ...crud_actions,
        ...event_actions,
        ...add_listener_actions,
        ...mixin_actions,
    }
}
