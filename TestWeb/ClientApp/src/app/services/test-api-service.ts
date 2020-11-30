import { Injectable } from '@angular/core';
import { AllocateUsersModel } from '../common/models/allocate.users.model';
import { ConfirmHearingModel } from '../common/models/confirm.hearing.model';
import { HearingModel } from '../common/models/hearing.model';
import { MapAllocateUsers } from './api/mappers/map-allocate-users';
import { MapConfirmHearing } from './api/mappers/map-confirm-hearing';
import { MapHearing } from './api/mappers/map-hearing';
import { ApiClient, ConferenceDetailsResponse, HearingDetailsResponse, UserDetailsResponse } from './clients/api-client';
import { Logger } from './logging/logger-base';

@Injectable({
    providedIn: 'root'
})
export class TestApiService {

  private readonly loggerPrefix: string = '[TestApiService] -';

  constructor(private apiClient: ApiClient, private logger: Logger) {}

  allocateUsers(allocateUsersModel: AllocateUsersModel): Promise<UserDetailsResponse[]> {
    this.logger.debug(`${this.loggerPrefix} Allocating users with model ${allocateUsersModel}`,  { payload: allocateUsersModel });
    const allocateRequest = MapAllocateUsers.map(allocateUsersModel);
    this.logger.debug(`${this.loggerPrefix} Mapped allocation model to request ${allocateRequest}`,  { payload: allocateRequest });
    return this.apiClient.allocateUsers(allocateRequest).toPromise();
  }

  createHearing(createHearingModel: HearingModel): Promise<HearingDetailsResponse> {
    const hearingRequest = MapHearing.map(createHearingModel);
    return this.apiClient.hearings(hearingRequest).toPromise();
  }

  confirmHearing(hearingId: string, confirmHearingModel: ConfirmHearingModel): Promise<ConferenceDetailsResponse> {
    const confirmRequest = MapConfirmHearing.map(confirmHearingModel);
    return this.apiClient.confirmHearingById(hearingId, confirmRequest).toPromise();
  }
}
