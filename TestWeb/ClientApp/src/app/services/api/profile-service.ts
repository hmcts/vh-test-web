import { Injectable } from '@angular/core';
import { ApiClient, UserProfileResponse } from '../clients/api-client';
import { Logger } from '../logging/logger-base';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly loggerPrefix: string = '[ProfileService] -';
    profile: UserProfileResponse;
    profiles: Record<string, UserProfileResponse> = {};

    constructor(private logger: Logger, private apiClient: ApiClient) {}

    async getUserProfile(): Promise<UserProfileResponse> {
        if (!this.profile) {
            this.profile = await this.apiClient.getUserProfile().toPromise();
        }
        return this.profile;
    }

    checkCacheForProfileByUsername(username: string): UserProfileResponse {
        return this.profiles[username];
    }

    clearUserProfile(): void {
        this.profile = null;
    }

    public async getLoggedInUsername() {
        const profile = await this.getUserProfile();
        this.logger.debug(`${this.loggerPrefix} Profile retrieved: ${profile.username}`);
        return profile.username;
    }
}
