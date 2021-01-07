import { Injectable } from '@angular/core';
import { EventModel } from 'src/app/common/models/event-model';
import { AllocateUsersModel } from '../../common/models/allocate.users.model';
import { ConfirmHearingModel } from '../../common/models/confirm.hearing.model';
import { DeleteModel } from '../../common/models/delete-model';
import { HearingModel } from '../../common/models/hearing.model';
import { MapAllocateUsers } from '../api/mappers/map-allocate-users';
import { MapConfirmHearing } from '../api/mappers/map-confirm-hearing';
import { MapDelete } from '../api/mappers/map-delete';
import { MapEvent } from '../api/mappers/map-event';
import { MapHearing } from '../api/mappers/map-hearing';
import {
    ApiClient,
    ConferenceDetailsResponse,
    ConferenceResponse,
    DeletedResponse,
    HearingDetailsResponse,
    ResetUserPasswordRequest,
    UpdateUserResponse,
    UserDetailsResponse
} from '../clients/api-client';
import { Logger } from '../logging/logger-base';

@Injectable({
    providedIn: 'root'
})
export class TestApiService {
    private readonly loggerPrefix: string = '[TestApiService] -';

    constructor(private apiClient: ApiClient, private logger: Logger) {}

    allocateUsers(allocateUsersModel: AllocateUsersModel): Promise<UserDetailsResponse[]> {
        this.logger.debug(`${this.loggerPrefix} Allocating users with model:`, { payload: allocateUsersModel });
        const allocateRequest = MapAllocateUsers.map(allocateUsersModel);
        this.logger.debug(`${this.loggerPrefix} Mapped allocation model to request:`, { payload: allocateRequest });
        return this.apiClient.allocateUsers(allocateRequest).toPromise();
    }

    createHearing(createHearingModel: HearingModel): Promise<HearingDetailsResponse> {
        this.logger.debug(`${this.loggerPrefix} Creating hearing with model:`, { payload: createHearingModel });
        const hearingRequest = MapHearing.map(createHearingModel);
        this.logger.debug(`${this.loggerPrefix} Mapped hearing model to request:`, { payload: hearingRequest });
        return this.apiClient.hearings(hearingRequest).toPromise();
    }

    confirmHearing(hearingId: string, confirmHearingModel: ConfirmHearingModel): Promise<ConferenceDetailsResponse> {
        this.logger.debug(`${this.loggerPrefix} Confirming hearing with model:`, { payload: confirmHearingModel });
        const confirmRequest = MapConfirmHearing.map(confirmHearingModel);
        this.logger.debug(`${this.loggerPrefix} Mapped confirm model to request:`, { payload: confirmRequest });
        return this.apiClient.confirmHearingById(hearingId, confirmRequest).toPromise();
    }

    resetUserPassword(username: string): Promise<UpdateUserResponse> {
        this.logger.debug(`${this.loggerPrefix} Resetting password for ${username}`);
        const resetRequest = new ResetUserPasswordRequest();
        resetRequest.username = username;
        this.logger.debug(`${this.loggerPrefix} Mapped reset model to request:`, { payload: resetRequest });
        return this.apiClient.password(resetRequest).toPromise();
    }

    deleteHearings(deleteHearingsModel: DeleteModel): Promise<DeletedResponse> {
        this.logger.debug(`${this.loggerPrefix} Deleting hearings with model:`, { payload: deleteHearingsModel });
        const deleteRequest = MapDelete.map(deleteHearingsModel);
        this.logger.debug(`${this.loggerPrefix} Mapped delete model to request:`, { payload: deleteRequest });
        return this.apiClient.removeTestData(deleteRequest).toPromise();
    }

    getConferencesForToday(): Promise<ConferenceResponse[]> {
        this.logger.debug(`${this.loggerPrefix} Getting conferences for today`);
        return this.apiClient.getConferencesForToday().toPromise();
    }

    getConferencesByHearingRefId(hearingId: string): Promise<ConferenceResponse> {
        this.logger.debug(`${this.loggerPrefix} Getting conference by hearing ref id ${hearingId}`);
        return this.apiClient.getConferenceByHearingRefId(hearingId).toPromise();
    }

    sendEvent(eventModel: EventModel): Promise<void> {
        this.logger.debug(`${this.loggerPrefix} Sending event with model:`, { payload: eventModel });
        const eventRequest = MapEvent.map(eventModel);
        this.logger.debug(`${this.loggerPrefix} Mapped event model to request:`, { payload: eventRequest });
        return this.apiClient.createVideoEvent(eventRequest).toPromise();
    }
}
