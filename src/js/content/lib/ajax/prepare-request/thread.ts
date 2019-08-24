import genDefaultThreadRequestParams from 'js/content/lib/ajax/prepare-request/thread-default';
import genChannelThreadRequestParams from 'js/content/lib/ajax/prepare-request/thread-channel';
import { ThreadInformation } from 'js/content/interface/Thread';

export default async function (is_channel: boolean, params: ThreadInformation) {
    if (is_channel) {
        return genChannelThreadRequestParams(params);
    } else {
        return genDefaultThreadRequestParams(params);
    }
}
