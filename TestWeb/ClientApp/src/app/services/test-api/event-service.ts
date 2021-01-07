import { Injectable } from '@angular/core';
import { EventModel } from 'src/app/common/models/event-model';
import { EventType, RoomType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private readonly loggerPrefix: string = '[EventsService] -';
    private eventModel: EventModel;

    constructor(private logger: Logger, private testApiService: TestApiService) {}

    async createHearingEvent(conferenceId: string, eventType: EventType, judgeParticipantId: string) {
        this.logger.debug(`${this.loggerPrefix} Creating event...`);
        this.eventModel = new EventModel();
        this.eventModel.conference_id = conferenceId;
        this.eventModel.event_type = eventType;
        this.eventModel.participant_id = judgeParticipantId;
        return await this.sendEventRequest();
    }

    async createParticipantEvent(
        conferenceId: string,
        participantId: string,
        eventType: EventType,
        transferFrom: RoomType,
        transferTo: RoomType
    ) {
        this.logger.debug(`${this.loggerPrefix} Creating event...`);
        this.eventModel = new EventModel();
        this.eventModel.conference_id = conferenceId;
        this.eventModel.event_type = eventType;
        this.eventModel.participant_id = participantId;
        this.eventModel.transfer_from = transferFrom;
        this.eventModel.transfer_to = transferTo;
        return await this.sendEventRequest();
    }

    private async sendEventRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING EVENT REQUEST`);
        try {
            const eventResponse = await this.testApiService.sendEvent(this.eventModel);
            this.logger.debug(`${this.loggerPrefix} EVENT CREATED.`);
            this.logger.debug(`${this.loggerPrefix} Event Response`, { payload: eventResponse });
            return eventResponse;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to create event.`, error);
            throw error;
        }
    }
}
