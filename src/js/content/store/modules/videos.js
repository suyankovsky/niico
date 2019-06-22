import state from 'js/content/store/modules/videos/state.js';
import getters from 'js/content/store/modules/videos/getters.js';
import mutations from 'js/content/store/modules/videos/mutations.js';
import crud_actions from 'js/content/store/modules/videos/crud-actions.js';
import event_actions from 'js/content/store/modules/videos/event-actions.js';
import add_listener_actions from 'js/content/store/modules/videos/add-listener-actions.js';
import mixin_actions from 'js/content/store/modules/videos/mixin-actions.js';

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
