import { EventModel } from 'src/app/common/models/event-model';
import { EventType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { EventsService } from './event-service';
import { TestApiService } from './test-api-service';

describe('EventService', () => {
    let service: EventsService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', ['sendEvent']);

    const eventModel = new EventModel();
    eventModel.conference_id = '123';
    eventModel.event_type = EventType.None;
    eventModel.participant_id = '789';
    eventModel.participant_room_id = '';

    beforeEach(() => {
        service = new EventsService(logger, testApiService);
    });

    it('should call the test api to create a hearing event', async () => {
        testApiService.sendEvent.and.returnValue(Promise.resolve());
        const result = await service.createHearingEvent(eventModel.conference_id, eventModel.event_type, eventModel.participant_id);
        expect(testApiService.sendEvent).toHaveBeenCalled();
        expect(result).not.toBeNull();
    });

    it('should call the test api to create a partcipant event', async () => {
        testApiService.sendEvent.and.returnValue(Promise.resolve());
        const result = await service.createParticipantEvent(
            eventModel.conference_id,
            eventModel.participant_id,
            eventModel.participant_room_id,
            eventModel.event_type,
            eventModel.transfer_from,
            eventModel.transfer_to
        );
        expect(testApiService.sendEvent).toHaveBeenCalled();
        expect(result).not.toBeNull();
    });

    it('should throw an error if call to test api to send an event fails', async () => {
        const error = { error: 'not found!' };
        testApiService.sendEvent.and.callFake(() => Promise.reject(error));
        await expectAsync(
            service.createHearingEvent(eventModel.conference_id, eventModel.event_type, eventModel.participant_id)
        ).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });
});
