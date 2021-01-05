import { Injectable } from '@angular/core';
import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { UserModel } from 'src/app/common/models/user.model';
import { MapAllocatedResponseToUsers } from '../api/mappers/map-allocated-users-details-response-to-users-model';
import { UserType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { HearingFormData } from './models/hearing-form-data';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class AllocationService {
    private readonly loggerPrefix: string = '[AllocationService] -';
    private allocateUsersModel: AllocateUsersModel;
    private allocatedUsers: UserModel[];

    constructor(private logger: Logger, private testApiService: TestApiService) {}

    async AllocatateUsers(hearingFormData: HearingFormData) {
        this.createAllocateUsersModels(hearingFormData);
        await this.sendAllocationRequest();
        return this.allocatedUsers;
    }

    private createAllocateUsersModels(hearingFormData: HearingFormData) {
        this.logger.debug(`${this.loggerPrefix} CREATING ALLOCATION MODEL`);
        this.allocateUsersModel = new AllocateUsersModel();
        this.allocateUsersModel.test_type = hearingFormData.testType;
        this.addUserTypesToModel(1, UserType.Judge);
        this.addUserTypesToModel(hearingFormData.individuals, UserType.Individual);
        this.addUserTypesToModel(hearingFormData.representatives, UserType.Representative);
        this.addUserTypesToModel(hearingFormData.observers, UserType.Observer);
        this.addUserTypesToModel(hearingFormData.panelMembers, UserType.PanelMember);
        this.logger.debug(
            `${this.loggerPrefix} ${this.allocateUsersModel.usertypes.length} have been added the allocation request in total`
        );
    }

    private addUserTypesToModel(quantity: number, userType: UserType) {
        if (quantity > 0) {
            for (let i = 0; i < quantity; i++) {
                this.logger.debug(`${this.loggerPrefix} Added a ${userType} number ${i + 1} to the allocation request`);
                this.allocateUsersModel.usertypes.push(userType);
            }
        }
    }

    private async sendAllocationRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING ALLOCATION REQUEST`);
        try {
            const allocationDetailsResponse = await this.testApiService.allocateUsers(this.allocateUsersModel);
            this.logger.debug(`${this.loggerPrefix} ${allocationDetailsResponse.length} users allocated`);
            this.allocatedUsers = MapAllocatedResponseToUsers.map(allocationDetailsResponse);
            this.allocatedUsers.forEach(user => {
                this.logger.debug(`${this.loggerPrefix} Allocated ${user.user_type} with username ${user.username}`);
            });
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to allocate users.`, error, { payload: this.allocateUsersModel });
        }
    }
}
