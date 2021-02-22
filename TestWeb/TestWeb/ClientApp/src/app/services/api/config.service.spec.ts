import { TestBed } from '@angular/core/testing';
import { doesNotReject } from 'assert';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { ApiClient, ClientSettingsResponse } from '../clients/api-client';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
    const apiService = jasmine.createSpyObj<ApiClient>('ApiClient', ['getClientConfigurationSettings']);
    let clientSettings: ClientSettingsResponse;
    let configService: ConfigService;
    const SETTINGS_KEY = 'vh.test.client.settings';

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [ConfigService, { provide: ApiClient, useValue: apiService }]
        });
    });

    beforeEach(() => {
        clientSettings = new ClientSettingsResponse();
        clientSettings.app_insights_instrumentation_key = '123';
        clientSettings.authority = 'auth';
        clientSettings.client_id = 'clientId';
        clientSettings.post_logout_redirect_uri = '/dashboard';
        clientSettings.redirect_uri = '/dashboard';
        clientSettings.tenant_id = 'tenantId';
        clientSettings.test_api_url = 'url';
        configService = TestBed.inject(ConfigService);
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('should have called method on api client', () => {
        apiService.getClientConfigurationSettings.and.returnValue(of(clientSettings));
        sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(clientSettings));
        const response = configService.getClientSettings();
        response.subscribe(result => {
            expect(result.app_insights_instrumentation_key).toBe(clientSettings.app_insights_instrumentation_key);
            expect(result.authority).toBe(clientSettings.authority);
            expect(result.client_id).toBe(clientSettings.client_id);
            expect(result.post_logout_redirect_uri).toBe(clientSettings.post_logout_redirect_uri);
            expect(result.redirect_uri).toBe(clientSettings.redirect_uri);
            expect(result.tenant_id).toBe(clientSettings.tenant_id);
            expect(result.test_api_url).toBe(clientSettings.test_api_url);
        });
    });

    it('should not have called method on api client', () => {
        sessionStorage.removeItem(SETTINGS_KEY);
        configService.getClientSettings();
        expect(apiService.getClientConfigurationSettings).not.toHaveBeenCalled();
    });

    it('should load and parse config', async () => {
        apiService.getClientConfigurationSettings.and.returnValue(of(clientSettings));
        sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(clientSettings));
        const response = await configService.loadConfig();
        expect(response).toBeTruthy();
    });
});
