import { Injectable } from '@angular/core';
import { AllocateUserModel } from 'src/app/common/models/allocate.user.model';
import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { AllocatedUserModel } from 'src/app/common/models/allocated.user.model';
import { UserModel } from 'src/app/common/models/user.model';
import { MapAllocatedResponseToUser } from '../api/mappers/map-allocated-user-details-response-to-users-model';
import { MapAllocatedResponseToAllocatedModel } from '../api/mappers/map-allocated-user-response-to-allocation-model';
import { MapAllocatedResponseToUsers } from '../api/mappers/map-allocated-users-details-response-to-users-model';
import { ProfileService } from '../api/profile-service';
import { UserType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { AllocationFormData } from './models/allocation-form-data';
import { HearingFormData } from './models/hearing-form-data';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class AllocationService {
    private readonly loggerPrefix: string = '[AllocationService] -';
    private allocateUsersModel: AllocateUsersModel;
    private allocatedUsers: UserModel[];
    private allocateUserModel: AllocateUserModel;
    private allocatedUser: UserModel;
    private allAllocatedByUsers: AllocatedUserModel[];

    constructor(private logger: Logger, private testApiService: TestApiService, private profileService: ProfileService) {}

    async allocatateUsers(hearingFormData: HearingFormData) {
        await this.createAllocateUsersModels(hearingFormData);
        await this.sendAllocationsRequest();
        return this.allocatedUsers;
    }

    private async createAllocateUsersModels(hearingFormData: HearingFormData) {
        this.logger.debug(`${this.loggerPrefix} CREATING ALLOCATIONS MODEL`);
        this.allocateUsersModel = new AllocateUsersModel();
        const username = await this.getLoggedInUserUsername();
        this.allocateUsersModel.allocated_by = username;
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

    private async sendAllocationsRequest() {
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
            throw error;
        }
    }

    async allocateSingleUser(allocationFormData: AllocationFormData) {
        await this.createAllocateUserModel(allocationFormData);
        await this.sendAllocationRequest();
        return this.allocatedUser;
    }

    private async createAllocateUserModel(allocationFormData: AllocationFormData) {
        this.logger.debug(`${this.loggerPrefix} CREATING ALLOCATION MODEL`);
        this.allocateUserModel = new AllocateUserModel();
        const username = await this.getLoggedInUserUsername();
        this.allocateUserModel.allocated_by = username;
        this.allocateUserModel.expiry_in_minutes = allocationFormData.expiry_in_minutes;
        this.allocateUserModel.test_type = allocationFormData.testType;
        this.allocateUserModel.user_type = allocationFormData.userType;
    }

    private async getLoggedInUserUsername() {
        try {
            const profile = await this.profileService.getUserProfile();
            return profile.username;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Unable to retreive user profile`, error);
            throw error;
        }
    }

    private async sendAllocationRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING ALLOCATION REQUEST`);
        try {
            const allocationDetailResponse = await this.testApiService.allocateSingleUser(this.allocateUserModel);
            this.logger.debug(`${this.loggerPrefix} ${allocationDetailResponse.user_type} user allocated`);
            this.allocatedUser = MapAllocatedResponseToUser.map(allocationDetailResponse);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to allocate user.`, error, { payload: this.allocateUserModel });
            throw error;
        }
    }

    async getAllAllocationsByUsername(): Promise<AllocatedUserModel[]> {
        const username = await this.getLoggedInUserUsername();
        await this.sendGetAllAllocationsRequest(username);
        return this.allAllocatedByUsers;
    }

    private async sendGetAllAllocationsRequest(username: string) {
        this.logger.debug(`${this.loggerPrefix} SENDING GET ALL ALLOCATIONS REQUEST`);
        try {
            const allocationDetailResponse = await this.testApiService.getAllAllocationsByAllocatedBy(username);
            this.logger.debug(`${this.loggerPrefix} ${allocationDetailResponse.length} allocated users found`);
            this.allAllocatedByUsers = MapAllocatedResponseToAllocatedModel.map(allocationDetailResponse);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to allocate user.`, error, { payload: this.allocateUserModel });
            throw error;
        }
    }

    async unallocateUser(username: string): Promise<void> {
        return await this.sendUnallocateUserRequest(username);
    }

    private async sendUnallocateUserRequest(username: string) {
        this.logger.debug(`${this.loggerPrefix} SENDING UNALLOCATE USER REQUEST`);
        try {
            const allocationDetailResponse = await this.testApiService.unallocateUser(username);
            this.logger.debug(`${this.loggerPrefix} ${allocationDetailResponse[0].username} unallocated`);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to unallocate user.`, error, { payload: this.allocateUserModel });
            throw error;
        }
    }
}
