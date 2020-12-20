import { Role } from 'src/app/common/models/data/role';
import { UserProfileResponse } from 'src/app/services/clients/api-client';

export class MockProfileService {
    mockProfile: UserProfileResponse = new UserProfileResponse({
        role: Role.Individual,
        username: 'john@doe.com'
    });

    profile: UserProfileResponse;
    profiles: Record<string, UserProfileResponse> = {};

    async getUserProfile(): Promise<UserProfileResponse> {
        return this.mockProfile;
    }

    async getProfileByUsername(username: string): Promise<UserProfileResponse> {
        return this.mockProfile;
    }

    checkCacheForProfileByUsername(username: string): UserProfileResponse {
        return this.mockProfile;
    }
}
