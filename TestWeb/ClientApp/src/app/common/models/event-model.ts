import { EventType, RoomType } from 'src/app/services/clients/api-client';
import { Guid } from 'guid-typescript';

export class EventModel {
    constructor() {
        this.event_id = Guid.create().toString();
        this.time_stamp_utc = new Date();
        this.transfer_from = RoomType.WaitingRoom;
        this.transfer_to = RoomType.WaitingRoom;
        this.reason = 'Test';
        this.phone = '';
    }

    'event_id': string | undefined;
    'event_type': EventType | undefined;
    'time_stamp_utc': Date | undefined;
    'conference_id': string | undefined;
    'participant_id': string | undefined;
    'transfer_from': RoomType | undefined;
    'transfer_to': RoomType | undefined;
    'reason': string | undefined;
    'phone': string | undefined;
}
