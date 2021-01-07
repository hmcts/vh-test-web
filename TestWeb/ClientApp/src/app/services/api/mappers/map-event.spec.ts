import { EventModel } from 'src/app/common/models/event-model';
import { EventType, RoomType } from '../../clients/api-client';
import { MapEvent } from './map-event';

describe('MapConfirmHearing', () => {
    const mapper = new MapEvent();

    it('should map the EventModel to the ConferenceEventRequest', () => {
        const eventModel: EventModel = {
            conference_id: '123',
            event_id: '456',
            event_type: EventType.Help,
            participant_id: '789',
            phone: '0123',
            reason: 'Any reason',
            time_stamp_utc: new Date(),
            transfer_from: RoomType.WaitingRoom,
            transfer_to: RoomType.AdminRoom
        };

        const request = MapEvent.map(eventModel);
        expect(request.conference_id).toBe(eventModel.conference_id);
        expect(request.event_id).toBe(eventModel.event_id);
        expect(request.event_type).toBe(eventModel.event_type);
        expect(request.participant_id).toBe(eventModel.participant_id);
        expect(request.phone).toBe(eventModel.phone);
        expect(request.reason).toBe(eventModel.reason);
        expect(request.time_stamp_utc).toBe(eventModel.time_stamp_utc);
        expect(request.transfer_from).toBe(eventModel.transfer_from);
        expect(request.transfer_to).toBe(eventModel.transfer_to);
    });
});
