import { Injectable } from '@angular/core';
import { AllocateUsersModel } from '../common/models/allocate.users.model';
import { ConfirmHearingModel } from '../common/models/confirm.hearing.model';
import { DeleteModel } from '../common/models/delete-model';
import { HearingModel } from '../common/models/hearing.model';
import { MapAllocateUsers } from './api/mappers/map-allocate-users';
import { MapConfirmHearing } from './api/mappers/map-confirm-hearing';
import { MapDelete } from './api/mappers/map-delete';
import { MapHearing } from './api/mappers/map-hearing';
import {
    ApiClient,
    ConferenceDetailsResponse,
    DeletedResponse,
    HearingDetailsResponse,
    ResetUserPasswordRequest,
    UpdateUserResponse,
    UserDetailsResponse
} from './clients/api-client';
import { Logger } from './logging/logger-base';

@Injectable({
    providedIn: 'root'
})
export class TestApiService {
    private readonly loggerPrefix: string = '[TestApiService] -';

    constructor(private apiClient: ApiClient, private logger: Logger) {}

    allocateUsers(allocateUsersModel: AllocateUsersModel): Promise<UserDetailsResponse[]> {
        this.logger.debug(`${this.loggerPrefix} Allocating users with model ${allocateUsersModel}`, { payload: allocateUsersModel });
        const allocateRequest = MapAllocateUsers.map(allocateUsersModel);
        this.logger.debug(`${this.loggerPrefix} Mapped allocation model to request ${allocateRequest}`, { payload: allocateRequest });
        return this.apiClient.allocateUsers(allocateRequest).toPromise();
    }

    createHearing(createHearingModel: HearingModel): Promise<HearingDetailsResponse> {
        this.logger.debug(`${this.loggerPrefix} Creating hearing with model ${createHearingModel}`, { payload: createHearingModel });
        const hearingRequest = MapHearing.map(createHearingModel);
        this.logger.debug(`${this.loggerPrefix} Mapped hearing model to request ${hearingRequest}`, { payload: hearingRequest });
        return this.apiClient.hearings(hearingRequest).toPromise();
    }

    confirmHearing(hearingId: string, confirmHearingModel: ConfirmHearingModel): Promise<ConferenceDetailsResponse> {
        this.logger.debug(`${this.loggerPrefix} Confirming hearing with model ${confirmHearingModel}`, { payload: confirmHearingModel });
        const confirmRequest = MapConfirmHearing.map(confirmHearingModel);
        this.logger.debug(`${this.loggerPrefix} Mapped confirm model to request ${confirmRequest}`, { payload: confirmRequest });
        return this.apiClient.confirmHearingById(hearingId, confirmRequest).toPromise();
    }

    resetUserPassword(username: string): Promise<UpdateUserResponse> {
        this.logger.debug(`${this.loggerPrefix} Resetting password for ${username}`);
        const resetRequest = new ResetUserPasswordRequest();
        resetRequest.username = username;
        this.logger.debug(`${this.loggerPrefix} Mapped reset model to request ${resetRequest}`, { payload: resetRequest });
        return this.apiClient.password(resetRequest).toPromise();
    }

    deleteHearings(deleteHearingsModel: DeleteModel): Promise<DeletedResponse> {
        this.logger.debug(`${this.loggerPrefix} Deleting hearings with model ${deleteHearingsModel}`, { payload: deleteHearingsModel });
        const deleteRequest = MapDelete.map(deleteHearingsModel);
        this.logger.debug(`${this.loggerPrefix} Mapped delete model to request ${deleteRequest}`, { payload: deleteRequest });
        return this.apiClient.removeTestData(deleteRequest).toPromise();
    }
}
