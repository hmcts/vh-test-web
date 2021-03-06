import { ClientSettingsResponse } from '../../services/clients/api-client';
import { Observable, of } from 'rxjs';

export class MockConfigService {
    clientSettings = new ClientSettingsResponse({
        tenant_id: 'tenantId',
        client_id: 'clientId',
        post_logout_redirect_uri: '/logout',
        redirect_uri: '/home',
        test_api_url: 'http://vh-video-api/',
        app_insights_instrumentation_key: 'appInsightsInstrumentationKey',
        authority: 'authority'
    });

    getClientSettings(): Observable<ClientSettingsResponse> {
        return of(this.clientSettings);
    }

    loadConfig() {}
}
