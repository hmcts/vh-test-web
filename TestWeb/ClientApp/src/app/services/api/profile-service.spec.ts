import { of } from 'rxjs';
import { individualTestProfile } from 'src/app/testing/data/test-profiles';
import { ApiClient } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { ProfileService } from './profile-service';

describe('ProfileService', () => {
    let service: ProfileService;
    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const apiClient = jasmine.createSpyObj<ApiClient>('ApiClient', ['getUserProfile']);
    const knownProfile = individualTestProfile;

    beforeAll(() => {
        apiClient.getUserProfile.and.returnValue(of(knownProfile));
    });

    beforeEach(() => {
        service = new ProfileService(loggerSpy, apiClient);
    });

    it('should not call api when profile is already set', async () => {
        service.profile = knownProfile;
        const result = await service.getUserProfile();
        expect(result).toBe(knownProfile);
        expect(apiClient.getUserProfile).toHaveBeenCalledTimes(0);
    });

    it('should call api when profile is not set', async () => {
        service.profile = null;
        const result = await service.getUserProfile();
        expect(result).toBe(knownProfile);
        expect(apiClient.getUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should clear set profile', () => {
        service.profile = knownProfile;
        service.clearUserProfile();
        expect(service.profile).toBeNull();
    });

    it('should return instance when profile is already in cache', () => {
        service.profiles[knownProfile.username] = knownProfile;
        const result = service.checkCacheForProfileByUsername(knownProfile.username);
        expect(result).toEqual(knownProfile);
    });

    it('should return instance when profile is already in cache', () => {
        const result = service.checkCacheForProfileByUsername(knownProfile.username);
        expect(result).toBeUndefined();
    });
});
