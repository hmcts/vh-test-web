import { EventModel } from 'src/app/common/models/event-model';
import { ConferenceEventRequest } from '../../clients/api-client';

export class MapEvent {
    public static map(model: EventModel): ConferenceEventRequest {
        const request = new ConferenceEventRequest();
        request.conference_id = model.conference_id;
        request.event_id = model.event_id;
        request.event_type = model.event_type;
        request.participant_id = model.participant_id;
        request.participant_room_id = model.participant_room_id;
        request.phone = model.phone;
        request.reason = model.reason;
        request.time_stamp_utc = model.time_stamp_utc;
        request.transfer_from = model.transfer_from;
        request.transfer_to = model.transfer_to;
        return request;
    }
}
