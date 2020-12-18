import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Config } from 'src/app/common/models/config';
import { ClientSettingsResponse } from '../clients/api-client';

export let ENVIRONMENT_CONFIG: Config = new Config();

@Injectable()
export class ConfigService {
    clientSettings: ClientSettingsResponse;
    private SETTINGS_KEY = 'vh.test.client.settings';
    private httpClient: HttpClient;

    constructor(handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
    }

    getClientSettings(): Observable<ClientSettingsResponse> {
      const settings = sessionStorage.getItem(this.SETTINGS_KEY);
      if (!settings) {
          return this.retrieveConfigFromApi();
      } else {
          return of(JSON.parse(settings));
      }
    }

    loadConfig() {
      return new Promise((resolve, reject) => {
          this.getClientSettings().subscribe(
              (data: ClientSettingsResponse) => {
                  this.clientSettings = data;
                  this.parse(data);
                  sessionStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data));
                  resolve(true);
              },
              err => {
                  console.log('Cannot get configuration settings.', err);
                  reject(err);
              }
          );
      });
    }

    private retrieveConfigFromApi(): Observable<ClientSettingsResponse> {
      let url = '/config';
      url = url.replace(/[?&]$/, '');
      return this.httpClient.get<ClientSettingsResponse>(url);
    }

    private parse(result: any): Promise<Config> {
      ENVIRONMENT_CONFIG = new Config();
      ENVIRONMENT_CONFIG.tenantId = result.tenant_id;
      ENVIRONMENT_CONFIG.clientId = result.client_id;
      ENVIRONMENT_CONFIG.redirectUri = result.redirect_uri;
      ENVIRONMENT_CONFIG.postLogoutRedirectUri = result.post_logout_redirect_uri;
      ENVIRONMENT_CONFIG.appInsightsInstrumentationKey = result.instrumentation_key;
      return Promise.resolve(ENVIRONMENT_CONFIG);
  }
}
